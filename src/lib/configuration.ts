import { boolean, object, string } from 'yup'
import type { InferType } from 'yup'

const configurationSchema = object({
    branch: string().oneOf(['dev', 'rc', 'release']).default('release'),
    voice: boolean().default(false),
})
type Configuration = InferType<typeof configurationSchema>

export { configurationSchema }
export type { Configuration }
