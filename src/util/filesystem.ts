import * as fs from 'fs'
import { safeJsonParse } from './object'

const loadJsonFile = <T extends object>(filePath: string): T | undefined => {
    try {
        const file = fs.readFileSync(filePath, 'utf8')
        return safeJsonParse<T>(file)
    } catch (error) {
        return undefined
    }
}

const writeJsonFile = <T extends object>(filePath: string, data: T) =>
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

const isDirectoryEmpty = (path: string) => {
    return fs.readdirSync(path).length === 0
}

export { isDirectoryEmpty, loadJsonFile, writeJsonFile }
