FROM ubuntu:20.04

ARG CONFD_VERSION
ARG CONFD_ADMIN_PASSWORD

ENV CONFD_ADMIN_PASSWORD "$CONFD_ADMIN_PASSWORD"
ENV CONFD_VERSION "$CONFD_VERSION"
ENV CONFD_DIR /tmp/confd-${CONFD_VERSION}
ENV PATH $PATH:$CONFD_DIR/bin

RUN apt-get -y update && apt-get install -y openssh-client build-essential libssl-dev libssl1.1 \
  python3.6 python3-pip curl && rm -rf /var/lib/apt/lists/*

COPY ./resources/confd-${CONFD_VERSION}.linux.x86_64.installer.bin /tmp
# COPY ./confd-${CONFD_VERSION}.doc.tar.gz /tmp
# COPY ./confd-${CONFD_VERSION}.examples.tar.gz /tmp
RUN mkdir ${CONFD_DIR}
RUN ${CONFD_DIR}.linux.x86_64.installer.bin ${CONFD_DIR}
RUN mkdir -p ${CONFD_DIR}/examples.confd/confd-module-catalog
COPY ./confd/Makefile ./confd/*.yang ./confd/confd.conf ./confd/*.xml ${CONFD_DIR}/examples.confd/confd-module-catalog/
COPY ./confd/docroot ${CONFD_DIR}/examples.confd/confd-module-catalog/docroot
WORKDIR ${CONFD_DIR}/examples.confd/confd-module-catalog
RUN sed -i "s|CONFD_ADMIN_PASSWORD|${CONFD_ADMIN_PASSWORD}|g" yangcatalog_aaa_init.xml
RUN make all
CMD [ "/usr/bin/make", "start_foreground" ]

EXPOSE 8888
EXPOSE 8008
EXPOSE 2022
EXPOSE 2024
