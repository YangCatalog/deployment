#!/bin/sh

microk8s helm3 install -f /home/yang/deployment/k8s/values.yaml /home/yang/deployment/k8s --generate-name
watch microk8s kubectl get pods
