# Example catalog

This example catalog holds the following components:

1. Applications
   1. [`httpbin` resources](http://localhost:7007/catalog/default/component/httpbin/kubernetes), deployed in the `default` namespace (owned by: developers).
1. Dataplanes
   1. [`envoy-gateway` resources](http://localhost:7007/catalog/default/component/envoy-gateway-data-plane/kubernetes) (owned by: platform-engineers).
1. Controlplanes
   1. [`envoy-gateway-system` resources](http://localhost:7007/catalog/default/component/envoy-gateway-control-plane/kubernetes) (owned by: platform-engineers).
