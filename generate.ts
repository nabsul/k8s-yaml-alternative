import { readFileSync, writeFileSync } from "fs"
import Handlebar from "handlebars"
import { namespace, services } from "./my-services"

const svcTpl = Handlebar.compile(readFileSync('./templates/service.yaml.hbr').toString())
const dplTpl = Handlebar.compile(readFileSync('./templates/deployment.yaml.hbr').toString())
const nsTpl = readFileSync('./templates/namespace.yaml').toString()

const results = [nsTpl]
for (const [name, svc] of Object.entries(services)) {
    const data = Object.assign({name, namespace}, svc)
    results.push(dplTpl(data));

    // We only need to create a service if there are ports
    if (svc.ports && svc.ports.length > 0) {
        results.push(svcTpl(data));
    }
}

const data = '# This file is generated using the generate.ts script\n' + results.join('---\n')

const file = 'generated.yaml'
writeFileSync(file, data)
console.log(data)
console.log(`Result saved to ${file}`)
