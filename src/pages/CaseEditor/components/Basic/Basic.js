import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './Basic.module.scss';
import classNames from 'classnames/bind';
// import { 
//     FiArrowLeft, 
//     CsSmartCondition, 
//     CsQuestion, 
//     CsQuestionMenu,
//     CsReportDownload,
//     CsSave,
//     FiSettings,
//     CsTrash,
//     CsSmartDrug,
//     CsTeaching,
//     CsFemale,
//     CsMale,
//     FiFilePlus,
//     FiTrash,
//     FiPlus,
//     FiSave,
//     FiFileText
// } from "react-icons/fi";
// import {
//     AiOutlineSave
// } from 'react-icons/ai';

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
class Basic extends Component {
    state = {value: ''}
    componentWillUnmount() {
        this.props.caseEditorBasic.clear();
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
        // if (type === 'gender') this.props.bloodTestStore.clearForSelector();
    }
    _handleClickGender = (e) => {
        const { dataset } = e.target;
        this.props.caseEditorBasic.changeEditableData(dataset.name, dataset.value);
    }

    render() {
        const {
            title,
            gender,
            age
        } = this.props.caseEditorBasic.editableData;

        return (
            <div className={cx('Basic')}>
                <h5>기본정보</h5>
                <div className={cx('form-wrapper', 'title', 'input')}>
                    <input 
                    name="title" 
                    id="title" 
                    type="text" 
                    autoComplete='off' 
                    placeholder="증례 핵심요약 한줄" 
                    onChange={this._handleChange}
                    value={title}/>
                    <label htmlFor="title">제목</label>
                </div>
                <div className={cx('form-wrapper', 'age-gender', 'label')}>
                    <div className={cx('age', {checked: +age > -1})}>
                        <label className={cx('label-no-input', 'label-age')} htmlFor="age">나이[만]</label>
                        <div className={cx('select-wrapper')}>
                            <select 
                                name="age"
                                value={age} 
                                onChange={this._handleChange}
                            >
                                <option disabled>만 나이를 선택</option>
                                {this.renderOptions()}
                            </select>
                        </div>
                    </div>
                    <div className={cx('gender', {checked: gender !== ''})}>
                        <label 
                        className={cx('label-no-input', 'label-gender')} htmlFor="gender">성별</label>
                        <div className={cx('radio-wrapper')}>
                            <div className={cx('male')}>
                                <input 
                                    autoComplete="off"  
                                    name='gender'
                                    type="radio" 
                                    value="male" 
                                    onChange={this._handleChange} 
                                    checked={gender === 'male'}
                                />
                                <div 
                                    className={cx('icon-wrapper', {checked: gender === 'male'})}
                                    data-value="male"
                                    data-name="gender"
                                    onClick={this._handleClickGender}
                                >
                                    남자
                                </div>
                            </div>
                            <div className={cx('female')}>
                                <input 
                                    autoComplete="off"  
                                    name='gender'
                                    type="radio" 
                                    value="female" 
                                    onChange={this._handleChange} 
                                    checked={gender === 'female'}
                                />
                                <div 
                                    className={cx('icon-wrapper', {checked: gender === 'female'})}
                                    data-value="female"
                                    data-name="gender"
                                    onClick={this._handleClickGender}
                                >
                                    여자
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Basic;