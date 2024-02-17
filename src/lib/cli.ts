import type { Configuration } from './configuration'

type FlagAlias = 'bc' | 'b'
type Flag = keyof Configuration

const alias: Record<FlagAlias, Flag> = {
    bc: 'loadBytecodeModule',
    b: 'branch',
} as const

const configurationTypes: Record<
    'boolean' | 'string',
    Array<Flag | FlagAlias>
> = {
    boolean: ['bc', 'loadBytecodeModule'],
    string: ['b', 'branch'],
}

export { alias, configurationTypes }
