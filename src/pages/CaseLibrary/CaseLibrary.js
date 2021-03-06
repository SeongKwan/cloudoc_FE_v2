import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import LayoutCloudoc from '../../components/LayoutCloudoc';
import styles from './CaseLibrary.module.scss';
import classNames from 'classnames/bind';
import UserStatus from '../../components/UserStatus/UserStatus';
import MyCases from '../../components/MyCases/MyCases';

const cx = classNames.bind(styles);

@withRouter
@inject('auth', 'Case', 'login', 'user', 'search')
@observer
class CaseLibrary extends Component {
    state = { selector: '' }
    componentDidMount() {
        this._handleClickOnSelector('case');
        this.props.auth.validateToken()
        .then(res => {
            if (res) return this.props.Case.loadCases();
        })
    }

    _handleClickOnSelector = (type) => {
        this.setState({selector: type});
    }

    render() {
        const { selector } = this.state;
        const { currentUser } = this.props.user;
        return (
            <LayoutCloudoc>
                <div className={cx('CaseLibrary')}>
                    <Helmet>
                        <title>Case Library</title>
                    </Helmet>
                    <UserStatus username={currentUser.username} />
                    <main>
                        <div className={cx('flexible-container')}>
                            <div className={cx('selector')}>
                                <button className={cx({active: selector === 'case'})} onClick={() => {this._handleClickOnSelector('case')}}>내 증례</button>
                                <button className={cx({active: selector === 'question'})} onClick={() => {this._handleClickOnSelector('question')}}>내 질문</button>
                                <button className={cx({active: selector === 'answer'})} onClick={() => {this._handleClickOnSelector('answer')}}>내 답변</button>
                            </div>
                            {
                                selector === 'case' &&
                                <MyCases />
                            }
                        </div>
                    </main>
                </div>
            </LayoutCloudoc>
        );
    }
}

export default CaseLibrary;