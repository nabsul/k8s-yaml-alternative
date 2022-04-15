import { V1Deployment, V1Service } from "@kubernetes/client-node"
import { MyService } from "./types"

export const k8sDeployment = (svc: MyService): V1Deployment => {
    const metadata = {
        name: svc.name,
        namespace: svc.namespace,
    }

    const container = {
        name: svc.name,
        image: svc.image,
        ports: (svc.ports || []).map(p => ({
            containerPort: p,
        }))
    }

    return {
        metadata,
        spec: {
            selector: { matchLabels: { app: svc.name } },
            replicas: svc.replicas,
            template: {
                metadata: { labels: { app: svc.name } },
                spec: { containers: [ container ] }
            }
        }
    }
}

export const k8sService = (svc: MyService): V1Service => {
    return {
        metadata: {
            name: svc.name,
            namespace: svc.namespace,
        },
        spec: {
            ports: (svc.ports || []).map(p => ({
                port: p,
                name: `port${p}`      
            }))
        }
    }
}
