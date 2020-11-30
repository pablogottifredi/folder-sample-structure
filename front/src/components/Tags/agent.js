import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';


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
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin)
        .then(responseBody),
        
};

const Tags = {
  getAll: () => requests.get('/search/tags'),
  getByHelpDeskId: (id) => requests.get(`/search/tags?helpdesk_id=${id}`)
};

export default {
  Tags,
  setToken: _token => { token = _token; }
};
