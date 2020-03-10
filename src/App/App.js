import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import Routes from './components/Routes';
import { inject, observer } from 'mobx-react';
import $ from 'jquery';
import convertRef from '../constant/convertReference'
import {
  osName
} from "react-device-detect";
import Modal from './components/Modal/Modal';

const cx = classNames.bind(styles);

@inject('auth', 'lab', 'modal', 'user')
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

    if (this.props.lab.readyForPaste) {

      if ($("#paste-area").length > 0) {
        document.querySelector("body").addEventListener("paste", this.handleCopyAndPaste);
      }
    }

  }
  componentDidUpdate() {
    if (this.props.lab.readyForPaste) {
      window.addEventListener('keydown', this.handleKeydown);
      if ($("#paste-area").length > 0) {
        document.querySelector("body").addEventListener("paste", this.handleCopyAndPaste);
      }
    }
    if (!this.props.lab.readyForPaste) {
      document.querySelector("body").removeEventListener("paste", this.handleCopyAndPaste);
    }
  }
  componentWillUnmount() {
    document.querySelector("body").removeEventListener("paste", this.handleCopyAndPaste);
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (e) => {
    const { keyCode } = e;
    const { readyForPaste } = this.props.lab;
    if (keyCode === 27 && readyForPaste) {
      this.props.lab.toggleReadyForPaste();
    }
  }

  handleCopyAndPaste = (e) => {
    let clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    
    // Do whatever with pasteddata
    // alert(pastedData);
    // console.log(pastedData)
    this.convertTextToObject(pastedData)
}

convertTextToObject = (pastedData) => {
    let parsedData = [];
    
    if (!this.checkerPaste(pastedData.split('\n')[0])) {
        alert('복사한 혈액검사 텍스트파일 양식이 틀렸거나 내용이 올바르지 않습니다');
        return false;
    }
    pastedData.split('\n').forEach(data => {
        let splitted = data.split('\t');
        if (splitted.length > 1) {
            if (splitted[1] !== "") {
                let name = splitted[1];
                let value;
                value = splitted[9];

                let ref = convertRef.find(data => data.source === name);
                if (ref) {
                    parsedData.push({
                        name: ref.target,
                        category: ref.category,
                        unit: ref.unit,
                        value: value
                    })
                } else {
                    parsedData.push({
                        name: name,
                        unit: splitted[3],
                        value: value
                    })
                }

            }
        }
    })
    parsedData.splice(0, 1);

    this.props.lab.setEditableData(parsedData.filter(x => x.value !== "-"));
    this.props.lab.toggleReadyForPaste();
    // console.log(parsedData);
}

checkerPaste = (firstData) => {
    let splitted = firstData.split('\t');
    
    if (splitted[0] === '검사구분') return true;
    return false;
}
  
  render() {
    const { readyForPaste } = this.props.lab;
    

    return (
      <Router>
        <Helmet>
          <title>{`Cloudoc`}</title>
          <meta name="description" content="더 나은 선택을 위한 여러분의 한의학 비서" />
        </Helmet>
        <main className={cx('App', {Windows: osName === 'Windows'}, {modalOpen: this.props.modal.open})}>
        {
          this.state.online === false &&
          <div className={cx('network-message', 'offline')}>오프라인 상태</div>
        }
        <div id="modal-area">
          <Modal />
        </div>
        <div id="paste-area">
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
                  <div>(윈도우)</div>
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
        </div>
          <Routes />
        </main>
      </Router>
    );
  }
}

export default App;
