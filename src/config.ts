import path from 'path'
import { ArgumentParser } from 'argparse'
export const config = {
    subject: 'შესავალი ციფრულ ტექნოლოგიებში'
}
export const env = {
    STUDENTS_DATA_PATH: `../../classroom-api/students.json`,
    CLASSROOM_CREDENTIALS_PATH: `../../classroom-api/credentials.json`,
    CLASSROOM_TOKEN_PATH: `../../classroom-api/token.json`
}

export function setEnv() {
    Object.entries(env).map(([k, v]) => process.env[k] = path.resolve(__dirname, v))
    const parser = new ArgumentParser()
    parser.addArgument(['-w', '--hw'])
    const args = parser.parseArgs()
    const hwId: string = args['hw']
    
    if (!hwId) {
        console.log('provide submission id')
        process.exit(1)
    }

    const hwConfig = homeworks.find(e => e.id == hwId)!

    if (!hwConfig) {
        console.log('provide valid submission id')
        process.exit(1)
    }
    return hwConfig
}

export function testerPath(hwId: string) {
    return path.resolve(__dirname, `../resources/${hwId}tester.js`)
}
export interface HwConfig {
    id: string,
    name: string,
}
export const homeworks: HwConfig[] = [
    {
        id: 'hw1',
        name: 'დავალება 1'
    }
]
