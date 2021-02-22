How to run YANGCATALOG on MicroK8s cluster
===

* Some parts of this chart were created with help of Kompose (https://kompose.io/).

# MicroK8s setup

## 1. Install MicroK8s

`sudo snap install microk8s --classic`

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

# Deployment

## 1. Edit parameters of deployment

`cd deployment/k8s`

`cp values-dist.yaml values.yaml`

`vim values.yaml`

* Please create all volume directories (docs, downloadables, mysql, nginx-conf, run, webroot) under YANG_VOLUMES manually.

## 2. Run Helm Chart

`microk8s helm3 install -f ./values.yaml . --generate-name`

## 3. View deployment progress

`microk8s kubectl get pods`

`microk8s kubectl get jobs`

## 4. Setup MariaDB

`microk8s kubectl cp 'table_users.sql' <mariadb_container_name>:/home/.`

`microk8s kubectl cp 'table_users_temp.sql' <mariadb_container_name>:/home/.`

`microk8s kubectl exec -it <mariadb_container_name> -- sh`

`mysql -u root -p yang_catalog < /home/table_users.sql`

`mysql -u root -p yang_catalog < /home/table_users_temp.sql`

`exit`

## Setup Elasticsearch container (on localhost only)

`sudo sysctl -w vm.max_map_count=262144`

`docker exec -it <elasticsearch_container_name> sh`

`curl -X PUT 'http://localhost:9200/_settings' -H 'Content-Type: application/json' -d '{ "index": { "blocks": { "read_only_allow_delete": "false" } } }'`

`exit`

## How to update images in local image registry

`docker-compose build`

`docker tag <image_name>:latest localhost:32000/<image_name>:latest`

`docker push localhost:32000/<image_name>:latest`
