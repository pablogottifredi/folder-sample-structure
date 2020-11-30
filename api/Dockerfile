# use node version v12 over a alpine linux
# https://alpinelinux.org/ 
FROM node:12.7.0-alpine
RUN mkdir /dist
WORKDIR /dist

COPY package.json .
COPY .babelrc .
COPY src src
RUN npm install 
RUN npm run build

# expose at port 3000
EXPOSE 3000

# command to run using the script defined in package.json
CMD ["yarn", "start"]
