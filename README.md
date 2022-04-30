# Kubernetes YAML Alternative

This repo demonstrates how to use TypeScript to define services in your Kubernetes cluster.
It is meant to replace manually crafting individual YAML files.

There are two approaches demonstrated here:

- Generating YAML using Handlebars
- Skipping the YAML altogether and deploying via the Kubernetes client library

## The Example Scenario

This demo creates three deployments and two services.
One of the services also requires a Kubernetes secret.
You can see the spec of these services in `./my-services.ts`.

All of these services will be deployed to a namespace called `k8s-ts-test`.
You can easily run this code on your cluster and cleanup later with `kubectl delete namespace k8s-ts-test`.

## Getting Started

Before getting started, make sure your `kubectl` is configured for the cluster that you want to test in.
Then, check out this code and run `npm install`

## The YAML Approach

- Generate your yaml file with `npm run generate`.
- Create the empty namespace with `kubectl create namespace k8s-ts-test`
- Apply the yaml with `kubectl apply -f generated.yaml`

## Deploying Directly

- Run `npm run deploy`

## Cleanup

All of the resources are created in the `k8s-ts-test`.
You can clean everything up with `kubectl delete namespace k8s-ts-test`
