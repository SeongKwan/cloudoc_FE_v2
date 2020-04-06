import React, { Component } from 'react';
import styles from './PDFPrint.module.scss';
import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PrintPage from '../../../../../pages/PrintPage';
import { getLocaleDateWithYMS } from '../../../../../utils/momentHelper';
import CheckBox from '../CheckBox/CheckBox';

const cx = classNames.bind(styles);

@inject('modal', 'print', 'Case', 'user')
@observer
class PDFPrint extends Component {
    state = { downloadPDF: false }

    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        this.setState({downloadPDF: false});
        this.props.modal.clear();
        document.removeEventListener('mousedown', this._handleClickOutside);
    }

    _handleClickOutside = (event) => {
        if (this.print && !this.print.contains(event.target)) {
            this.props.modal.closeModal()
        }
    }

    _handleClickOnCancel = () => {
        this.props.modal.closeModal();
    }

    _handleClickOnConfirm = () => {
        this.props.print.clear();
        this.props.modal.closeModal();
    }

    render() {
        const {
            basic, optionalBasic, symptom, lab,
            diagnosis, drug, fomula, teaching
        } = this.props.print.content;
        return (
            <div className={cx('PDFPrint')} ref={ref => this.print = ref}>
                <h5>리포트 내용구성</h5>
                <ul>
                    <CheckBox itemName="basic" content={basic} labelTitle="기본정보" />
                    <CheckBox itemName="symptom" content={symptom} labelTitle="증상" />
                    <CheckBox itemName="lab" content={lab} labelTitle="혈액검사" />
                    <CheckBox itemName="diagnosis" content={diagnosis} labelTitle="추정진단" />
                    <CheckBox itemName="drug" content={drug} labelTitle="처방" />
                    <CheckBox itemName="fomula" content={fomula} labelTitle="처방구성" />
                    <CheckBox itemName="teaching" content={teaching} labelTitle="환자지도" />
                </ul>
                <div className={cx('button-wrapper')}>
                    <button className={cx('cancel')} onClick={this._handleClickOnCancel}>취소</button>
                        <PDFDownloadLink 
                            onClick={this._handleClickOnConfirm}
                            className={cx('btn-tool', 'report')}
                            document={<PrintPage user={this.props.user.currentUser} currentCase={this.props.Case.currentCase} contentSetting={{basic, optionalBasic, symptom, lab, diagnosis, drug, fomula, teaching}} />}
                            fileName={`${this.props.Case.currentCase.title}_${getLocaleDateWithYMS(this.props.Case.currentCase.created_date)}.pdf`}
                            style={{ textDecoration: "none" }}
                        >
                            {({ blob, url, loading, error }) => {
                                    return (loading ? <button className={cx('confirm', 'preparing')}>준비중...</button> : <><button className={cx('confirm')} onClick={this._handleClickOnConfirm}>내려받기</button></>)
                                }
                            }
                    </PDFDownloadLink>
                </div>
            </div>
        );
    }
}

export default PDFPrint;