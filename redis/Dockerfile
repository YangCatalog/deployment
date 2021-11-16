FROM redis:6-alpine

ARG YANG_ID
ARG YANG_GID
ENV REDIS_ID "$YANG_ID"
ENV REDIS_GID "$YANG_GID"
ENV REDIS_REPLICATION_MODE "master"

# Map 'redis' and 'yang' group/user IDs due to volume usage and read-write permissions
RUN sed -i "s|redis:x:999:1000:Linux User|redis:x:${REDIS_ID}:${REDIS_GID}:Linux User|g" /etc/passwd
RUN sed -i "s|redis:x:1000:redis|redis:x:${REDIS_GID}:redis|g" /etc/group

CMD ["redis-server", "--save 300 1"]
