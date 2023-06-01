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
RUN usermod -u ${OPENSEARCH_ID} opensearch
RUN groupmod -g ${OPENSEARCH_GID} opensearch
RUN chown -R opensearch:root /usr/share/opensearch/config/
# Support arbitrary UIDs as per OpenShift guidelines
USER ${OPENSEARCH_ID}:${OPENSEARCH_GID}

EXPOSE 9200
