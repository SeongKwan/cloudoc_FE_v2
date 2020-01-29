import React, { Component } from 'react';
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class Footer extends Component {
  render() {
    return (
      <footer className={cx('Footer')}>
        <div className={cx('copyright')}>
          &copy; 2020 INTEGRO MEDI LAB CO., LTD. All Rights Reserved.
        </div>
        <p>ver 2020.01.29b test (beta)</p>
      </footer>
    );
  }
}

export default Footer;