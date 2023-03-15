#!/bin/sh

microk8s kubectl delete --all services
microk8s kubectl delete --all deployments
microk8s kubectl delete --all pods
microk8s kubectl delete --all jobs
microk8s kubectl delete --all networkpolicy
microk8s kubectl delete --all pvc
microk8s kubectl delete --all secret
microk8s kubectl delete --all ingress

microk8s kubectl delete pv run-pv
microk8s kubectl delete pv admin-webroot-pv
microk8s kubectl delete pv main-webroot-pv
microk8s kubectl delete pv nginx-conf-pv
microk8s kubectl delete pv downloadables-pv
microk8s kubectl delete pv docs-pv
microk8s kubectl delete pv confd-cache-pv

microk8s kubectl delete storageclass local-storage

