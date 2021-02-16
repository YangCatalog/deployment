How to run YANGCATALOG on microk8s cluster
===

* Some parts of this chart were created with help of Kompose (https://kompose.io/).

## Install microk8s

`sudo snap install microk8s --classic`

## Enable DNS

`microk8s enable dns`

## Enable ingress

`microk8s enable ingress`

## Enable Helm

`microk8s.enable helm3`

## Get AWS ECR token (login is valid for 12 hours)

`aws ecr get-login-password --region <region>`

## LogIn with docker to AWS (copy&paste token from previous step)

`docker login –u AWS <aws_account_id>.dkr.ecr.<region>.amazonaws.com`

## LogIn with microk8s to AWS

`microk8s kubectl create secret generic regcred --from-file=.dockerconfigjson=~/.docker/config.json --type=kubernetes.io/dockerconfigjson`

## Edit parameters of deployment

`cp values-dist.yaml values.yaml`

`vim values.yaml`

* Please create all volume directories (docs, downloadables, mysql, nginx-conf, run, webroot) under YANG_VOLUMES manually.

## Run Helm Chart

`cd deployment/k8s`
`microk8s helm3 install -f ./values.yaml . --generate-name`

## View deployment progress

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

## How to update images in ECR

`docker-compose build`

`docker tag <image_name>:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<image_name>:latest`

`docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<image_name>:latest`
