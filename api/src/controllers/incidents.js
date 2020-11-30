import config from '../config';
import agent from '../agents/invgate.api.incidents';
const { body, query, check, validationResult } = require('express-validator/check')

const validate = (method) => {
    switch (method) {
        case 'get': {
            return [ 
                query('helpdesk_id', 'helpdesk_id mandatory').exists(),
                query('helpdesk_id', 'helpdesk_id invalid').isInt({min:0}),
                query('detailed').isIn(['0', '1', undefined]),
                query('text_to_search').escape()
            ]   
        }
        case 'tags': {
            return [
                query('helpdesk_id', 'helpdesk_id must have a valid Id or not be sent').optional().isInt({min:0})   
            ]
        }
    }
}
const read = (req, res, next) => {
    const errors = validationResult( req );
    if (!errors.isEmpty()) return res.status(428).send( { code: '428', message: errors.array({onlyFirstError:true})[0].msg });
    const text_to_search = req.query.text_to_search || '';
    agent.helpdeskById( req.query.helpdesk_id )
        .then( response  => {
            let ids = response.requestIds;
            agent.incidentByIds( ids, ( incidents )=>{
                var t = text_to_search.toLowerCase();
                var f = incidents.filter( (e) =>{ return e.title.toLowerCase().includes(t) || e.description.toLowerCase().includes(t) });
                let detailed = req.query.detailed || 0;
                var m = detailed==0? f.map( (e) => { return  { id: e.id, title: '', description: ''} } ) : f;
                //eval exact match prev to add
                if (m.length > 0) {
                    var onlymatch = incidents.filter( (e) =>{ return exactmatch(t, e.title.toLowerCase() + ' ' + e.description.toLowerCase() ) });
                    if (t.length > 2 && onlymatch.length > 0){
                        console.log( 'word', t,'full match','added to rank');
                        agent.addWordToRank( req.query.helpdesk_id, t );
                    }
                    else 
                        console.log( 'word', t,'partial match','not added');
                }
                res.status(200).send( m );
            });
            
        })
        .catch(( error => {
            if (error.code == 428) console.error('API invgate','error', 'incidents', "unexpected preconditions errors");
            let errorExposed = (error.code && error.code != 428)?{ code: 500, message: 'internal server error'}:{ code: error.code, message: error.message };
            res.status( errorExposed.code ).send( errorExposed);
        }));
 
}

const tags = (req, res, next) => {
    const errors = validationResult( req );
    if (!errors.isEmpty()) return res.status(428).send( { code: '428', message: errors.array({onlyFirstError:true})[0].msg });
    let id = req.query.helpdesk_id;
    if (id) { 
        agent.getWordFromRank( id )
            .then( (data) => {
                let r = (data || []).filter((e) => e!==null && e !== '').map( el => { return { tag: el }});
                res.status(200).send( r );
            })
            .catch( (err) => {
                res.status(500).send( { code: 500, message: 'internal server error'});
            });
    } else {
        agent.getWordFromGlobalRank( )
            .then( (data) => {
                let r = (data || []).filter((e) => e!==null && e !== '').map( el => { return { tag: el }});
                res.status(200).send( r );
            })
            .catch( (err) => {
                res.status(500).send( { code: 500, message: 'internal server error'});
            });
    }

} 

const exactmatch = (text, searchWords) => {
    var reg = '\\b'+text+'\\b';
    var r = new RegExp(reg).test(searchWords);
    return r;
}

export default { read, tags, validate }
