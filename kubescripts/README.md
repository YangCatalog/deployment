# Kubernetes PROD Deployment

## Pulling the latest changes

Docker images on the production are always builded from the `master` branch.
It is therefore necessary to pull the latest changes before the actual build.
To pull the latest changes, run the following Git commands
in the directory where [deployment](https://github.com/YangCatalog/deployment) repository is cloned (e.g. `/home/yang/deployment`).
```
git checkout master
git submodule update --init
```

## Building latest Docker images

This directory contains 3 shell scripts that are used when deploying the code to the production.

As with the DEV environment, it is necessary to first build Docker images using the command `docker-compose build`.
However, unlike the DEV environment where `docker-compose up -d` is used to start containers,
we need to run these scripts in specific order.

`k8-push-images.sh`

- This script contains only one for loop that goes through each of the builded Docker images.
- Each Docker image is first [tagged](https://docs.docker.com/engine/reference/commandline/tag/) as `localhost:32000/$image:latest`
and then [pushed](https://docs.docker.com/engine/reference/commandline/push/) to a `localhost:32000` registry.
- This script needs to be run every time a Docker image is rebuilt and can be started as:
```
./k8-push-images.sh
```

`k8s-full-delete.sh`

- This script is used for full delete and stop of everything which is currently running inside Kubernetes.
- This script needs to be run every time we want to re-deploy changes and can be started as:
```
./k8s-full-delete.sh
```

`k8-deploy.sh`

- Kubernetes pods are started/deployed after running this script.
- This script needs to be run right after we deleted everything using `k8s-full-delete.sh` script and can be started as:
```
./k8-deploy.sh
```

## Rollback procedure

Rarely, it may happen that after deploying latest changes, something does not work as intended and it is necessary to do the rollback.
For this reason we are [tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging) = giving tags to every release commit.
The format we use is `v.<major>.<minor>.<patch>` so for example: `v5.9.0`
You can simply use following git commands to go back to specific release:
```
git checkout tags/v5.9.0
git submodule update --init
```
NOTE: change the tag accordingly and run `docker-compose build` command to rebuild Docker images again.
