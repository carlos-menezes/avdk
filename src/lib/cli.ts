import type { Configuration } from './configuration'

type FlagAlias = 'b' | 'v'
type Flag = keyof Configuration

const alias: Record<FlagAlias, Flag> = {
    b: 'branch',
    v: 'voice',
} as const

const configurationTypes: Record<
    'boolean' | 'string',
    Array<Flag | FlagAlias>
> = {
    boolean: ['v', 'voice'],
    string: ['b', 'branch'],
}

export { alias, configurationTypes }
