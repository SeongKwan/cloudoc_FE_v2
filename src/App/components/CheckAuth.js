import React, { Component } from 'react';
import { 
    Switch, 
    Route, 
    withRouter,
    Redirect
} from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Landing from '../../pages/Landing';
import Page404 from '../../pages/Page404';
import Login from '../../pages/Login';
import Signup from '../../pages/Signup';

const CheckAuth = () => (WrappedComponent) => {
    @withRouter
    @inject("loginStore")
    @observer
    class AuthenticatedComponent extends Component {
        render() {
            const { inLoggedIn } = this.props.loginStore;
            return (
                <>
                    {
                        inLoggedIn
                        ? <WrappedComponent {...this.props} />
                        : <Switch> 
                            <Route path="/" exact>
                                <Landing />
                            </Route>
                            <Route path="/editor">
                                <Redirect to="/" />
                            </Route>
                            <Route exact path="/login">
                                <Login />
                            </Route>
                            <Route exact path="/signup">
                                <Signup />
                            </Route>
                            <Route>
                                <Page404 />
                            </Route>
                        </Switch>
                    }
                </>
            );
        }
    }
    return AuthenticatedComponent;
};

export default CheckAuth;