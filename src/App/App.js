import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import Routes from './components/Routes';
import { inject, observer } from 'mobx-react';

const cx = classNames.bind(styles);

@inject('loginStore')
@observer
class App extends Component {
  render() {
    console.log(this.props.loginStore.loggedIn);
    return (
      <Router>
        <Helmet>
          <title>{`Cloudoc`}</title>
        </Helmet>
        <div className={cx('App')}>
          <Routes />
        </div>
      </Router>
    );
  }
}

export default App;
