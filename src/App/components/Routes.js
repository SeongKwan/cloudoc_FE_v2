import React from 'react';
import { 
    Switch, 
    Route,
    Redirect
} from 'react-router-dom';
import CaseEditor from '../../pages/CaseEditor';
import CaseMaster from '../../pages/CaseMaster';
import PrintPage from '../../pages/PrintPage';
import ClinicalDB from '../../pages/ClinicalDB';
import Page404 from '../../pages/Page404';
import {
    BrowserView,
    // MobileView
} from "react-device-detect";
import CheckAuth from './CheckAuth';

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
                        <Redirect to="/editor" />
                    </Route>
                    <Route path="/editor">
                        <CaseEditor />
                    </Route>
                    <Route path="/master">
                        <CaseMaster />
                    </Route>
                    <Route path="/clinicaldb">
                        <ClinicalDB />
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