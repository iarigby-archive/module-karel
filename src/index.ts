const root = '/home/ia/dev/dt'
process.env.STUDENTS_DATA_PATH = `${root}/classroom-api/students.json`
process.env.CLASSROOM_CREDENTIALS_PATH = `${root}/classroom-api/credentials.json`
process.env.CLASSROOM_TOKEN_PATH = `${root}/classroom-api/token.json`
import { getSubmissions, Submission } from 'classroom-api'
import { KarelTester } from 'jskarel-tester'
import { downloadAssignment } from 'dt-utils'
import * as runInfo from './runs'
import { partitionResults } from './partitions'
const subject = 'შესავალი ციფრულ ტექნოლოგიებში'
const hw = 'დავალება 1'
const tester = new KarelTester(process.cwd() + '/testFile.js')

function log<T>(e: T, message: string) {
    console.log(message)
    return e
}

function downloadAtInterval(submission: Submission, index: number): Promise<string> {
    const moveDir = '/home/ia/dev/dt/data/test'
    return new Promise((resolve) =>
        setTimeout(() => {
            console.log(`${submission.emailId}: downloading`)
            resolve(downloadAssignment({
                downloadDir: '/home/ia/Downloads',
                downloadUrl: submission.attachment!.downloadUrl,
                fileName: submission.attachment!.title,
                moveDir: moveDir,
                timeout: 1000
            }))
        }, (index + 1) * 1000))
}


function downloadAndTest(submission: Submission, index: number): Promise<Submission> {
    if (!submission.check || !submission.qualifies()) {
        // copy previous results
        const prev = runInfo.findPreviousResult(submission)
        submission.results = prev?.results || submission.results
        return new Promise(r => r(submission))
    }
    const id = submission.emailId
    return downloadAtInterval(submission, index)
        .then(e => log(e, `${id}: finished downloading`))
        .then(newPath => tester.testSubmission(newPath))
        .then(r => log(r, `${id}: finished testing`))
        .then(results => submission.addResults(results))
        .catch(error => {
            submission.results.push({
                error: true,
                message: "crash",
                details: error
            })
            log({}, `error: ${id}, ${error}`)
            submission.crashed = true
            return submission
        })
}

async function main() {
    const submissions = await getSubmissions(subject, hw)
        .then(submissions => submissions
            .filter(runInfo.newSubmission)
            // .slice(0, 100)
            .map(runInfo.markForChecking)
            .map(downloadAndTest))
    const results = await Promise.all(submissions)
    const output = partitionResults(results)
    runInfo.saveRunInfo(output)
    let length = 0
    for (let partition in output) {
        const r: any[] = output[partition]
        length = length + r.length
        log({}, `${partition}: ${r.length}`)
    }
    console.log(submissions.length, length)
}

main()