# Setting up a local cluster with Envoy Gateway

A more elaborated version of this can be checked on: https://tetr8.io/3CRZaOb.

1. Install [`kind`](https://kind.sigs.k8s.io/) by following: https://kind.sigs.k8s.io/docs/user/quick-start/#installation. This requires Docker-daemon to be installed, on macOS, you can try [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Install [`kubectl`](https://kubernetes.io/docs/reference/kubectl/) if you don't have it: https://kubernetes.io/docs/tasks/tools/#kubectl.
3. Create a local cluster.

```console
kind create cluster
```

4. Install the required resources to install Envoy Gateway in this local cluster.

```console
kubectl apply -f https://github.com/envoyproxy/gateway/releases/download/v0.2.0/install.yaml
```

Check if everything is running (make sure you have "response" from the following requests):

```console
kubectl get pods --namespace gateway-system --field-selector=status.phase==Running
```

```console
kubectl get pods --namespace envoy-gateway-system --field-selector=status.phase==Running
```

5. Install [HTTPbin](../resources/httpbin) as a workload/application in our cluster, from the project root directory:

```console
kubectl apply -f examples/kubernetes/resources/httpbin/httpbin.yaml
```

Check if the application is running:

```console
kubectl get pods --field-selector=status.phase==Running | grep httpbin
```

6. Install [Envoy Gateway](../resources/envoy-gateway), from the project root directory:

Firstly, install the _class_.

```console
kubectl apply -f examples/kubernetes/resources/envoy-gateway/my-envoy-gateway.yaml
```

Then, create a Gateway _instance_ (with `insecure-port` as its name),

```console
kubectl apply -f examples/kubernetes/resources/envoy-gateway/insecure-port.yaml
```

Wait until it's up:

```console
kubectl get pod --namespace envoy-gateway-system --field-selector=status.phase==Running | grep insecure-port
```

7. Now you're ready! Back to [the main README](../../../README.md).
