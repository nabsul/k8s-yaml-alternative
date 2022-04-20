import { createDeployment, createSecret, createService, deploymentExists, replaceDeployment, replaceSecret, replaceService, secretExists, serviceExists } from "./k8s-client";
import { k8sDeployment, k8sSecret, k8sService } from "./k8s-objects";
import { MyService } from "./types";

const getName = (namespace: string, name: string): string => {
    return `[${name}] in namespace [${namespace}]`
}

export const deployService = async (namespace: string, name: string, svc: MyService) => {
    // check if a secret needs to be created
    const secretData: {[key: string]: string} = {}
    for (const [k, v] of Object.entries(svc.env || {})) {
        if (typeof v !== 'string') {
            secretData[k] = v.vaultSecret
        }
    }

    if (Object.values(secretData).length > 0) {
        const secretName = `${name}-secret`
        const secret = k8sSecret(namespace, secretName, secretData)
        const sExists = await secretExists(namespace, secretName)
        const secretFunc = sExists ? replaceSecret : createSecret
        console.log(`Upserting Kubernetes secret ${secretName}`)
        await secretFunc(secret)
    }

    const exists = await deploymentExists(namespace, name)
    const deployment = k8sDeployment(namespace, name, svc)
    const dplFunc = exists ? replaceDeployment : createDeployment
    console.log(`Upserting Kubernetes deployment ${getName(namespace, name)}`)
    await dplFunc(deployment)

    if (svc.ports && svc.ports.length > 0) {
        console.log(`Upserting Kubernetes service for ${getName(namespace, name)}`)
        const svcExists = await serviceExists(namespace, name)
        const service = k8sService(namespace, name, svc)
        const svcFunc = svcExists ? replaceService : createService
        await svcFunc(service)
    } else {
        console.log(`Skipping service creation because there are no ports.`)
    }

    console.log(`Deployment ${getName(namespace, name)} complete.`)
}
