import { AppsV1Api, CoreV1Api, KubeConfig, V1Namespace } from "@kubernetes/client-node";
import { k8sDeployment, k8sService } from "./k8s-objects";
import { MyService } from "./types";

const cfg = new KubeConfig()
cfg.loadFromDefault()

const coreClient = cfg.makeApiClient(CoreV1Api)
const appClient = cfg.makeApiClient(AppsV1Api)

export const getName = (ns: string, n: string) => `[${ns}] - [${n}]`

const wrapGet = async <T>(p: Promise<T>): Promise<T | null> => {
    try {
        return await p
    } catch (err: any) {
        if (err.statusCode !== 404) {
            throw err
        }
    }

    return null
}

export const makeDeployment = async (namespace: string, name: string, svc: MyService) => {
    const d = k8sDeployment(namespace, name, svc)
    if (null !== await wrapGet(appClient.readNamespacedDeployment(name, namespace))) {
        await appClient.replaceNamespacedDeployment(name, namespace, d)
        console.log(`Deployment ${getName(namespace, name)} updated`)
        return
    } 
    
    await appClient.createNamespacedDeployment(namespace, d)
    console.log(`Deployment ${getName(namespace, name)} created`)
}

export const makeService = async (namespace: string, name: string, svc: MyService) => {
    if (!svc.ports || svc.ports.length === 0) {
        console.log(`Service ${getName(namespace, name)} is not needed`)
        return
    }

    const s = k8sService(namespace, name, svc)
    const service = await wrapGet(coreClient.readNamespacedService(name, namespace))
    if (null !== service) {
        s!.metadata!.resourceVersion = service.body.metadata!.resourceVersion!
        await coreClient.replaceNamespacedService(name, namespace, s)
        console.log(`Service ${getName(namespace, name)} updated`)
        return
    } 
    
    await coreClient.createNamespacedService(namespace, s)
    console.log(`Service ${getName(namespace, name)} created`)
}

export const makeNamespace = async (ns: string) => {
    if (null !== await wrapGet(coreClient.readNamespace(ns))) {
        console.log(`Namespace ${ns} already exists.`)
        return
    }

    const namespace: V1Namespace = { metadata: { name: ns } }
    await coreClient.createNamespace(namespace)
    console.log(`Namespace ${ns} created.`)
}
