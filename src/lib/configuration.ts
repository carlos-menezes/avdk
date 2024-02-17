import { boolean, object, string } from 'yup'
import type { InferType } from 'yup'

const configurationSchema = object({
    branch: string().oneOf(['dev', 'rc', 'release']).default('release'),
    loadBytecodeModule: boolean().default(true),
})
type Configuration = InferType<typeof configurationSchema>

export { configurationSchema }
export type { Configuration }