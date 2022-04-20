import { namespace, services } from "./my-services"
import { deployService } from "./src/deploy"
import { createNamespaceIfNotExist } from "./src/k8s-client"

export const deployServices = async () => {
    await createNamespaceIfNotExist(namespace)

    for (var [n, s] of Object.entries(services)) {
        await deployService(namespace, n, s)
    }

    console.log(`Deployment complete`)
}

deployServices().catch(console.log)
