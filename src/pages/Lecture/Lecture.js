import React, { Component } from 'react';
import styles from './Lecture.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";
import LayoutCloudoc from '../../components/LayoutCloudoc';

const cx = classNames.bind(styles);

class Lecture extends Component {
    render() {
        return (
            <LayoutCloudoc>
                <div className={cx('Lecture')}>
                    <Helmet>
                        <title>Lecture</title>
                    </Helmet>
                    Lecture
                </div>
            </LayoutCloudoc>
        );
    }
}

export default Lecture;