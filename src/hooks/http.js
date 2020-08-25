import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
}

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: false, data: null, extra: null, identifier: action.identifier }
    case 'RESPONSE':
      return { ...currHttpState,  loading: false, data: action.responseData, extra: action.extra }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR':
      return initialState
    default:
      console.log('ll', action)
      throw new Error('Should not be reched!');
  }
}

const useHttp = () => {
  const [ httpState, dispatchHttp ] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
    fetch(url, {
      method,
      body,
      header: {
        'Content-Type': 'application/json'
      }
    }).then (response => {
      return response.json()
    }).then( responseData => {
      dispatchHttp({type: 'RESPONSE', responseData, extra: reqExtra });
    }).catch(error => {
      dispatchHttp({type: 'ERROR', errorMessage: error.message});
    });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear
  };
};

export default useHttp;
