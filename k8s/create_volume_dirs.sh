#!/bin/bash

yang_volumes=$(grep YANG_VOLUMES values.yaml | awk '{print $2}')
for dir in admin-webroot docs downloadables main-webroot nginx-conf run; do
  echo "Creating $yang_volumes/$dir folder for k8s volume..."
  mkdir -p "$yang_volumes/$dir"
done

echo "Finished all the work."

