import { deployServices } from "./src/deploy"
import { getYaml } from "./src/yaml"

const command = process.argv[2]

const getCommand = () => {
    switch (command) {
        case 'deploy':
            return deployServices
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
