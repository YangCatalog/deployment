#!/bin/bash
ar x $1
zstd -d < control.tar.zst | xz > control.tar.xz
zstd -d < data.tar.zst | xz > data.tar.xz
ar -m -c -a sdsd ./package.deb debian-binary control.tar.xz data.tar.xz
rm debian-binary control.tar.zst control.tar.xz data.tar.zst data.tar.xz
