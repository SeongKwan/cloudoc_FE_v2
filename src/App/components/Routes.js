import React, {Component} from 'react';
import { 
    Switch, 
    Route,
    Redirect,
    withRouter
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CaseLibrary from '../../pages/CaseLibrary';
// import PrintPage from '../../pages/PrintPage';
import Page404 from '../../pages/Page404';
import {
    // BrowserView,
    // MobileView
} from "react-device-detect";
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
                    console.log('expired')
                }
            }, 30000);
            // }, 1800000);
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
                {/* <MobileView>
                    <Switch>
                    <Route path="/404" component={Page404} />
                    <Route path="/cloudoc/clinicaldb" component={ClinicalDBMobile} />
                    <Route path={`/cloudoc/case/detail/:id/:index/:dateIndex`} component={CaseDetailMobile} />
                    <Route path={`/cloudoc/case/create`} component={CaseCreateMobile} />
                    <Route path="/cloudoc" exact component={MainMobile} />
                    <Route component={Page404} />
                    </Switch>
                </MobileView> */}
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/case" />
                    </Route>
                    <Route exact path="/case">
                        <CaseLibrary />
                    </Route>
                    <Route path="/case/editor">
                        <CaseEditor />
                    </Route>
                    <Route path="/qna">
                        <CaseQnA />
                    </Route>
                    <Route path="/lecture">
                        <Lecture />
                    </Route>
                    <Route path="/report/:caseId">
                    {/* {
                        this.props.Case.currentCase !== undefined && this.props.Case.currentCase !== null &&
                        <PrintPage user={this.props.user.currentUser} currentUser={this.props.Case.currentCase}/>
                    } */}
                    </Route>
                    <Route>
                        <Page404 />
                    </Route>
                    
                </Switch>
                {/* <BrowserView>
                </BrowserView> */}
            </>
        );
    }
}

export default CheckAuth()(Routes);