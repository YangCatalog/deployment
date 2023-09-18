FROM opensearchproject/opensearch:2.7.0
ARG OPENSEARCH_ID
ARG OPENSEARCH_GID

ENV OPENSEARCH_ID="$OPENSEARCH_ID" \
    OPENSEARCH_GID="$OPENSEARCH_GID" \
    VIRTUAL_ENV=/opensearch

COPY opensearch.yml thesaurus.conf jvm.options /usr/share/opensearch/config/

USER root:root
RUN usermod -u ${OPENSEARCH_ID} opensearch \
    && groupmod -g ${OPENSEARCH_GID} opensearch \
    && chown -R ${OPENSEARCH_ID}:${OPENSEARCH_GID} /usr/share/opensearch/

# Support arbitrary UIDs as per OpenShift guidelines
USER ${OPENSEARCH_ID}:${OPENSEARCH_GID}

EXPOSE 9200
