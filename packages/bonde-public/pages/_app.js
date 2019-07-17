// pages/_app.js
import React from "react";
import {createStore} from "redux";
import {Provider} from "react-redux";
import App, {Container} from "next/app";
import withRedux from "next-redux-wrapper";
import configureStore from '../configureStore'

const reducer = (state = {foo: ''}, action) => {
    switch (action.type) {
        case 'FOO':
            return {...state, foo: action.payload};
        default:
            return state
    }
};

class MyApp extends App {
    static async getInitialProps ({ Component, ctx }) {
        return {
          pageProps: {
            ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
          }
        };
      }

    render() {
        const {Component, pageProps, store} = this.props;
        return (
            <Container>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </Container>
        );
    }

}

export default withRedux(configureStore)(MyApp);