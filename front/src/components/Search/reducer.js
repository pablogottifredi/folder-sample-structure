import {
    SEARCH_CRITERIA_CHANGED
  } from './types';
  

  export default (state = {}, action) => {
    switch (action.type) {
      case SEARCH_CRITERIA_CHANGED:
        return { 
          ...state,
          text: action.payload.text,
          helpdeskid: action.payload.helpdeskid,
          detailed: action.payload.detailed
        }
      default:
        return state;
    }
  };
  