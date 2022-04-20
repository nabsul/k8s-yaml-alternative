import { readFileSync, writeFileSync } from "fs"
import Handlebar from "handlebars"
import { namespace, services } from "./my-services"

const svcTpl = Handlebar.compile(readFileSync('./templates/service.hbr').toString())
const dplTpl = Handlebar.compile(readFileSync('./templates/deployment.hbr').toString())

const results = []
for (const [name, svc] of Object.entries(services)) {
    const data = Object.assign({name, namespace}, svc)
    results.push(dplTpl(data));

    // We only need to create a service if there are ports
    if (svc.ports && svc.ports.length > 0) {
        results.push(svcTpl(data));
    }
}

const data = results.join('---\n')
console.log(data)

const file = process.argv[process.argv.length - 1]
if (file.endsWith('.yaml') || file.endsWith('.yml')) {
    writeFileSync(file, data)
    console.log(`Result saved to ${file}`)
}
