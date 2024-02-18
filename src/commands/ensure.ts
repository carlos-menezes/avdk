import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { Stream } from 'stream'
import { promisify } from 'util'
import { getAltVFiles, getAltVPlatform } from '../lib/altv'
import { Configuration } from '../lib/configuration'
import { AVDK_CONFIG_FILE, OUTPUT_DIRECTORY } from '../util/constants'
import { loadJsonFile } from '../util/filesystem'
import { logSuccess } from '../util/log'

const finished = promisify(Stream.finished)

export default async () => {
    const avdkJson = loadJsonFile<Configuration>(AVDK_CONFIG_FILE)
    if (!avdkJson) {
        throw new Error('avdk configuration file not found')
    }

    const currentDirectory = process.cwd()
    const platform = getAltVPlatform(process.platform)
    const files = await getAltVFiles(platform, avdkJson)

    const directoryPaths = [...new Set(files.map((file) => file.dest))]
    directoryPaths.map(async (name) => {
        const fullPath = path.resolve(currentDirectory, OUTPUT_DIRECTORY, name)
        fs.mkdirSync(fullPath, {
            recursive: true,
        })
    })

    // Download all files
    await Promise.all(
        files.map(async (file): Promise<void> => {
            const fileName = path.basename(file.url)
            const filePath = path.resolve(
                currentDirectory,
                OUTPUT_DIRECTORY,
                file.dest,
                fileName
            )

            const writer = fs.createWriteStream(filePath)

            await axios
                .get(file.url, {
                    responseType: 'stream',
                })
                .then((response) => {
                    response.data.pipe(writer)
                    return finished(writer)
                })

            logSuccess(
                `Ensured '${fileName}' -> '${OUTPUT_DIRECTORY}/${file.dest}'`
            )
        })
    )

    if (platform === 'x64_linux') {
        // Create start.sh file with the correct permissions
        const startSh = path.resolve(
            currentDirectory,
            OUTPUT_DIRECTORY,
            'start.sh'
        )
        fs.writeFileSync(
            startSh,
            `#!/bin/bash\nchmod +x ./altv-*\n./altv-server\n`,
            {
                mode: 0o755,
            }
        )
    }
}
