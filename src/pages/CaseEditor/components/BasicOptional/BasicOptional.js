import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './BasicOptional.module.scss';
import classNames from 'classnames/bind';
import TextareaAutosize from 'react-textarea-autosize';

const cx = classNames.bind(styles);

@withRouter
@inject(
    'auth',
    'Case',
    'login',
    'user', 
    'caseEditorBasic'
)
@observer
class BasicOptional extends Component {
    state = {value: ''}
    componentWillUnmount() {
        this.props.caseEditorBasic.clearOptional();
    }
    handleChange = (value) => {
        this.setState({value})
    }
    renderOptions = () => {
        let arrNumber = [];
        for(var i=0;i<121;i++){
            arrNumber[i]=i;
        }

        return arrNumber.map((num, i) => {
            return <option key={i} value={i}>{i} 세</option>
        });
    }
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
            pastHistory,
            familyHistory,
            socialHistory,
            memo
        } = this.props.caseEditorBasic.editableData;

        return (
            <div className={cx('BasicOptional')}>
                <div className={cx('form-wrapper', 'pastHistory', 'input')}>
                    <input 
                    name="pastHistory" 
                    id="pastHistory" 
                    type="text" 
                    autoComplete='off' 
                    placeholder="과거 질병 이력" 
                    onChange={this._handleChange}
                    value={pastHistory}/>
                    <label htmlFor="pastHistory">과거력</label>
                </div>
                <div className={cx('form-wrapper', 'familyHistory', 'input')}>
                    <input 
                    name="familyHistory" 
                    id="familyHistory" 
                    type="text" 
                    autoComplete='off' 
                    placeholder="집안 질병 내력" 
                    onChange={this._handleChange}
                    value={familyHistory}/>
                    <label htmlFor="familyHistory">가족력</label>
                </div>
                <div className={cx('form-wrapper', 'socialHistory', 'input')}>
                    <input 
                    name="socialHistory" 
                    id="socialHistory" 
                    type="text" 
                    autoComplete='off' 
                    placeholder="외부 환경 또는 사회생활" 
                    onChange={this._handleChange}
                    value={socialHistory}/>
                    <label htmlFor="socialHistory">사회력</label>
                </div>
                <div className={cx('form-wrapper', 'memo', 'input')}>
                    <TextareaAutosize 
                    className={cx('textarea')}
                    name="memo" 
                    id="memo" 
                    type="text" 
                    minRows={4}
                    placeholder="진찰관련 자유롭게 작성해 주세요" 
                    onChange={this._handleChange}
                    value={memo}/>
                    <label htmlFor="memo">기타 진찰결과</label>
                </div>
            </div>
        );
    }
}

export default BasicOptional;