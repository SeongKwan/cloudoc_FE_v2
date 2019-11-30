import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import Routes from './components/Routes';

const cx = classNames.bind(styles);

class App extends Component {
  render() {
    return (
      <Router>
        <Helmet>
          <title>{`Cloudoc`}</title>
          <meta name="description" content="더 나은 선택을 위한 여러분의 한의학 비서" />
        </Helmet>
        <div className={cx('App')}>
          <Routes />
        </div>
      </Router>
    );
  }
}

export default App;
