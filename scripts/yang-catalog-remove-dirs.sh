#!/bin/sh

YANG_PATH=/var/yang
read -p "What is your main yangcatalog path [$YANG_PATH]): " yang_path
yang_path=${yang_path:-$YANG_PATH}

rm -rf $yang_path
rm -rf ../.env



