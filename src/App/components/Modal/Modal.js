import React, { Component } from 'react';
import styles from './Modal.module.scss';
import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';
import { 
    FiArrowDown
} from "../../../lib/react-icons/fi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrintPage from '../../../pages/PrintPage';
import { getLocaleDateWithYMS } from '../../../utils/momentHelper';

const cx = classNames.bind(styles);

@inject('modal', 'print', 'Case', 'user')
@observer
class Modal extends Component {
    state = {
        downloadPDF: false
    }
    handleClickOnCancel = () => {
        this.props.modal.closeModal();
    }

    render() {
        const { modalType, open } = this.props.modal;
        const {
            basic,
            optionalBasic,
            symptom,
            lab,
            diagnosis,
            drug,
            fomula,
            teaching,
        } = this.props.print.content;

        if (!open) {
            return false;
        } else {
            return (
                <div className={cx('Modal')}>
                    <div className={cx('Print')}>
                        <h5>리포트 내용구성</h5>
                        <ul>
                            <li className={cx('checkbox')}>
                                <div className={cx('input')}>
                                    <input 
                                        type="checkbox"
                                        id="basic"
                                        name="basic"
                                        value={"basic"}
                                        checked={basic}
                                        onChange={(e) => {
                                            this.props.print.switchContent('basic', !basic);
                                        }}
                                    />
                                </div>
                                <label className={cx('label')} htmlFor="basic">기본정보</label>
                            </li>
                            {/* <li className={cx('checkbox')}>
                                <div className={cx('input')}>
                                    <input 
                                        type="checkbox"
                                        id="optionalBasic"
                                        name="optionalBasic"
                                        value={"optionalBasic"}
                                        checked={optionalBasic}
                                        onChange={(e) => {
                                            this.props.print.switchContent('optionalBasic', !optionalBasic);
                                        }}
                                    />
                                </div>
                                <label className={cx('label')} htmlFor="optionalBasic">추가정보</label>
                            </li> */}
                            <li className={cx('checkbox')}>
                                <div className={cx('input')}>
                                    <input 
                                        type="checkbox"
                                        id="symptom"
                                        name="symptom"
                                        value={"symptom"}
                                        checked={symptom}
                                        onChange={(e) => {
                                            this.props.print.switchContent('symptom', !symptom);
                                        }}
                                    />
                                </div>
                                <label className={cx('label')} htmlFor="symptom">증상</label>
                            </li>
                            <li className={cx('checkbox')}>
                                <div className={cx('input')}>
                                    <input 
                                        type="checkbox"
                                        id="lab"
                                        name="lab"
                                        value={"lab"}
                                        checked={lab}
                                        onChange={(e) => {
                                            this.props.print.switchContent('lab', !lab);
                                        }}
                                    />
                                </div>
                                <label className={cx('label')} htmlFor="lab">혈액검사</label>
                            </li>
                            <li className={cx('checkbox')}>
                                <div className={cx('input')}>
                                    <input 
                                        type="checkbox"
                                        id="diagnosis"
                                        name="diagnosis"
                                        value={"diagnosis"}
                                        checked={diagnosis}
                                        onChange={(e) => {
                                            this.props.print.switchContent('diagnosis', !diagnosis);
                                        }}
                                    />
                                </div>
                                <label className={cx('label')} htmlFor="diagnosis">추정진단</label>
                            </li>
                            <li className={cx('checkbox')}>
                                <div className={cx('input')}>
                                    <input 
                                        type="checkbox"
                                        id="drug"
                                        name="drug"
                                        value={"drug"}
                                        checked={drug}
                                        onChange={(e) => {
                                            this.props.print.switchContent('drug', !drug);
                                        }}
                                    />
                                </div>
                                <label className={cx('label')} htmlFor="drug">처방</label>
                            </li>
                            <li className={cx('checkbox')}>
                                <div className={cx('input')}>
                                    <input 
                                        type="checkbox"
                                        id="fomula"
                                        name="fomula"
                                        value={"fomula"}
                                        checked={fomula}
                                        onChange={(e) => {
                                            this.props.print.switchContent('fomula', !fomula);
                                        }}
                                    />
                                </div>
                                <label className={cx('label')} htmlFor="fomula">처방구성</label>
                            </li>
                            <li className={cx('checkbox')}>
                                <div className={cx('input')}>
                                    <input 
                                        type="checkbox"
                                        id="teaching"
                                        name="teaching"
                                        value={"teaching"}
                                        checked={teaching}
                                        onChange={(e) => {
                                            this.props.print.switchContent('teaching', !teaching);
                                        }}
                                    />
                                </div>
                                <label className={cx('label')} htmlFor="teaching">환자지도</label>
                            </li>
                        </ul>
                        <div className={cx('button-wrapper')}>
                            <button className={cx('cancel')} onClick={this.handleClickOnCancel}>취소</button>
                                    <PDFDownloadLink 
                                        onClick={this.handleClickOnConfirm}
                                        className={cx('btn-tool', 'report')}
                                        document={<PrintPage user={this.props.user.currentUser} currentCase={this.props.Case.currentCase} contentSetting={{basic, optionalBasic, symptom, lab, diagnosis, drug, fomula, teaching}} />}
                                        fileName={`${this.props.Case.currentCase.title}_${getLocaleDateWithYMS(this.props.Case.currentCase.created_date)}.pdf`}
                                        style={{
                                            textDecoration: "none"
                                        }}
                                    >
                                        {({ blob, url, loading, error }) => {
                                                return (loading ? <button className={cx('confirm', 'preparing')}>다운로드 준비중...</button> : <><button className={cx('confirm')}>내려받기</button></>)
                                            }
                                        }
                                </PDFDownloadLink>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Modal;