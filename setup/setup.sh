#!/bin/bash

YANG_RESOURCES=/var/yang
cur_dir=$(pwd)

# Update and install basic apt packages
set -ex
apt update -y
apt install -y git curl rsync docker docker-compose
apt upgrade -y
apt autoremove -y

# Create a basic tree structure inside $YANG_RESOURCES directory
mkdir -p $YANG_RESOURCES
cd $YANG_RESOURCES
directories=("all_modules" "cache/redis-json" "commit_dir" "conf" "opensearch" "ietf" "ietf-exceptions" "logs/uwsgi" "logs/opensearch" "nginx" "nonietf/openconfig" "nonietf/yangmodels" "redis" "tmp" "ytrees")
for directory in ${directories[@]}; do
    mkdir -p $directory -m 755
done

# Create a basic tree structure inside $YANG_RESOURCES/nginx directory -> needed for docker volumes
cd $YANG_RESOURCES/nginx
nginx_directories=("compatibility" "drafts" "private" "results" "stats" "YANG-modules")
for directory in ${nginx_directories[@]}; do
    mkdir -p $directory -m 755
done

# Clone the directories that contain the YANG models
cd $YANG_RESOURCES/nonietf/openconfig
git clone --recurse-submodules https://github.com/openconfig/public.git
cd $YANG_RESOURCES/nonietf/yangmodels
git clone --recurse-submodules https://github.com/YangModels/yang.git

# yang-catalog@2018-04-03 module needs to be indexed to OpenSearch
cd $YANG_RESOURCES
touch yang2_repo_cache.dat
echo "{\"yang-catalog@2018-04-03/ietf\": \"/var/yang/all_modules/yang-catalog@2018-04-03.yang\"}" >yang2_repo_cache.dat

# Add iana-if-types revisions in exception file
cd $YANG_RESOURCES/ietf-exceptions
touch iana-exceptions.dat
echo "iana-if-type@2022-03-07.yang\niana-if-type@2022-08-17.yang\niana-if-type@2022-08-24.yang" >iana-exceptions.dat

# Make sure module yang-catalog@2018-04-03 is available
cd $YANG_RESOURCES/all_modules
curl -X GET https://raw.githubusercontent.com/YangModels/yang/main/experimental/ietf-extracted-YANG-modules/yang-catalog%402018-04-03.yang -o yang-catalog@2018-04-03.yang
# Store file to the cache/redis-json to be able to load it at the start of yc-api-recovery
cd $cur_dir
cp yang-catalog.json $YANG_RESOURCES/cache/redis-json/$(date +"%Y-%m-%d_00:00:00-UTC.json")

# Add yang user -> whole $YANG_RESOURCES tree structure needs to belong to user 'yang'
groupadd -g 1001 -r yang
useradd -r -g yang -u 1016 yang
chown -R yang:yang $YANG_RESOURCES

# Pull RFCs and Draft files needed for sdo-analysis (this might take some time)
cd $YANG_RESOURCES/ietf
rsync -avz --include 'draft-*.txt' --include 'draft-*.xml' --exclude '*' --delete rsync.ietf.org::internet-drafts my-id-mirror
# rsync -avz --include 'draft-*.txt' --include 'draft-*.xml' --exclude '*' --delete rsync.ietf.org::id-archive my-id-archive-mirror
rsync -avlz --delete --include="rfc[0-9]*.txt" --exclude="*" ftp.rfc-editor.org::rfcs rfc

chmod 755 $YANG_RESOURCES

chown -R yang:yang $YANG_RESOURCES
