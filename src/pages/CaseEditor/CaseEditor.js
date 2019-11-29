import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './CaseEditor.module.scss';
import classNames from 'classnames/bind';
import { Helmet } from "react-helmet";

const cx = classNames.bind(styles);

@withRouter
@inject('userStore', 'loginStore')
@observer
class CaseEditor extends Component {
  render() {
    return (
      <div className={cx('CaseEditor')}>
        <Helmet>
            <title>Case Editor</title>
        </Helmet>
        Case Editor Page
        <button 
          className={cx('btn-logout')}
          onClick={() => {
            this.props.loginStore.logout()
            .then(async (res) => {
              if (res) {
                this.props.history.go('/')
              }
            })
          }}
        >
          로그아웃
        </button>
      </div>
    );
  }
}

export default CaseEditor;