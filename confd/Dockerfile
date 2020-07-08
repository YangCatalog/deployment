# Pull base image.
FROM ubuntu:18.04

ENV CONFD_VER 7.3.1

# Install Java.
RUN \
  apt-get update && \
#  apt-get install -y libffi libssl1.0 libcrypto.so.6 openjdk-7-jdk openssh-client build-essential ant && \
  apt-get install -y openssh-client build-essential libssl-dev libssl1.0.0 python3.6 python3-pip  && \
  rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip
RUN pip3 install pyang==2.2.1
# Define commonly used JAVA_HOME variable
#ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64
ENV CONFD_DIR /tmp/confd-${CONFD_VER}
ENV PATH $PATH:$CONFD_DIR/bin

COPY ./resources/confd-${CONFD_VER}.linux.x86_64.installer.bin /tmp
#COPY ./confd-${CONFD_VER}.doc.tar.gz /tmp
#COPY ./confd-${CONFD_VER}.examples.tar.gz /tmp
RUN  mkdir /tmp/confd-${CONFD_VER}
RUN  /tmp/confd-${CONFD_VER}.linux.x86_64.installer.bin /tmp/confd-${CONFD_VER}
RUN  mkdir /tmp/confd-${CONFD_VER}/examples.confd
RUN  mkdir /tmp/confd-${CONFD_VER}/examples.confd/confd-module-catalog
COPY ./confd/Makefile ./confd/*.yang ./confd/confd.conf ./confd/*.xml /tmp/confd-${CONFD_VER}/examples.confd/confd-module-catalog/
COPY ./confd/docroot /tmp/confd-${CONFD_VER}/examples.confd/confd-module-catalog/docroot
WORKDIR /tmp/confd-${CONFD_VER}/examples.confd/confd-module-catalog
RUN make all
CMD [ "/usr/bin/make", "start_foreground" ]

EXPOSE 8888
EXPOSE 8008
EXPOSE 2022
EXPOSE 2024

