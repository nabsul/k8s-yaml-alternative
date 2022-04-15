import { deployService } from "./src/deploy"
import { getAllServices, namespace } from "./src/my-services"
import { createNamespaceIfNotExist } from "./src/namespace"
import { getYaml } from "./src/yaml"

const deploy = async () => {
    await createNamespaceIfNotExist(namespace)

    for (var s of getAllServices()) {
        await deployService(s)
    }

    console.log(`Deployment complete`)
}

const command = process.argv[2]

const getCommand = () => {
    switch (command) {
        case 'deploy':
            return deploy    
        case 'yaml':
            return async () => getYaml(process.argv[3])
    }
}

const func = getCommand()

if (!func) {
    console.log(`command not found: [${command}]`)
    process.exit()
}

func().catch(console.log)
