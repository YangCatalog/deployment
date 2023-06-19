How to run YANGCATALOG on MicroK8s cluster
===

* Some parts of this chart were created with help of Kompose (https://kompose.io/).

# MicroK8s setup

## 1. Install MicroK8s

`sudo snap install microk8s --classic`

* You can join the microk8s group with:

`sudo usermod -a -G microk8s $USER`

`sudo chown -f -R $USER ~/.kube`

`su - $USER`
* If you don t want to write `microk8s` before each comand

`sudo sudo snap alias microk8s.kubectl kubectl`

## 2. Enable DNS

`microk8s enable dns`

## 3. Enable local image registry

`microk8s enable registry`

## 4. SetUp docker to use local image registry

`echo { \"insecure-registries\" : [\"localhost:32000\"] } | sudo tee /etc/docker/daemon.json`

`sudo systemctl restart docker`

## 5. Configure service node port range

`microk8s stop`

`echo --service-node-port-range=80-10873 | tee -a /var/snap/microk8s/current/args/kube-apiserver`

`microk8s start`

## 6. Enable Helm

`microk8s.enable helm3`

### Following setup is for pods ipv6 assignment. This has been created with the help of [this](https://discuss.kubernetes.io/t/microk8s-ipv6-dualstack-how-to/14507/1) disccussion

## 7. Firewall permissions for ipv6

`sudo sysctl -w net.ipv6.conf.all.forwarding=1`

`sudo iptables -P FORWARD ACCEPT`

`sudo ufw allow in on vxlan.calico`

`sudo ufw allow out on vxlan.calico`

## 8. Activate IPv6DualStack feature in Kubernetes and assign CIDR

```commandline
sudo patch /var/snap/microk8s/current/args/kube-proxy << EOF
2c2,3
< --cluster-cidr=10.1.0.0/16
---
> --cluster-cidr=10.1.0.0/16,fd01::/64
> --feature-gates="IPv6DualStack=true"
EOF
```

```commandline
sudo patch /var/snap/microk8s/current/args/kube-apiserver << EOF
2c2
< --service-cluster-ip-range=10.152.183.0/24
---
> --service-cluster-ip-range=10.152.183.0/24,fd98::/108
18a19
> --feature-gates="IPv6DualStack=true"
EOF
```

```commandline
sudo patch /var/snap/microk8s/current/args/kube-controller-manager << EOF
7a8,10
> --feature-gates="IPv6DualStack=true"
> --service-cluster-ip-range=10.152.183.0/24,fd98::/108
> --cluster-cidr=10.1.0.0/16,fd01::/64
EOF
```

```commandline
sudo patch /var/snap/microk8s/current/args/kubelet << EOF
16a17,19
> --feature-gates="IPv6DualStack=true"
> --image-gc-high-threshold=50
> --image-gc-low-threshold=45
EOF
```

## 9. Configure calico

```commandline
cat << EOF > calico-config.patch
data:
  cni_network_config: |-
    {
      "name": "k8s-pod-network",
      "cniVersion": "0.3.1",
      "plugins": [
        {
          "type": "calico",
          "log_level": "info",
          "datastore_type": "kubernetes",
          "nodename_file_optional": true,
          "nodename": "__KUBERNETES_NODE_NAME__",
          "mtu": __CNI_MTU__,
          "ipam": {
              "type": "calico-ipam",
              "assign_ipv4": "true",
              "assign_ipv6": "true"
          },
          "policy": {
              "type": "k8s"
          },
          "kubernetes": {
              "kubeconfig": "__KUBECONFIG_FILEPATH__"
          }
        },
        {
          "type": "portmap",
          "snat": true,
          "capabilities": {"portMappings": true}
        },
        {
          "type": "bandwidth",
          "capabilities": {"bandwidth": true}
        }
      ]
    }
  typha_service_name: none
  veth_mtu: "1440"
EOF
kubectl patch -n kube-system configmaps/calico-config --patch-file=calico-config.patch
```

* Replace <IPV6_GLOBAL_INTF> in next command - you can find how to after the command

```commandline
cat << EOF > calico-node.patch
spec:
  template:
    spec:
      containers:
      - env:
        - name: IP6
          value: autodetect
        - name: IP6_AUTODETECTION_METHOD
          value: interface=<IPV6_GLOBAL_INTF>
        - name: CALICO_IPV6POOL_CIDR
          value: fd01::/64
        - name: FELIX_IPV6SUPPORT
          value: "true"
        name: calico-node
EOF
kubectl patch -n kube-system daemonset/calico-node --patch-file=calico-node.patch
```

* To find your `<IPV6_GLOBAL_INTF>` you need to issue `ifconfig` command that will list all the interfaces and search
for one that contains something similar to following

`inet6 2000::1  prefixlen 64  scopeid 0x0<global>`

* `inet6` and `<global>` is an important part of the line.

* If you are running it on local env for testing, and you don't have inet6 configured you can do following command.
Please replace <INTF> with an interface that is used to access internet.

`sudo ip a add 2000::1/64 dev <INTF>`

## 10. Restart and test

`microk8s stop`

`microk8s start`

* To test if calico assigns ipv6 address for new pod create a following pod

`kubectl run  -it --rm ipv6 --image=busybox -- sh`

* In opened shell of the pod issue command `ifconfig` and see if provided interface contains some global
inet6 line

# Deployment

## 1. Edit parameters of deployment

`cd deployment/k8s`

`cp values-dist.yaml values.yaml`

`vim values.yaml`

* Please create all volume directories (admin-webroot, docs, downloadables, main-webroot, nginx-conf, run) under YANG_VOLUMES manually.
* Please check if `/var/yang/conf/yangcatalog.conf` file points to correct OpenSearch IP

## 2. Run Helm Chart

`microk8s helm3 install -f ./values.yaml . --generate-name`

## 3. View deployment progress

`microk8s kubectl get pods`

`microk8s kubectl get jobs`

## Setup OpenSearch container (on localhost only)

`sudo sysctl -w vm.max_map_count=262144`

`docker exec -it <opensearch_container_name> sh`

`curl -X PUT 'http://localhost:9200/_settings' -H 'Content-Type: application/json' -d '{ "index": { "blocks": { "read_only_allow_delete": "false" } } }'`

`exit`

## How to update images in local image registry

`docker-compose build`

`docker tag <image_name>:latest localhost:32000/<image_name>:latest`

`docker push localhost:32000/<image_name>:latest`
