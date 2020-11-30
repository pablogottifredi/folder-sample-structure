const uuid = require('uuid/v1');
const request = require('request-promise');
const Joi = require('@hapi/joi');

const ENDPOINT_BASE_ROUTE =  process.env.API_BASE_ROUTE;
const ENDPOINT_INCIDENTS_BY_HELPDESK = '/incidents.by.helpdesk';
const ENDPOINT_INCIDENTS_BY_ID = '/incident';
const ENDPOINT_COMMON_AUTH = { auth: { user: process.env.API_USERNAME, pass: process.env.API_PASSWORD, sendImmediately: true }};
const AGENT_CACHE_HOST = 'api-invgate-cache';
const AGENT_CACHE_PORT = 6379;
const AGENT_CACHE_EXPIRATION = 360;
const AGENT_CACHE_PRE_INDEX = 'invgate.api.incident';
var redis = require("redis"); 
var cache_client = redis.createClient('redis://'+AGENT_CACHE_HOST+':'+AGENT_CACHE_PORT);
cache_client.on("error", function (err) {
    console.log('API invgate', 'error', 'agent invgate.api.incidents', 'error conneting with cache engine',err);
});

const helpdeskById = ( helpdesk_id ) => {
    return new Promise((resolve,reject) =>{
        const optR = {
            method: 'GET',
            uri: ENDPOINT_BASE_ROUTE + ENDPOINT_INCIDENTS_BY_HELPDESK,
            qs: { 
                helpdesk_id: helpdesk_id
            }
        };
        const options = {...optR,...ENDPOINT_COMMON_AUTH}
        const responseSchema = Joi.object().keys( {
            status: Joi.string().required(),
            info: Joi.string().required(),
            requestIds: Joi.array().items(Joi.number())
        });
        const errorSchema = Joi.object().keys( {
            error: Joi.string().required(),
            status: Joi.number().required()
        });
        const trnx = uuid(options);
        const cacheidx = AGENT_CACHE_PRE_INDEX+ENDPOINT_INCIDENTS_BY_HELPDESK+'/'+helpdesk_id;
        cache_client.get( cacheidx, (err,reply)=>{
            if (reply){ resolve( JSON.parse(reply) )}
            else {
                console.log('request', 'start', trnx,  process.env.LOG_LEVEL=='verbose'?options:options.uri);
                request( options ) 
                    .then(function(response){
                        console.log('request', 'response', trnx, process.env.LOG_LEVEL=='verbose'?response:'');
                        Joi.validate( response, responseSchema, (err,value)=>{
                            if (err) {
                                console.error('request', 'error', trnx, "agent schema response invalid", err.details);
                                reject( { code: 500, message: "agent schema response invalid"} );
                            } else {
                                cache_client.set( cacheidx, response, 'EX', AGENT_CACHE_EXPIRATION );
                                resolve(JSON.parse(response));
                            }
                        });
                        
                    })
                    .catch(function(responseError){
                        console.error('request', 'error', trnx, process.env.LOG_LEVEL=='verbose'?responseError:responseError.statusCode);
                        let errR = responseError.error;
                        Joi.validate( errR, errorSchema, (err,value) => {
                            if (err) {
                                console.error('request', 'error', trnx, "agent schema response invalid", err.details);
                                reject( { code: 500, message: "agent schema error invalid"} );
                            } else {
                                reject( { code: value.status || 500, message: value.error }  );
                            }
                        });
                    
                    });
            }          
        })
    
    });
};

const incidentByIds = async ( arrayOfIncidents, resolve ) => {
    var promiseArray = [];
    var acc = [];
    var accerr = [];
    arrayOfIncidents.forEach( id => {
        var p = incidentById( id )
        .then(  (data)=>{
            acc.push({ id: data.id, title: data.title, description: data.description} );      
        })
        .catch( (err)=>{
            accerr.push( err );
        });
        promiseArray.push(p);
    } );
    await Promise.all( promiseArray )
            .then(()=>{
            
            } )
            .catch(()=>{

            })
            .finally( () =>{
                resolve( acc );                    
            });

};

const incidentById = ( incident_id ) => {
    return new Promise((resolve,reject) =>{
        const optR = {
            method: 'GET',
            uri: ENDPOINT_BASE_ROUTE + ENDPOINT_INCIDENTS_BY_ID,
            qs: { 
                id: incident_id
            }
        };
        const options = {...optR,...ENDPOINT_COMMON_AUTH}
        const trnx = uuid(options);

        const cacheidx = AGENT_CACHE_PRE_INDEX+ENDPOINT_INCIDENTS_BY_ID+'/'+incident_id;
        cache_client.get( cacheidx, (err,reply)=>{
            if (reply){ resolve( JSON.parse(reply) )}
            else {
                console.log('request', 'start', trnx,  process.env.LOG_LEVEL=='verbose'?options:options.uri);
                request( options ) 
                    .then(function(response){
                        console.log('request', 'response', trnx, process.env.LOG_LEVEL=='verbose'?response:'');
                        cache_client.set( cacheidx, response, 'EX', AGENT_CACHE_EXPIRATION );
                        resolve( JSON.parse(response) );
                    })
                    .catch(function(err){
                        console.error('request', 'error', trnx, process.env.LOG_LEVEL=='verbose'?err:'');
                        reject( { code: 500, message: JSON.stringify(err.error) } );
                    });
            }
        })
        
    });
};

const addWordToRank = ( helpdesk_id, word ) => {
    const cacheidx = AGENT_CACHE_PRE_INDEX+ENDPOINT_INCIDENTS_BY_HELPDESK+'/'+helpdesk_id+'/RANKING/WORDS';
    const cacheidxglobal = AGENT_CACHE_PRE_INDEX+ENDPOINT_INCIDENTS_BY_HELPDESK+'/GLOBAL/RANKING/WORDS';
    cache_client.zincrby( cacheidx, 1, word, () => {;} );
    cache_client.zincrby( cacheidxglobal, 1, word,(r) => {;} );
    return true;
}

const getWordFromRank = ( helpdesk_id ) => {
    return new Promise( (resolve,reject) => {
        const cacheidx = AGENT_CACHE_PRE_INDEX+ENDPOINT_INCIDENTS_BY_HELPDESK+'/'+helpdesk_id+'/RANKING/WORDS';
        cache_client.zrevrange( cacheidx, 0, 4, (err,rank)=>{
            resolve(rank);
        });
    });
};
const getWordFromGlobalRank = ( ) => {
    return new Promise( (resolve,reject) => {
        const cacheidxglobal = AGENT_CACHE_PRE_INDEX+ENDPOINT_INCIDENTS_BY_HELPDESK+'/GLOBAL/RANKING/WORDS';
        cache_client.zrevrange( cacheidxglobal, 0, 4, (err,rank)=>{
            resolve(rank);
        });
    });
};

export default { helpdeskById, incidentById, incidentByIds, addWordToRank, getWordFromRank, getWordFromGlobalRank  }
