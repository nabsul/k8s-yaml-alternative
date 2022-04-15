import { readFileSync, writeFileSync } from "fs"
import Handlebar from "handlebars"
import { getAllServices } from "./my-services"

const svcTpl = Handlebar.compile(readFileSync('./templates/service.hbr').toString())
const dplTpl = Handlebar.compile(readFileSync('./templates/deployment.hbr').toString())

export const getYaml = (file?: string) => {
    const services = getAllServices()
    const results = []
    for (const s of services) {
        results.push(dplTpl(s));
        results.push(svcTpl(s));
    }
    const data = results.join('---\n')
    console.log(data)

    if (file) {
        writeFileSync(file, data)
        console.log(`Result saved to ${file}`)
    }
}
