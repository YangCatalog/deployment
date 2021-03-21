#!/bin/sh
read -p "Please provide your user name: " user_name

if getent passwd "$user_name" > /dev/null 2>&1; then
    echo "Thank you $user_name"
else
    echo "$user_name does not exists exiting"
    exit 1
fi

if [ -x "$(command -v docker)" ]; then
    echo "docker installed"
else
    echo "Installing docker"
    apt-get update
    apt-get install --yes \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg |  gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    echo \
    "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" |  tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update
    apt-get install --yes docker-ce=5:20.10.5~3-0~ubuntu-bionic docker-ce-cli=5:20.10.5~3-0~ubuntu-bionic containerd.io

    usermod -aG docker "$user_name"
    chmod 666 /var/run/docker.sock
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

email_address=$(awk '/^email-addres/{print $3}' install.conf)
change_first_line="MAILTO=$email_address"
echo "changing email address in crontab files"

sed -i "1s/.*/$change_first_line/" ../backend/crontab
sed -i "1s/.*/$change_first_line/" ../search/crontab
sed -i "1s/.*/$change_first_line/" ../sdo_analysis/crontab

if getent passwd "yang" > /dev/null 2>&1; then
    echo "User yang already exists - not creating user"
else
    echo "Creating user yang with home /home/yang"
    useradd -s /bin/bash -d /home/yang/ -m yang
fi

mysql_passwd=$(awk '/^mysql_passwd/{print $3}' install.conf)
rabbitmq_passwd=$(awk '/^rabbitmq_passwd/{print $3}' install.conf)
git_email=$(awk '/^git_email/{print $3}' install.conf)
git_name=$(awk '/^git_name/{print $3}' install.conf)

group_id=$(id -g yang)
user_id=$(id -u yang)

echo "creating .env file"
cat <<EOF >../.env
COMPOSE_PROJECT_NAME=yc
MYSQL_ROOT_PASSWORD=$mysql_passwd
MYSQL_DATABASE=yang_catalog
MYSQL_USER=yang
MYSQL_PASSWORD=$mysql_passwd
MYSQL_VOLUME=/var/yang/mysql
RABBITMQ_USER=rabbitmq
RABBITMQ_PASSWORD=$rabbitmq_passwd
ELASTICSEARCH_DATA=/var/yang/elasticsearch
ELASTICSEARCH_LOG=/var/yang/logs/elasticsearch
NGINX_LOG=/var/yang/logs/nginx
ELASTICSEARCH_ID=$user_id
ELASTICSEARCH_GID=$group_id
YANG_ID=$user_id
YANG_GID=$group_id
MYSQL_ID=$user_id
MYSQL_GID=$group_id
YANG_RESOURCES=/var/yang
KEY_FILE=/home/yang/deployment/resources/privkey.pem
CERT_FILE=/home/yang/deployment/resources/fullchain.pem
CA_CERT_FILE=/a/system/yangcatalog.org.crt
NGINX_FILES=nginx-testing.conf
GIT_USER_NAME=$git_name
GIT_USER_EMAIL=$git_email
EOF

sysctl -w vm.max_map_count=262144

chown $user_name:$user_name ../.env

YANG_PATH=/var/yang
read -p "What do you want your main yangcatalog path to be [$YANG_PATH]): " yang_path
yang_path=${yang_path:-$YANG_PATH}

if [ -d "$yang_path" ]
then
    echo "Directory $yang_path exists - exiting"
    exit 1
else
    echo "Creating and filling $yang_path directory"
    mkdir $yang_path
    mkdir $yang_path/tmp
    mkdir $yang_path/tmp/validator-cache
    mkdir $yang_path/elasticsearch
    mkdir $yang_path/conf

    AWS_ELK="yes"
    read -p "Do you wanna start local elastic search - type yes if you want loacal elk): " elk
    if [ "yes" = $elk ] || [ "y" = $elk ]
    then
        AWS_ELK="False"
        cp resources/patch.yaml ../patch.yaml
        cd ..
        git apply patch.yaml
        rm patch.yaml
        cd scripts
        echo "done patching"
    else
        echo "please setup elastic search for yangcatalog.conf file"
        AWS_ELK="True"
    fi
    here=$(pwd)
    cp ../conf/yangcatalog.conf.sample ./yangcatalog.conf

    VAL=AWS_ELK
    sed -i "s/^\(es-aws\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^update-signature/{print $3}' install.conf)
    sed -i "s/^\(update-signature\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^django-secret-key/{print $3}' install.conf)
    sed -i "s/^\(django-secret-key\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^yangvalidator-secret-key/{print $3}' install.conf)
    sed -i "s/^\(yangvalidator-secret-key\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^flask-secret-key/{print $3}' install.conf)
    sed -i "s/^\(flask-secret-key\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^admin-token/{print $3}' install.conf)
    sed -i "s/^\(admin-token\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^yang-catalog-token/{print $3}' install.conf)
    sed -i "s/^\(yang-catalog-token\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^rabbitmq_passwd/{print $3}' install.conf)
    sed -i "s/^\(rabbitMq-password\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^mysql_passwd/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(mysql-password\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^webex-access-token/{print $3}' install.conf)
    sed -i "s/^\(webex-access-token\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^confd-credentials/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(confd-credentials\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^private-secret/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(private-secret\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^elk-secret/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(elk-secret\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^client-id/{print $3}' install.conf)
    sed -i "s/^\(client-id\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^client-secret/{print $3}' install.conf)
    sed -i "s/^\(client-secret\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^repo-config-name/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(repo-config-name\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^repo-config-email/{print $3}' install.conf)
    sed -i "s/^\(repo-config-email\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^email-to/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(email-to\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^ip/{print $3}' install.conf)
    sed -i "s/^\(ip\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^redirect-oidc/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(redirect-oidc\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^issuer/{print $3}' install.conf)
    sed -i "s/^\(issuer\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^confdc-yangpath-ieee/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(confdc-yangpath-ieee\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^confdc-yangpath-only/{$1=""; $2=""; print substr($0,3)}' install.conf)
    sed -i "s/^\(confdc-yangpath\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL=$(awk '/^username/{print $3}' install.conf)
    sed -i "s/^\(username\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    VAL="localhost"
    sed -i "s/^\(ip-text\s*=\s*\).*\$/\1$VAL/" ./yangcatalog.conf

    mv ./yangcatalog.conf $yang_path/conf/.

    mkdir $yang_path/nginx
    mkdir $yang_path/nginx/compatibility
    mkdir $yang_path/nginx/private
    mkdir $yang_path/nginx/results
    mkdir $yang_path/nginx/stats
    mkdir $yang_path/nginx/YANG-modules
    mkdir $yang_path/ytrees
    cp ./resources/ietf-inet-types@2013-07-15.json $yang_path/ytrees/ietf-inet-types@2013-07-15.json
    cp ./resources/ietf-yang-library@2016-06-21.json $yang_path/ytrees/ietf-yang-library@2016-06-21.json
    cp ./resources/ietf-yang-types@2013-07-15.json $yang_path/ytrees/ietf-yang-types@2013-07-15.json
    cp ./resources/yang-catalog@2018-04-03.json $yang_path/ytrees/yang-catalog@2018-04-03.json
    mkdir $yang_path/cache
    cp ./resources/cache.json $yang_path/cache/2000-01-01_18:17:02-UTC.json
    mkdir $yang_path/ietf
    mkdir $yang_path/all_modules
    cp ../confd/yang-catalog.yang $yang_path/all_modules/yang-catalog@2018-04-03.yang
    cp ../confd/ietf-yang-types.yang $yang_path/all_modules/ietf-yang-types@2013-07-15.yang
    cp ../confd/ietf-inet-types.yang $yang_path/all_modules/ietf-inet-types@2013-07-15.yang
    cp ../confd/ietf-yang-library.yang $yang_path/all_modules/ietf-yang-library@2016-06-21.yang
    mkdir $yang_path/backup
    mkdir $yang_path/commit_dir
    mkdir $yang_path/logs
    mkdir $yang_path/logs/confd
    mkdir $yang_path/logs/elasticsearch
    mkdir $yang_path/logs/nginx
    mkdir $yang_path/logs/jobs
    mkdir $yang_path/logs/uwsgi
    mkdir $yang_path/logs/statistics

    touch $yang_path/logs/statistics/yang.log

    touch $yang_path/logs/uwsgi/yang-catalog-access.log
    touch $yang_path/logs/uwsgi/yang-catalog-error.log
    touch $yang_path/logs/uwsgi/yang-search-access.log
    touch $yang_path/logs/uwsgi/yang-search-error.log
    touch $yang_path/logs/uwsgi/yang-validator-access.log
    touch $yang_path/logs/uwsgi/yang-validator-error.log
    touch $yang_path/logs/uwsgi/yangre-access.log
    touch $yang_path/logs/uwsgi/yangre-error.log

    touch $yang_path/logs/nginx/access.log
    touch $yang_path/logs/nginx/error.log

    touch $yang_path/logs/jobs/draft-pull-local.log
    touch $yang_path/logs/jobs/draft-pull.log
    touch $yang_path/logs/jobs/openconfig-pull.log
    touch $yang_path/logs/jobs/removeUnused.log
    touch $yang_path/logs/jobs/resolveExpiration.log

    touch $yang_path/logs/confd/audit.log
    touch $yang_path/logs/confd/browser.log
    touch $yang_path/logs/confd/confd.log
    touch $yang_path/logs/confd/devel.log
    touch $yang_path/logs/confd/netconf.log

    touch $yang_path/logs/yang.log
    touch $yang_path/logs/yangvalidator_debug.log
    touch $yang_path/logs/yang_search_debug.log
    touch $yang_path/logs/process-changed-mods.log
    touch $yang_path/logs/parseAndPopulate.log
    touch $yang_path/logs/healthcheck.log
    touch $yang_path/logs/downloadGitHub.log
    touch $yang_path/logs/crons-log.log
    touch $yang_path/logs/cronjob-weekly.log
    touch $yang_path/logs/cronjob-daily.log
    touch $yang_path/logs/YANGgenericstats-weekly.log
    touch $yang_path/logs/YANGgenericstats-daily.log
    touch $yang_path/logs/YANGIETFstats.log
    touch $yang_path/logs/GenerateFiguresAndStats.log

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
    mkdir $yang_path/requests

cat <<EOF >$yang_path/ietf-exceptions/exceptions.dat
ietf-foo@2016-03-20.yang
EOF

    touch $yang_path/commit_dir/commit_msg
    touch $yang_path/unparsable-modules.json
    touch $yang_path/yang2_repo_cache.dat
cat <<EOF >$yang_path/yang2_repo_cache.dat
{"yang-catalog@2018-04-03/ietf": "$yang_path/all_modules/yang-catalog@2018-04-03.yang", "ietf-yang-types@2013-07-15/ietf": "$yang_path/all_modules/ietf-yang-types@2013-07-15.yang", "ietf-inet-types@2013-07-15/ietf": "$yang_path/all_modules/ietf-inet-types@2013-07-15.yang","ietf-yang-library@2016-06-21/ietf": "$yang_path/all_modules/ietf-yang-library@2016-06-21.yang"}
EOF
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

    if [ -x "$(command -v docker)" ]; then
        echo "Git installed"
        # command
    else
        echo "Installing git"
        # command
        apt-get update
        apt-get install --yes \
        git
    fi

    mkdir $yang_path/nonietf/mef
    mkdir $yang_path/nonietf/onf
    mkdir $yang_path/nonietf/openconfig
    mkdir $yang_path/nonietf/openroadm
    mkdir $yang_path/nonietf/sysrepo
    mkdir $yang_path/nonietf/yangmodels
    cd $yang_path/nonietf/yangmodels
    git clone https://github.com/YangModels/yang.git
    cd yang
    git submodule init
    git submodule update

    cd $yang_path/nonietf/sysrepo
    git clone https://github.com/sysrepo-archive/yang.git
    cd yang
    git submodule init
    git submodule update

    cd $yang_path/nonietf/mef
    git clone https://github.com/MEF-GIT/YANG-public.git
    cd YANG-public
    git submodule init
    git submodule update

    cd $yang_path/nonietf/onf
    git clone https://github.com/OpenNetworkingFoundation/Snowmass-ONFOpenTransport.git
    cd Snowmass-ONFOpenTransport
    git submodule init
    git submodule update

    cd $yang_path/nonietf/openconfig
    git clone https://github.com/openconfig/public.git
    cd public
    git submodule init
    git submodule update

    cd $yang_path/nonietf/openconfig
    git clone https://github.com/openconfig/yang.git
    cd yang
    git submodule init
    git submodule update

    cd $yang_path/nonietf/openroadm
    git clone https://github.com/OpenROADM/OpenROADM_MSA_Public.git
    cd OpenROADM_MSA_Public
    git submodule init
    git submodule update

    cd $here
    chown -R yang:yang $yang_path
fi



