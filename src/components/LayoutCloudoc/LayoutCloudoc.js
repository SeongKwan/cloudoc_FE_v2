import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './LayoutCloudoc.module.scss';
import classNames from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import HeaderCloudoc from '../HeaderCloudoc';
import FooterCloudoc from '../FooterCloudoc';

const cx = classNames.bind(styles);

@withRouter
@inject()
@observer
class LayoutCloudoc extends Component {
    render() {
        const { children } = this.props;

        return (
            <div className={cx('LayoutCloudoc')}>
                <div className={cx('header-container')}>
                    <HeaderCloudoc />
                </div>
                <main className={cx('main-container')}>
                    {children}
                </main>
                <footer className={cx('footer-container')}>
                    <FooterCloudoc />
                </footer>
            </div>
        );
    }
}

LayoutCloudoc.propTypes = {
    children: PropTypes.object
}

export default LayoutCloudoc;