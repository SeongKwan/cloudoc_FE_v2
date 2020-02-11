import React, { Component } from 'react';
import styles from './Lab.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import convertRef from '../../../../constant/convertReference'
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
    componentDidMount() {
        if (document.querySelector("#paste")) {
            console.log('acitve paste button')
            document.querySelector("#paste").addEventListener("click", this.paste);
        }
        
    }
    
    componentDidUpdate() {
        if (document.querySelector("#paste")) {
            console.log('acitve paste button')
            document.querySelector("#paste").addEventListener("click", this.paste);
        }
    }
    componentWillUnmount() {
        if (document.querySelector("#paste")) {
            document.querySelector("#paste").removeEventListener("click", this.paste);
        }
        this.props.lab.clear();
    }

    paste = () => {
        let pasteText = document.getElementById("outbox");
        // let data;
        // pasteText.focus();
        // document.execCommand("paste");

        // setTimeout(() => { data = window.clipboardData; }, 500);
    
        // console.log(document.execCommand("paste"));
        // setTimeout(() => {console.log(data.getData('Text'))}, 800);
        
        navigator.clipboard.readText().then(clipText => {
            // document.getElementById("outbox").innerText = clipText
            // console.log(clipText)
            this.convertTextToObject(clipText);
        })
        .catch(err => {
            console.log('paste error: ', err);
        });
        // setTimeout(this.handleCopyAndPaste, 100);
        // console.log(pasteText.textContent);
    }

    handleCopyAndPaste = (e) => {
        let clipboardData, pastedData;
 
        // Stop data actually being pasted into div
        e.stopPropagation();
        e.preventDefault();
    
        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');
        
        // Do whatever with pasteddata
        // alert(pastedData);
        // console.log(pastedData)
        this.convertTextToObject(pastedData)
    }

    convertTextToObject = (pastedData) => {
        let parsedData = [];
        
        if (!this.checkerPaste(pastedData.split('\n')[0])) {
            return alert('복사한 혈액검사 텍스트파일 양식이 틀렸거나 내용이 올바르지 않습니다')
        }
        pastedData.split('\n').forEach(data => {
            let splitted = data.split('\t');
            // console.log(splitted)
            if (splitted.length > 1) {
                if (splitted[1] !== "") {
                    let name = splitted[1];
                    let value;
                    if (splitted[5] !== " ") {
                        value = splitted[5];
                    } else if (splitted[6] !== " ") {
                        value = splitted[6];
                    } else {
                        value = splitted[7];
                    }

                    let ref = convertRef.find(data => data.source === name);
                    if (ref) {
                        parsedData.push({
                            name: ref.target,
                            category: ref.category,
                            unit: ref.unit,
                            value: value
                        })
                    } else {
                        parsedData.push({
                            name: name,
                            unit: splitted[3],
                            value: value
                        })
                    }

                }
            }
        })
        parsedData.splice(0, 1);

        this.props.lab.setEditableData(parsedData.filter(x => x.value !== "-"));
        // console.log(parsedData);
    }

    checkerPaste = (firstData) => {
        let splitted = firstData.split('\t');
        const ref = ['혈구검사', '생화학검사', '호르몬면역검사'];
        if (ref.indexOf(splitted[0])!== -1) return true;
        return false
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

    // _deleteBloodTest = (e) => {
    //     if (e.target.dataset.index !== undefined
    //     ) {
    //         e.stopPropagation();
    //         const selectedIndex = e.target.dataset.index;
    //         this.props.handleDeleteBloodTest(selectedIndex);
    //     }
    // }

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
        
        const categories = this._extractCategory();
        let dividedLabByCategory = [];

        categories.forEach((category, i) => {
            dividedLabByCategory[i] = labs.filter(item => {
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
        const { isEditing } = this.props.Case;
        const { type } = this.props;
        const { editableData, staticData } = this.props.lab;
        // console.log(JSON.parse(JSON.stringify(editableData)))
        // const { category, testName, state } = this.props.lab.sortingType;
        // const categorySorting = category;
        // const nameSorting = testName;
        // const stateSorting = state;
        // const disabledModalButton = this.props.lab.labDates.length > 0 ? false : true;
        let labs = (type === "create" || isEditing) ? editableData : staticData;
        let { length } = labs;
        
        let disabledButton = length <= 0;
        
        

        return (
            <div className={cx('Lab')}>
                <div className={cx('title-wrapper')}>
                    <h5>진단검사</h5>
                    {
                        (type === "create" || isEditing) &&
                        <>
                            <button disabled={disabledButton} className={cx('delete-all', {disabled: disabledButton})} onClick={this.handleDeleteAll}>결과삭제</button>
                            <div>
                                <input hidden id="outbox" />
                                <button className={cx('text')} id="paste">텍스트결과</button>
                            </div>
                            <div className={cx('load-lab-results')}>
                                <button className={cx('excel')}>
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
                                                    <input {...getInputProps()} accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                                    엑셀결과
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
                        </>
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