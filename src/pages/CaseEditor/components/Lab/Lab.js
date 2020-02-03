import React, { Component } from 'react';
import styles from './Lab.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
// import {
    // FiSearch, FiX
// } from 'react-icons/fi';
// import {
    // FaTrash
// } from 'react-icons/fa';
// import $ from 'jquery';
import Dropzone from 'react-dropzone';
import LabBar from '../../../../components/LabBar/LabBar';
import _ from 'lodash';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'lab', 'labListItem', 'labListForInput')
@observer
class Lab extends Component {
    componentWillUnmount() {
        this.props.lab.clear();
    }

    _onChange = (e) => {
        if (e.target.files.length === 0) {
            return this.props.lab.clearExcel();
        }
        return this.props.lab.changeExcelFile(e.target.files[0]);
    }

    onFormSubmit = (file) => {
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

    // _deleteBloodTest = (e) => {
    //     if (e.target.dataset.index !== undefined
    //     ) {
    //         e.stopPropagation();
    //         const selectedIndex = e.target.dataset.index;
    //         this.props.handleDeleteBloodTest(selectedIndex);
    //     }
    // }

    _extractCategory = () => {
        const { editableData } = this.props.lab;
        if (editableData.length > 0) {
            let categories = [];
            let array = _.uniqBy(editableData, 'category');
            array.forEach((item, i) => {
                categories[i] = item.category;
            });
            
            return _.sortBy(categories)
        } else return false;
    }

    _renderResults = () => {
        const { editableData } = this.props.lab;
        const categories = this._extractCategory();
        let dividedLabByCategory = [];

        categories.forEach((category, i) => {
            dividedLabByCategory[i] = editableData.filter(item => {
                return item.category === category;
            })
        });

        return dividedLabByCategory.map((arr, i) => {
            return <ul key={i} style={{marginBottom: '4rem'}}>
                <h6 className={cx('category-title')}>
                    <span>[{categories[i]}]</span>
                </h6>
                {
                    arr.map((lab, i) => {
                        const {
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
                        </li>
                    })
                }
            </ul>
        })
    }

    render() {
        const { editableData } = this.props.lab;
        
        // const { category, testName, state } = this.props.lab.sortingType;
        // const categorySorting = category;
        // const nameSorting = testName;
        // const stateSorting = state;
        // const disabledModalButton = this.props.lab.labDates.length > 0 ? false : true;
        let { length } = editableData;

        
        return (
            <div className={cx('Lab')}>
                <div className={cx('title-wrapper')}>
                    <h5>진단검사</h5>
                    <div className={cx('load-lab-results')}>
                        <button>
                            <Dropzone
                                onDrop={(acceptedFiles) => this.onFormSubmit(acceptedFiles)}
                                onDropRejected={(rejectedFiles) => {
                                    if (rejectedFiles.length > 0) {
                                        return alert('엑셀파일만 업로드가 가능합니다')
                                    }
                                }
                                }
                            >
                                {({acceptedFiles, getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()} className={cx('drag-drop-zone')}>
                                            <input {...getInputProps()} />
                                            검사결과 가져오기
                                        </div>
                                        <div className={cx("fileName-dateSelectButton")}>
                                            <div>
                                                {acceptedFiles.map((file) => {
                                                return <div key={file.path} className={cx('fileName')}>
                                                        선택된 파일: {file.path}
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </button>
                    </div>
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