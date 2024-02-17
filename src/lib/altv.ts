import { Configuration } from './configuration'
import os from 'os'

type NativePlatform = 'win32' | 'linux' | 'darwin'
type AltVPlatform = 'x64_win32' | 'x64_linux'
type AltVFile = {
    dest: string
    url: string
}

const altVPlatformName: Record<NativePlatform, AltVPlatform> = {
    win32: 'x64_win32',
    linux: 'x64_linux',
    darwin: 'x64_linux',
}

const getBaseFiles = (
    platform: AltVPlatform,
    {
        branch,
        loadBytecodeModule,
    }: Pick<Configuration, 'branch' | 'loadBytecodeModule'>
): AltVFile[] =>
    [
        {
            dest: '',
            url: `https://cdn.alt-mp.com/server/${branch}/${platform}/altv-crash-handler${platform === 'x64_win32' ? '.exe' : ''}`,
        },
        {
            dest: '',
            url: `https://cdn.alt-mp.com/server/${branch}/${platform}/altv-server${platform === 'x64_win32' ? '.exe' : ''}`,
        },
        {
            dest: 'modules/js-module/',
            url: `https://cdn.alt-mp.com/js-module/${branch}/${platform}/modules/js-module/${platform == 'x64_linux' ? 'lib' : ''}js-module.${platform === 'x64_win32' ? 'dll' : 'so'}`,
        },
        {
            dest: 'modules/js-module/',
            url: `https://cdn.alt-mp.com/js-module/${branch}/${platform}/modules/js-module/libnode.${platform === 'x64_win32' ? 'dll' : 'so.108'}`,
        },
        loadBytecodeModule
            ? {
                  dest: 'modules/',
                  url: `https://cdn.alt-mp.com/js-bytecode-module/${branch}/${platform}/modules/${platform == 'x64_linux' ? 'lib' : ''}js-bytecode-module.${platform === 'x64_win32' ? 'dll' : 'so'}`,
              }
            : null,
    ].filter(Boolean) as AltVFile[]

const getDataFiles = (branch: Configuration['branch']): AltVFile[] => [
    {
        dest: 'data',
        url: `https://cdn.alt-mp.com/data/${branch}/data/clothes.bin`,
    },
    {
        dest: 'data',
        url: `https://cdn.alt-mp.com/data/${branch}/data/pedmodels.bin`,
    },
    {
        dest: 'data',
        url: `https://cdn.alt-mp.com/data/${branch}/data/rpfdata.bin`,
    },
    {
        dest: 'data',
        url: `https://cdn.alt-mp.com/data/${branch}/data/vehmodels.bin`,
    },
    {
        dest: 'data',
        url: `https://cdn.alt-mp.com/data/${branch}/data/vehmods.bin`,
    },
    {
        dest: 'data',
        url: `https://cdn.alt-mp.com/data/${branch}/data/weaponmodels.bin`,
    },
]

const getAltVFiles = (configuration: Readonly<Configuration>): AltVFile[] => {
    const system = os.platform()
    const platform = altVPlatformName[system as NativePlatform]
    const { branch, loadBytecodeModule } = configuration

    const baseFiles = getBaseFiles(platform, { branch, loadBytecodeModule })
    const dataFiles = getDataFiles(branch)

    return [...baseFiles, ...dataFiles]
}

export { getAltVFiles }
