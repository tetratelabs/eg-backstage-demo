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
5. Install CRDs and deployments required for Envoy Gateway, by following: https://github.com/envoyproxy/gateway/blob/main/docs/user/QUICKSTART.md.

```console
kubectl apply -f https://github.com/envoyproxy/gateway/releases/download/v0.2.0-rc2/gatewayapi-crds.yaml
kubectl apply -f https://github.com/envoyproxy/gateway/releases/download/v0.2.0-rc2/install.yaml
```

6. Install dataplanes resources:

```
kubectl apply -f catalog/dataplanes/envoygateway/resources/gatewayclass.yaml
kubectl apply -f catalog/dataplanes/envoygateway/resources/gateway.yaml
```

6. Expose httpbin:

```
kubectl apply -f catalog/applications/httpbin/resources
```

6. Run local kube proxy:

```console
kubectl proxy
```

7. In another terminal session, run:

```console
yarn dev
```

## EKS setup
1. Create an EKS cluster

`eksctl create cluster -f deploy/eks/eks-cluster.yaml`

2. Follow step 3-7 above to install EG and HTTPBin

3. Deploy postgres and backstage

`kubectl apply -f deploy/kubernetes`

4. Use kubectl port forward

`kubectl port-forward -n backstage svc/backstage 7007:80`

Note current backstage image hardcoded http://localhost:7007 baseUrl so don't change port.

Then access http://localhost:7007.

## Blog setup

Apply resources in blog/resources.

1. class
2. instance
3. route
