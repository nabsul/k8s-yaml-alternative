import { createDeployment, createService, deploymentExists, replaceDeployment, replaceService, serviceExists } from "./k8s-client";
import { k8sDeployment, k8sService } from "./k8s-objects";
import { MyService } from "./types";
import { getUserConfirmation } from "./util";

const getName = (svc: MyService): string => {
    return `[${svc.name}] in namespace [${svc.namespace}]`
}


export const deployService = async (svc: MyService) => {
    console.log(`Preparing to deploy ${getName(svc)}`)
    const exists = await deploymentExists(svc)
    if (exists) {
        const message = `Deployment ${getName(svc)} already exists. Redeploy?`
        if (!await getUserConfirmation(message)) {
            console.log('Aborting.')
            process.exit()
        }
    }

    const deployment = k8sDeployment(svc)
    const func = exists ? replaceDeployment : createDeployment
    await func(deployment)

    if ((svc.ports || []).length > 0) {
        console.log(`Creating Kubernetes service for [${getName(svc)}]`)
        const service = k8sService(svc)
        if (await serviceExists(svc)) {
            await replaceService(service)
        } else {
            await createService(service)
        }
    } else {
        console.log(`Skipping service creation because there are no ports.`)
    }

    console.log(`Deployment ${getName(svc)} complete.`)
}
