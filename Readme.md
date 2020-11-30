# Folder Structure Sample

Based on [own sample code](https://github.com/pablogottifredi/some-coding-test/tree/master/coding-test-fullstack)

## Requirements

Install this pre-requisites and follow the steps

* Docker CE
[Install Docker Community Edition version 18.09.04 or up](https://docs.docker.com/install/linux/docker-ce/ubuntu/) according this instructions
Need more help? Follow this instruction for [beginners users](https://github.com/pablogottifredi/invg-coding-test/blob/master/docker-beginner-install.md)

* Docker Compose cli
[Install Docker Compose cli](https://docs.docker.com/compose/install/)

  

## Quick instructions
* Clone from [here]() 
* Go to folder-sample-structure folder
* Run cp api/.env.example api/.env
* Add your credential in KEY API_PASSWORD in api/.env 
* ***OVER*** the folder-sample-structure/***coding-test-fullstack*** run ***docker-compose up -d --build***
* Open http://localhost:5005 to access a Front 
* Open http://localhost:5003/api/doc to access to doc and test env for API

Good luck!


## Getting started

### 1. Get from repo

Clone using your own credentials from repo [https://github.com/pablogottifredi/folder-sample-structure](https://github.com/pablogottifredi/folder-sample-structure)

  
```
$ git clone https://github.com/pablogottifredi/folder-sample-structure
```


### 2. Access to subfolder of API and config .env file

```
$ cd folder-sample-structure
~:folder-sample-structure$ cd api
~:folder-sample-structure/api$
```

#### 3 Config .env file of API
Copy .env.example to .env edit with the credentials provided

```
~:folder-sample-structure/api$ cp .env.example .env
~:folder-sample-structure/api$ vi .env
```

Keys to config

```
API_USERNAME=apiuser
API_PASSWORD=<a key>
API_AUTH_METHOD=basic
API_BASE_ROUTE=http://localhost:3001/api/v1

```

> PROJECT FRONT ARE NOT CONFIGURED WEBPACK YET

> USES A STATIC CONFIG OF GATEWAY at http://localhost:5003/api/v2

> [agent of incidents](https://github.com/pablogottifredi/folder-sample-structure/blob/master/front/src/components/IncidentList/agent.js) and [agent of tags](https://github.com/pablogottifredi/folder-sample-structure/blob/master/front/src/components/Tags/agent.js)


### 4. Run using docker-compose

All the environment is ready to use without aditional install

> Use ***docker-compose up -d*** into folder-sample-structure folder
  

```
:~folder-sample-structure$ docker-compose up -d
```



Ready!

  
## Environment info
Docker compose create a enviroment with

* An ***API Restfull*** in NodeJS v12 with endpoin required
* An ***Swagger-UI doc*** interface to open api spec and test
* An ***API Gateway*** in nginx to define the specific routing for nano/microservice
* An ***API cache*** in a Redis 5, to temporal cache of agent requests
* An ***A Web Page with UI to test*** in a React, component oriented desing


### Problem with ports?

When you launch **docker-compose up -d**, the project use the config in [docker-compose.yml](./docker-compose.yml) and [docker-compose.override.yml](./docker-compose.override.yml)

  
For develop pruposes are mapped directly the internal ports to external container. Specifically in [docker-compose.override.yml](./docker-compose.override.yml) file

  
See the config:
```
version: "3.5"
    services:
        api-invgate-facade:
            ports:
            - "5000:3000"

        api-invgate-doc:
            ports:
            - "5001:8080"

        api-invgate-gateway:
            ports:
            - "5003:80"

        front-invgate:
            ports:
            - "5005:4100"
```

This project **only needs the api gateway port opened***. If you have ports listen in ***5000,5001,5003,5005*** you can delete this config or change

  
> ***Warning!***
>
> If you change the ***api-invgate-gateway port***, you must change the routes in the [api documentation](./api/doc/invgate.api.v2.openapi.json) if you want still use Swagger-UI enviroment to test

  

### Name of containers and networks

We use ***stronger names*** to containers, you could have problems if you have duplicated names

* API Restfull NodeJS v12 use ***api-invgate-facade***
* API Doc use ***api-invgate-doc***
* API Gateway use ***api-invgate-gateway***
* API Cache ***api-invgate-cache***
* FRONT invgate use ***front-invgete***
  
#### Do you need see logs?
Open a terminal with each log

 
For API Node
```
$ docker container logs api-invgate-facade -f
```

For API Gateway
```
$ docker container logs api-invgate-gateway -f
```


For FRONT
```
$ docker container logs front-invgate -f
```


### How to test?

You can test the api using [CURL](https://curl.haxx.se/docs/manpage.html)

  

For API Node

```
$ curl -X GET "http://localhost:5003/api/v2/incidents.by.helpdesk/search/?helpdesk_id=12" -H "accept: application/json"
```

 Or be a human being and test accross the documentation interface


> Open in a browser **http://localhost:5003/api/doc/**


For FRONT

> Open in a browser **http://localhost:5005/**



### Additional comments About Performance
The solution was designed using Redis cache preset in 360 seconds. 

The agent of API use cache to improve the response speed. Is possible config the cache with persistence according to engine features. 

The solution was not provided with that config set.

The technique used allows increasing the performance-on-demand of request and searches but has low performance in the first request. 

There are two ways to offer a complete performance. 

* Providing an endpoint to pre-cache data. 
    This approach needs a model synchronization process starting when the model's "incidents" and "incidents by request" has changed. 
    
    The common method could be adding to the queue process each time that rows changes and send a POST message to the endpoint proposed.

* Mount a replica of data, redundant in a specific engine designed for search, like Elastic Search. 

    This solution simplifies the architecture of API, delegating the liability of cache and search using regular expressions. 
    
    Although this approach is not a complete warranty of models synchronized (slight inconsistency) is the best solution for a massive quantity of data.
