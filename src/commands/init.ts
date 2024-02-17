import fs from 'fs'
import { globSync } from 'glob'
import path from 'path'
import { Configuration } from '../lib/configuration'
import { isDirectoryEmpty, writeJsonFile } from '../util/filesystem'
import { scripts, type PackageJson } from '../lib/packageManager'
import { safeJsonParse } from '../util/object'
import { AVDK_CONFIG_FILE } from '../util/constants'
import { logSuccess } from '../util/log'

export default async (
    configuration: Readonly<Configuration>,
    resourceName: string = 'resource'
) => {
    const currentDirectory = process.cwd()
    const isEmpty = isDirectoryEmpty(currentDirectory)
    if (!isEmpty) {
        throw new Error('The current directory is not empty')
    }

    // Copy all files from the `template` folder
    const baseDirectory = path.resolve(__dirname, '../../template/')
    const searchPath = path.resolve(baseDirectory, '**/*')
    const templatePaths = globSync(searchPath, {
        cwd: baseDirectory,
        absolute: false,
        dotRelative: true,
        mark: true,
    })

    // Create the directory structure
    const directoryPaths = templatePaths.filter((templatePath) =>
        templatePath.endsWith('/')
    )
    directoryPaths.map(async (name) => {
        const fullPath = path.resolve(currentDirectory, name)
        fs.mkdirSync(fullPath, {
            recursive: true,
        })
    })

    // Copy the files
    const filePaths = templatePaths.filter(
        (templatePath) => !templatePath.endsWith('/')
    )
    filePaths.map((filePath) => {
        const parsedFilePath = path.parse(filePath)
        const source = path.resolve(baseDirectory, filePath)
        fs.copyFileSync(
            source,
            path.resolve(parsedFilePath.dir, parsedFilePath.base)
        )
    })

    // Create the config file
    const configurationPath = path.resolve(currentDirectory, AVDK_CONFIG_FILE)
    writeJsonFile(configurationPath, configuration as Configuration)
    logSuccess(`Created ${AVDK_CONFIG_FILE}`)

    // Edit the `package.json` file
    const packagePath = path.resolve(currentDirectory, 'package.json')
    const packageJson = fs.readFileSync(packagePath, 'utf8')
    const parsedPackageJson = safeJsonParse<PackageJson>(packageJson)
    if (!parsedPackageJson) {
        throw new Error('Failed to parse package.json')
    }
    parsedPackageJson.scripts = scripts
    writeJsonFile(packagePath, parsedPackageJson)
    logSuccess('Updated package.json with scripts')

    // Rename the resources folder
    const resourcePath = path.resolve(currentDirectory, 'src')
    fs.renameSync(
        path.resolve(resourcePath, 'resource'),
        path.resolve(resourcePath, resourceName)
    )
    logSuccess(`Renamed resource folder to ${resourceName}`)
}
