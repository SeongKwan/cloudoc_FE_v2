import React, { Component } from 'react';
import styles from './Confirm.module.scss';
import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';
import { FiX } from 'react-icons/fi';

const cx = classNames.bind(styles);

@inject('modal')
@observer
class Confirm extends Component {
    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this._handleClickOutside);
        this.props.modal.clear();
    }
    _handleClickOutside = (event) => {
        if (this.confirm && !this.confirm.contains(event.target)) {
            this.props.modal.closeModal();
        }
    }
    render() {
        
        return (
            <div className={cx('Confirm')} ref={ref => this.Confirm = ref}>
                <div className={cx('close')} onClick={() => {this.props.modal.closeModal()}}><FiX /></div>
                <div className={cx('message')}>{this.props.modal.message['confirm']}</div>
                <div className={cx('button-container')}>
                    <div className={cx('button','cancel')} onClick={() => {
                        this.props.modal.closeModal();
                        if (this.props.modal.callBackFn['cancel'] !== null) {
                            this.props.modal.callBackFn['cancel']();
                        }
                        }}
                    >
                        취소
                    </div>
                    <div className={cx('button','confirm')} onClick={() => {
                        this.props.modal.callBackFn['confirm']();
                        this.props.modal.closeModal();
                        }}
                    >
                        확인
                    </div>
                </div>
            </div>
        );
    }
}

export default Confirm;