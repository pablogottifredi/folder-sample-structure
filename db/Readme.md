# Invg Test. Query Test

Provide a solution according the follow  [spec](https://github.com/pablogottifredi/invg-coding-test/blob/master/spec-querying-test-full-stack.md)

## Requirements (optionally)

Install this pre-requisites and follow the steps

-   Docker CE  [Install Docker Community Edition version 18.09.04 or up](https://docs.docker.com/install/linux/docker-ce/ubuntu/)  according this instructions Need more help? Follow this instruction for  [beginners users](https://github.com/pablogottifredi/invg-coding-test/blob/master/docker-beginner-install.md)
    
-   Docker Compose cli  [Install Docker Compose cli](https://docs.docker.com/compose/install/)

-   [Npm](https://www.npmjs.com/get-npm) or yarn

## Quickview
The entire code here, just open [data.dump.sql](https://github.com/pablogottifredi/invg-coding-test/blob/master/querying-test-full-stack/data/data.dump.sql)

## Short anwser
``` 
select DISTINCT on (1)
city,customer
from sales
order by city,mount desc, customer asc;
``` 


## Getting started

### 1. Get from repo
Clone using your own credentials from repo  [https://github.com/pablogottifredi/invg-coding-test.git](https://github.com/pablogottifredi/invg-coding-test.git)

```
$ git clone https://github.com/pablogottifredi/invg-coding-test.git

```

### 2. Access to subfolder

```
$ cd invg-coding-test
~:invg-coding-test$ cd querying-test-full-stack

```

### 3. Run using docker-compose

All the environment is ready to use without aditional install

> Use  _**docker-compose up -d**_  into querying-test-full-stack folder

```
:~invg-coding-test/querying-test-full-stack$ docker-compose up -d
:~invg-coding-test/querying-test-full-stack$ npm run build 

```

Ready!