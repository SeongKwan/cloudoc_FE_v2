import React, { Component } from 'react';
import styles from './UserStatus.module.scss';
import classNames from 'classnames/bind';
import { withRouter } from 'react-router-dom';

const cx = classNames.bind(styles);

@withRouter
class UserStatus extends Component {
    render() {
        return (
            <div className={cx('UserStatus')}>
                <div className={cx('flexible-container')}>
                    <div className={cx('level-exp')}>
                        <div className={cx('level')}>Lv.1</div>
                    </div>
                    <div className={cx('info')}>
                        <div className={cx('nickname')}><span>{`${this.props.username}`}</span> 님, 환영합니다</div>
                        <div className={cx('points')}>현재포인트 <span>1,000 PTS</span></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserStatus;