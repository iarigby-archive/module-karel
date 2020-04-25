import { setEnv, testerPath, config } from './config'
const { hw, slice, download, runOpts } = setEnv()
import { getSubmissions, Submission, Drive, downloadFile, createDrive } from 'classroom-api'
import {Result, testSubmission} from 'jskarel-tester'
// import { downloadAssignment } from 'dt-utils'
import { Run, log } from './runs'
import { partitionResults } from './partitions'
import fs from 'fs'
const testPath = testerPath(hw.id)
// const tester = new KarelTester(testerPath(hw.id))
const run = new Run(hw, runOpts)
const moveDir = '/home/ia/dev/dt/data/' + hw.id
try {
    fs.mkdirSync(moveDir)
} catch (whatever) { }

// function downloadAtInterval(submission: Submission, index: number): Promise<string> {
//     const fileName = submission.attachment!.title
//     return new Promise((resolve) => {
//         if (download) {
//             setTimeout(() => {
//                 console.log(`${submission.emailId}: downloading`)
//                 resolve(downloadAssignment({
//                     downloadDir: '/home/ia/Downloads',
//                     downloadUrl: submission.attachment!.downloadUrl,
//                     fileName: fileName,
//                     moveDir: moveDir,
//                     timeout: 500
//                 }))
//             }, (index) * 1000)
//         } else {
//             resolve(`${moveDir}/${fileName}`)
//         }
//     })
// }

function downloadAtInterval(submission: Submission, drive: Drive,  index: number): Promise<string> {
    const attachment = submission.attachment!
    const fileName = attachment.title
    const id = attachment.id
    const path = `${moveDir}/${fileName}`
    return new Promise((resolve) => {
            setTimeout(() => {
        if (download) {
                console.log(`${submission.emailId}: downloading`)
                downloadFile(drive, id)
                    .then((contents: any) => {

                fs.writeFileSync(path, contents)
                resolve(path)
                    })
        } else {
            resolve(path)
        }
            }, (index) * 200)

    })
}

function downloadAndTest(submission: Submission, drive: Drive, index: number): Promise<Submission> {
    if (!run.forceCheck(submission) && !submission.qualifies()) {
        return new Promise(r => r(submission))
    }
    const id = submission.emailId
    // return downloadAtInterval(submission, index)
     return downloadAtInterval(submission, drive, index)
         .then((e: string) => log(e, `${id}: finished downloading`))
         .then((newPath: string) => testSubmission(testPath, newPath))
        // .then(newPath => tester.testSubmission(newPath))
         .then((r: Result[]) => log(r, `${id}: finished testing`))
         .then((results: Result[]) => submission.addResults(results))
        .catch((error: any) => {
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
    const drive = await createDrive()
    const submissions = await getSubmissions(config.subject, hw.name)
        .then(submissions => slice ? submissions.slice(0, slice) : submissions)
        .then(submissions => submissions
            .filter(s => !hw.skip?.includes(s.emailId) && (run.forceCheck(s) || run.newSubmission(s))))
        .then(s => log(s, `downloading ${s.filter(e => e.onTime()).length}`))
        .then(submissions => submissions.map((s, i) => downloadAndTest(s, drive, i)))
    const results = await Promise.all(submissions)
    const output = partitionResults(results, hw)

    run.saveRunInfo(output)
}

main()