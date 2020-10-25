FROM node:lts-alpine

ENV WORKDIR=/opt/cicada
WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}/package.json
RUN npm install --registry=https://registry.npm.taobao.org

COPY src ${WORKDIR}/src
COPY view ${WORKDIR}/view
COPY www ${WORKDIR}/www
COPY sqlite ${WORKDIR}/sqlite

RUN npm run compile
RUN npm install html-pdf --registry=https://registry.npm.taobao.org

CMD [ "node", "www/production.js" ]