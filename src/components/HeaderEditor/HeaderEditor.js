import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './HeaderEditor.module.scss';
import classNames from 'classnames/bind';
import { 
    FiArrowLeft, 
    
    // CsQuestion, 
    FiMessageCircle,
    FiSettings,
    FiTrash,
    FiPlus,
    FiSave,
    FiFileText,
    FiHelpCircle,
    FiEdit
} from "../../lib/react-icons/fi";
import './HeaderEditor.css';
import { inject, observer } from 'mobx-react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrintPage from '../../pages/PrintPage';
import { getLocaleDateWithYMS } from '../../utils/momentHelper';

const cx = classNames.bind(styles);

@withRouter
@inject('Case', 'user', 'caseEditorBasic')
@observer
class HeaderEditor extends Component {

    render() {
        const { type } = this.props;
        const { isEditing, currentCase } = this.props.Case;
        
        if (type === "detail") {
            if (this.props.Case.currentCase === null) {
                return false;
            }
        }

        return (
            <header className={cx('HeaderEditor')}>
                <div className={cx('tool-bar')}>
                    <div className={cx('btn-tool', 'back')} onClick={() => {
                        this.props.history.goBack();
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
                        type === "detail" && isEditing &&
                        <div 
                            className={cx('btn-tool', 'save')} 
                            onClick={() => {
                                    this.props.Case.updateCase()
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
                                    this.props.Case.toggleIsEditing();
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
                                        if (window.confirm(`이 증례[${currentCase.title}]를(을) 삭제하시겠습니까?`)) {
                                            this.props.Case.deleteCase(this.props.Case.currentCase._id);
                                            this.props.history.push(`/case`)
                                        }
                                    }
                                }
                            >
                                <FiTrash />
                                <div className={cx('label')}>삭제</div>
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
                        this.props.Case.currentCase !== undefined && type === "detail" && !isEditing &&
                        <PDFDownloadLink 
                            className={cx('btn-tool', 'report')}
                            document={<PrintPage user={this.props.user.currentUser} currentCase={this.props.Case.currentCase} />}
                            fileName={`${this.props.Case.currentCase.title}_${getLocaleDateWithYMS(this.props.Case.currentCase.created_date)}.pdf`}
                            style={{
                                textDecoration: "none"
                            }}
                        >
                            <FiFileText />
                            
                            <div className={cx('label')}>리포트</div>
                        </PDFDownloadLink>
                    }





                </div>
                <div className={cx('menu')}>
                    <div className={cx('btn-tool', 'qna')}>
                        <FiHelpCircle />
                        <div className={cx('label')}>도움</div>
                    </div>
                    <div className={cx('btn-tool', 'settings')}>
                        <FiSettings />
                        <div className={cx('label')}>메뉴</div>
                    </div>
                </div>
            </header>
        );
    }
}

export default HeaderEditor;