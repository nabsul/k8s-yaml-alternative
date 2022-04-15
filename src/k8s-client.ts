import { AppsV1Api, CoreV1Api, KubeConfig, V1Deployment, V1Namespace, V1Service } from "@kubernetes/client-node";
import { MyService } from "./types";

const cfg = new KubeConfig()
cfg.loadFromDefault()

const coreClient = cfg.makeApiClient(CoreV1Api)
const appClient = cfg.makeApiClient(AppsV1Api)

const checkExists = async (func: () => Promise<any>) => {
    try {
        await func()
        return true
    } catch (err: any) {
        if (err.statusCode !== 404) {
            throw err
        }
    }

    return false
}

export const namespaceExists = (ns: string) => checkExists(() => coreClient.readNamespace(ns))
export const deploymentExists = (svc: MyService) => checkExists(() => appClient.readNamespacedDeployment(svc.name, svc.namespace))
export const serviceExists = (svc: MyService) => checkExists(() => coreClient.readNamespacedService(svc.name, svc.namespace))

export const createNamespace = (ns: string) => {
    const namespace: V1Namespace = {
        metadata: {
            name: ns
        }
    }
    
    return coreClient.createNamespace(namespace)
}

export const createDeployment = (d: V1Deployment) => {
    return appClient.createNamespacedDeployment(d?.metadata?.namespace!, d)
}

export const replaceDeployment = (d: V1Deployment) => {
    return appClient.replaceNamespacedDeployment(d?.metadata?.name!, d?.metadata?.namespace!, d)
}

export const createService = (s: V1Service) => {
    return coreClient.createNamespacedService(s?.metadata?.namespace!, s)
}

export const replaceService = (s: V1Service) => {
    return coreClient.replaceNamespacedService(s?.metadata?.name!, s?.metadata?.namespace!, s)
}
