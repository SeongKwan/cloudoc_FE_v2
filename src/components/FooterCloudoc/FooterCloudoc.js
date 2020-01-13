import React, { Component } from 'react';
import styles from './FooterCloudoc.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import brandLogo from '../../styles/img/logo_main.png';

const cx = classNames.bind(styles);

class FooterCloudoc extends Component {
    render() {
        return (
            <div className={cx('FooterCloudoc')}>
                <div className={cx('company-info')}>
                    <img
                        className={cx('logo')}
                        alt="IML Logo"
                        src={brandLogo}
                    />
                    <div className={cx('info')}>
                        <p>&copy; 2020 INTEGRO MEDI LAB CO., LTD.</p>
                        <p>All Rights Reserved.</p>
                    </div>
                </div>
                <ul className={cx('navbar')}>
                    <li className={cx('navbar-item')}>
                        <Link to="/privacy">개인보호정책</Link>
                    </li>
                    <li className={cx('navbar-item')}>
                        <Link to="customer">고객지원</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default FooterCloudoc;