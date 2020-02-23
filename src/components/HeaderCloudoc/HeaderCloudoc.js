import React, { Component } from 'react';
import styles from './HeaderCloudoc.module.scss';
import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import brandLogo from '../../styles/img/logo_main.png';
import { FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import $ from 'jquery';
import './HeaderCloudoc.css';

const cx = classNames.bind(styles);

@withRouter
@inject(
    'auth',
    'Case',
    'login',
    'user', 
)
@observer
class HeaderCloudoc extends Component {
    state = {
        where: '',
        openMenus: false
    }
    componentDidMount() {
        let where = this.props.location.pathname.split('/')[1];
        this.setState({ where });
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    _handleClickOnLogo = () => {
        this.props.history.push('/case')
    }
    _handleClickOnButton = () => {
        const { openMenus } = this.state;
        this.setState({ openMenus: !openMenus })
        let contentElement = $('#dropdown-content-user');
        if (openMenus) {
            contentElement.removeClass('animated fadeIn');
            contentElement.addClass('animated fadeOut');
            contentElement.removeClass('openContent');
            setTimeout(() => {contentElement.addClass('closeContent');}, 500)
        } else {
            contentElement.removeClass('animated fadeOut');
            contentElement.addClass('animated fadeIn');
            contentElement.addClass('openContent');
            contentElement.removeClass('closeContent');
        }
    }
    handleClickOutside = (event) => {
        if (this.userButton && !this.userButton.contains(event.target)) {
            if (this.state.openMenus) {
                this._handleClickOnButton();
            }
        }
    }
    render() {
        const { currentUser } = this.props.user;
        let { where } = this.state;

        return (
            <div className={cx('HeaderCloudoc')}>
                <div className={cx('brand-logo')} onClick={this._handleClickOnLogo}>
                    <img
                        className={cx('logo')}
                        alt="Cloudoc Logo"
                        src={brandLogo}
                    />
                    <div className={cx('brand-name')}>Cloudoc</div>
                </div>
                <nav className={cx('navbar')}>
                    <ul className={cx('nav-list')}>
                        <li className={'nav-item'}>
                            <Link className={cx({active: where === 'case'})} to='/case'>증례 라이브러리</Link>
                        </li>
                        <li className={'nav-item'}>
                            <Link className={cx({active: where === 'qna'})} to='/qna'>증례 Q&A</Link>
                        </li>
                        <li className={'nav-item'}>
                            <Link className={cx({active: where === 'lecture'})} to='/lecture'>임상강의</Link>
                        </li>
                    </ul>
                </nav>
                <div className={cx('btn-user')} ref={(ref) => {
                            this.userButton = ref;
                        }} >
                    <button 
                        
                        onClick={this._handleClickOnButton}
                    >
                        <FiMenu />
                    </button>
                    <ul id="dropdown-content-user" className={cx('content')}>
                        <div className={cx('user-status')}>
                            <div className={cx('nickname')}>{`${currentUser.username} 님`}</div>
                            <div className={cx('points')}>1,000 PTS</div>
                            <div className={cx('charge')}>포인트충전</div>
                        </div>
                        <div className={cx('divider-horizon')}></div>
                        <li className={cx('content-item')}><FiUser />계정관리</li>
                        <li 
                            className={cx('content-item')}
                            onClick={() => {
                                this.props.login.logout()
                                .then((res) => {
                                    console.log(res)
                                    if (res) {
                                        this.props.history.go('http://cloudoc.net.s3-website.ap-northeast-2.amazonaws.com/')
                                    }
                                })
                            }}
                        >
                            <FiLogOut />로그아웃
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default HeaderCloudoc;