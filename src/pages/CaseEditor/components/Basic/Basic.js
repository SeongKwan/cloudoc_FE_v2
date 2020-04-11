import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './Basic.module.scss';
import classNames from 'classnames/bind';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

@withRouter
@inject(
    'auth',
    'Case',
    'login',
    'user', 
    'caseEditorBasic',
    'lab',
    'modal'
)
@observer
class Basic extends Component {
    state = {value: ''}
    componentWillUnmount() {
        this.props.caseEditorBasic.clear();
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

        this._handleModal('confirm', '성별을 바꾸면 혈액검사가 초기화 됩니다. 바꾸시겠습니까?');
        this.props.modal.setFunction('confirm', () => {
            this.props.lab.clearForSelector();
            this.props.caseEditorBasic.changeEditableData(dataset.name, dataset.value);
        })
    }

    _handleModal = (type, message) => {
        this.props.modal.showModal(type, true);
        this.props.modal.setMessage(type, message);
    }

    render() {
        const {
            title,
            gender,
            age
        } = this.props.caseEditorBasic.editableData;
        const { staticData } = this.props.caseEditorBasic;
        const { type } = this.props;
        const { isEditing, currentCaseDetail } = this.props.Case;
        const { updatedDate } = currentCaseDetail;

        return (
            <div className={cx('Basic', {view: (!isEditing && type === 'detail')})}>
                <h5>
                    <span>기본정보</span>
                    {
                        type === 'detail' && updatedDate !== 'default' &&
                        <span className={cx('updated-date')}>{`최근수정일시 - ${updatedDate}`}</span>
                    }
                </h5>
                <div className={cx('form-wrapper', 'title', 'input')}>
                    {
                        type === 'create' || isEditing ?
                        <input 
                            name="title" 
                            autoFocus
                            id="title" 
                            type="text" 
                            autoComplete='off' 
                            placeholder="증례 핵심요약 한줄" 
                            onChange={this._handleChange}
                            value={title}
                        />
                        : <input 
                            name="title" 
                            id="title" 
                            type="text" 
                            readOnly
                            className={cx('static')}
                            value={staticData.title}
                        />
                    }
                    <label htmlFor="title">제목</label>
                </div>
                <div className={cx('form-wrapper', 'age-gender', 'label')}>
                    <div className={cx('age', {checked: +age > -1})}>
                        <label className={cx('label-no-input', 'label-age')} htmlFor="age">나이[만]</label>
                        {
                            type === 'create' || isEditing ?
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
                            : <div className={cx('age-wrapper')}>
                                {staticData.age} 세
                            </div>
                        }
                    </div>
                    <div className={cx('gender', {checked: gender !== ''})}>
                        <label 
                        className={cx('label-no-input', 'label-gender')} htmlFor="gender">성별</label>
                        <div className={cx('radio-wrapper')}>
                            {
                                type === 'create' || isEditing ?
                                <>
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
                                            onClick={(e) => {
                                                if (gender === 'female') {
                                                    this._handleClickGender(e);
                                                }
                                            }}
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
                                            onClick={(e) => {
                                                if (gender === 'male') {
                                                    this._handleClickGender(e);
                                                }
                                            }}
                                        >
                                            여자
                                        </div>
                                    </div>
                                </>
                                : <div className={cx('gender-wrapper')}>{staticData.gender === "male" ? '남자' : '여자'}</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Basic;