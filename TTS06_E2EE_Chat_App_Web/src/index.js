import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App';
// import Router from './router/Router';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18n from './translation/i18n';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { AppContext, socket } from './context/appContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppContext.Provider value={{socket}}>
        <Provider store={store}>
            <BrowserRouter>
                <I18nextProvider i18n={i18n}>
                    <App />
                    <ToastContainer />
                </I18nextProvider>
            </BrowserRouter>
        </Provider>
    </AppContext.Provider>
);
