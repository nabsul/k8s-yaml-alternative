export type MyService = {
    image: string,
    replicas: number,
    ports?: number[],
    env?: {[key: string]: EnvVal}
}

export type EnvVal = string | { vaultSecret }
