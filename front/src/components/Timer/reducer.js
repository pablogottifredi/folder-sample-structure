import {
    TIMER_EXPIRED,
    TIMER_STARTED
  } from './types';
  
  export default (state = {}, action) => {
    switch (action.type) {
      case TIMER_EXPIRED:
        return { 
            ...state,
            sender: action.payload, 
            when: new Date().toISOString()
        }
      case TIMER_STARTED:
        return { 
            ...state,
            sender: action.payload, 
            when: new Date().toISOString() 
        }
      default:
        return state;
    }
  };
  