import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './Mobile.module.scss';
import { 
    FiMenu, FiPlus, FiSave, FiEdit,
    FiTrash, FiPrinter, FiArrowLeft, 
    FiHelpCircle, FiMessageCircle,
} from "../../../../lib/react-icons/fi";
import { MobileView } from "react-device-detect";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

@withRouter
@inject('Case')
@observer
class Mobile extends Component {
    state = { downloadPDF: false, open: false }
    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        this.setState({ downloadPDF: false });
        document.removeEventListener('mousedown', this._handleClickOutside);
    }
    _handleClickOutside = (event) => {
        if (this.toolbar && !this.toolbar.contains(event.target) && this.state.open) {
            if (!this.menu.contains(event.target)) {
                return this.setState({open: false})
            }
        }
    }
    render() {
        const { type, difference } = this.props;
        const { isEditing } = this.props.Case;
        
        if (type === "detail") {
            if (this.props.Case.currentCase === null) {
                return false;
            }
        }

        return (
            <>
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
                                        this.props.back('confirm', '저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?');
                                    } else {
                                        this.props.callBackFn();
                                    }
                                } else if (!isEditing && type === 'create') {
                                    this.props.back('confirm', '작업한 내용은 저장되지 않습니다. 그대로 나가시겠습니까?');
                                } else {
                                    this.props.callBackFn();
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
                                            this.props.create('confirm', '새증례를 작성하시겠습니까?')
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
                                            this.props.update('confirm', '수정하신 내용으로 저장하시겠습니까?');
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
                                        this.props.post();
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
                                                    this.props.handleModal('confirm', '저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?');
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
            </>
        );
    }
}

export default Mobile;