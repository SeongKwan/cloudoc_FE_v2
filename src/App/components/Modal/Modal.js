import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './Modal.module.scss';
import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';
import PDFPrint from './components/PDFPrint/PDFPrint';
import CaseDelete from './components/CaseDelete/CaseDelete';

const cx = classNames.bind(styles);

@withRouter
@inject('modal', 'print', 'Case', 'user')
@observer
class Modal extends Component {
    

    render() {
        const { open, modalType } = this.props.modal;
        const { dateIndex } = this.props.match.params;

        if (!open) {
            return false;
        } else {
            return (
                <div className={cx('Modal', {PDF: modalType.print}, {caseDelete: modalType.caseDelete})}>
                    {
                        modalType.print &&
                        <PDFPrint />
                    }
                    {
                        modalType.caseDelete &&
                        <CaseDelete dateIndex={dateIndex} />
                    }
                </div>
            );
        }
    }
}

export default Modal;