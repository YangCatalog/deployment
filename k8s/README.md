How to run YANGCATALOG on MicroK8s cluster
===

* Some parts of this chart were created with help of Kompose (https://kompose.io/).

## 1. Install MicroK8s

`sudo snap install microk8s --classic`

## 2. Enable DNS

`microk8s enable dns`

## 3. Enable local image registry

`microk8s enable registry`

## 4. SetUp docker to use local image registry

`echo { \"insecure-registries\" : [\"localhost:32000\"] } | sudo tee /etc/docker/daemon.json`

`sudo systemctl restart docker`

## 5. Enable ingress

`microk8s enable ingress`

## 6. Enable Helm

`microk8s.enable helm3`

## 7. Edit parameters of deployment

`cp values-dist.yaml values.yaml`

`vim values.yaml`

* Please create all volume directories (docs, downloadables, mysql, nginx-conf, run, webroot) under YANG_VOLUMES manually.

## 8. Run Helm Chart

`cd deployment/k8s`
`microk8s helm3 install -f ./values.yaml . --generate-name`

## 9. View deployment progress

`microk8s kubectl get pods`

`microk8s kubectl get jobs`

## Setup MariaDB (on localhost only)

`microk8s kubectl cp 'table_users.sql' <mariadb_container_name>:/home/.`

`microk8s kubectl cp 'table_users_temp.sql' <mariadb_container_name>:/home/.`

`microk8s kubectl exec -it <mariadb_container_name> -- sh`

`mysql -u root -p yang_catalog < /home/table_users.sql`

`mysql -u root -p yang_catalog < /home/table_users_temp.sql`

`exit`

## Setup Elasticsearch container (on localhost only)

`sudo sysctl -w vm.max_map_count=262144`

`microk8s kubectl exec -it <elasticsearch_container_name> -- sh`

`curl -X PUT 'http://localhost:9200/_settings' -H 'Content-Type: application/json' -d '{ "index": { "blocks": { "read_only_allow_delete": "false" } } }'`

`exit`

## How to update images in local image registry

`docker-compose build`

`docker tag <image_name>:latest localhost:32000/<image_name>:registry`

`docker push localhost:32000/<image_name>:registry`
