import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import Routes from './components/Routes';
import { inject, observer } from 'mobx-react';

const cx = classNames.bind(styles);

@inject('auth', 'lab')
@observer
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
    if (this.props.lab.readyForPaste) {
      window.addEventListener('keydown', this.handleKeydown);
    }
  }
  componentDidUpdate() {
    if (this.props.lab.readyForPaste) {
      window.addEventListener('keydown', this.handleKeydown);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (e) => {
    const { keyCode } = e;
    const { readyForPaste } = this.props.lab;
    if (keyCode === 27 && readyForPaste) {
      this.props.lab.toggleReadyForPaste();
    }
  }
  
  render() {
    const { readyForPaste } = this.props.lab;

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
        {
          readyForPaste && 
          <div className={cx('ready-paste-cover')}>
            <div className={cx('instruction')}>
              <div className={cx('title')}>
                혈액검사결과 붙여넣기 
                <span onClick={() => {this.props.lab.toggleReadyForPaste();}} className={cx('cancel')}>
                  취소(ESC)
                </span>
              </div>
              <div className={cx('code-container')}>
                <div className={cx('window','code-wrapper')}>
                  <div>(윈도우)</div>
                  <code className={cx('short-command-key')}>ctrl + v</code>
                </div>
                <div className={cx('mac','code-wrapper')}>
                  <div>(맥)</div>
                  <code className={cx('short-command-key')}>cmd + v</code>
                </div>
              </div>
              
            </div>
          </div>
        }
          <Routes />
        </main>
      </Router>
    );
  }
}

export default App;
