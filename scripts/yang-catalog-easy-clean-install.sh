#!/bin/sh

if [ -x "$(command -v docker)" ]; then
    echo "docker installed"
    # command
else
    echo "Installng docker"
    # command
    apt-get update
    apt-get install --yes \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    echo \
    "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update
    apt-get install --yes docker-ce=5:20.10.5~3-0~ubuntu-bionic docker-ce-cli=5:20.10.5~3-0~ubuntu-bionic containerd.io
    if [ -x "$(command -v docker)" ]; then
        echo "Docker installed succesfully"
    else
        echo "Docker did not install please try to install it manualy before proceeding to next steps"
	exit 1
    fi

fi

if [ -x "$(command -v docker-compose)" ]; then
    echo "docker-compose installed"
else
    curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    if [ -x "$(command -v docker-compose)" ]; then
	    echo "docker-compose installed succesfully"
    else
	    echo "docker-compose did not install please try to install it manualy first before proceeding to next steps"
	    exit 1
    fi
fi
exit 1

YANG_PATH=/var/yang2
read -p "What do you want your main yangcatalog path to be [$YANG_PATH]): " yang_path
yang_path=${yang_path:-$YANG_PATH}

mkdir $yang_path
mkdir $yang_path/tmp
mkdir $yang_path/tmp/validator-cache
mkdir $yang_path/elasticsearch
mkdir $yang_path/conf
mkdir $yang_path/nginx
mkdir $yang_path/nginx/compatibility
mkdir $yang_path/nginx/private
mkdir $yang_path/nginx/results
mkdir $yang_path/nginx/stats
mkdir $yang_path/nginx/YANG-modules
mkdir $yang_path/ytree
mkdir $yang_path/cache
mkdir $yang_path/ietf
mkdir $yang_path/all_modules
mkdir $yang_path/backup
mkdir $yang_path/commit_dir
mkdir $yang_path/logs
mkdir $yang_path/logs/confd
mkdir $yang_path/logs/elasticsearch
mkdir $yang_path/logs/nginx
mkdir $yang_path/logs/jobs
mkdir $yang_path/logs/uwsgi
mkdir $yang_path/logs/statistics
mkdir $yang_path/mysql
mkdir $yang_path/nonietf
mkdir $yang_path/volumes
mkdir $yang_path/volumes/docs
mkdir $yang_path/volumes/downloadables
mkdir $yang_path/volumes/mysql
mkdir $yang_path/volumes/nginx-conf
mkdir $yang_path/volumes/run
mkdir $yang_path/volumes/webroot
mkdir $yang_path/ietf-exceptions
mkdir $yang_path/nonietf/mef
mkdir $yang_path/nonietf/onf
mkdir $yang_path/nonietf/openconfig
mkdir $yang_path/nonietf/openroadm
mkdir $yang_path/nonietf/sysrepo
mkdir $yang_path/nonietf/yangmodels
mkdir $yang_path/requests

cat <<EOF >$yang_path/ietf-exceptions/exceptions.dat
ietf-foo@2016-03-20.yang
EOF


touch $yang_path/commit_dir/commit_msg
touch $yang_path/unparsable-modules.json
touch $yang_path/yang2_repo_cache.dat
touch $yang_path/yang2_repo_cache.dat.bak
touch $yang_path/yang2_repo_cache.dat.failed
touch $yang_path/yang2_repo_deletes.dat
touch $yang_path/yang2_repo_deletes.dat.bak
touch $yang_path/tmp/rest-of-elk-data.json
touch $yang_path/tmp/process-sdo-api-stderr.txt
touch $yang_path/tmp/log_trigger.txt
touch $yang_path/tmp/log_sdo.txt
touch $yang_path/tmp/log_runCapabilities_temp.txt
touch $yang_path/tmp/log_api_sdo.txt
touch $yang_path/tmp/log-pull-local2.txt
touch $yang_path/tmp/log-pull-local.txt
touch $yang_path/tmp/es_missing_modules.json
touch $yang_path/tmp/correlation_ids




