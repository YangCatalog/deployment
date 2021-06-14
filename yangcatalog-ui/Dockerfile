### Build Angular app ###
FROM node:10.15.0

ARG YANG_ID
ARG YANG_GID

ENV YANG_ID "$YANG_ID"
ENV YANG_GID "$YANG_GID"

WORKDIR /usr/src
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build-prod

CMD cp -r  /usr/src/dist/yangcatalog-ui/* /usr/share/nginx/html/yangcatalog-ui/. && chown -R ${YANG_ID}:${YANG_GID} /usr/share/nginx/html/yangcatalog-ui
