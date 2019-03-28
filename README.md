# deployment
Main repository to start up all the pieces of yang-catalog

## Requirements

* Docker, including docker-compose
* IPv4 Internet connectivity (Docker Hub doesn't do IPv6 yet)
* Sufficient space for container images

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
MariaDB) and combine them into an "almost" functional local deployment
of the Yang Catalog, which should be accessible on
http://localhost:8080/

## Status and Future Work

### Loose Ends

The linkage between the various components presumably still contains
bugs and/or hasn't been tested seriously.

There are some places where the components hard-codes "linkage"
parameters such as hostnames (usually to `localhost`, because in the
historic deployments, everything runs in a single machine) and service
credentials.  In general, the container images should allow such
parameters to be passed in using environment variables or "mounted"
configuration files.

### State/Data

Containers want to be "stateless", but the Yang Catalog is all about
data storage.  Some data is in an SQL database, which can be easily
shared between containers.

But other data is stored in directories, e.g. the "private" directory
where schema files are stored.  The backend API writes to those
directories, and the Web front-end reads from them.

Currently we implement this shared storage using a volume that is
shared between the `web_root` and `backend`.  In our proof-of-concept
`docker-compose.yml`, we simply expose the `web_root` part of the
source tree as a volume.  In real deployments, you'd probably use a
more stand-alone volume.  Also, it is a bit ugly to mix static files
and schema files in the same volume, but this follows from the current
front-end/back-end configuration and would take a bit of work to
disentangle.

### Logging

According to "cloud native" conventions, applications running in
containers should log to standard output.  Currently, several
components are more or less hardwired to log to
`/var/yang/logs/yang.log` or similar files.  It would be good to
change those applications to log to standard output, perhaps driven by
presence or absence of some configuration parameter.

### ConfD

The Yang Catalog requires ConfD, which is not open source and cannot
be included here in the same way as the other components.  In the
current `docker-compose.yml`, we map the `confd` service to an
external service on `yangcatalog.org`.  Note that this only works if
you have credentials for that ConfD installation in
`conf/yangcatalog.conf`.  If you have an existing ConfD installation,
change that service mapping to point to yours instead of
`yangcatalog.org`.

Going forward, we could include container build instructions based on
a ConfD installer/license that needs to be obtained separately
somehow, and integrate that container into the overall deployment.

### Kubernetes support

It would be nice to code a deployment specification to a Kubernetes
cluster for more production-grade installations.  This will provide
opportunities of making the system more robust and scalable by
replicating components where appropriate.

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

The `out-of-tree` directory contains files that belong to a specific
components; in particular, Dockerfiles to build container images for
them.  The idea is that those files would move to the individual
component repositories via PRs.  But they need a bit more maturation,
so we keep them here for now.

`docker-compose.yml` is the actual "orchestration" that attempts to
describe a complete (modulo ConfD) deployment of the Yang Catalog.

The `conf` directory contains a few files that are passed to the
containers using bind mounts.
