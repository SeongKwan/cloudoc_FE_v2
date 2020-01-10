import React, { Component } from 'react';
import styles from './CaseQnA.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";
import LayoutCloudoc from '../../components/LayoutCloudoc';

const cx = classNames.bind(styles);

class CaseQnA extends Component {
    render() {
        return (
            <LayoutCloudoc>
                <div className={cx('CaseQnA')}>
                    <Helmet>
                        <title>Case QnA</title>
                    </Helmet>
                    Case QnA
                </div>
            </LayoutCloudoc>
        );
    }
}

export default CaseQnA;