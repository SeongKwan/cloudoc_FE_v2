import React, { Component } from 'react';
import styles from './Lab.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import LabBar from '../../../../components/LabBar/LabBar';
import _ from 'lodash';
import { FiAlertCircle } from '../../../../lib/react-icons/fi';
import { FaTrash, FaSortAlphaUp, FaSortAlphaDown, FaSortNumericDown, FaSortNumericUp } from '../../../../lib/react-icons/fa';
import ReactTooltip from 'react-tooltip';
import $ from 'jquery';
import './Lab.css';

const cx = classNames.bind(styles);

@inject('Case', 'caseEditorBasic', 'search', 'lab', 'labListItem', 'labListForInput')
@observer
class Lab extends Component {
    state = {
        openAddManual: false
    }
    componentDidMount() {
        this.props.lab.setLabCategories();
    }

    componentWillUnmount() {
        this.props.lab.clear();
        this.props.lab.clearSortType();
        this.props.lab.clearForSelector();
    }

    handleOnClickPasteButton = () => {
        this.props.lab.toggleReadyForPaste();
    }

    _onChange = (e) => {
        if (e.target.files.length === 0) {
            return this.props.lab.clearExcel();
        }
        return this.props.lab.changeExcelFile(e.target.files[0]);
    }

    handleDeleteBloodTest = (selectedIndex) => {
        this.props.lab.deleteBloodTest(selectedIndex);
    }

    handleDeleteAll = () => {
        this.props.lab.clear();
        this.props.lab.clearSelectedLabCategory();
    }

    _deleteBloodTest = (index) => {
        if (index !== undefined
        ) {
            this.props.lab.deleteBloodTest(index);
        }
    }

    _extractCategory = () => {
        const { isEditing } = this.props.Case;
        const { type } = this.props;

        const { editableData, staticData } = this.props.lab;

        let labs = (type === "create" || isEditing) ? editableData : staticData;
        if (labs.length > 0) {
            let categories = [];
            let array = _.uniqBy(labs, 'category');
            array.forEach((item, i) => {
                categories[i] = item.category;
            });
            
            return _.sortBy(categories)
        } else return false;
    }

    handleClickOnSort = (name) => {
        const { sortType } = this.props.lab;
        let type, direction;

        if (name === 'name') {
            type = 'name'
            if (sortType.name !== '') {
                if (sortType.name === 'asc') {
                    direction = 'desc';
                }
                if (sortType.name === 'desc') {
                    direction = 'asc';
                }
            } else if (sortType.name === '') {
                direction = 'asc';
            }
        } else if (name === 'value') {
            type = 'value'
            if (sortType.value !== '') {
                if (sortType.value === 'asc') {
                    direction = 'desc';
                }
                if (sortType.value === 'desc') {
                    direction = 'asc';
                }
            } else if (sortType.value === '') {
                direction = 'asc';
            }
        }
        this.props.lab.changeSortType(type, direction);
    }

    _renderResults = () => {
        const { isEditing } = this.props.Case;
        const { type } = this.props;

        const { editableData, staticData, sortType } = this.props.lab;
        let labs = (type === "create" || isEditing) ? editableData : staticData;
        
        const categories = this._extractCategory();
        
        let dividedLabByCategory = [];
        let categorizedLab = [];

        

        categories.forEach((category, i) => {
            dividedLabByCategory[i] = labs.filter(item => {
                return item.category === category;
            })
        });

        return dividedLabByCategory.map((arr, index) => {
            let sortedArr = [];
                    
            if (sortType.name !== '') {
                if (sortType.name === 'asc') {
                    sortedArr = _.sortBy(arr, 'name');
                } else {
                    sortedArr = _.sortBy(arr, 'name').reverse();
                }
            }
            if (sortType.value !== '') {
                if (sortType.value === 'asc') {
                    sortedArr = _.sortBy(arr, ['stateOrder', 'name']);
                } else {
                    sortedArr = _.sortBy(arr, ['stateOrder', 'name']).reverse();
                }
            }


            sortedArr.forEach((lab, i) => {
                return categorizedLab.push(lab);
            })
            
            return <ul key={index} style={{marginBottom: '4rem'}}>
                <h6 className={cx('category-title')}>
                    <span>[{categories[index]}]</span>
                </h6>
                
                {
                    sortedArr.map((lab, i) => {
                        
                        const {
                            originalIndex,
                            name,
                            unit,
                            value,
                            refMin,
                            refMax,
                            optMin,
                            optMax,
                            alertMin,
                            alertMax,
                            alertMessage,
                            state,
                            description,
                            
                        } = lab;
                        let showAlert = (state === '매우 낮음' && !!alertMin) || (state === '매우 높음' && !!alertMax);
                        let alertContents;
                        if (!!description) {
                            alertContents = description;
                        } else if (!!!description && alertMessage) {
                            alertContents = alertMessage;
                        } else {
                            alertContents = '-'
                        }
                        
                        
                        return <li key={i}>
                            
                            <div className={cx('lab-name-unit')}>
                                <div className={cx('name')}>{name}</div>
                                <div className={cx('unit')}>[{unit}]</div>
                                {
                                    showAlert &&
                                    <div className={cx('alert-icon', {high: state === '매우 높음'}, {low: state === '매우 낮음'})}>
                                        <div
                                            className={cx('icon-box')}
                                            ref={ref => this.labAlert = ref}
                                            data-tip={alertContents}
                                            data-for={`tooltip-lab-alert-${index}-${i}`}
                                            onFocus={() => { ReactTooltip.show(this.labAlert); }}
                                            onBlur={() => { ReactTooltip.hide(this.labAlert); }}
                                        >
                                            <FiAlertCircle />
                                        </div>
                                    
                                    {
                                        (description !== '' || showAlert) &&
                                        <ReactTooltip className="custom-tooltip" place="right" effect="solid" id={`tooltip-lab-alert-${index}-${i}`} />
                                    }
                                    </div>
                                }
                            </div>
                            <div className={cx('bar-wrapper')}>
                                <LabBar 
                                    changeValue={this.handleChangeValueLabBar}
                                    isEditing={(type === "create" || isEditing)}
                                    index={originalIndex}
                                    labs={dividedLabByCategory}
                                    categoryIndex={index}
                                    inputIndex={i}
                                    value={value}
                                    unit={unit}
                                    refMin={refMin}
                                    refMax={refMax}
                                    optMin={optMin}
                                    optMax={optMax}
                                    alertMin={alertMin}
                                    alertMax={alertMax}
                                />
                            </div>
                            {
                                (type === "create" || isEditing) &&
                                <div className={cx('trash')}>
                                    <FaTrash onClick={(e) => {this._deleteBloodTest(originalIndex);}}/>
                                </div>
                            }
                        </li>
                    })
                }
            </ul>
        })
    }

    handleChangeValueLabBar = (index, value) => {
        console.log(index, value)
        console.log(JSON.parse(JSON.stringify(this.props.lab.editableData)))
        const {
            refMin,
            refMax,
            optMin,
            optMax,
            alertMin,
            alertMax
        } = this.props.lab.editableData[index];
        
        this.props.lab.getState(index, refMin, refMax, optMin, optMax, alertMin, alertMax, +value);
        this.props.lab.handleChangeLabBar(index, value);
    }

    _handleClickOnAddLab = () => {
        const { name, value } = this.props.lab.addLab;
        if (name !== '' && value !== '') {
            this.props.lab.addBloodTest();
            return this.props.lab.clearAddLab();
        } else {
            alert('검사명 또는 결과값이 입력되지 않았습니다');
        }
    }

    _handleChangeAddLab = (e) => {
        const { value, name } = e.target;

        
        if (name === 'name' && value !== '') {
            let lab = e.target.options[e.target.selectedIndex].dataset.lab;
            this.props.lab.setAddLab(JSON.parse(lab));
            $('#lab-value').focus();
        } else if (name === 'name' && value === '') {
            this.props.lab.clearAddLabSelectLab();
        }

        this.props.lab.handleChangeAddLab(name, value);

    }

    renderOptionsCategory = () => {
        return this.props.lab.optionsCategory.map((category, i) => {
            return <option key={i} value={category}>{category}</option>
        });
    }

    renderOptionsName = () => {
        return this.props.lab.optionsName.map((lab, i) => {
            return <option data-lab={JSON.stringify(lab)} key={i} value={lab.name}>{`${lab.name}`}</option>
        });
    }
    handleOnClickAddManual = () => {
        this.setState({openAddManual: !this.state.openAddManual});
    }

    render() {
        const { isEditing } = this.props.Case;
        const { type } = this.props;
        const { editableData, staticData, addLab, labCategories, selectedLabCategory, sortType } = this.props.lab;
        let labs = (type === "create" || isEditing) ? editableData : staticData;
        let { length } = labs;

        let disabledButton = length <= 0;
        let dataTip = addLab.selectLab !== null ? `${addLab.selectLab['unit']}` : ''
        

        return (
            <div className={cx('Lab')}>
                <div className={cx('title-wrapper')}>
                    <h5>혈액검사</h5>
                    {
                        (type === "create" || isEditing) &&
                        <>
                            <div className={cx('text','button-paste')} onClick={this.handleOnClickPasteButton} id="paste">결과붙여넣기</div>
                            <button className={cx('add-manual', {open: this.state.openAddManual})} onClick={this.handleOnClickAddManual}>{this.state.openAddManual ? '입력닫기' : '직접입력'}</button>
                            <button disabled={disabledButton} className={cx('delete-all', {disabled: disabledButton})} onClick={this.handleDeleteAll}>결과삭제</button>
                        </>
                    }
                </div>
                { (type === "create" || isEditing) &&
                <div className={cx('category-container')}>
                    <ul className={cx('select-list')}>
                    {   (selectedLabCategory !== null || selectedLabCategory !== undefined) &&
                        labCategories.map((category, i) => {
                            return <li className={cx('select-list-item')} key={i}>
                                <label>
                                    <div>{category.label}</div>
                                    <input 
                                        type="checkbox"
                                        value={category.value}
                                        checked={selectedLabCategory[i].value === category.value}
                                        onChange={(e) => {
                                            const { gender } = this.props.caseEditorBasic.editableData;

                                            this.props.lab.handleSelectLabCategories(e.target.value, i)
                                            return this.props.lab.filteredEditableData(gender, i);
                                        }}
                                    />
                                    <span></span>
                                </label>
                                    
                            </li>
                        })
                    }   
                    </ul>
                </div>
                }
                {
                    this.state.openAddManual &&
                    <>
                    <div className={cx('lab-select-input-container')}>
                        {
                            (type === 'create' || isEditing) &&
                            <div className={cx('lab-input-wrapper')}>
                            <div className={cx('form-wrapper', 'age-gender', 'label')}>
                                <div className={cx('category', {checked: true})}>
                                    <label className={cx('label-no-input', 'label-age')} htmlFor="category">검사종류</label>
                                    <div className={cx('select-wrapper')}>
                                        <select 
                                            name="category"
                                            value={addLab.category} 
                                            onChange={this._handleChangeAddLab}
                                        >
                                            <option disabled>검사종류</option>
                                            {this.renderOptionsCategory()}
                                        </select>
                                    </div>
                                </div>
                                <div className={cx('name', {checked: true})}>
                                    <label className={cx('label-no-input', 'label-age')} htmlFor="name">검사명</label>
                                    <div className={cx('select-wrapper')}>
                                        <select 
                                            name="name"
                                            value={addLab.name} 
                                            onChange={this._handleChangeAddLab}
                                        >
                                            <option disabled>검사명</option>
                                            <option value=''>선택해 주세요</option>
                                            {this.renderOptionsName()}
                                        </select>
                                    </div>
                                </div>
                            </div>                        
                            <div className={cx('form-wrapper', 'value-wrapper', 'title', 'input')}>
                                <input 
                                    ref={ref => this.labInput = ref}
                                    data-tip={dataTip}
                                    data-for="tooltip-input-value"
                                    name="value" 
                                    id="lab-value" 
                                    type="number"
                                    placeholder="값" 
                                    onChange={this._handleChangeAddLab}
                                    onKeyDown={(e) => {
                                        if (e.keyCode === 13 && e.target.value > 0) {
                                            this._handleClickOnAddLab();
                                        }
                                    }}
                                    value={addLab.value}
                                    onFocus={() => { ReactTooltip.show(this.labInput); }}
                                    onBlur={() => { ReactTooltip.hide(this.labInput); }}
                                />
                                {
                                    addLab.selectLab !== null &&
                                    <ReactTooltip className="custom-tooltip short lab" place="right" effect="solid" id="tooltip-input-value" />
                                }
                                <label className={cx('label-no-input', 'label-age')} htmlFor="lab-value">검사값</label>
                            </div>
                            
                            </div>
                        }
                    </div>
                    <div className={cx('btn-add-container')}>
                        {
                            (type === "create" || isEditing) &&
                            <button className={cx('btn-add-lab')} onClick={this._handleClickOnAddLab}>개별검사추가 +</button>
                        }
                    </div>
                    </>
                }
                {
                    length > 0 &&
                    <div className={cx('sort-button-container')}>
                        <button onClick={() => {this.handleClickOnSort('name')}}  className={cx({deactive: sortType.name === ''}, 'name', {asc: sortType.name === 'asc'}, {desc: sortType.name === 'desc'})}>
                            <span>이름순</span>
                            {
                                sortType.name !== '' &&
                                <>
                                    {(sortType.name === 'asc') ? <FaSortAlphaUp /> : <FaSortAlphaDown /> }
                                </>
                            }
                        </button>
                        <button onClick={() => {this.handleClickOnSort('value')}}  className={cx({deactive: sortType.value === ''}, 'value', {asc: sortType.value === 'asc'}, {desc: sortType.value === 'desc'})}>
                            <span>상태순</span>
                            {
                                sortType.value !== '' &&
                                <>
                                    {(sortType.value === 'asc') ? <FaSortNumericUp /> : <FaSortNumericDown /> }
                                </>
                            }
                        </button>
                    </div>
                }
                <div className={cx('lab-results-list')}>
                    <ul>
                        {
                            length > 0 &&
                            this._renderResults()
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Lab;