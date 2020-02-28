import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/base.scss';
import './styles/bs4/bootstrap.scss';
import App from './App';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import stores from './stores';
import * as serviceWorker from './serviceWorker';

configure({ 
    enforceActions: "observed"
});

// ReactDOM.render(
//     <PDFViewer style={{width: '100vw', height: '100vh'}}>
//         <PrintPage />
//     </PDFViewer>
// , document.getElementById('root'));

ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
