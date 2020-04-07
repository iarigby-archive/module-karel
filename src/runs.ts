import fs from 'fs'
import { Submission } from 'classroom-api'
import { Partitions } from './partitions'

type S = Submission

const path = process.cwd() + '/output'
const runs = fs
    .readdirSync(path)
    .map(dirname => dirname.match(/^run(\d+)$/))
    .filter(e => e != null)
    .map(match => Number(match![1]))
    .sort((a, b) => b - a)
const lastRun = runs.length ? runs[0] : 0
const currentRun = lastRun + 1

const previousResults: any = getPreviousRunInfo()
let notPassed: Submission[] = []
for (let k of Object.keys(previousResults).filter(e => e != 'passed')) {
    notPassed = notPassed.concat(previousResults[k])
}
const forceRecheck: string[] = []


export function newSubmission(s: Submission) {
    if (forceRecheck.find(e => e == s.emailId)) return true
    if (previousResults == {}) return true
    const passed = previousResults.passed.find((e: Submission) => e.emailId == s.emailId)
    if (passed) return false
    return true
}

export function newFile(s: Submission) {
    const previous = findPreviousResult(s)
    if (s.timeStamp) {
        if (!previous.timeStamp) {
            return true
        } else {
            return new Date(previous.timeStamp).getTime() < s.timeStamp.getTime()
        }
    } else {
        return false
    }    
}
// assumes newSubmission has been run
export function markForChecking(s: Submission) {
    if (previousResults == {}) {
        s.check = true
        return s
    }
    if (forceRecheck.find(e => e == s.emailId)) {
        s.check = true
        return s
    }
    const previous = findPreviousResult(s)
    if (!previous)
        throw "cannot find previous records of " + s.emailId
    if (previous.crashed) {
        s.check = true
        return s
    }
    s.check = newFile(s)
    return s
}


export function getPreviousRunInfo(): Partitions<Submission[]> {
    const output: any = {}
    if (currentRun == 1) {
        return output
    }
    const dir = path + '/run' + lastRun
    fs.readdirSync(dir)
        .filter(e => e.includes('.json'))
        .forEach(file => {
            const name = file.match(/(.*)\.json/)![1]
            const contents = fs.readFileSync(dir + '/' + file, 'utf-8')
            const results: Submission[] = JSON.parse(contents)
            output[name] = results
        })
    return output
}
export function saveRunInfo(output: Partitions<Submission[]>) {
    const outPath = path + '/run' + currentRun
    fs.mkdirSync(outPath)
    const casted: any = output
    for (let partition in output) {
        const r: Submission[] = casted[partition] // damn you typescript:( 
        const filename = `${outPath}/${partition}.json`
        fs.writeFileSync(filename, JSON.stringify(r, null, '\t'))
    }
}

export function findPreviousResult(submission: Submission): Submission {
    const previous = notPassed.find(s => s.emailId == submission.emailId)
    if (!previous)
        throw "cannot find previous records of " + submission.emailId
    return previous
}