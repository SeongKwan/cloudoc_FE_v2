import React, { Component } from 'react';
import styles from './LabResults.module.scss';
import classNames from 'classnames/bind';
import LabBar from '../../../../../../components/LabBar/LabBar';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import { FiAlertCircle } from '../../../../../../lib/react-icons/fi';
import { FaTrash } from '../../../../../../lib/react-icons/fa';

const cx = classNames.bind(styles);

@inject('Case', 'caseEditorBasic', 'search', 'lab', 'labListItem', 'labListForInput')
@observer
class LabResults extends Component {
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
    handleChangeValueLabBar = (index, value) => {
        const {
            refMin, refMax, optMin,
            optMax, alertMin, alertMax
        } = this.props.lab.editableData[index];
        
        this.props.lab.getState(index, refMin, refMax, optMin, optMax, alertMin, alertMax, +value);
        this.props.lab.handleChangeLabBar(index, value);
    }
    _deleteBloodTest = (index) => {
        if (index !== undefined ) {
            this.props.lab.deleteBloodTest(index);
        }
    }
    render() {
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
            
            return <ul className={cx('LabResults')} key={index} style={{marginBottom: '4rem'}}>
                
                <h6 className={cx('category-title')}>
                    <span>[{categories[index]}]</span>
                </h6>
                
                {
                    sortedArr.map((lab, i) => {
                        
                        const {
                            originalIndex, name, unit,
                            value, refMin, refMax,
                            optMin, optMax, alertMin,
                            alertMax, alertMessage, state,
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
}

export default LabResults;