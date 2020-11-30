import {
  APP_LOAD,
  LOGOUT,
  LOGIN,
  REGISTER
} from '../constants/actionTypes';

const defaultState = {
  appName: 'incidents.by.helpdek test',
  token: null,
  viewChangeCounter: 0
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return state;
    case LOGOUT:
      return state;
    case LOGIN:
      return state;
    case REGISTER:
      return state;
    default:
      return state;
  }
};
