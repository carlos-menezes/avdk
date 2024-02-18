import { OUTPUT_DIRECTORY } from '../util/constants'

type PackageJson = {
    name: string
    version: string
    scripts: Record<Script, string>
    devDependencies: Record<string, string>
    type: string
}

type Script =
    | 'clean'
    | 'compile'
    | 'copy'
    | 'build'
    | 'start:windows'
    | 'start:linux'
    | 'dev:windows'
    | 'dev:linux'
    | 'ensure'

const scripts: Record<Script, string> = {
    clean: `rimraf ./${OUTPUT_DIRECTORY}`,
    compile: `swc ./src -d ./${OUTPUT_DIRECTORY}/resources --copy-files --strip-leading-paths`,
    copy: `cpy './configuration/**/*' ./${OUTPUT_DIRECTORY} `,
    build: 'npm run clean && npm run compile && npm run copy',
    'start:windows': `npm run build && ./${OUTPUT_DIRECTORY}/altv-server.exe`,
    'start:linux': `npm run build && ./${OUTPUT_DIRECTORY}/altv-server`,
    'dev:windows':
        'nodemon --watch "./src/**/" --ext "ts" --exec "npm run start:windows"',
    'dev:linux':
        'nodemon --watch "./src/**/" --ext "ts" --exec "npm run start:linux"',
    ensure: '',
}

export { scripts }
export type { Script, PackageJson }
