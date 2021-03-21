confd_version=$(awk '/^confd-version/{print $3}' install.conf)
yumapro_version=$(awk '/^yumapro-version/{print $3}' install.conf)

FILE=$(pwd)/../resources/confd-$confd_version.linux.x86_64.installer.bin
if [ -f "$FILE" ]; then
    chmod +x $FILE
else
    echo "no such file or directory $FILE"
    exit 1
fi

FILE=$(pwd)/../resources/yumapro-client-$yumapro_version.u1804.amd64.deb
if [ -f "$FILE" ]; then
    chmod +x $FILE
else
    echo "no such file or directory $FILE"
    exit 1
fi
cd ..
docker-compose build
docker-compose up -d