# Setup documentation
This file describes all the needed steps to properly set up and configure the YANG Catalog project.

## Set up the project for the first time

1. Run [setup.sh](setup.sh) script as root to create the basic tree structure needed for running YANG Catalog using: ```$ /bin/bash setup.sh```

2. Go to the [conf](../conf) directory and copy the [yangcatalog.conf.sample](../conf/yangcatalog.conf.sample) file into the same directory with the name ```yangcatalog.conf``` and then move it to the ```<YANG_RESOURCES>/conf``` directory.
The simple command line command from the [deployment](..) directory for this step will be: ```$ cp conf/yangcatalog.conf.sample <YANG_RESOURCES>/yangcatalog.conf```.
Then replace all the tokens, passwords, usernames and email addresses which you want to use.
<br>**NOTE: Alternatively, you can ask another developer to provide this file.**

3. Create a copy of the [.env-dist](../.env-dist) file and name it ```.env``` in the [deployment](..) directory.
Passwords need to be equivalent to the ones in the ```<YANG_RESOURCES>/yangcatalog.conf``` file. 
IDs and paths can be changed according to your directory tree structure.
<br>**NOTE: Alternatively, you can ask another developer to provide this file.**

4. Copy following files/directories from the ```IETF``` server (or just ask for them from another YANG Catalog developer):<br>
   - ```/home/yang/deployment/resources/confd-<CONFD_VERSION>.linux.x86_64.installer.bin``` into the [deployment/resources](../resources) directory.<br>
   **NOTE: confd installer needs to be an executable file so run ```$ chmod +x resources/confd-<CONFD_VERSION>.linux.x86_64.installer.bin```**
   - ```/home/yang/deployment/yangcatalog-ui/tmp``` into the [deployment/frontend/yangcatalog-ui](../frontend/yangcatalog-ui) directory.

5. Download yumapro-client for the latest ubuntu version (registration needed) from https://www.yumaworks.com/support/download-yumapro-client/yumapro-client-downloads/ into the [deployment/resources](../resources) directory.
<br>**NOTE: Alternatively, you can ask another developer to provide this file.**

6. **Optional**: If you want to use your ssl certificate, set the ```<NGINX_FILES>``` in the ```.env``` file to ```yangcatalog-nginx*.conf```

7. Build the docker-compose file (This is necessary only for the first time you build this application or if some changes were made to the scripts. This process might take several minutes depending on your computer):
```$ docker-compose build```
<br>**NOTE: Do NOT run docker and docker-compose command as sudo, see this post-install notes: https://docs.docker.com/engine/install/linux-postinstall/**

8. Set ```max_map_count``` kernel setting using ```$ sysctl -w vm.max_map_count=262144``` because Elasticsearch will fail otherwise.
Containers share the same kernel as the host OS, so this needs to be done on host machine and not inside the docker container, this also needs to be done everytime host machine is restarted.

9. Run the yangcatalog: ```$ docker-compose up -d```
While loading all the applications some of them might fail and restart a couple of times - this is due to some of them being dependent on others.
Just let it load for a couple of minutes, and it should start everything without problems.
The ```yc-backend``` container will start once the ```yc-api-recovery``` container will exit with code 0. You can see the status code using ```$ docker ps -a```

10. Execute to the `yc-backend` container using command `docker exec -it yc-backend bash` and run 2 following commands:
```
python3 elasticsearchIndexing/create_indices.py
python3 sandbox/create_admin.py
```

11. **Optional**: You can update logrotate in order to not have infinitely big log files. 
logrotate configuration is stored in the [backend/yangcatalog-rotate](../backend/yangcatalog-rotate) file.
During docker image build, this file is copied to the ```/etc/logrotate.d/yangcatalog-rotate``` location.
Default configuration:
```conf
  /var/yang/logs/*.log {
      rotate 7
      daily
      compress
      missingok
      copytruncate
      dateext
      su yang yang
}
```

12.  Make sure that 10837 port is opened since this is needed for rsync using: ```$ lsof -i -P -n | grep '*:10873 (LISTEN)'``` 
<br>**NOTE: On the Amazon instance you need to go to security groups pick the group under which your instance is running, add a new inbound rule and add the custom port to it.**

13.  The [resources](../resources) directory should contain the following files:
```
drwxrwxr-x  2 yang yang     4096 Feb 14 06:34 ./
drwxrwxr-x 16 yang yang     4096 Jul  8 06:43 ../
-rw-rw-r--  1 yang yang       40 Oct 12  2021 .gitignore
-rwxr-xr-x  1 yang yang 17811628 Nov 22 08:00 confd-8.0.linux.x86_64.installer.bin*
-rw-r--r--  1 yang yang     5677 Nov 11 15:56 fullchain.pem
-rw-rw-r--  1 yang yang     1472 Oct 12  2021 main.cf
-rw-------  1 yang yang     1704 Nov 11 15:57 privkey.pem
-rw-rw-r--  1 yang yang      330 Oct 12  2021 rsync
-rw-rw-r--  1 yang yang      361 Oct 12  2021 rsyncd.conf
-rw-rw-r--  1 yang yang  1717748 Oct 12  2021 yumapro-client-20.10-9.u1804.amd64.deb
```


14. To send mails about the results of the running cronjobs, insert one or more mail addresses (separated by comma) to the ```<CRON_MAIL_TO>``` environment variable in your ```.env``` file.

15. After the first successful start, it is recommended to run cronjob-daily in the ```sdo-analysis``` container:
    - ```$ docker exec -it yc-sdo-analysis bash```
    - ```$ cd bin/cronjobs```
    - ```$ su yang```
    - ```$ ./cronjob```

16. After the end of cronjob-daily (the first time it can take up to one hour), it is recommended to run the [draftPullLocal.py](../backend/ietfYangDraftPull/draftPullLocal.py) script, which populates the basic set of modules into the databases:
    - ```$ docker exec -it yc-backend bash```
    - ```$ cd ietfYangDraftPull```
    - ```$ su yang```
    - ```$ python3 draftPullLocal.py```

## Recreate all containers

1. To stop all the running  containers use: ```$ docker stop $(docker ps -a -q)```
2. To remove all the stopped containers use: ```$ docker rm $(docker ps -a -q)```
3. To remove all the created volumes use: ```$ docker volume prune```
4. To remove all the images use: ```$ docker rmi $(docker images -a -q) -f```
5. If you want to clean either Elasticsearch data, remove everything from ```<ELASTICSEARCH_DATA>``` and ```<ELASTICSEARCH_LOG>``` folders
6. Now it's possible to build images using: ```$ docker-compose build``` and run the containers using: ```$ docker-compose up -d```. Or just alternatively: ```$ docker-compose up -d --build```
