FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.2
ARG ELASTICSEARCH_ID
ARG ELASTICSEARCH_GID
ENV ELASTICSEARCH_ID "$ELASTICSEARCH_ID"
ENV ELASTICSEARCH_GID "$ELASTICSEARCH_GID"

ENV VIRTUAL_ENV=/elasticsearch

COPY elasticsearch.yml /usr/share/elasticsearch/config/
COPY thesaurus.conf /usr/share/elasticsearch/config/
COPY jvm.options /usr/share/elasticsearch/config/

RUN usermod -u ${ELASTICSEARCH_ID} elasticsearch
RUN groupmod -g ${ELASTICSEARCH_GID} elasticsearch
RUN chown -R elasticsearch:root /usr/share/elasticsearch/config/
# Support arbitrary UIDs as per OpenShift guidelines
USER ${ELASTICSEARCH_ID}:${ELASTICSEARCH_GID}

EXPOSE 9200
