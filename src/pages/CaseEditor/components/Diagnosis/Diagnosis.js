import React, { Component } from 'react';
import styles from './Diagnosis.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import {
    FiSearch, FiX
} from 'react-icons/fi';
import {
    FaTrash
} from 'react-icons/fa';
import $ from 'jquery';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'diagnosis', 'diagnosisListItem', 'diagnosisListForInput')
@observer
class Diagnosis extends Component {
    state = { 
        keyword: '',
        focusParent: false,
        selected: -1
    }
    componentDidMount() {
        this.props.diagnosis.initEditableData();
        this.setState({ keyword: this.props.search.keyword.diagnosis })
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        this.setState({ selected: -1, focusParent: false });
        document.removeEventListener('mousedown', this._handleClickOutside);
        this._handleClearKeyword();
    }
    _handleClickOutside = (event) => {
        if (this.searchInput && !this.searchInput.contains(event.target)) {
            this.setState({focusParent: false, selected: -1});
        }
    }
    _toggleOnFocus = () => {
        this.setState({ focusParent: true})
    }
    _handleClickListItem = (index, name) => {
        this.setState({ selected: index, keyword: name });
        this._focusListItem();
        this.props.diagnosisListForInput.setSelectedIndex(-1);
    }
    _handleOnChange = (e) => {
        const { value } = e.target;
        this.setState({ keyword: value, focusParent: true });
        this.props.diagnosisListItem.setSearchKeyword(value)

    }
    _handleClearKeyword = () => {
        this.setState({ keyword: '', selected: -1});
        this.props.search.clearKeyword();
        this.props.diagnosisListItem.clearSearchKeyword();
        $(this.input).focus();
    }
    _focusListItem = () => {
        $(this.input).focus();
    }

    _onChangeName = (e) => {
        const { dataset, name, value } = e.target;
        this.props.diagnosis.handleChange(dataset.index, name, value);
    }
    _handleSelectSymptom = (name) => {
        const { selected } = this.state;
        
        if (selected > -1) {
            this.props.diagnosis.handleChange(selected, 'name', name);
            this.props.diagnosisListForInput.setSelectedIndex(-1);
            this.props.search.setKeyword('diagnosis', '');
            this.props.diagnosisListItem.clearSearchKeyword();
            return this.setState({ keyword: '', focusParent: false, selected: -1});
        }
        this.props.diagnosis.addDiagnosis(null, null, name);
        this.props.diagnosisListForInput.setSelectedIndex(-1);
        this.props.search.setKeyword('diagnosis', '');
        this.props.diagnosisListItem.clearSearchKeyword();
        this.setState({ keyword: '', focusParent: false, selected: -1});
    }
    _addDiagnosis = (type, value) => {
        const { keyword, selected } = this.state;
        if (keyword === '') { return false; }
        if (type === 'enter') {
            if (selected > -1) {
                this.props.diagnosis.handleChange(selected, 'name', value);

            } else {
                this.props.diagnosis.addDiagnosis(null, null, value);
                return this.setState({ keyword: '', focusParent: false, selected: -1});
            }
        }
        if (selected > -1) {
            this.props.diagnosis.handleChange(selected, 'name', keyword);
        }
        this.props.diagnosis.addDiagnosis(null, null, this.state.keyword);
        this.setState({ keyword: '', focusParent: false, selected: -1});
    }
    _deleteDiagnosis = (i) => {
        const { editableData } = this.props.diagnosis;
        if (i !== undefined
        ) {
            if (editableData.length < 2) {
                return false;
            } else {
                // e.stopPropagation();
                const selectedIndex = i;
                
                this.props.diagnosis.deleteDiagnosis(selectedIndex);
            }
        }
    }

    _scroll = (index) => {
        let offTop;
        if (index <= 3 && index >= 0) {
            offTop = 0;
        }
        if (index > 3) {
            offTop = (index - 2.5) * 32;
        }
        $(function() {
            let listContainer = $("ul[data-form='list-container-for-diagnosis']");
            listContainer.scrollTop(offTop);
            listContainer.on("scroll", () => {
            })
        })
    }

    _diagnosisMatchingCheck = (diagnosisName) => {
        const diagnosis = this.props.diagnosisListItem.diagnosises || [];
        if (diagnosis.filter(item => item.name === diagnosisName).length > 0) {
            return true;
        } else return false;
    }
    
    render() {
        const { editableData } = this.props.diagnosis;
        const { length } = editableData;
        const { diagnosises } = this.props.diagnosisListItem;
        return (
            <div id="case-editor-diagnosis" className={cx('Diagnosis')}>
            <h5>추정진단</h5>
                <div 
                    className={cx('search-container')}
                    ref={(ref) => {
                        this.searchInput = ref;
                    }}
                >
                    <div className={cx('wrapper', 'search-wrapper', {focus: this.state.focusParent})}>
                        <div className={cx('btn-search')}>
                            <FiSearch />
                        </div>
                        <div className={cx('input')}>
                            <input 
                                ref={(ref) => {
                                    this.input = ref;
                                }}
                                name="keyword" 
                                id="keyword-diagnosis" 
                                type="text" 
                                autoComplete='off' 
                                placeholder="진단 검색 & 추가" 
                                onChange={this._handleOnChange}
                                value={this.state.keyword}
                                onKeyDown={(e) => {
                                    const { focusParent, keyword } = this.state;
                                    const { selectedIndex, maxIndex, currentIndex } = this.props.diagnosisListForInput;
                                    const diagnosises = this.props.diagnosisListItem.diagnosises || [];
                                    let index;

                                    if(e.keyCode === 13) {
                                        if (selectedIndex < 0) {
                                            if (this._symptomMatchingCheck(keyword)) {
                                                this.props.diagnosisListItem.clearSearchKeyword();
                                                return this._addDiagnosis('enter', keyword);
                                            } else {
                                                this.setState({keyword: ''});
                                                this.props.diagnosisListItem.clearSearchKeyword();
                                                return alert('아래 목록에서 알맞는 진단을 선택 후 입력해 주세요')
                                            }
                                        }
                                        this._addDiagnosis('enter', diagnosises[selectedIndex].name);
                                        this.props.diagnosisListForInput.setSelectedIndex(-1);
                                        this.props.diagnosisListItem.clearSearchKeyword();
                                        return this.props.diagnosisListForInput.clearForList();
                                        
                                        
                                    }
                                    if (e.keyCode === 27) {
                                        this.setState({keyword: '', focusParent: false, selected: -1})
                                        if (currentIndex < 0 || currentIndex === null) return false;
                                        this.props.diagnosisListForInput.clear();
                                        
                                        this.props.symptom.pressESC(currentIndex);
                                        this.props.diagnosisListItem.setSearchKeyword('');
                                    }

                                    if(e.keyCode === 38) {
                                        e.preventDefault();
                                        if(focusParent) {
                                            if (selectedIndex <= 0) {
                                                this._scroll(0);
                                                this.setState({keyword: diagnosises[0].name})
                                                return;
                                            }
                                            if (selectedIndex > 0) {
                                                index = selectedIndex - 1;
                                                this._scroll(index);
                                                this.setState({keyword: diagnosises[selectedIndex - 1].name})
                                                return this.props.diagnosisListForInput.setSelectedIndex(index);
                                            }
                                        }
                                        return;
                                    }
                                    if(e.keyCode === 40) {
                                        e.preventDefault();
                                        if(!focusParent) {
                                            this.setState({focusParent: true})
                                        } else {
                                            if (selectedIndex < 0) {
                                                index = 0;
                                                this._scroll(index);
                                                this.setState({keyword: diagnosises[0].name})
                                                return this.props.diagnosisListForInput.setSelectedIndex(index);
                                            }
                                            if (selectedIndex >= 0 && selectedIndex < maxIndex) {
                                                index = selectedIndex + 1;
                                                this._scroll(index);
                                                this.setState({keyword: diagnosises[index].name})
                                                return this.props.diagnosisListForInput.setSelectedIndex(index);
                                            }
                                            if (selectedIndex === maxIndex) {
                                                this._scroll(maxIndex);
                                                this.setState({keyword: diagnosises[maxIndex].name})
                                                return;
                                            }
                                        }
                                    }
                                }}
                                onFocus={this._toggleOnFocus}
                            />
                        </div>
                        <div onClick={this._handleClearKeyword} className={cx('btn-clear')}>
                            {this.state.keyword.length > 0 && <FiX />}
                        </div>
                    </div>
                    {
                        this.state.focusParent &&
                        <div className={cx('wrapper', 'results-wrapper')}>
                            <ul data-form="list-container-for-diagnosis">
                                {
                                    diagnosises.map((diagnosis, i) => {
                                        const { name } = diagnosis;
                                        const { selectedIndex } = this.props.diagnosisListForInput;

                                        return <li 
                                            className={cx({active: selectedIndex === i})}
                                            key={i}
                                            onClick={() => {
                                                this._handleSelectSymptom(name);
                                            }}
                                            onMouseEnter={() => {
                                                this.props.diagnosisListForInput.setSelectedIndex(i);
                                            }}
                                            onMouseLeave={() => {
                                                this.props.diagnosisListForInput.setSelectedIndex(-1);
                                            }}
                                        >
                                            {name || ''}
                                        </li>
                                    })
                                }
                                {
                                    diagnosises.length < 1 && <li className={cx('no-results')} style={{fontWeight: 100}}><span style={{letterSpacing: 1.2, fontWeight: 400, textDecoration: 'underline'}}>{this.state.keyword}</span> 와 일치하는 진단이 없습니다</li>
                                }
                            </ul>
                        </div>
                    }
                </div>
                <div className={cx('wrapper', 'diagnosis-wrapper')}>
                    <ul>
                        {
                            editableData.map((diagnosis, i) => {
                                const { name, description } = diagnosis;
                                return <li key={i} className={cx('')}>
                                    <div className={cx('form-wrapper', 'diagnosis-name', 'input')}>
                                        <input 
                                            className={cx('name')}
                                            name="name" 
                                            id={`diagnosis-name-${i}`} 
                                            type="text" 
                                            placeholder="진단" 
                                            readOnly
                                            onClick={()=>{this._handleClickListItem(i, name)}}
                                            value={name || ''}
                                        />
                                        <label htmlFor={`diagnosis-name-${i}`}>진단명</label>
                                    </div>
                                    <div className={cx('input', 'description', 'form-wrapper')}>
                                        <input 
                                            data-index={i}
                                            className={cx('description')}
                                            name="description" 
                                            id={`diagnosis-description-${i}`} 
                                            type="text" 
                                            autoComplete='off' 
                                            placeholder="입력란" 
                                            onChange={this._onChangeName}
                                            value={description}
                                        />
                                        <label htmlFor={`diagnosis-description-${i}`}>상세설명</label>
                                    </div>
                                    <div className={cx('trash', {last: length === 1})}>
                                        <FaTrash onClick={() => {this._deleteDiagnosis(i);}}/>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Diagnosis;