import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './HeaderEditor.module.scss';
import classNames from 'classnames/bind';
import { 
    FiPlus, FiSave, FiEdit,
    FiTrash, FiPrinter, FiArrowLeft, 
    FiHelpCircle, FiMessageCircle,
} from "../../lib/react-icons/fi";
import './HeaderEditor.css';
import { inject, observer } from 'mobx-react';
import { BrowserView } from "react-device-detect";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import Mobile from './components/Mobile/Mobile';
import CaseRecord from './components/CaseRecord/CaseRecord';

const cx = classNames.bind(styles);

@withRouter
@inject('Case', 'user', 'caseEditorBasic', 'modal', 'symptom', 'lab', 'diagnosis', 'treatment', 'teaching')
@observer
class HeaderEditor extends Component {
    state = { downloadPDF: false }
    
    componentWillUnmount() {
        this.setState({ downloadPDF: false });
        this.props.modal.clear();
    }
    handleClickOnBack = (type, message) => {
        this.handleModal(type, message);
        this.props.modal.setFunction(type, () => {
            this.confirmCallBackFn();
        })
    }
    handleClickOnCreate = (type, message) => {
        this.handleModal(type, message);
        this.props.modal.setFunction(type, () => {
            this.props.Case.clearIsEditing();
            this.props.Case.clearAllEditableData();
            this.props.history.push(`/case/editor/create`)
        })
    }
    handleClickOnUpdate = (type, message) => {
        const { dateIndex } = this.props.match.params;
        this.handleModal(type, message);
        this.props.modal.setFunction(type, () => {
            this.props.Case.updateCase(dateIndex)
                .then(res => {
                    if (res) {
                        this.toastUpdateComplete();
                        this.props.Case.toggleIsEditing();
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        })
    }
    handleClickOnPost = () => {
        if (this.props.caseEditorBasic.editableData.title !== '') {
            this.handleModal('confirm', '증례를 생성하시겠습니까?');
            this.props.modal.setFunction('confirm', () => {
                this.props.Case.postCase();
                this.props.Case.clearIsEditing();
                this.props.history.push(`/case`);
            })
        } else {
            toast('증례의 제목을 입력해주세요');
            $('.input_case_title').focus();
        }
    }
    handleModal = (type, message) => {
        this.props.modal.showModal(type, true);
        this.props.modal.setMessage(type, message);
    }
    confirmCallBackFn = () => {
        this.props.history.push(`/case`)
        this.props.Case.clearIsEditing();
    }

    toastUpdateComplete = () => toast("증례가 수정되었습니다");

    render() {
        const { type } = this.props;
        const { isEditing } = this.props.Case;
        
        if (type === "detail") {
            if (this.props.Case.currentCase === null) {
                return false;
            }
        }
        const { caseEditorBasic, symptom, lab, diagnosis, treatment, teaching } = this.props;
        let difference = (
            caseEditorBasic.diff ||
            symptom.diff ||
            lab.diff ||
            diagnosis.diff ||
            treatment.diff ||
            treatment.diffForFormula ||
            teaching.diff
            ) ? true : false;
            
        return (
            <header className={cx('HeaderEditor')}>
                <BrowserView>
                    <ToastContainer 
                        className={cx('toast')}
                        toastClassName={cx('toast-wrapper')}
                        bodyClassName={cx('toast-body')}
                        position='top-right'
                        autoClose={3000}
                        transition={Bounce}
                        closeButton={false}
                    />
                    <div className={cx('tool-bar', 'desktop')}>
                        <div 
                            className={cx('btn-tool', 'back')} 
                            onClick={() => {
                                if (isEditing) {
                                    if (difference) {
                                        this.handleClickOnBack('confirm', '저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?');
                                    } else {
                                        this.confirmCallBackFn();
                                    }
                                } else if (!isEditing && type === 'create') {
                                    this.handleClickOnBack('confirm', '작업한 내용은 저장되지 않습니다. 그대로 나가시겠습니까?');
                                } else {
                                    this.confirmCallBackFn();
                                }
                            }}
                        >
                            <FiArrowLeft />
                            <div className={cx('label')}>뒤로</div>
                        </div>
                        {
                            type === "detail" && !isEditing &&
                            <div 
                                className={cx('btn-tool', 'create')}
                                onClick={() => {
                                        this.handleClickOnCreate('confirm', '새증례를 작성하시겠습니까?')
                                    }
                                }
                            >
                                <FiPlus />
                                <div className={cx('label')}>새증례</div>
                            </div>
                        }
                        
                        {
                            type === "detail" && isEditing && 
                            <div 
                                className={cx('btn-tool', 'save', {disabled: !difference})} 
                                onClick={() => {
                                    if (difference) {
                                        this.handleClickOnUpdate('confirm', '수정하신 내용으로 저장하시겠습니까?');
                                    }
                                }}
                            >
                                <FiSave />
                                <div className={cx('label')}>
                                    저장
                                </div>
                            </div>
                        }
                        {
                            type === "create" &&
                            <div 
                                className={cx('btn-tool', 'save')} 
                                onClick={() => {
                                    this.handleClickOnPost();
                                }}
                            >
                                <FiSave />
                                <div className={cx('label')}>
                                    생성
                                </div>
                            </div>
                        }
                        {
                            type === "detail" &&
                            <div 
                                className={cx('btn-tool', 'save')} 
                                onClick={() => {
                                        const { dateIndex } = this.props.match.params;
                                        if (isEditing) {
                                            if (this.props.Case.checkDifferenceContent()) {
                                                this.handleModal('confirm', '저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?');
                                                this.props.modal.setFunction('confirm', () => {
                                                    this.props.Case.toggleIsEditing(dateIndex);
                                                })
                                            } else {
                                                this.props.Case.toggleIsEditing(dateIndex);
                                            }
                                        } else {
                                            this.props.Case.toggleIsEditing(dateIndex);
                                        }
                                    }
                                }
                            >
                                <FiEdit />
                                <div className={cx('label')}>
                                    {!isEditing ? '편집' : '취소'}
                                </div>
                            </div>
                        }
                        {
                            type === "detail" &&
                            <>
                                <div 
                                    className={cx('btn-tool', 'trash')}
                                    onClick={() => {
                                            this.props.modal.showModal('caseDelete', true);
                                        }
                                    }
                                >
                                    <FiTrash />
                                    <div className={cx('label')}>삭제</div>
                                </div>
                            </>
                        }

                        {
                            type === "detail" && !isEditing &&
                            <>
                                <div 
                                    className={cx('btn-tool', 'question')}
                                    onClick={() => {
                                        this.props.modal.showModal('notification', true);
                                        this.props.modal.setMessage('notification', '현재 준비중입니다');
                                    }}
                                >
                                    <FiMessageCircle />
                                    <div className={cx('label')}>질문</div>
                                </div>
                                    <div 
                                    className={cx('btn-tool', 'question')}
                                    onClick={() => {
                                        this.setState({downloadPDF: true});
                                        this.props.modal.showModal('print', false);
                                    }}
                                >
                                    <FiPrinter />
                                    <div className={cx('label')}>PDF</div>
                                </div>
                            </>
                            
                        }

                        <div 
                            className={cx('btn-tool', 'qna')} 
                            onClick={() => {
                                this.props.modal.showModal('notification', true);
                                this.props.modal.setMessage('notification', '현재 준비중입니다');
                            }}
                        >
                            <FiHelpCircle />
                            <div className={cx('label')}>도움</div>
                        </div>
                    </div>
                </BrowserView>
                {
                    type === 'detail' &&
                    <CaseRecord
                        handleModal={this.handleModal}
                        toastUpdate={this.toastUpdateComplete}
                    />
                }
                <Mobile 
                    difference={difference}
                    type={type} 
                    back={this.handleClickOnBack} 
                    create={this.handleClickOnCreate}
                    update={this.handleClickOnUpdate}
                    post={this.handleClickOnPost}
                    handleModal={this.handleModal}
                    callBackFn={this.confirmCallBackFn}
                />
            </header>
        );
    }
}

export default HeaderEditor;