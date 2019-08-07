# confd-module-catalog

An example implementation of the [draft-openconfig-netmod-model-catalog](https://tools.ietf.org/html/draft-openconfig-netmod-model-catalog-01) using the Tail-f/Cisco [ConfD](https://developer.cisco.com/site/confD/downloads/) management agent.


## Using a local install and Makefile

You need a locally installed ConfD with appropriate northbound APIs (e.g. NETCONF, REST) enabled in the configuration. Start by sourcing the `confdrc` file in the top level ConfD installation into your environment:

```
$ source ./confdrc
```

Then use the `Makefile` in this repository to `start`, `stop` ConfD as well as to `clean` out the environment and rebuild `all`, e.g.:

```
$ make all start
```

This should give you a running instance of ConfD with the catalog YANG modules loaded. You can now use the REST interface to query, update and delete data in the catalog. The `load.sh` script will put some initial data (pulled from the IETF and IEEE repositories) into the running server for you to play with:

```
$ ./load.sh
```

You can now query the server for content, like:

```
$ curl -u admin:admin http://127.0.0.1:8008/api/config/organizations?deep
```

Or the following for JSON:

```
$ curl -u admin:admin -H "Accept: application/vnd.yang.data+json" http://127.0.0.1:8008/api/config/organizations?deep
```


To stop ConfD and reset the environment (clean the database):

```
$ make stop clean
```

## Using docker

Make sure to have docker installed, then build the image using `docker build`. It should look something like:
```
$ docker build -t module-catalog .
Sending build context to Docker daemon 59.05 MB
[...]
Successfully built e016a812c983
$
```

Then run the image using `docker run` along the following lines:
```
$ docker run -P -d module-catalog
8b0b2d8fd1e83b36cea148f872a0ab09709db8362e6b4b40a8225a2d98bb090d
$
```

The container should now be up and running with the web UI and NETCONF server exposed according to the Dockerfile
```
EXPOSE 8888
EXPOSE 8008
EXPOSE 2022
EXPOSE 2024
```

Inspect the port mapping using the `docker ps -l` command:
```
$ docker ps -l
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                                                                                NAMES
193d5ab031d5        module-catalog      "/usr/bin/make start_"   7 minutes ago       Up 7 minutes        0.0.0.0:32783->2022/tcp, 0.0.0.0:32782->2024/tcp, 0.0.0.0:32781->8008/tcp, 0.0.0.0:32780->8888/tcp   admiring_mahavira
```

In this case, the web UI is available on localhost, ports 32776 (no SSL) and 32775 (SSL). The NETCONF server is available on ports 32778 (SSH) and 32777 (TCP). Running the following command will dump the content of the `organizations` subtree in JSON:

```
$ curl -u admin:admin -H "Accept: application/vnd.yang.data+json" http://127.0.0.1:32777/api/config/organizations?deep
```

