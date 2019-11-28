import React, { Component } from 'react';
import styles from './Landing.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";

const cx = classNames.bind(styles);

class Landing extends Component {
  render() {
    return (
      <div className={cx('Landing')}>
        <Helmet>
            <title>Case Editor</title>
            <meta name="description" content="더 나은 선택을 위한 여러분의 한의학 비서" />
        </Helmet>
        Landing Page
      </div>
    );
  }
}

export default Landing;