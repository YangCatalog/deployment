# YANG Catalog

## Overview

This repository contains configurations and scripts that tie all the individual components of YANG Catalog together. The components themselves are included as git submodules.

You can find official YANG Catalog website [here](https://yangcatalog.org).

# Deployment
Main repository to start up all the pieces of YANG Catalog

## Requirements

* Docker, including docker-compose
* IPv4 Internet connectivity (Docker Hub doesn't do IPv6 yet)
* Sufficient space for container images (approx 10 GB)
* Sufficient space for all the modules data
  - approx 45 GB for local development
  - up to 250 GB for production
* Sufficient RAM
  - approx 8 GB for local development
  - up to 24 GB for production

### External requirements

The deployment uses several services via container images that are
distributed by third parties, e.g. via DockerHub

* Elasticsearch
* RabbitMQ
* NGINX (as the base image of the frontend container, which includes static content)

## Basic Usage

Create `conf/yangcatalog.conf` from `conf/yangcatalog.conf.sample`,
replacing values enclosed in `@...@` with your own.

```
git submodule update --init
docker-compose build # not strictly necessary
docker-compose up
```

The `docker-compose build` should build container images for the
various components of the YANG Catalog.

The `docker-compose up` will start containers from these images, as
well as from some third-party container images (e.g. RabbitMQ,
Redis) and combine them into a functional local deployment
of the YANG Catalog, which should be accessible on
http://localhost

Make sure that you will start the elasticsearch Dockerfile as well
since in production environment this is not used and an AWS elasticsearch
instance is used instead

## Status

### Elasticsearch

Elasticsearch instance can be started in two different ways. Locally
you can set "es-aws" in your yangcatalog.conf file to `False` and start
the elasticsearch manually using `docker run` command. Also es-host
has to be set to elasticsearch instance IP (k8s setup) or
`yc-elasticsearch` (docker-compose setup) and port to `9200`. In production
we use AWS elasticsearch service. This instance runs on different server
and are connected to YANG Catalog server. For this the "es-aws" needs to be
set to `True` and es-host set to whatever URL AWS provides for elasticsearch.
In AWS make sure that this URL is not opened for internet but is opened for
the other instance that is running yangcatalog.org

### Logging

All the logging is done to different files that should be located in
one directory which is specified in yangcatalog.conf config file.
Normally you would find this in /var/yang/logs. This directory is
a volume shared with host system. All the logs can be checked and
filtered using YANG Catalog admin UI if you have access to that.

### ConfD

The YANG Catalog requires ConfD, which is not open source and cannot
be included here in the same way as the other components. In order
for YANG Catalog to be working you need to acquire confd since this
is a beating heart of YANG Catalog and contains all the metadata
about each module. Confd binary is copied to resources and each
docker service that will need this will install it in its own
container.

### Kubernetes support

It is possible to deploy YANG Catalog on Kubernetes by following this [guide](./k8s/README.md).

### OpenShift support

OpenShift is, at its core, a multi-tenant variant of Kubernetes.  It
imposes some limitations on the containers it runs; for example,
processes run under a non-root UID.  Many container images are build
under the assumption that they _will_ run as root.

## Structure of the Repository

Various open-source components of the YANG Catalog are imported as
submodules:

* [backend](https://github.com/YangCatalog/backend) - the YANG Catalog
  API server
* [search](https://github.com/YangCatalog/search) - the YANG search
  Web application - repo DISCONTINUED
* [web_root](https://github.com/YangCatalog/web_root) - static HTML,
  CSS etc. content
* [yangre-gui](https://github.com/plewyllie/yangre-gui) - Peter
  Lewyllie's YANG Regular Expression checker
* [yangvalidator](https://github.com/YangCatalog/yang-validator-extractor) - Carl
  Moberg's YANG validation application
* [sdo_analysis](https://github.com/YangCatalog/sdo_analysis) - Scripts
  to analyze and validate YANG files
* [admin_ui](https://github.com/YangCatalog/admin_ui) - Admin frontend
  to monitor and manage yangcatalog.org
* [yangcatalog-ui](https://github.com/YangCatalog/yangcatalog-ui) - Whole YANG Catalog frontend - Angular app

`docker-compose.yml` is the actual "orchestration" that attempts to
describe a complete (modulo ConfD) deployment of the YANG Catalog.

The `conf` directory contains a few files that are passed to the
containers using bind mounts.

### .env variables

Some of the following variables if changed here has to corespond with yangcatalog.conf file

`COMPOSE_PROJECT_NAME=yc` - When running a docker-compose up command it will create
a docker containers that have some specific name (like backend, frontend...).
This will add a prefix to these names so in this example we would have yc-backend, yc-frontend...

`REDIS_VOLUME` - Directory where redis will store its `dump.rdb` file.

`RABBITMQ_USER=<RABBITMQ_USER>` - rabbitmq username.

`RABBITMQ_PASSWORD=<RABBITMQ PASSWORD>`  - rabbitmq username.

`ELASTICSEARCH_DATA=/var/lib/elasticsearch` - This is only used with local elasticsearch. If AWS
elasticsearch is used this variables can be set to anything. If local elasticsearch is used this
variable is used to specify where elasticsearch indexed data should be saved

`ELASTICSEARCH_LOG=/var/log/elasticsearch`  - This is only used with local elasticsearch. If AWS
elasticsearch is used this variables can be set to anything. If local elasticsearch is used this
variable is used to specify where elasticsearch logs should be saved

`NGINX_LOG=/var/log/nginx` - Where do we save nginx logs

`KEY_FILE=/home/yang/deployment/resources/yangcatalog.org.key` - certificate key file for HTTPS protocol.
If None exists just use any path

`CERT_FILE=/home/yang/deployment/resources/yangcatalog.org.crt` - certificate file for HTTPS protocol.
If None exists just use any path

`CA_CERT_FILE=/home/yang/deployment/resources/yangcatalog.org.crt` - ca_certificate file for HTTPS protocol.
If None exists just use any path

`ELASTICSEARCH_ID=1001` - This is only used with local elasticsearch. If AWS
elasticsearch is used this variables can be set to anything. If local elasticsearch is used this
variable is used to set permissions to specific user ID. It`s safe to use same ID as YANG_ID

`ELASTICSEARCH_GID=1001` - This is only used with local elasticsearch. If AWS
elasticsearch is used to set permissions to specific user GID. It`s safe to use same GID as YANG_GID

`YANG_ID=1016` - ID created for yang user

`YANG_GID=1016` - GID created for yang user

`YANG_RESOURCES=/var/yang` - specify path where all the yangcatalog data will be saved.

`NGINX_FILES=yangcatalog-nginx*.conf` - NGINX config files used for NGINX. There is testing config file
or production one with HTTPS. Read [documentation](./DOCUMENTATION) file to find out how to use this variable

`GIT_USER_NAME=foo` - yangcatalog is pushing some data to github repository and it needs to
set usename before any commit is done.

`GIT_USER_EMAIL=bar@foo.com` - yangcatalog is pushing some data to github repository and it needs to
set email address before any commit is done.

`CRON_MAIL_TO=bar@foo.com` - comma separated list of emails which are used
with cron jobs. If any cron job will fail it will send it to this comma separated list of email addresses.

`YANGCATALOG_CONFIG_FILE` - Path to global config file used by all YANG Catalog components.

`CONFD_VERSION` - Verson of [ConfD](https://www.tail-f.com/management-agent/) to be used.

`CONFD_PASSWORD` - Password for ConfD

`CONFD_LOG` - Directory where ConfD will store log files.

`YANGLINT_VERSION` - Version of [yanglint](https://github.com/CESNET/libyang) to be used.
