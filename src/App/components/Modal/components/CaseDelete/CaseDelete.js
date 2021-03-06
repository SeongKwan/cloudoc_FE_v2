import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './CaseDelete.module.scss';
import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';
import { getLocaleDateWithYMS } from '../../../../../utils/momentHelper';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

@withRouter
@inject('modal', 'Case', 'user')
@observer
class CaseDelete extends Component {
    state = { open: false, openType: '' }
    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        this.setState({open: false});
        this.props.modal.clear();
        document.removeEventListener('mousedown', this._handleClickOutside);
    }

    _handleClickOutside = (event) => {
        if (this.CaseDelete && !this.CaseDelete.contains(event.target)) {
            this.props.modal.closeModal();
        }
    }

    _handleClickDeleteRecordButton = async () => {
        const caseId = this.props.Case.currentCase._id
        
        if (this.props.Case.currentCaseRecord.length <= 1) { return alert(`마지막 진료입니다. 완전삭제를 원하시면, 해당 증례를 삭제해 주세요`); }
        else {
            await this.props.Case.deleteRecordFromCase(caseId)
            this.toastDeleteRecordComplete();
            await this.props.modal.closeModal();
            return this.props.history.replace(`/case/editor/detail/${caseId}/${0}`);
        }
    }

    _handleClickDeleteCaseButton = () => {
        this.props.modal.closeModal();
        return this.props.Case.deleteCase(this.props.Case.currentCase._id)
        .then(res => {
            this.toastDeleteCaseComplete();
            this.props.history.push(`/case`);
        });
    }

    _handleClickOnList = (type) => {
        this.setState({open: true, openType: type})
    }

    _handleModal = (type, message) => {
        this.props.modal.showModal(type, true);
        this.props.modal.setMessage(type, message);
    }

    toastDeleteRecordComplete = () => toast("기록이 삭제되었습니다");
    toastDeleteCaseComplete = () => toast("증례가 삭제되었습니다");

    render() {
        const { currentCaseRecordDate } = this.props.Case;
        return (
            <div ref={ref => this.CaseDelete = ref} className={cx('CaseDelete')} onMouseLeave={() => {}}>
                <div className={cx('close')} onClick={() => {this.props.modal.closeModal()}}><FiX /></div>
                {
                    !this.state.open &&
                    <>
                        <div className={cx('top')} onClick={() => {this._handleClickOnList('record');}}>해당날짜 기록만 삭제</div>
                        <div className={cx('bottom')} onClick={() => {this._handleClickOnList('case');}}>해당증례 삭제</div>
                    </>
                }
                {
                    this.state.open && 
                    <div>
                        {
                            this.state.openType === 'record' &&
                            <>
                                <div className={cx('delete-message', 'record')}>{`[${getLocaleDateWithYMS(currentCaseRecordDate)}] 의 기록을 삭제합니다`}</div>
                                <div className={cx('button-wrapper')}>
                                    <div className={cx('button', 'cancel')} onClick={() => {this.setState({open: false, openType: ''})}}>취소</div>
                                    <div 
                                        className={cx('button', 'delete')}
                                        onClick={() => {
                                            this._handleClickDeleteRecordButton();
                                        }}
                                    >
                                        기록 삭제
                                    </div>
                                </div>
                            </>
                        }
                        {
                            this.state.openType === 'case' &&
                            <>
                                <div className={cx('delete-message','case')}>
                                    이 작업은 되돌릴 수 없습니다. <br/>
                                    {
                                        `정말 증례-[${this.props.Case.currentCase.title}]을(를) 삭제하시겠습니까?`
                                    }
                                    </div>
                                <div className={cx('button-wrapper')}>
                                    <div className={cx('button', 'cancel')} onClick={() => {this.setState({open: false, openType: ''})}}>취소</div>
                                    <div 
                                        className={cx('button', 'delete')}
                                        onClick={() => {
                                            this._handleClickDeleteCaseButton();
                                        }}
                                    >
                                        증례 삭제
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default CaseDelete;