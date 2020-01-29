import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './HeaderEditor.module.scss';
import classNames from 'classnames/bind';
import { 
    FiArrowLeft, 
    
    // CsQuestion, 
    CsQuestionMenu,
    FiSettings,
    FiTrash,
    FiPlus,
    FiSave,
    FiFileText,
    FiHelpCircle
} from "react-icons/fi";
import './HeaderEditor.css';
import { inject, observer } from 'mobx-react';

const cx = classNames.bind(styles);

@withRouter
@inject('Case')
@observer
class HeaderEditor extends Component {

    render() {
        const { type } = this.props;

        return (
            <header className={cx('HeaderEditor')}>
                <div className={cx('tool-bar')}>
                    <div className={cx('btn-tool', 'back')} onClick={() => {this.props.history.goBack();}}>
                        <FiArrowLeft />
                        <div className={cx('label')}>뒤로</div>
                    </div>
                    {
                        type === "detail" &&
                        <div className={cx('btn-tool', 'create')}>
                            <FiPlus />
                            <div className={cx('label')}>새증례</div>
                        </div>
                    }
                    <div 
                        className={cx('btn-tool', 'save')} 
                        onClick={() => {
                                this.props.Case.postCase();
                                this.props.history.push(`/case`)
                            }
                        }
                    >
                        <FiSave />
                        <div className={cx('label')}>
                            {
                                type === "detail" ? "저장" : "만들기"
                            }
                        </div>
                    </div>
                    {
                        type === "detail" &&
                        <>
                            <div className={cx('btn-tool', 'trash')}>
                                <FiTrash />
                                <div className={cx('label')}>삭제</div>
                            </div>
                            <div className={cx('btn-tool', 'question')}>
                                <FiHelpCircle />
                                <div className={cx('label')}>질문</div>
                            </div>
                        </>
                    }
                    <div className={cx('btn-tool', 'report')}>
                        <FiFileText />
                        <div className={cx('label')}>리포트</div>
                    </div>
                </div>
                <div className={cx('menu')}>
                    <div className={cx('btn-tool', 'qna')}>
                        <CsQuestionMenu />
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