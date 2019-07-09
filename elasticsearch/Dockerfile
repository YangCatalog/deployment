FROM docker.elastic.co/elasticsearch/elasticsearch:6.7.2
ARG ELASTICSEARCH_ID_GID
ENV ELASTICSEARCH_ID_GID "$ELASTICSEARCH_ID_GID"

ENV VIRTUAL_ENV=/elasticsearch

COPY --chown=elasticsearch:root elasticsearch.yml /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:root thesaurus.conf /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:root jvm.options /usr/share/elasticsearch/config/

RUN usermod -u ${ELASTICSEARCH_ID_GID} elasticsearch
RUN groupmod -g ${ELASTICSEARCH_ID_GID} elasticsearch
# Support arbitrary UIDs as per OpenShift guidelines
USER ${ELASTICSEARCH_ID_GID}:${ELASTICSEARCH_ID_GID}

EXPOSE 9200
