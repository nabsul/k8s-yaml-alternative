import { namespace, services } from "./my-services"
import { getName, makeDeployment, makeNamespace, makeService } from "./src/k8s-client"

export const deployServices = async () => {
    await makeNamespace(namespace)
    console.log('')

    for (var [n, s] of Object.entries(services)) {
        console.log(`Deploying ${getName(namespace, n)} started`)
        await makeDeployment(namespace, n, s)
        await makeService(namespace, n, s)
        console.log(`Deploying ${getName(namespace, n)} complete\n`)
    }

    console.log(`Deployments complete`)
}

deployServices().catch(console.log)
