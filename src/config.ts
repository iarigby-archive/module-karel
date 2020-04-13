import path from 'path'
import { ArgumentParser } from 'argparse'
import { Partitions } from './partitions'
import { RunOpts } from './runs'
export const config = {
    subject: 'შესავალი ციფრულ ტექნოლოგიებში'
}
export const env = {
    STUDENTS_DATA_PATH: `../../classroom-api/students.json`,
    CLASSROOM_CREDENTIALS_PATH: `../../classroom-api/credentials.json`,
    CLASSROOM_TOKEN_PATH: `../../classroom-api/token.json`
}
interface EnvOptions {
    hw: HwConfig,
    slice?: number,
    download: boolean,
    runOpts: RunOpts
}
export function setEnv(): EnvOptions {
    Object.entries(env).map(([k, v]) => process.env[k] = path.resolve(__dirname, v))
    const parser = new ArgumentParser()
    parser.addArgument(['-w', '--hw'])
    parser.addArgument(['-s', '--slice'])
    parser.addArgument(['-t', '--trial'])
    parser.addArgument(['-d', '--download'])
    parser.addArgument(['-e', '--restart'])
    parser.addArgument(['-l', '--rerun'])
    parser.addArgument(['-c', '--continue'])
    parser.addArgument(['-o', '--omit'])
    parser.addArgument(['-f', '--force'])
    parser.addArgument(['-k', '--skip'])
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
    let download = true
    if (args.download == 'false') {
        download = false
    }
    const omit: string[] = (args.omit || '').split(',')
    const force = args.force?.split(',')
    if (force && force.length) {
        if (! hwConfig.force) {
            hwConfig.force = []
        }
        hwConfig.force = hwConfig.force.concat(force)
    }
    const skip = args.skip?.split(',')
    if (skip) {
        if (!hwConfig.skip) {
            hwConfig.skip = []
        }
        hwConfig.skip = hwConfig.skip.concat(skip)
    }
    return {
        hw: hwConfig,
        slice: args.slice,
        download: download,
        runOpts: {
            trial: args.trial == 'true',
            restart: args.restart == 'true',
            rerun: args.rerun == 'true',
            continue: args.continue,
            omit: omit
        }
    }
}

export function testerPath(hwId: string) {
    return path.resolve(__dirname, `../resources/${hwId}tester.js`)
}
export interface HwConfig {
    id: string,
    name: string,
    exceptions?: Partitions<string[]>,
    manualChecks?: string[],
    force?: string[],
    skip?: string[]
}
export const homeworks: HwConfig[] = [
    {
        id: 'hw1',
        name: 'დავალება 1',
        exceptions: {
            // late: ['gsamk19', 'aeris19', 'akuba19', 'ninchkh19', 'kpant19']
        },
        // manualChecks: ['dtsom19', 'zkhut16']
        manualChecks: ['ninchkh19', 'aeris19']
    },
    {
        id: 'hw2fillLine',
        name: 'დავალება2 - fillLine',
        skip: ['kpant19'],
        manualChecks: ['rgoch19', 'lsats19', 'aatru19', 'apapi19'],
        exceptions: {
            // late: ['aerkv17']
        }
    },
    {
        id: 'hw2copyBeepers',
        name: 'დავალება 2-copyBeepers',
        skip: [],
        manualChecks: ['aatru19', 'tkhat19'],
        exceptions: {
            // late: ['nukapa19']
        }
    },
    {
        id: 'bonus1',
        name: 'ბონუსი 1',
        skip: ['oiasa19'],
        exceptions: {
            // late: ['gbera19']
        },
        manualChecks: ['lsats19']
    },
    {
        id: 'hw3',
        name: 'დავალება 3',
        skip: ['gmode19']
    }
]
