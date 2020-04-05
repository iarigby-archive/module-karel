import { Partitions } from './partitions'
import { Submission } from 'classroom-api'
const notifications: Partitions<boolean> = {
    crashed: false,
    notSubmitted: false,
    late: false, // ?
    invalid: true,
    error: true,
    failed: true,
    passed: true,
    none: false
} 


export function needsNotification(submission: Submission) {
    throw "needs implementation"
    if (!submission.check) 
        return false
}