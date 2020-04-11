import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './HeaderEditor.module.scss';
import classNames from 'classnames/bind';
import { 
    FiMenu, FiPlus, FiSave, FiEdit,
    FiTrash, FiPrinter, FiArrowLeft, 
    FiHelpCircle, FiMessageCircle,
} from "../../lib/react-icons/fi";
import { IoMdArrowDropdown } from 'react-icons/io';
import './HeaderEditor.css';
import { inject, observer } from 'mobx-react';
import { getLocaleDateWithYMS } from '../../utils/momentHelper';
import { BrowserView, MobileView } from "react-device-detect";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

@withRouter
@inject('Case', 'user', 'caseEditorBasic', 'modal', 'symptom', 'lab', 'diagnosis', 'treatment', 'teaching')
@observer
class HeaderEditor extends Component {
    state = { downloadPDF: false, focusParent: false, open: false }
    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        this.setState({ downloadPDF: false, focusParent: false });
        this.props.modal.clear();
        document.removeEventListener('mousedown', this._handleClickOutside);
    }
    _handleClickOutside = (event) => {
        if (this.recordDate && !this.recordDate.contains(event.target) && this.state.focusParent) {
            this.setState({ focusParent: false})
        }
        if (this.toolbar && !this.toolbar.contains(event.target) && this.state.open) {
            if (!this.menu.contains(event.target)) {
                return this.setState({open: false})
            }
        }
    }
    _toggleOnFocus = () => {
        this.setState({ focusParent: !this.state.focusParent})
    }
    _handleClickOnBack = (type, message) => {
        this._handleModal(type, message);
        this.props.modal.setFunction(type, () => {
            this.confirmCallBackFn();
        })
    }
    _handleClickOnCreate = (type, message) => {
        this._handleModal(type, message);
        this.props.modal.setFunction(type, () => {
            this.props.Case.clearIsEditing();
            this.props.Case.clearAllEditableData();
            this.props.history.push(`/case/editor/create`)
        })
    }
    _handleClickOnUpdate = (type, message) => {
        const { dateIndex } = this.props.match.params;
        this._handleModal(type, message);
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
    _handleClickOnPost = () => {
        if (this.props.caseEditorBasic.editableData.title !== '') {
            this._handleModal('confirm', '증례를 생성하시겠습니까?');
            this.props.modal.setFunction('confirm', () => {
                this.props.Case.postCase();
                this.props.Case.clearIsEditing();
                this.props.history.push(`/case`);
            })
        } else {
            this._handleModal('notification', '증례의 제목을 입력해 주세요');
        }
    }
    _handleModal = (type, message) => {
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
        const { isEditing, currentCaseRecord } = this.props.Case;
        const { dateIndex, caseId } = this.props.match.params;
        
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
                                        this._handleClickOnBack('confirm', '저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?');
                                    } else {
                                        this.confirmCallBackFn();
                                    }
                                } else if (!isEditing && type === 'create') {
                                    this._handleClickOnBack('confirm', '작업한 내용은 저장되지 않습니다. 그대로 나가시겠습니까?');
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
                                        this._handleClickOnCreate('confirm', '새증례를 작성하시겠습니까?')
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
                                        this._handleClickOnUpdate('confirm', '수정하신 내용으로 저장하시겠습니까?');
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
                                    this._handleClickOnPost();
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
                                                this._handleModal('confirm', '저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?');
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
                    <div 
                        ref={(ref) => { this.recordDate = ref; }}
                        className={cx('record-date', {focus: this.state.focusParent})}
                    >
                        <div 
                            className={cx('selected-date')} 
                            onClick={() => { this._toggleOnFocus(); }}
                        >
                            <div>({`${+dateIndex + 1}/${currentCaseRecord.length}`})</div>
                            {
                                currentCaseRecord.length > 0 &&
                                <div>{getLocaleDateWithYMS(currentCaseRecord[dateIndex])}</div>
                            }
                            <div className={cx('arrow-down-icon')}><IoMdArrowDropdown /></div>
                        </div>
                        {
                        this.state.focusParent &&
                        <div className={cx('records')}>
                            <ul>
                            {
                                currentCaseRecord.map((date, i) => {
                                return <li key={i}>
                                    <div 
                                    onClick={() => {
                                        this.setState({focusParent: false});
                                        if (isEditing) {
                                            if (this.props.Case.checkDifferenceContent()) {
                                                this.props.modal.setFunction('cancel', () => {
                                                    this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                                })
                                                
                                                this._handleModal('confirm', '저장되지 않은 내용이 있습니다. 저장하고 다른 진료일자로 바꾸시겠습니까?');
                                                return this.props.modal.setFunction('confirm', () => {
                                                    this.props.Case.updateCase(dateIndex)
                                                        .then(res => {
                                                            if (res) {
                                                                this.toastUpdateComplete();
                                                                this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                                            }
                                                        })
                                                        .catch(err => {
                                                            console.log(err)
                                                        });
                                                })
                                            }
                                        }
                                        return this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                    }} 
                                    className={cx('date', {selected: i === +dateIndex})}
                                    >
                                    {getLocaleDateWithYMS(date)}
                                    </div>
                                </li>
                                })
                            }
                            </ul>
                        </div>
                        }
                    </div>
                }
                <MobileView>
                    <div ref={ref => this.menu = ref} className={cx('btn-tool', 'menu')} onClick={() => {this.setState({open: !this.state.open})}}>
                        <FiMenu />
                    </div>
                </MobileView>
                <MobileView>
                    <ToastContainer 
                        className={cx('toast')}
                        toastClassName={cx('toast-wrapper')}
                        bodyClassName={cx('toast-body')}
                        position='top-right'
                        autoClose={3000}
                        transition={Bounce}
                        closeButton={false}
                    />
                    <div ref={ref => this.toolbar = ref} className={cx('toggle-tool-bar', {open: this.state.open})}>
                        <div className={cx('tool-bar','mobile')}>
                            <div className={cx('btn-tool', 'back')} onClick={() => {
                                if (isEditing) {
                                    if (difference) {
                                        this._handleClickOnBack('confirm', '저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?');
                                    } else {
                                        this.confirmCallBackFn();
                                    }
                                } else if (!isEditing && type === 'create') {
                                    this._handleClickOnBack('confirm', '작업한 내용은 저장되지 않습니다. 그대로 나가시겠습니까?');
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
                                            this._handleClickOnCreate('confirm', '새증례를 작성하시겠습니까?')
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
                                            this._handleClickOnUpdate('confirm', '수정하신 내용으로 저장하시겠습니까?');
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
                                        this._handleClickOnPost();
                                        }
                                    }
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
                                                    this._handleModal('confirm', '저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?');
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
                                            }}
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
                                            this.props.modal.showModal('print');
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
                    </div>
                </MobileView>
            </header>
        );
    }
}

export default HeaderEditor;