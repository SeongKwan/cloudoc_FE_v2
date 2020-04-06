import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './PasteArea.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

@inject('lab')
@observer
class PasteArea extends Component {
    render() {
        return (
            <div className={cx('ready-paste-cover')}>
                <div className={cx('instruction')}>
                <div className={cx('title')}>
                    혈액검사결과 붙여넣기 
                    <span 
                        onClick={() => {this.props.lab.toggleReadyForPaste();}} 
                        className={cx('cancel')}
                    >
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
        );
    }
}

export default PasteArea;