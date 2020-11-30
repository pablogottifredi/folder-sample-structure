import {
    ASYNC_AGENT_START,
    ASYNC_AGENT_END,
    ASYNC_AGENT_ERROR,
    ASYNC_PROCESS_START,
    ASYNC_PROCESS_END
  } from './types';
  

  export default (state = {}, action) => {
    switch (action.type) {
      case ASYNC_AGENT_START:
        return { 
            ...state,
            message: action.payload, 
            date: new Date().toISOString()
        }
      case ASYNC_AGENT_END:
        return { 
            ...state,
            message: 'ASYNC_AGENT_COMPLETED', 
            dated: new Date().toISOString() 
        }
      case ASYNC_AGENT_ERROR:
        return { 
            ...state,
            message: action.payload, 
            dated: new Date().toISOString() 
        }
      case ASYNC_PROCESS_START:
        return { 
            ...state,
            message: action.payload, 
            dated: new Date().toISOString() 
        }
      case ASYNC_PROCESS_END:
          return { 
              ...state,
              message: action.payload, 
              dated: new Date().toISOString() 
          }
        
      default:
        return state;
    }
  };
  