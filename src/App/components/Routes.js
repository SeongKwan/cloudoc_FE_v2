import React from 'react';
import { 
    Switch, 
    Route,
    Redirect
} from 'react-router-dom';
import CaseLibrary from '../../pages/CaseLibrary';
import PrintPage from '../../pages/PrintPage';
import Page404 from '../../pages/Page404';
import {
    BrowserView,
    // MobileView
} from "react-device-detect";
import CheckAuth from './CheckAuth';
import CaseQnA from '../../pages/CaseQnA/CaseQnA';
import Lecture from '../../pages/Lecture/Lecture';

const Routes = () => {
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
            <BrowserView>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/case" />
                    </Route>
                    <Route path="/case">
                        <CaseLibrary />
                    </Route>
                    <Route path="/qna">
                        <CaseQnA />
                    </Route>
                    <Route path="/lecture">
                        <Lecture />
                    </Route>
                    <Route path="/print">
                        <PrintPage />
                    </Route>
                    <Route>
                        <Page404 />
                    </Route>
                    
                </Switch>
            </BrowserView>
        </>
    );
};

export default CheckAuth()(Routes);