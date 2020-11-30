# use node version v12 over a alpine linux
# https://alpinelinux.org/ 
FROM node:12.7.0-alpine
RUN mkdir /dist
WORKDIR /dist

RUN npm i react-scripts
COPY package.json .
COPY public public
COPY src src
RUN yarn install
RUN yarn run build
EXPOSE 4100

# command to run using the script defined in package.json
CMD ["yarn", "start"]
