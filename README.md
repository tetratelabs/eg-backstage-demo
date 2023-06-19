# [Envoy Gateway](https://gateway.envoyproxy.io/) [Backstage](https://backstage.io/) Playground

> **Warning**: This repository is a playground, a sketch to seek possible UI/UX when interacting with Envoy deployments managed via [Gateway API](https://gateway-api.sigs.k8s.io/). This contains _full of ugly hacks_, merely to show the potentials.

## Prerequisites

1. A local Kubernetes cluster. We use: [`localKubectlProxy`](https://backstage.io/docs/features/kubernetes/configuration#localkubectlproxy) as the [`kubernetes.clusterLocatorMethods[0].type`](https://backstage.io/docs/features/kubernetes/configuration#clusterlocatormethods). Please follow the instructions [here](./examples/kubernetes/local/SETUP.md) to bring up a local cluster.
1. [`make`](https://www.gnu.org/software/make/). `make` is usually _reachable_ on macOS (via Xcode or Command Line Tools) and GNU/Linux distributions (via package managers).
1. (optional) [`node`](https://nodejs.org/). The v16.18.0 LTS version is recommended. Note: Make sure to use `x64` architecture, since some of the modules still `x64`-only.
1. (optional) [`yarn`](https://classic.yarnpkg.com/lang/en/docs/install/) classic.

> Note: We supply a [`Makefile`](./Makefile) that downloads all of the required [tools](./Tools.mk).

## Playing around

> **Warning**: Some of the commands takes a while, be patient.

After you have a running cluster with Envoy Gateway installed, you need to build the Backstage App, you can run the following command:

```console
make build
```

After that, the app will be created in `./dist` directory. To run the app:

```console
make run
```

> **Note**: `make build run` works fine too!

Then, when the log lines show similar to the following,

```
2022-10-23T02:45:10.261Z backstage info Listening on :7007
```

you can open a browser by pointing it to http://localhost:7007.

Click `httpbin` in components list, select `Kubernetes` tab, scroll down and expand `Local` click `Expose` button next to the `Service`

![Exposing a service](https://user-images.githubusercontent.com/73152/197379576-510ae57a-e83a-4360-b46d-e25c9d0e0834.png)

## Licenses

- `plugins/kubernetes/*` Apache License Version 2.0 Copyright 2020 The Backstage Authors.
- `*` Apache License Version 2.0 Copyright 2020 Tetrate.io, Inc.
