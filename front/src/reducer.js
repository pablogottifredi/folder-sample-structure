import { combineReducers } from 'redux';
import common from './reducers/common';

import timer from './components/Timer/reducer';
import status from './components/Status/reducer';
import search from './components/Search/reducer';


import { routerReducer } from 'react-router-redux';

export default combineReducers({
  timer,
  status,
  search,
  common,
  router: routerReducer
});
