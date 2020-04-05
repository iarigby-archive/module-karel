import { Submission } from "classroom-api"

type S = Submission
export interface Partitions<T> {
    crashed: T,
    notSubmitted: T,
    late: T,
    invalid: T,
    error: T,
    failed: T,
    passed: T,
    // rest
    none: T
} 
 
const partitions: Partitions<(s: S) => boolean | undefined> = {
    crashed: (s: S) => s.crashed,
    notSubmitted: (s: S) => !s.turnedIn(),
    late: (s: S) => !s.onTime(),
    invalid: (s: S) => s.incorrectFormat,
    error: (s: S) => s.hasErrors(),
    failed: (s: S) => !s.passed(),
    passed: (s: S) => s.passed(),
    // rest
    none: (s: S) => true
}

export function partitionResults(results: Submission[]) {
    const output: any = {}   
    Object.keys(partitions).forEach(e => output[e] = [])
    const dumb: any = partitions
    results.forEach(result => {
        for (let partition in partitions) {
            if (dumb[partition](result)) {
                output[partition].push(result)
                return
            }
        }
    })
    return output
}