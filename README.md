YANGCATALOG
===========

You can find official yangcatalog website in [here](https://yangcatalog.org).

# Deployment
Main repository to start up all the pieces of yang-catalog

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

* elasticsearch
* php-fpm (we derive an image that adds mysqli and ssmtp)
* rabbitmq
* mariadb
* nginx (as the base image of the frontend container, which includes
  static content)

## Basic Usage

Create `conf/yangmodules.conf` from `conf/yangmodules.conf.sample`,
replacing values enclosed in `@...@` with your own.

```
git submodule init
git submodule update
docker-compose build # not strictly necessary
docker-compose up
```

The `docker-compose build` should build container images for the
various components of the Yang Catalog.

The `docker-compose up` will start containers from these images, as
well as from some third-party container images (e.g. RabbitMQ,
MariaDB) and combine them into a functional local deployment
of the Yang Catalog, which should be accessible on
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
and are connected to yangcatalog server. For this the "es-aws" needs to be
set to `True` and es-host set to whatever URL AWS provides for elasticsearch.
In AWS make sure that this URL is not opened for internet but is opened for
the other instance that is running yangcatalog.org

### Logging

All the logging is done to different files that should be located in
one directory which is specified in yangcatalog.conf config file.
Normally you would find this in /var/yang/logs. This directory is
a volume shared with host system. All the logs can be checked and
filtered using yangcatalog admin UI if you have access to that.

### ConfD

The Yang Catalog requires ConfD, which is not open source and cannot
be included here in the same way as the other components. In order
for yangcatalog to be working you need to acquire confd since this
is a beating heart of yangcatalog and contains all the metadata
about each module. Confd binary is copied to resources and each
docker service that will need this will install it in its own
container.

### Kubernetes support

It is possible to deploy YANGCATALOG on Kubernetes by following this [guide](./k8s/README.md).

### OpenShift support

OpenShift is, at its core, a multi-tenant variant of Kubernetes.  It
imposes some limitations on the containers it runs; for example,
processes run under a non-root UID.  Many container images are build
under the assumption that they _will_ run as root.

## Structure of the Repository

Various open-source components of the Yang Catalog are imported as
submodules:

* [backend](https://github.com/YangCatalog/backend) - the Yang Catalog
  API server
* [search](https://github.com/YangCatalog/search) - the Yang search
  Web application
* [web_root](https://github.com/YangCatalog/web_root) - static HTML,
  CSS etc. content
* [doc](https://github.com/YangCatalog/doc) - not currently used
* [yangre-gui](https://github.com/plewyllie/yangre-gui) - Peter
  Lewyllie's Yang Regular Expression checker
* [yangvalidator](https://github.com/YangCatalog/bottle-yang-extractor-validator) - Carl
  Moberg's Yang validation application
* [sdo_analysis](https://github.com/YangCatalog/sdo_analysis) - Scripts
  to analyze and validate yang files
* [admin_ui](https://github.com/YangCatalog/admin_ui) - Admin frontend
  to monitor and manage yangcatalog.org

`docker-compose.yml` is the actual "orchestration" that attempts to
describe a complete (modulo ConfD) deployment of the Yang Catalog.

The `conf` directory contains a few files that are passed to the
containers using bind mounts.
