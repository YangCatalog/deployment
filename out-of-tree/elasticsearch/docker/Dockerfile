FROM docker.elastic.co/elasticsearch/elasticsearch:7.0.0

ENV VIRTUAL_ENV=/elasticsearch

COPY --chown=elasticsearch:root elasticsearch.yml /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:root thesaurus.conf /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:root jvm.options /usr/share/elasticsearch/config/

RUN usermod -u 1003 elasticsearch
RUN groupmod -g 1003 elasticsearch
# Support arbitrary UIDs as per OpenShift guidelines
USER 1003:0

EXPOSE 9200
EXPOSE 9300