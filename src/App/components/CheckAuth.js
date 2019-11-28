import React, { Component } from 'react';
import { 
    Switch, 
    Route, 
    withRouter 
} from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Landing from '../../pages/Landing';
import Page404 from '../../pages/Page404';

const CheckAuth = () => (WrappedComponent) => {
    @withRouter
    @inject("loginStore")
    @observer
    class AuthenticatedComponent extends Component {
        render() {
            const { loggedIn } = this.props.loginStore;
            return (
                <>
                    {
                        loggedIn
                        ? <WrappedComponent {...this.props} />
                        : <Switch> 
                            <Route path="/" exact>
                                <Landing />
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