import { createNamespace, namespaceExists } from "./k8s-client"

export const createNamespaceIfNotExist = async (ns: string) => {
    if (await namespaceExists(ns)) {
        console.log(`Namespace ${ns} already exists.`)
        return
    }

    await createNamespace(ns)
    console.log(`Namespace ${ns} created.`)
}
