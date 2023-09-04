FROM opensearchproject/opensearch:2.7.0
ARG OPENSEARCH_ID
ARG OPENSEARCH_GID
ENV OPENSEARCH_ID "$OPENSEARCH_ID"
ENV OPENSEARCH_GID "$OPENSEARCH_GID"

ENV VIRTUAL_ENV=/opensearch

COPY opensearch.yml /usr/share/opensearch/config/
COPY thesaurus.conf /usr/share/opensearch/config/
COPY jvm.options /usr/share/opensearch/config/

USER root:root
RUN usermod -u ${OPENSEARCH_ID} opensearch \
    && groupmod -g ${OPENSEARCH_GID} opensearch \
    && chown ${OPENSEARCH_ID}:${OPENSEARCH_GID} /usr/share/opensearch/config \
    && chown ${OPENSEARCH_ID}:${OPENSEARCH_GID} /usr/share/opensearch/opensearch-docker-entrypoint.sh \
    && chmod +x /usr/share/opensearch/opensearch-docker-entrypoint.sh

# Support arbitrary UIDs as per OpenShift guidelines
USER ${OPENSEARCH_ID}:${OPENSEARCH_GID}

EXPOSE 9200
