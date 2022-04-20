import { MyService } from "./src/types"

export const namespace = 'k8s-ts-test'

export const services: {[key: string]: MyService} = { 
    service1: {
        image: 'nginx:latest',
        replicas: 2,
        ports: [80]
    },
    service2: {
        image: 'nats',
        replicas: 1,
        ports: [4222, 8222]
    },
    service3: {
        image: 'nats',
        replicas: 1,
        env: {
            REGULAR_VAR: 'Some Value',
            SECRET_VAR: { vaultSecret: 'vault-secret-name' }
        }
    }
}
