#!/bin/sh

# Pass name of the existing helm release as an argument
microk8s helm3 upgrade -f /home/yang/deployment/k8s/values.yaml $1 /home/yang/deployment/k8s
