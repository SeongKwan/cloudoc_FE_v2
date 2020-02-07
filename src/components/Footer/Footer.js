import React, { Component } from 'react';
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import { getLocaleDateWithYYYY } from '../../utils/momentHelper';

const cx = classNames.bind(styles);

class Footer extends Component {
  render() {
    let dateNow = getLocaleDateWithYYYY( Date.now());
    return (
      <footer className={cx('Footer')}>
        <div className={cx('copyright')}>
          &copy; 2020 INTEGRO MEDI LAB CO., LTD. All Rights Reserved.
        </div>
        <p>{`ver ${dateNow}b test (beta)`}</p>
      </footer>
    );
  }
}

export default Footer;