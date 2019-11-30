import React, { Component } from 'react';
import styles from './ClinicalDB.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";

const cx = classNames.bind(styles);

class ClinicalDB extends Component {
  render() {
    return (
      <div className={cx('ClinicalDB')}>
        <Helmet>
            <title>Clinical-DB</title>
        </Helmet>
      </div>
    );
  }
}

export default ClinicalDB;