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
    FiFileText,
    FiHelpCircle,
    FiEdit,
    // FiArrowDown
} from "../../lib/react-icons/fi";
import { TiDocumentAdd, TiDocumentDelete } from 'react-icons/ti';
import './HeaderEditor.css';
import { inject, observer } from 'mobx-react';
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import PrintPage from '../../pages/PrintPage';
import { getLocaleDateWithYMS } from '../../utils/momentHelper';
// import Loader from '../Loader';

const cx = classNames.bind(styles);

@withRouter
@inject('Case', 'user', 'caseEditorBasic', 'modal')
@observer
class HeaderEditor extends Component {
    state = {
        downloadPDF: false
    }

    componentWillUnmount() {
        this.setState({ downloadPDF: false });
    }

    _handleClickAddRecordButton = async () => {
        console.log('click')
        const { caseId } = this.props.match.params;
        const lengthOfRecord = this.props.Case.currentCase.record.length;
        const createdDate =  getLocaleDateWithYMS(Date.now());
        const lastDate = this.props.Case.currentCase.record[lengthOfRecord - 1].createdDate;
        let shortLastDate = getLocaleDateWithYMS(lastDate);
        console.log(createdDate, shortLastDate)
        if (createdDate === shortLastDate) {
            return alert('동일날짜 진료가 이미 있습니다.');
        }
        await this.props.Case.addNewRecordToCase(caseId)
        .then(res => {
            this.props.history.replace(`/case/editor/detail/${caseId}/${0}`);
            this.props.Case.toggleIsEditing(0);
        })
        .catch(error => {
            console.log(error);
        });
    
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


    render() {
        const { type } = this.props;
        const { isEditing, currentCase } = this.props.Case;
        const { dateIndex } = this.props.match.params;
        
        if (type === "detail") {
            if (this.props.Case.currentCase === null) {
                return false;
            }
        }

        return (
            <header className={cx('HeaderEditor')}>
                <div className={cx('tool-bar')}>
                    <div className={cx('btn-tool', 'back')} onClick={() => {
                        this.props.history.push(`/case`)
                        this.props.Case.clearIsEditing();
                        }}>
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
                        type === "detail" && !isEditing &&
                        <div 
                            className={cx('btn-tool', 'create')}
                            onClick={this._handleClickAddRecordButton}
                        >
                            <TiDocumentAdd />
                            <div className={cx('label')}>새진료</div>
                        </div>
                    }
                    {
                        type === "detail" && isEditing &&
                        <div 
                            className={cx('btn-tool', 'save')} 
                            onClick={() => {
                                    this.props.Case.updateCase(dateIndex)
                                    .then(res => {
                                        if (res) {
                                            alert('정상적으로 수정되었습니다')
                                            this.props.Case.toggleIsEditing();
                                        }
                                        
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    });
                                }
                            }
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
                                    this.props.Case.toggleIsEditing(dateIndex);
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
                                onClick={this._handleClickDeleteRecordButton}
                            >
                                <TiDocumentDelete />
                                <div className={cx('label')}>진료삭제</div>
                            </div>
                            <div 
                                className={cx('btn-tool', 'trash')}
                                onClick={() => {
                                        if (window.confirm(`이 증례[${currentCase.title}]를(을) 삭제하시겠습니까?`)) {
                                            this.props.Case.deleteCase(this.props.Case.currentCase._id);
                                            this.props.history.push(`/case`);
                                        }
                                    }
                                }
                            >
                                <FiTrash />
                                <div className={cx('label')}>증례삭제</div>
                            </div>


                            <div 
                                className={cx('btn-tool', 'question')}
                                onClick={() => {
                                    this.props.history.push(`/report`)
                                }}
                            >
                                <FiMessageCircle />
                                <div className={cx('label')}>질문</div>
                            </div>
                        </>
                    }

                    {
                        type === "detail" && !isEditing &&
                        <div 
                            className={cx('btn-tool', 'question')}
                            onClick={() => {
                                this.setState({downloadPDF: true});
                                this.props.modal.showModal('print');
                            }}
                        >
                            <FiFileText />
                            <div className={cx('label')}>리포트</div>
                        </div>
                    }

                    




                <div className={cx('btn-tool', 'qna')} onClick={() => {alert('현재 준비중입니다.')}}>
                    <FiHelpCircle />
                    <div className={cx('label')}>도움</div>
                </div>
                {/* <div className={cx('btn-tool', 'settings')}>
                    <FiSettings />
                    <div className={cx('label')}>메뉴</div>
                </div> */}
                </div>
            </header>
        );
    }
}

export default HeaderEditor;