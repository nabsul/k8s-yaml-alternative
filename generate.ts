import { readFileSync, writeFileSync } from "fs"
import Handlebar from "handlebars"
import { namespace, services } from "./my-services"

const svcTpl = Handlebar.compile(readFileSync('./templates/service.yaml.hbr').toString())
const dplTpl = Handlebar.compile(readFileSync('./templates/deployment.yaml.hbr').toString())
const secTpl = Handlebar.compile(readFileSync('./templates/secret.yaml.hbr').toString())

const results = []
for (const [name, svc] of Object.entries(services)) {
    const secretData: {[key: string]: string} = {}
    for (const [k, v] of Object.entries(svc.env || {})) {
        if (typeof v !== 'string') {
            secretData[k] = Buffer.from(v.vaultSecret).toString('base64')
        }
    }

    if (Object.values(secretData).length > 0) {
        console.log(secretData)
        results.push(secTpl({name, namespace, data: secretData}))
    }

    const data = Object.assign({name, namespace}, svc)
    results.push(dplTpl(data));

    // We only need to create a service if there are ports
    if (svc.ports && svc.ports.length > 0) {
        results.push(svcTpl(data));
    }
}

const data = '# This file is generated using the generate.ts script\n' + results.join('---\n')

const file = process.argv[process.argv.length - 1]
if (file.endsWith('.yaml') || file.endsWith('.yml')) {
    writeFileSync(file, data)
    console.log(`Result saved to ${file}`)
} else {
    console.log(data)
}
