import type { Configuration } from './configuration'

type FlagAlias = 'bc' | 'b' | 'v'
type Flag = keyof Configuration

const alias: Record<FlagAlias, Flag> = {
    bc: 'loadBytecodeModule',
    b: 'branch',
    v: 'voice',
} as const

const configurationTypes: Record<
    'boolean' | 'string',
    Array<Flag | FlagAlias>
> = {
    boolean: ['bc', 'loadBytecodeModule', 'v', 'voice'],
    string: ['b', 'branch'],
}

export { alias, configurationTypes }
