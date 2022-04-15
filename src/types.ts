export type MyService = {
    namespace: string,
    name: string,
    image: string,
    replicas: number,
    ports?: number[],
}

// We use this in our definition because the namespace is constant and the namespace is defined as a dictionary key
export type MyServiceAbbreviated = {
    image: string,
    replicas: number,
    ports: number[]
}
