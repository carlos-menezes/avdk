import pc from 'picocolors'

const logError = (error: Error) => {
    console.error(pc.red(error.message))
}

const logSuccess = (message: string) => {
    console.info(pc.green(message))
}

const logErrorBackground = (error: Error) => {
    console.error(pc.bgRed(error.message))
}

const logSuccessBackground = (message: string) => {
    console.error(pc.bgGreen(message))
}

export { logError, logSuccess, logErrorBackground, logSuccessBackground }
