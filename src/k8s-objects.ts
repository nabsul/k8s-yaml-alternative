import { V1Container, V1Deployment, V1EnvVar, V1Secret, V1Service } from "@kubernetes/client-node"
import { EnvVal, MyService } from "./types"

export const k8sDeployment = (namespace: string, name: string, svc: MyService): V1Deployment => {
    const container: V1Container = {
        name,
        image: svc.image,
        ports: (svc.ports || []).map(p => ({ containerPort: p })),
        env: Object.entries(svc.env || {}).map(([n,e]) => createEnvVar(name, n, e))
    }

    return {
        metadata: { name, namespace },
        spec: {
            selector: { matchLabels: { app: name } },
            replicas: svc.replicas,
            template: {
                metadata: { labels: { app: name } },
                spec: { containers: [ container ] }
            }
        }
    }
}

export const k8sService = (namespace: string, name: string, svc: MyService): V1Service => {
    return {
        metadata: { name, namespace },
        spec: {
            ports: (svc.ports || []).map(p => ({
                port: p,
                name: `port${p}`      
            }))
        }
    }
}

const createEnvVar = (svcName: string, name: string, val: EnvVal): V1EnvVar => {
    if (typeof val == 'string') {
        return { name, value: val }
    }

    return {
        name,
        valueFrom: {
            secretKeyRef: {
                name: `${svcName}-secret`,
                key: val.vaultSecret
            }
        }
    }
}

