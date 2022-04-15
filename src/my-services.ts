import { MyService, MyServiceAbbreviated } from "./types"

export const namespace = 'k8s-ts-test'

const services: {[key: string]: MyServiceAbbreviated} = { 
    service1: {
        image: 'nginx:latest',
        replicas: 2,
        ports: [80]
    },
    service2: {
        image: 'nats',
        replicas: 1,
        ports: [4222, 8222]
    }
}

export const getAllServices = (): MyService[] => {
    return Object.entries(services).map(([name, s]) => Object.assign({name, namespace}, s))
}
