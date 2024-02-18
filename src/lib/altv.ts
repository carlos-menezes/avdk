import axios from 'axios'
import { Configuration } from './configuration'
import os from 'os'

type NativePlatform = 'win32' | 'linux' | 'darwin'
type AltVPlatform = 'x64_win32' | 'x64_linux'
type AltVFile = {
    dest: string
    url: string
}

type UpdateJson = {
    latestBuildNumber: number
    version: string
    sdkVersion: string
    hashList: Record<string, string>
    sizeList: Record<string, string>
}

const altVPlatformName: Record<NativePlatform, AltVPlatform> = {
    win32: 'x64_win32',
    linux: 'x64_linux',
    darwin: 'x64_linux',
}

const getServerFiles = async (
    platform: AltVPlatform,
    { branch }: Pick<Configuration, 'branch'>
): Promise<AltVFile[]> => {
    const updateJson = await axios.get(
        `https://cdn.alt-mp.com/server/${branch}/${platform}/update.json`
    )

    if (!updateJson.data) {
        throw new Error('Failed to fetch data update.json')
    }

    const { hashList } = updateJson.data as UpdateJson
    const fileNames = Object.keys(hashList)

    return fileNames.map((fileName) => ({
        dest: '',
        url: `https://cdn.alt-mp.com/server/${branch}/${platform}/${fileName}`,
    }))
}

const getDataFiles = async (
    branch: Configuration['branch']
): Promise<AltVFile[]> => {
    const updateJson = await axios.get(
        `https://cdn.alt-mp.com/data/${branch}/update.json`
    )

    if (!updateJson.data) {
        throw new Error('Failed to fetch data update.json')
    }

    const { hashList } = updateJson.data as UpdateJson
    const fileNames = Object.keys(hashList)
    return fileNames.map(
        (fileName) =>
            ({
                dest: 'data',
                url: `https://cdn.alt-mp.com/data/${branch}/${fileName}`,
            }) as AltVFile
    )
}

const getJsBytecodeModule = async (
    platform: AltVPlatform,
    { branch }: Pick<Configuration, 'branch'>
) => {
    const updateJson = await axios.get(
        `https://cdn.alt-mp.com/js-bytecode-module/${branch}/${platform}/update.json`
    )

    if (!updateJson.data) {
        throw new Error('Failed to fetch data update.json')
    }

    const { hashList } = updateJson.data as UpdateJson
    const fileNames = Object.keys(hashList)
    return fileNames.map((fileName) => ({
        dest: fileName,
        url: `https://cdn.alt-mp.com/js-bytecode-module/${branch}/${platform}/${fileName}`,
    }))
}

const getVoiceModule = async (
    platform: AltVPlatform,
    { branch }: Pick<Configuration, 'branch'>
) => {
    const updateJson = await axios.get(
        `https://cdn.alt-mp.com/voice-server/${branch}/${platform}/update.json`
    )

    if (!updateJson.data) {
        throw new Error('Failed to fetch data update.json')
    }

    const { hashList } = updateJson.data as UpdateJson
    const fileNames = Object.keys(hashList)
    return fileNames.map((fileName) => ({
        dest: '',
        url: `https://cdn.alt-mp.com/voice-server/${branch}/${platform}/${fileName}`,
    }))
}

const getAltVFiles = async (
    configuration: Readonly<Configuration>
): Promise<AltVFile[]> => {
    const system = os.platform()
    const platform = altVPlatformName[system as NativePlatform]
    const { branch, loadBytecodeModule, voice } = configuration

    const serverFiles = await getServerFiles(platform, {
        branch,
    })
    const dataFiles = await getDataFiles(branch)

    const files = [...serverFiles, ...dataFiles]

    if (loadBytecodeModule) {
        const jsBytecodeModule = await getJsBytecodeModule(platform, {
            branch,
        })

        files.push(...jsBytecodeModule)
    }

    if (voice) {
        const voiceModule = await getVoiceModule(platform, {
            branch,
        })

        files.push(...voiceModule)
    }

    return files
}

export { getAltVFiles }
