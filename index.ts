import { deployServices } from "./src/deploy"
import { getYaml } from "./src/yaml"

const command = process.argv[2]

const getCommand = () => {
    switch (command) {
        case 'yaml':
            return async () => getYaml(process.argv[3])
        case 'deploy':
            return deployServices
    }
}

const func = getCommand()

if (!func) {
    console.log(`command not found: [${command}]`)
    process.exit()
}

func().catch(console.log)
