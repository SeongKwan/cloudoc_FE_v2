import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './Landing.module.scss';
import classNames from 'classnames/bind';
import ServiceIntro from '../../components/ServiceIntro';
import Layout from '../../components/Layout';

const cx = classNames.bind(styles);

@withRouter
class Landing extends Component {
  render() {
    return (
      <div className={cx('Landing')}>
        <Layout>
          <ServiceIntro />
        </Layout>
      </div>
    );
  }
}

export default Landing;