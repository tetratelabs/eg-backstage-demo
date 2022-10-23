# HTTPBin

We modified the deployment resource from https://raw.githubusercontent.com/istio/istio/master/samples/httpbin/httpbin.yaml by adding a label to the deployment. This is required since Backstage `kubernetes-backend` plugin relies on labels when querying resources from a Kubernetes cluster. See: https://backstage.io/docs/features/kubernetes/configuration#surfacing-your-kubernetes-components-as-part-of-an-entity for more details.

```yaml
...
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpbin
  # Note: We modified this, hence deployment is properly labelled and can be fetched by Backstage kubernetes-backend plugin.
  labels:
    app: httpbin
spec:
  ...
```
