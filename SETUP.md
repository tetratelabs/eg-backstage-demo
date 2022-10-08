# Setup

## Manual bookinfo catalog

1. Install [`kind`](https://kind.sigs.k8s.io/).

```console
brew install kind
```

2. Create a cluster.

```console
kind create cluster
```

3. Install `istio`, and the sample application (`bookinfo`) following: https://istio.io/latest/docs/setup/getting-started/.
4. Install `httpbin`, and label the deployment with: `app=httpbin`.

```console
kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/httpbin/httpbin.yaml
kubectl label deployment httpbin app=httpbin
```

5. Run local kube proxy:

```console
kubectl proxy
```

6. In another terminal session, run:

```console
yarn dev
```
