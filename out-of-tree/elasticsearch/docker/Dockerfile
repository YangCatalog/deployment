FROM docker.elastic.co/elasticsearch/elasticsearch:7.0.0-beta1

ENV VIRTUAL_ENV=/elasticsearch

COPY --chown=elasticsearch:root elasticsearch.yml /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:root thesaurus.conf /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:root jvm.options /usr/share/elasticsearch/config/

# Support arbitrary UIDs as per OpenShift guidelines
USER 1002:0