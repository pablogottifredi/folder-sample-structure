import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { fail } from 'assert';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:5003/api/v2/incidents.by.helpdesk';
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    //Put here authentication
    //req.set('authorization', `Token ${token}`);
  }
}
const requests = {
  get: (url,params) =>
    superagent.get(`${API_ROOT}${url}`,params).use(tokenPlugin)
        .then(responseBody,fail)
};

const Incidents = {
  search: ( params,fail) => requests.get('/search',{ helpdesk_id: params.id, text_to_search: params.text, detailed: params.detailed},fail)
};

export default {
  Incidents,
  setToken: _token => { token = _token; }
};
