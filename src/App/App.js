import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import Routes from './components/Routes';
import { inject, observer } from 'mobx-react';
import $ from 'jquery';
import { osName } from "react-device-detect";
import Modal from './components/Modal/Modal';
import PasteArea from './components/PasteArea/PasteArea';

const cx = classNames.bind(styles);

@inject('auth', 'lab', 'modal', 'user')
@observer
class App extends Component {
  state = { online: false };

  componentDidMount() {
    const { onLine } = window.navigator;
    this._setStateOnline(onLine);

    if (this.props.lab.readyForPaste) {
      window.addEventListener('keydown', this._handleKeydown);
      if ($("#paste-area").length > 0) {
        document.querySelector("body").addEventListener("paste", this._handleCopyAndPaste);
      }
    }

    window.addEventListener('online', () => {
      this._setStateOnline(true);
      setTimeout(() => {window.location.reload(true);}, 300);
    });
    window.addEventListener('offline', () => { this._setStateOnline(false); });
  }

  componentDidUpdate() {
    if (this.props.lab.readyForPaste) {
      window.addEventListener('keydown', this._handleKeydown);
      if ($("#paste-area").length > 0) {
        document.querySelector("body").addEventListener("paste", this._handleCopyAndPaste);
      }
    } else if (!this.props.lab.readyForPaste) {
      document.querySelector("body").removeEventListener("paste", this._handleCopyAndPaste);
    }
  }
  componentWillUnmount() {
    document.querySelector("body").removeEventListener("paste", this._handleCopyAndPaste);
    window.removeEventListener('keydown', this._handleKeydown);
  }

  _setStateOnline = (status) => { this.setState({online: status}); };

  _handleKeydown = (e) => {
    const { keyCode } = e;
    const { readyForPaste } = this.props.lab;
    if (keyCode === 27 && readyForPaste) { this.props.lab.toggleReadyForPaste(); }
  }

  _handleCopyAndPaste = (e) => {
    let clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    
    // Do whatever with pasteddata
    this.props.lab.convertTextToObject(pastedData)
}

  render() {
    const { readyForPaste } = this.props.lab;
    
    return (
      <Router>
        <Helmet>
          <title>{`Cloudoc`}</title>
          <meta name="description" content="더 나은 선택을 위한 여러분의 한의학 비서" />
        </Helmet>
        <main className={cx('App', {Windows: osName === 'Windows'}, {modalOpen: (this.props.modal.open && this.props.modal.onLayer)})}>
        {
          !this.state.online &&
          <div className={cx('network-message', 'offline')}>오프라인 상태</div>
        }
          <div id="modal-area">
            <Modal />
          </div>
          <div id="paste-area">
          {
            readyForPaste && 
            <PasteArea />
          }
          </div>
          <Routes />
        </main>
      </Router>
    );
  }
}

export default App;
