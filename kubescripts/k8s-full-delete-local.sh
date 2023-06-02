#!/bin/sh

kubectl delete --all services
kubectl delete --all deployments
kubectl delete --all pods
kubectl delete --all jobs
kubectl delete --all networkpolicy
kubectl delete --all pvc
kubectl delete --all secret
kubectl delete --all ingress

kubectl delete pv run-pv
kubectl delete pv admin-webroot-pv
kubectl delete pv main-webroot-pv
kubectl delete pv nginx-conf-pv
kubectl delete pv downloadables-pv
kubectl delete pv docs-pv
kubectl delete pv confd-cache-pv

kubectl delete storageclass local-storage

