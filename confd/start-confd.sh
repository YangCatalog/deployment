#!/bin/bash

source /opt/confd/confdrc
cd "${0%/*}"
make all start
