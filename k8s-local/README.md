How to run YANGCATALOG locally on Minikube cluster
===

## 1. Minikube and Helm installation

Please refer to this guide for minikube installation instructions: https://minikube.sigs.k8s.io/docs/start/

Also, as I will be using just `kubectl` command, you can either install kubectl separately [here](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-using-native-package-management) (then minikube after start will be configured to use kubectl you installed) or use:

```bash
alias kubectl='minikube kubectl --'
```

Notice that you will need to enter this alias every time you open new terminal.

As for the helm, use the installation guide [here](https://helm.sh/docs/intro/install/).

## 2. IPv6 and DualStack challenge

For now minikube does not support IPv6, so either of this options are not to be tested locally for now.

https://github.com/kubernetes/minikube/issues/8535

## 3. Starting minikube cluster and mounting necessary volumes

Use your own deployment folder in the second part of this command:

```bash
(minikube start --extra-config=apiserver.service-node-port-range=1-65535 --mount-string="/var/yang:/var/yang" --mount) && (minikube mount /home/dmkirichen/Documents/deployment:/home/dmkirichen/Documents/deployment &)
```

## 4. Enable local image registry

We need to reconfigure docker to use inner local registry of the minikube. It's need to be done every time you run a new terminal.

```bash
eval $(minikube docker-env)
```

## 5. Populating local registry with images

```bash
cd deployment/
docker-compose build
```

## 6. Deploying kubernetes configuration

You might need to check if all fields in values.yaml are fitting for you configuration.

```bash
cd k8s-local/
helm install -f values.yaml . --generate-name
```

## 7. Useful debug tools

```bash
kubectl get po
kubectl get ev
kubectl describe pods/pod_name
kubectl logs pods/pod_name
kubectl exec --stdin --tty pods/pod_name -- /bin/bash
```

## 8. Cleanup commands

Removing every deployment resource:

```bash
deployment/kubescripts/k8s-full-delete-local.sh
```

Removing whole minikube cluster configuration:
```bash
minikube delete
```
