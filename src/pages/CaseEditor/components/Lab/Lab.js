import React, { Component } from 'react';
import styles from './Lab.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import LabBar from '../../../../components/LabBar/LabBar';
import _ from 'lodash';
import { FiPlus } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import './Lab.css';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'lab', 'labListItem', 'labListForInput')
@observer
class Lab extends Component {
    componentWillUnmount() {
        this.props.lab.clear();
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

    onFormSubmit = (file) => {
        // console.log(file)
        this.props.lab.changeExcelFile(file[0]);
        if (this.props.lab.excelFile) {
            return this.props.lab.postExcel()
            .then(() => {
                const { testResults } = this.props.lab;
                
                this.props.lab.setEditableData(testResults[0].filter(x => x.value !== "-"));
            })
        }
        if (this.props.lab.excelFile === null) {
            return alert('업로드 할 엑셀 파일을 선택해 주세요');
        }
    }

    handleDeleteBloodTest = (selectedIndex) => {
        this.props.lab.deleteBloodTest(selectedIndex);
    }

    handleDeleteAll = () => {
        this.props.lab.clear();
    }

    // _onChangeName = (e) => {
    //     const {
    //         dataset,
    //         name,
    //         value
    //     } = e.target;

    //     const {
    //         refMin,
    //         refMax,
    //         optMin,
    //         optMax,
    //         alertMin,
    //         alertMax
    //     } = this.props.bloodTest[dataset.index];
        
    //     this.props.lab.getState(dataset.index, refMin, refMax, optMin, optMax, alertMin, alertMax, +value);
    //     this.props.lab.handleChange(dataset.index, name, value);
    // }

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

    _renderResults = () => {
        const { isEditing } = this.props.Case;
        const { type } = this.props;

        const { editableData, staticData } = this.props.lab;

        let labs = (type === "create" || isEditing) ? editableData : staticData;
        // let labs = testResults || [];
        
        const categories = this._extractCategory();
        let dividedLabByCategory = [];

        categories.forEach((category, i) => {
            dividedLabByCategory[i] = labs.filter(item => {
                return item.category === category;
            })
        });

        // console.log(JSON.parse(JSON.stringify(dividedLabByCategory)))

        return dividedLabByCategory.map((arr, i) => {
            let sortedArr = _.sortBy(arr, 'name');

            return <ul key={i} style={{marginBottom: '4rem'}}>
                <h6 className={cx('category-title')}>
                    <span>[{categories[i]}]</span>
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
                            alertMax
                        } = lab;
                        return <li key={i}>
                            <div className={cx('lab-name-unit')}>
                                <div className={cx('name')}>{name}</div>
                                <div className={cx('unit')}>[{unit}]</div>
                            </div>
                            <div className={cx('bar-wrapper')}>
                                <LabBar 
                                    changeValue={this.handleChangeValueLabBar}
                                    isEditing={(type === "create" || isEditing)}
                                    index={originalIndex}
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
        
        if (name === 'name') {
            let lab = e.target.options[e.target.selectedIndex].dataset.lab;
            this.props.lab.setAddLab(JSON.parse(lab));
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
            return <option data-lab={JSON.stringify(lab)} key={i} value={lab.name}>{lab.name}</option>
        });
    }

    render() {
        const { isEditing } = this.props.Case;
        const { type } = this.props;
        const { editableData, staticData, addLab } = this.props.lab;
        let labs = (type === "create" || isEditing) ? editableData : staticData;
        let { length } = labs;
        // console.log(length)
        // console.log(labNames.length)
        // console.log(JSON.parse(JSON.stringify(addLab)));
        // console.log('static ',JSON.parse(JSON.stringify(staticData)))
        // console.log('editable ',JSON.parse(JSON.stringify(editableData)))
        // const { category, testName, state } = this.props.lab.sortingType;
        // const categorySorting = category;
        // const nameSorting = testName;
        // const stateSorting = state;
        // const disabledModalButton = this.props.lab.labDates.length > 0 ? false : true;
        
        let disabledButton = length <= 0;
        let dataTip = addLab.selectLab !== null ? `범위 :  ${addLab.selectLab['refMin']} ~ ${addLab.selectLab['refMax']}` : ''
        

        return (
            <div className={cx('Lab')}>
                <div className={cx('title-wrapper')}>
                    <h5>진단검사</h5>
                    {
                        (type === "create" || isEditing) &&
                        <>
                            <div className={cx('text','button-paste')} onClick={this.handleOnClickPasteButton} id="paste">결과붙여넣기</div>
                            <button disabled={disabledButton} className={cx('delete-all', {disabled: disabledButton})} onClick={this.handleDeleteAll}>결과삭제</button>
                        </>
                    }
                </div>
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
                                        <option>선택해 주세요</option>
                                        {this.renderOptionsName()}
                                    </select>
                                </div>
                            </div>
                        </div>                        
                        <div className={cx('form-wrapper', 'value-wrapper', 'title', 'input')}>
                            <input 
                                data-tip={dataTip}
                                data-for="tooltip-input-value"
                                name="value" 
                                id="value" 
                                type="number"
                                placeholder="값" 
                                onChange={this._handleChangeAddLab}
                                value={addLab.value}
                            />
                            {
                                addLab.selectLab !== null &&
                                <ReactTooltip className="custom-tooltip short" place="right" effect="solid" id="tooltip-input-value" />
                            }
                            <label className={cx('label-no-input', 'label-age')} htmlFor="value">검사값</label>
                        </div>
                        
                        </div>
                    }
                </div>
                <div className={cx('btn-add-container')}>
                    {
                        (type === "create" || isEditing) &&
                        <button className={cx('btn-add-lab')} onClick={this._handleClickOnAddLab}>검사추가<FiPlus /></button>
                    }
                </div>
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