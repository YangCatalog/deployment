# YANG Catalog

## Overview

This repository contains configurations and scripts that tie all the individual components of YANG Catalog together. The components themselves are included as git submodules.

You can find the official YANG Catalog website [here](https://yangcatalog.org).

For accessing some endpoints of YANG Catalog's API directly, you can use [ycclient](https://github.com/earies/ycclient).

# Deployment
The main repository to start up all the pieces of YANG Catalog

## Requirements

* Docker, including docker-compose
* IPv4 Internet connectivity (Docker Hub doesn't do IPv6 yet)
* Sufficient space for container images (approx 10 GB)
* Sufficient space for all the module data
  - approx 45 GB for local development
  - up to 250 GB for production
* Sufficient RAM
  - approx 10 GB for local development
  - up to 24 GB for production

### External requirements

The deployment uses several services via container images that are
distributed by third parties, e.g. via DockerHub

* OpenSearch
* RabbitMQ
* Redis
* NGINX (as the base image of the frontend container, which includes static content)

## Basic Usage

Create `conf/yangcatalog.conf` from `conf/yangcatalog.conf.sample`,
replacing values enclosed in `@...@` with your own.

```
git submodule update --init
docker-compose build # not strictly necessary
docker-compose up
```

The `docker-compose build` command will build container images for the
various components of the YANG Catalog.

The `docker-compose up` will start containers from these images, as
well as the necessary third-party images and combine them into a functional local deployment
of the YANG Catalog, which should be accessible at
http://localhost

All containers have access to a shared volume at `/var/yang`, which is also mapped to the same directory on the host.

### OpenSearch

For development, OpenSearch is run directly in the local environment as a docker container.
The `opensearch-aws` option needs to be set to `False`, `opensearch-host`,
which is the hostname containers will use to try and connect to OpenSearch,
needs to be set to `yc-opensearch`, and `opensearch-port` to `9200`.

In the production environment, we use [Amazon's OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html).
Here `opensearch-aws` needs to be set to `True`, `opensearch-host` and `opensearch-port` must be configured
according to the information provided in the AWS console.


### Logging

All logs are stored in a directory configured in yangcatalog.conf, by default `/var/yang/logs`.
Logs can also be read and filtered through YANG Catalog's admin UI.

### ConfD

YANG Catalog requires ConfD, which is proprietary software and can not be freely distributed.
ConfD can be aquired from [Tail-F Systems](https://www.tail-f.com).

### Kubernetes support

It is possible to deploy YANG Catalog on Kubernetes by following this [guide](./k8s/README.md).

### OpenShift support

OpenShift is, at its core, a multi-tenant variant of Kubernetes.  It
imposes some limitations on the containers it runs; for example,
processes run under a non-root UID.  Many container images are build
under the assumption that they _will_ run as root.

## Structure of the Repository

Various open-source components of YANG Catalog are imported as
submodules:

* [backend](https://github.com/YangCatalog/backend) - YANG Catalog
  API server
* [frontend](https://github.com/YangCatalog/frontend) - Angular applications for 
  YANG Catalog frontend and admin UI together with some static content
* [yangre-gui](https://github.com/plewyllie/yangre-gui) - Peter
  Lewyllie's YANG Regular Expression checker
* [yangvalidator](https://github.com/YangCatalog/yang-validator-extractor) - Carl
  Moberg's YANG validation application
* [module-compilation](https://github.com/YangCatalog/module-compilation) - Scripts
  to analyze and validate YANG files

`docker-compose.yml` is the actual "orchestration" that attempts to
describe a complete (modulo ConfD) deployment of YANG Catalog.

The `conf` directory contains a few files that are passed to the
containers using bind mounts.

### .env variables

Some of the variables here have to correspond with the yangcatalog.conf file.

`COMPOSE_PROJECT_NAME=yc` - The prefix docker-compose will add to container names belonging to this project.
For example, `yc` will result in containers names `yc-backend`, `yc-frontend`, etc..

`REDIS_VOLUME` - Directory where redis will store its `dump.rdb` file.

`RABBITMQ_USER=<RABBITMQ_USER>` - rabbitmq username.

`RABBITMQ_PASSWORD=<RABBITMQ PASSWORD>`  - rabbitmq password.

`OPENSEARCH_DATA=/var/lib/opensearch` - If local OpenSearch is used this
variable is used to specify where OpenSearch indexed data should be saved

`OPENSEARCH_LOG=/var/logs/opensearch`  - If local OpenSearch is used this
variable is used to specify where OpenSearch logs should be saved

`NGINX_LOG=/var/logs/nginx` - Where do we save nginx logs

`KEY_FILE=/home/yang/deployment/resources/yangcatalog.org.key` - certificate key file for HTTPS protocol.
If None exists just use any path

`CERT_FILE=/home/yang/deployment/resources/yangcatalog.org.crt` - certificate file for HTTPS protocol.
If None exists just use any path

`CA_CERT_FILE=/home/yang/deployment/resources/yangcatalog.org.crt` - ca_certificate file for HTTPS protocol.
If None exists just use any path

`OPENSEARCH_ID=1016` - If local OpenSearch is used this
variable is used to set permissions to specific user ID. It`s safe to use same ID as YANG_ID

`OPENSEARCH_GID=1001` - If local OpenSearch is used this
variable is used to set permissions to specific group ID. It`s safe to use same ID as YANG_GID

`YANG_ID=1016` - ID created for yang user

`YANG_GID=1001` - GID created for yang user

`YANG_RESOURCES=/var/yang` - specify path where all shared YANG Catalog data will be saved.

`NGINX_FILES=nginx-testing.conf` - NGINX config files used for NGINX. There is testing config file
or production one with HTTPS. Read [documentation](./setup/README.md) file to find out how to use this variable

`GIT_USER_NAME=foo` - yangcatalog is pushing some data to GitHub repository, and it needs to
set username before any commit is done.

`GIT_USER_EMAIL=bar@foo.com` - yangcatalog is pushing some data to GitHub repository, and it needs to
set email address before any commit is done.

`CRON_MAIL_TO=bar@foo.com` - comma separated list of emails which are used
with cron jobs. If any cron job will fail it will send it to this comma separated list of email addresses.

`YANGCATALOG_CONFIG_PATH=/etc/yangcatalog/yangcatalog.conf` - Path to global config file used by all YANG Catalog components.

`CONFD_VERSION=8.0` - Version of [ConfD](https://www.tail-f.com/management-agent/) to be used.

`CONFD_PASSWORD` - Password for ConfD database.

`CONFD_PASSWORD_HASH` - Hashed password for ConfD admin in format `$1$<salt>$<hash>` or `$0$<password>`.

`CONFD_LOG=/var/yang/logs/confd` - Directory where ConfD will store log files.

`YANGLINT_VERSION=v2.1.111` - Version of [yanglint](https://github.com/CESNET/libyang) to be used.

`XYM_VERSION=0.7.0` - Version of [xym](https://github.com/xym-tool/xym) to be used.
