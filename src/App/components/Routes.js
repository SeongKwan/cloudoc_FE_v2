import React, {Component} from 'react';
import { 
    Switch, 
    Route,
    Redirect,
    withRouter
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CaseLibrary from '../../pages/CaseLibrary';
import Page404 from '../../pages/Page404';
import CheckAuth from './CheckAuth';
import CaseQnA from '../../pages/CaseQnA/CaseQnA';
import Lecture from '../../pages/Lecture/Lecture';
import CaseEditor from '../../pages/CaseEditor/CaseEditor';

let timer = null;

@withRouter
@inject('auth', 'Case', 'search', 'login', 'user')
@observer
class Routes extends Component {
    componentDidMount() {
        const { isLoggedIn } = this.props.login;
        const { expiredToken } = this.props.auth;

        if (isLoggedIn) {
            timer = setInterval(() => {
                if (!expiredToken) {
                    this.checkToken();
                } else {
                    console.log('expired');
                }
            }, 1800000);
        }
    }

    componentWillUnmount() {
        clearInterval(timer);
        this.props.auth.setExpiredToken(false);
    }

    checkToken = () => {
        const THIS = this;
        return new Promise((resolve, reject) => {
            let result = THIS.props.auth.validateToken();
            return resolve({success: result.data}); 
        });
    }

    render() {
        return (
            <>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/case" />
                    </Route>
                    <Route exact path="/case">
                        <CaseLibrary />
                    </Route>
                    <Route path="/case/editor/:type/:caseId/:dateIndex">
                        <CaseEditor />
                    </Route>
                    <Route path="/case/editor/:type">
                        <CaseEditor />
                    </Route>
                    <Route path="/qna">
                        <CaseQnA />
                    </Route>
                    <Route path="/lecture">
                        <Lecture />
                    </Route>
                    <Route path="/report/:caseId">
                    </Route>
                    <Route>
                        <Page404 />
                    </Route>
                </Switch>
            </>
        );
    }
}

export default CheckAuth()(Routes);