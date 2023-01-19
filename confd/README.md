# ConfD database

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

This should give you a running instance of ConfD with the YANG catalog modules loaded. You can now use the REST interface to query, update and delete data in the catalog. The `load.sh` script will put some initial data (pulled from the IETF and IEEE repositories) into the running server for you to play with:

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

## Using Docker

Make sure to have Docker installed, then build the image using `docker build`. It should look something like:
```
$ docker-compose build confd
Building confd
Sending build context to Docker daemon    499MB

[...]

Successfully built e016a812c983
$
```

Then run the image using `docker-compose up -d confd` along the following lines:
```
$ docker-compose up -d confd
Creating yc-confd ... done
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
CONTAINER ID   IMAGE      COMMAND                  CREATED              STATUS                             PORTS                                                                                                      NAMES
750e8d787735   yc_confd   "/usr/bin/make start…"   About a minute ago   Up 59 seconds (health: starting)   2022/tcp, 0.0.0.0:8008->8008/tcp, :::8008->8008/tcp, 2024/tcp, 0.0.0.0:8888->8888/tcp, :::8888->8888/tcp   yc-confd
```

## Admin password change

If you want to change password you need to:
1. exec to the running container `docker exec -it yc-confd bash`
2. use command `confd_cli -u admin -C` to use `confd_cli`
3. inside `confd_cli` use command `aaa authentication users user admin change-password` to change password
4. you will be prompted to enter old password then new password (twice)

After successfully changing your password, you should run command `show running-config aaa authentication users user admin`
to display hashed password stored for `admin` user. This password should have format `$1$<salt>$<hash>` and should be stored
to the `yangcatalog_aaa_init.xml` file.
Admin password is loaded from this file at the start of ConfD - for the first
time you can create password in format `$0$<plain_text_password>`.

