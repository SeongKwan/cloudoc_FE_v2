import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './BasicOptional.module.scss';
import classNames from 'classnames/bind';
import TextareaAutosize from 'react-textarea-autosize';

const cx = classNames.bind(styles);

@withRouter
@inject(
    'auth', 'Case', 'login',
    'user', 'caseEditorBasic'
)
@observer
class BasicOptional extends Component {
    _handleChange = (e) => {
        const { value, name: type } = e.target;
        this.props.caseEditorBasic.changeEditableData(type, value);
    }
    _handleClickGender = (e) => {
        const { dataset } = e.target;
        this.props.caseEditorBasic.changeEditableData(dataset.name, dataset.value);
    }

    render() {
        const {
            pastHistory, familyHistory,
            socialHistory, memo
        } = this.props.caseEditorBasic.editableData;
        const { staticData } = this.props.caseEditorBasic;
        const { type } = this.props;
        const { isEditing } = this.props.Case;

        return (
            <div className={cx('BasicOptional')}>
                <div className={cx('form-wrapper', 'pastHistory', 'input')}>
                    {
                        type === 'create' || isEditing ?
                        <TextareaAutosize 
                            className={cx('textarea')}
                            name="pastHistory" 
                            id="pastHistory" 
                            type="text" 
                            minRows={4}
                            placeholder="과거 질병 이력"  
                            onChange={this._handleChange}
                            value={pastHistory}
                        />
                        : <TextareaAutosize 
                            className={cx('textarea','static')}
                            name="pastHistory" 
                            id="pastHistory" 
                            type="text" 
                            minRows={4}
                            readOnly
                            value={staticData.pastHistory}
                        />
                    }
                    <label htmlFor="pastHistory">과거력</label>
                </div>
                <div className={cx('form-wrapper', 'familyHistory', 'input')}>
                    {
                        type === 'create' || isEditing ?
                        <TextareaAutosize 
                            className={cx('textarea')}
                            name="familyHistory" 
                            id="familyHistory" 
                            type="text" 
                            minRows={4}
                            placeholder="집안 질병 내력"  
                            onChange={this._handleChange}
                            value={familyHistory}
                        />
                        : <TextareaAutosize 
                            className={cx('textarea','static')}
                            name="familyHistory" 
                            id="familyHistory" 
                            type="text" 
                            minRows={4}
                            readOnly
                            value={staticData.familyHistory}
                        />
                    }
                    <label htmlFor="familyHistory">가족력</label>
                </div>
                <div className={cx('form-wrapper', 'socialHistory', 'input')}>
                    {
                        type === 'create' || isEditing ?
                        <TextareaAutosize 
                            className={cx('textarea')}
                            name="socialHistory" 
                            id="socialHistory" 
                            type="text" 
                            minRows={4}
                            placeholder="외부 환경 또는 사회생활"  
                            onChange={this._handleChange}
                            value={socialHistory}
                        />
                        : <TextareaAutosize 
                            className={cx('textarea','static')}
                            name="socialHistory" 
                            id="socialHistory" 
                            type="text" 
                            minRows={4}
                            readOnly
                            value={staticData.socialHistory}
                        />
                    }
                    <label htmlFor="socialHistory">사회력</label>
                </div>
                <div className={cx('form-wrapper', 'memo', 'input')}>
                    {
                        type === 'create' || isEditing ?
                        <TextareaAutosize 
                            className={cx('textarea')}
                            name="memo" 
                            id="memo" 
                            type="text" 
                            minRows={4}
                            placeholder="진찰관련 자유롭게 작성해 주세요" 
                            onChange={this._handleChange}
                            value={memo}
                        />
                        : <TextareaAutosize 
                            className={cx('textarea','static')}
                            name="memo" 
                            id="memo" 
                            type="text" 
                            minRows={4}
                            readOnly
                            value={staticData.memo}
                        />
                    }
                    <label htmlFor="memo">기타 진찰결과</label>
                </div>
            </div>
        );
    }
}

export default BasicOptional;