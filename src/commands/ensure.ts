import { getAltVFiles } from '../lib/altv'
import { Configuration } from '../lib/configuration'
import { AVDK_CONFIG_FILE, OUTPUT_DIRECTORY } from '../util/constants'
import { loadJsonFile } from '../util/filesystem'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { logSuccess } from '../util/log'

export default async () => {
    const avdkJson = loadJsonFile<Configuration>(AVDK_CONFIG_FILE)
    if (!avdkJson) {
        throw new Error('avdk configuration file not found')
    }

    const currentDirectory = process.cwd()
    const files = getAltVFiles(avdkJson)

    const directoryPaths = [...new Set(files.map((file) => file.dest))]
    directoryPaths.map(async (name) => {
        const fullPath = path.resolve(currentDirectory, OUTPUT_DIRECTORY, name)
        fs.mkdirSync(fullPath, {
            recursive: true,
        })
    })

    // Download all files
    await Promise.all(
        files.map(async (file) => {
            const fileName = path.basename(file.url)
            const filePath = path.resolve(
                currentDirectory,
                OUTPUT_DIRECTORY,
                file.dest,
                fileName
            )

            const response = await axios.get(file.url, {
                responseType: 'arraybuffer',
            })

            fs.writeFile(filePath, response.data, (err) => {
                if (err) throw err
            })
            logSuccess(
                `Ensured '${fileName}' -> '${OUTPUT_DIRECTORY}/${file.dest}'`
            )
        })
    )
}
