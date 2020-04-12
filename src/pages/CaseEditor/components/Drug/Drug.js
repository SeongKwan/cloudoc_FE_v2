import React, { Component } from 'react';
import styles from './Drug.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import { FiPlus } from '../../../../lib/react-icons/fi';
import { FaTrash } from '../../../../lib/react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';
import $ from 'jquery';
import SearchBar from './components/SearchBar/SearchBar';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'treatment', 'drugListItem', 'drugListForInput')
@observer
class Drug extends Component {
    state = { keyword: '' }
    
    _handleClickListItem = (name) => {
        this.setState({keyword: name });
        this._focusListItem();
    }
    _handleChange = (e) => {
        const { value, name: type } = e.target;
        this.props.treatment.handleChangeTretment(type, value);
    }
    _handleChangeFormula = (e) => {
        const { value, name, dataset } = e.target;
        this.props.treatment.handleChange(dataset.index, name, value);
    }
    _focusListItem = () => {
        $('#keyword-drug').focus();
    }

    _deleteFormula = (i) => {
        this.props.treatment.deleteTreatment(i);
    }

    _handleClickOnAddFormula = () => {
        const { editableData } = this.props.treatment;
        const { length } = editableData;

        if (editableData.length <= 0) {
            this.props.treatment.addDrug();
            return setTimeout(() => {$(`#herb-name-${0}`).focus();}, 100)
        } else {
            if (editableData[length - 1]['dose'] > 0 && editableData[length - 1]['herbName'] !== '') {
                this.props.treatment.addDrug();
                return setTimeout(() => {$(`#herb-name-${length}`).focus();}, 100)
            } else {
                alert('약재명 또는 수량이 입력되지 않았습니다');
            }
        }
    }

    render() {
        const { isEditing } = this.props.Case;
        const { type } = this.props;
        const { editableData, editableDataForTreatment, staticData, staticDataForTreatment } = this.props.treatment;
        const {
            drugName,
            guide,
            caution,
            description
        } = editableDataForTreatment;

        return (
            <div id="case-editor-drug" className={cx('Drug', {view: !isEditing})}>
                <h5>처방</h5>
                {
                    (type === "create" || isEditing) &&
                    <SearchBar />
                }
                <div className={cx('wrapper', 'drug-wrapper')}>
                    <ul>
                        {
                            (type === "create" || isEditing) ?
                            <li className={cx('')}>
                                <div className={cx('form-wrapper', 'drug-name', 'input')}>
                                    <input 
                                        className={cx('name')}
                                        name="name" 
                                        id={`drug-name`} 
                                        type="text" 
                                        placeholder="처방" 
                                        readOnly
                                        onClick={()=>{this._handleClickListItem(drugName)}}
                                        value={drugName || ''}
                                    />
                                    <label htmlFor={`drug-name`}>처방명</label>
                                </div>
                                <div className={cx('wrapper', 'formula-wrapper')}>
                                    <ul>
                                        {
                                            editableData.map((formula, i) => {
                                                const { herbName, dose } = formula;
                                                return <li key={i} className={cx('')}>
                                                    <div className={cx('form-wrapper', 'herb-name', 'input')}>
                                                        <input 
                                                            autoComplete="off"
                                                            className={cx('name')}
                                                            name="herbName" 
                                                            id={`herb-name-${i}`} 
                                                            type="text" 
                                                            placeholder="약초명" 
                                                            onChange={this._handleChangeFormula}
                                                            data-index={i}
                                                            value={herbName || ''}
                                                            onKeyDown={(e) => {
                                                                if (e.keyCode === 13) {
                                                                    $(`#formula-dose-${i}`).focus();
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`herb-name-${i}`}>약초명</label>
                                                    </div>
                                                    <div className={cx('input', 'form-wrapper', 'formula-dose')}>
                                                        <input 
                                                            data-index={i}
                                                            className={cx('dose')}
                                                            name="dose" 
                                                            id={`formula-dose-${i}`} 
                                                            type="number" 
                                                            autoComplete='off' 
                                                            placeholder="수량[g/일]" 
                                                            onChange={this._handleChangeFormula}
                                                            value={dose || ''}
                                                            onKeyDown={(e) => {
                                                                let { length } = editableData;
                                                                let enter = e.keyCode === 13;
                                                                if (enter && (i < length - 1)) {
                                                                    return $(`#herb-name-${i + 1}`).focus();
                                                                }
                                                                if (enter && (i === length - 1)) {
                                                                    if (editableData[length - 1]['dose'] > 0 && editableData[length - 1]['herbName'] !== '') {
                                                                        this._handleClickOnAddFormula();
                                                                        return setTimeout(() => {$(`#herb-name-${i + 1}`).focus();}, 100);
                                                                    } else {
                                                                        alert('약재명 또는 수량이 입력되지 않았습니다');
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`formula-dose-${i}`}>수량[g/일]</label>
                                                    </div>
                                                    <div className={cx('trash')}>
                                                        <FaTrash onClick={() => {this._deleteFormula(i);}}/>
                                                    </div>
                                                </li>
                                            })
                                        }
                                        {
                                            (type === "create" || isEditing) &&
                                            <button className={cx('btn-add-formula')} onClick={this._handleClickOnAddFormula}>약재추가<FiPlus /></button>
                                        }
                                    </ul>
                                </div>
                                <div className={cx('form-wrapper', 'description', 'input')}>
                                    <TextareaAutosize 
                                        className={cx('textarea')}
                                        name="description" 
                                        id="description" 
                                        type="text" 
                                        minRows={3}
                                        placeholder="처방 상세설명란"
                                        onChange={this._handleChange}
                                        value={description}
                                    />
                                    <label htmlFor="caution">처방설명</label>
                                </div>
                                <div className={cx('form-wrapper', 'guide', 'input')}>
                                    <TextareaAutosize 
                                        className={cx('textarea')}
                                        name="guide" 
                                        id="guide" 
                                        type="text" 
                                        minRows={3}
                                        placeholder="처방의 올바른 복용방법"
                                        onChange={this._handleChange}
                                        value={guide}
                                    />
                                    <label htmlFor="guide">복약법</label>
                                </div>
                                <div className={cx('form-wrapper', 'caution', 'input')}>
                                    <TextareaAutosize 
                                        className={cx('textarea')}
                                        name="caution" 
                                        id="caution" 
                                        type="text" 
                                        minRows={3}
                                        placeholder="복용시 주의사항"
                                        onChange={this._handleChange}
                                        value={caution}
                                    />
                                    <label htmlFor="caution">주의사항</label>
                                </div>
                            </li>
                            : 
                            <li className={cx('static')}>
                                <div className={cx('form-wrapper', 'drug-name', 'input')}>
                                    <input 
                                        className={cx('name', 'static')}
                                        name="name" 
                                        id={`drug-name`} 
                                        type="text" 
                                        readOnly
                                        value={staticDataForTreatment.drugName || ''}
                                    />
                                    <label htmlFor={`drug-name`}>처방명</label>
                                </div>
                                <div className={cx('wrapper', 'formula-wrapper')}>
                                    <ul>
                                        {
                                            staticData.map((formula, i) => {
                                                const { herbName, dose } = formula;
                                                return <li key={i} className={cx('')}>
                                                    <div className={cx('form-wrapper', 'herb-name', 'input')}>
                                                        <input 
                                                            className={cx('name', 'static')}
                                                            name="herbName" 
                                                            id={`herb-name-${i}`} 
                                                            type="text" 
                                                            readOnly
                                                            value={herbName || ''}
                                                        />
                                                        <label htmlFor={`herb-name-${i}`}>약초명</label>
                                                    </div>
                                                    <div className={cx('input', 'dose', 'form-wrapper')}>
                                                        <input 
                                                            className={cx('dose','static')}
                                                            name="dose" 
                                                            id={`formula-dose-${i}`} 
                                                            type="number" 
                                                            readOnly
                                                            value={dose || ''}
                                                        />
                                                        <label htmlFor={`formula-dose-${i}`}>수량[g/일]</label>
                                                    </div>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className={cx('form-wrapper', 'description', 'input')}>
                                    <TextareaAutosize 
                                        className={cx('textarea', 'static')}
                                        name="description" 
                                        id="description" 
                                        type="text" 
                                        minRows={3}
                                        readOnly
                                        value={staticDataForTreatment.description}
                                    />
                                    <label htmlFor="caution">처방설명</label>
                                </div>
                                <div className={cx('form-wrapper', 'guide', 'input')}>
                                    <TextareaAutosize 
                                        className={cx('textarea', 'static')}
                                        name="guide" 
                                        id="guide" 
                                        type="text" 
                                        minRows={3}
                                        readOnly
                                        value={staticDataForTreatment.guide}
                                    />
                                    <label htmlFor="guide">복약법</label>
                                </div>
                                <div className={cx('form-wrapper', 'caution', 'input')}>
                                    <TextareaAutosize 
                                        className={cx('textarea', 'static')}
                                        name="caution" 
                                        id="caution" 
                                        type="text" 
                                        minRows={3}
                                        readOnly
                                        value={staticDataForTreatment.caution}
                                    />
                                    <label htmlFor="caution">주의사항</label>
                                </div>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Drug;