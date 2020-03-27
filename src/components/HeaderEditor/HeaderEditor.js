import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './HeaderEditor.module.scss';
import classNames from 'classnames/bind';
import { 
    FiArrowLeft, 
    // CsQuestion, 
    FiMessageCircle,
    // FiSettings,
    FiTrash,
    FiPlus,
    FiSave,
    // FiFileText,
    FiHelpCircle,
    FiEdit,
    FiPrinter
    // FiArrowDown
} from "../../lib/react-icons/fi";
import {
    IoMdArrowDropdown
} from 'react-icons/io';
import './HeaderEditor.css';
import { inject, observer } from 'mobx-react';
// import Loader from '../Loader';
import { getLocaleDateWithYMS } from '../../utils/momentHelper';

const cx = classNames.bind(styles);

@withRouter
@inject('Case', 'user', 'caseEditorBasic', 'modal', 'symptom', 'lab', 'diagnosis', 'treatment', 'teaching')
@observer
class HeaderEditor extends Component {
    state = {
        downloadPDF: false,
        focusParent: false
    }
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
            this._toggleOnFocus();
        }
    }

    _handleClickDeleteRecordButton = async () => {
        const { caseId } = this.props.match.params;
        if (window.confirm('한번 삭제 후 되돌릴 수 없습니다. 이 진료를 삭제하시겠습니까?')) {
            if (this.props.Case.currentCaseRecord.length <= 1) {
            return alert(`마지막 진료입니다. 완전삭제를 원하시면, 해당 증례를 삭제해 주세요`);
            }
            if (this.props.Case.currentCaseRecord.length > 1) {
            await this.props.Case.deleteRecordFromCase(caseId)
            return this.props.history.replace(`/case/editor/detail/${caseId}/${0}`);
            }
        }
    }

    _toggleOnFocus = () => {
        this.setState({ focusParent: !this.state.focusParent})
    }


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
                <div className={cx('tool-bar')}>
                    <div className={cx('btn-tool', 'back')} onClick={() => {
                        if (isEditing) {
                            if (difference) {
                                if (window.confirm('저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?')) {
                                    this.props.history.push(`/case`)
                                    this.props.Case.clearIsEditing();
                                } else {
                                    return false;
                                }
                            } else {
                                this.props.history.push(`/case`)
                                this.props.Case.clearIsEditing();
                            }
                        } else {
                            this.props.history.push(`/case`)
                            this.props.Case.clearIsEditing();
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
                                    if (this.props.caseEditorBasic.editableData.title !== '') {
                                        if (window.confirm('증례를 생성하시겠습니까?')) {
                                            this.props.Case.clearIsEditing();
                                            this.props.Case.clearAllEditableData();
                                            this.props.history.push(`/case/editor/create`)
                                        }
                                        return false;
                                    } else {
                                        alert('증례의 제목을 입력해 주세요')
                                    }
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
                                    if (window.confirm('수정하신 내용으로 저장하시겠습니까?')) {
                                        return this.props.Case.updateCase(dateIndex)
                                        .then(res => {
                                            if (res) {
                                                alert('정상적으로 수정되었습니다');
                                                this.props.Case.toggleIsEditing();
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        });
                                    } else {
                                        return false;
                                    }
                                }
                                return false;
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
                                if (this.props.caseEditorBasic.editableData.title !== '') {
                                        if (window.confirm('증례를 생성하시겠습니까?')) {
                                            this.props.Case.postCase();
                                            this.props.Case.clearIsEditing();
                                            this.props.history.push(`/case`);
                                        }
                                        return false;
                                    } else {
                                        alert('증례의 제목을 입력해 주세요');
                                    }
                                    
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
                                            if (window.confirm('저장되지 않은 내용이 있습니다. 그대로 나가시겠습니까?')) {
                                                this.props.Case.toggleIsEditing(dateIndex);
                                            } else {
                                                return false;
                                            }
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
                                        this.props.modal.showModal('caseDelete');
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
                                    window.alert('현재 준비중입니다.')
                                    
                                }}
                            >
                                <FiMessageCircle />
                                <div className={cx('label')}>질문</div>
                            </div>
                                <div 
                                className={cx('btn-tool', 'question')}
                                onClick={() => {
                                    this.setState({downloadPDF: true});
                                    this.props.modal.showModal('print', true);
                                }}
                            >
                                <FiPrinter />
                                <div className={cx('label')}>PDF</div>
                            </div>
                        </>
                        
                    }

                    <div className={cx('btn-tool', 'qna')} onClick={() => {alert('현재 준비중입니다.')}}>
                        <FiHelpCircle />
                        <div className={cx('label')}>도움</div>
                    </div>
                </div>
                {
                        type === 'detail' &&
                        <div 
                            ref={(ref) => {
                                this.recordDate = ref;
                            }}
                            className={cx('record-date', {focus: this.state.focusParent})}>
                            <div className={cx('selected-date')} 
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
                                                    if (window.confirm('저장되지 않은 내용이 있습니다. 저장하고 다른 진료일자로 바꾸시겠습니까?')) {
                                                    return this.props.Case.updateCase(dateIndex)
                                                        .then(res => {
                                                            if (res) {
                                                                alert('정상적으로 수정되었습니다')
                                                            }
                                                        })
                                                        .then(() => {
                                                        this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
                                                        })
                                                        .catch(err => {
                                                            console.log(err)
                                                        });
                                                    }
                                                    return this.props.history.push(`/case/editor/detail/${caseId}/${i}`);
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
            </header>
        );
    }
}

export default HeaderEditor;