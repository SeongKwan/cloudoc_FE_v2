import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import Loader from '../../components/Loader/Loader';
import LayoutCloudoc from '../../components/LayoutCloudoc';
import styles from './CaseLibrary.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
let timer = null;

@withRouter
@inject(
    'auth',
    'Case',
    'login',
    'user', 
)
@observer
class CaseLibrary extends Component {
    componentDidMount() {
        this._loadCases();
        timer = setInterval(() => {
            this.checkToken();
        }, 1800000);
    }
    componentWillUnmount() {
        clearInterval(timer);
    }

    checkToken = () => {
        this.props.auth.validateToken();
    }
    _loadCases = () => {
        this.props.Case.loadCases();
    }

    render() {
        const cases = this.props.Case.registry || [];
        const { isLoading } = this.props.Case;
    
        return (
            <LayoutCloudoc>
                <div className={cx('CaseLibrary')}>
                    <Helmet>
                        <title>Case Library</title>
                    </Helmet>
                    Home - Case Library
                    <span>
                        <button onClick={this._loadCases}>증례 불러오기</button>
                        
                    </span>
                    <div className={cx('wrapper-caselist')}>
                    {
                        isLoading 
                        ? <Loader /> 
                        : <ul>
                        {cases.map((item, i) => {
                            return <li key={i}>#{i} 증례</li>
                        })}
                        </ul>
                    }
                    </div>
                </div>
            </LayoutCloudoc>
        );
    }
}

export default CaseLibrary;