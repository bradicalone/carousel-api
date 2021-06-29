import React from 'react';
import ReactDOM from 'react-dom';
import reducer from './reducers';
import App from './components/App.js';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {};
const store = createStore(
    reducer,
    initialState,
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);