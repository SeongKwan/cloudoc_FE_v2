import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import Routes from './components/Routes';

const cx = classNames.bind(styles);

class App extends Component {
  state = {
    online: false
  };
  componentDidMount() {
    const online = window.navigator.onLine;
    if (online) {
      this.setState({ online: true })
    } else {
      this.setState({ online: false })
    }
    window.addEventListener('online', () => {
      this.setState({ online: true })
      setTimeout(() => {window.location.reload(true);}, 300);
    });
    window.addEventListener('offline', () => {
      this.setState({ online: false })
    });
  }
  render() {
    return (
      <Router>
        <Helmet>
          <title>{`Cloudoc`}</title>
          <meta name="description" content="더 나은 선택을 위한 여러분의 한의학 비서" />
        </Helmet>
        <main className={cx('App')}>
        {
          this.state.online === false &&
          <div className={cx('network-message', 'offline')}>오프라인 상태</div>
        }
          <Routes />
        </main>
      </Router>
    );
  }
}

export default App;
