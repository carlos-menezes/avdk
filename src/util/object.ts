const safeJsonParse = <T,>(json: string): T | undefined => {
    try {
        const jsonValue: T = JSON.parse(json)
        return jsonValue
    } catch {
        return undefined
    }
}

const removeKeys = <T,>(data: object, removableKeys: object): T =>
    Object.entries(data)
        .filter(([flag]) => !Object.keys(removableKeys).includes(flag))
        .reduce((acc, [flag, value]) => ({ ...acc, [flag]: value }), {} as T)

export { removeKeys, safeJsonParse }
