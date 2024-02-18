#! /usr/bin/env node

import minimist from 'minimist'
import { Configuration, configurationSchema } from './lib/configuration'
import init from './commands/init'
import ensure from './commands/ensure'
import { ValidationError } from 'yup'
import { alias, configurationTypes } from './lib/cli'
import { removeKeys } from './util/object'
import {
    logErrorBackground,
    logSuccessBackground,
} from './util/log'

const run = async () => {
    const args = minimist(process.argv.slice(2), {
        default: configurationSchema.cast({}),
        alias,
        ...configurationTypes,
    })

    const { _: commands, ...config } = args
    const command = commands[0]
    const flags = removeKeys<Configuration>(config, alias)
    try {
        switch (command) {
            case 'init': {
                const configuration = configurationSchema.validateSync(flags)
                const name = commands[1]
                try {
                    await init(configuration, name)
                    logSuccessBackground(
                        'OK! Run `npm i` to install dependencies'
                    )
                } catch (e) {
                    const error = e as Error
                    logErrorBackground(error)
                }
                break
            }
            case 'ensure': {
                try {
                    await ensure()
                    logSuccessBackground('OK! Ensured all Alt:V files')
                } catch (e) {
                    const error = e as Error
                    logErrorBackground(error)
                }
                break
            }
        }
    } catch (e) {
        const error = e as ValidationError
        console.error(error.message)
        process.exit(1)
    }
}

run()
    .then(() => process.exit(0))
    .catch(console.error)
