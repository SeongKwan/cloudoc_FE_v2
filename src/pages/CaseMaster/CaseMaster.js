import React, { Component } from 'react';
import styles from './CaseMaster.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";

const cx = classNames.bind(styles);

class CaseMaster extends Component {
  render() {
    return (
      <div className={cx('CaseMaster')}>
        <Helmet>
            <title>Case Master</title>
            <meta name="description" content="더 나은 선택을 위한 여러분의 한의학 비서" />
        </Helmet>
      </div>
    );
  }
}

export default CaseMaster;