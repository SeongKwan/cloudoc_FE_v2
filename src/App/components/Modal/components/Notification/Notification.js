import React, { Component } from 'react';
import styles from './Notification.module.scss';
import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';
import { FiX } from 'react-icons/fi';

const cx = classNames.bind(styles);

@inject('modal')
@observer
class Notification extends Component {
    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this._handleClickOutside);
        this.props.modal.clear();
    }
    _handleClickOutside = (event) => {
        if (this.Notification && !this.Notification.contains(event.target)) {
            this.props.modal.closeModal();
        }
    }
    render() {
        return (
            <div className={cx('Notification')} ref={ref => this.Notification = ref}>
                <div className={cx('close')} onClick={() => {this.props.modal.closeModal()}}><FiX /></div>
                <div className={cx('message')}>{this.props.modal.message['notification']}</div>
                <div className={cx('button-container')}>
                    <div className={cx('button','confirm')} onClick={() => this.props.modal.closeModal()}>확인</div>
                </div>
            </div>
        );
    }
}

export default Notification;