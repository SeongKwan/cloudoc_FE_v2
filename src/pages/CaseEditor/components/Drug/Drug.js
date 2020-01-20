import React, { Component } from 'react';
import styles from './Drug.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import {
    FiSearch, FiX
} from 'react-icons/fi';
import {
    FaTrash
} from 'react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';

import $ from 'jquery';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'treatment', 'drugListItem', 'drugListForInput')
@observer
class Drug extends Component {
    state = { 
        keyword: '',
        focusParent: false,
        selected: -1
    }
    componentDidMount() {
        this.props.drugListItem.loadDrugs();
        this.setState({ keyword: this.props.search.keyword.drug })
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
    _handleClickListItem = (name) => {
        this.setState({keyword: name });
        this._focusListItem();
        // this.props.drugListForInput.setSelectedIndex(-1);
    }
    _handleChange = (e) => {
        const { value, name: type } = e.target;
        this.props.treatment.handleChangeTretment(type, value);
    }
    _handleChangeFormula = (e) => {
        const { value, name, dataset } = e.target;
        this.props.treatment.handleChange(dataset.index, name, value);
    }
    _handleOnChange = (e) => {
        const { value } = e.target;
        this.setState({ keyword: value, focusParent: true });
        this.props.drugListItem.setSearchKeyword(value)

    }
    _handleClearKeyword = () => {
        this.setState({ keyword: '', selected: -1});
        this.props.search.clearKeyword();
        this.props.drugListItem.clearSearchKeyword();
        $(this.input).focus();
    }
    _focusListItem = () => {
        $(this.input).focus();
    }

    _onChangeName = (e) => {
        const { dataset, name, value } = e.target;
        this.props.treatment.handleChange(dataset.index, name, value);
    }
    _handleSelectDrug = (drug) => {
        this.props.treatment.handleChangeTretment('drugName', drug.name);
        this.props.treatment.autoSetDrug(drug);
        this.setState({ keyword: '', focusParent: false, selected: -1});
    }
    _addDrug = (type, value) => {
        const { keyword } = this.state;
        if (keyword === '') { return false; }
        if (type === 'enter') {
                this.props.treatment.handleChangeTretment('drugName', value);
                return this.setState({ keyword: '', focusParent: false, selected: -1});
            }
        this.props.treatment.handleChangeTretment('drugName', value);
        this.setState({ keyword: '', focusParent: false, selected: -1});
    }
        
    
    _deleteDrug = (i) => {
        const { editableData } = this.props.treatment;
        if (i !== undefined
        ) {
            if (editableData.length < 2) {
                return false;
            } else {
                // e.stopPropagation();
                const selectedIndex = i;
                
                this.props.treatment.deleteDrug(selectedIndex);
            }
        }
    }

    _deleteFormula = (i) => {
        this.props.treatment.deleteTreatment(i);
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
            let listContainer = $("ul[data-form='list-container-for-drug']");
            
            listContainer.scrollTop(offTop);
            listContainer.on("scroll", () => {
            })
        })
    }

    _drugMatchingCheck = (drugName) => {
        const drugs = this.props.drugListItem.drugs || [];
        if (drugs.filter(item => item.name === drugName).length > 0) {
            return true;
        } else return false;
    }

    _handleClickOnAddFormula = () => {
        this.props.treatment.addDrug();
    }

    render() {
        const { editableData, editableDataForTreatment } = this.props.treatment;
        const { length } = editableData;
        const { drugs } = this.props.drugListItem;
        const {
            drugName,
            guide,
            caution,
            // lifestyle
        } = editableDataForTreatment;

        return (
            <div className={cx('Drug')}>
                <h5>처방</h5>
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
                                id="keyword-drug" 
                                type="text" 
                                autoComplete='off' 
                                placeholder="처방 검색" 
                                onChange={this._handleOnChange}
                                value={this.state.keyword}
                                onKeyDown={(e) => {
                                    const { focusParent, keyword } = this.state;
                                    const { selectedIndex, maxIndex, currentIndex } = this.props.drugListForInput;
                                    const drugs = this.props.drugListItem.drugs || [];
                                    let index;

                                    if(e.keyCode === 13) {
                                        if (selectedIndex < 0) {
                                            if (this._drugMatchingCheck(keyword)) {
                                                this.props.drugListItem.clearSearchKeyword();
                                                return this._addDrug('enter', keyword);
                                            } else {
                                                this.setState({keyword: ''});
                                                this.props.drugListItem.clearSearchKeyword();
                                                return alert('아래 목록에서 알맞는 처방을 선택 후 입력해 주세요')
                                            }
                                        }
                                        this._addDrug('enter', drugs[selectedIndex].name);
                                        this.props.drugListForInput.setSelectedIndex(-1);
                                        this.props.drugListItem.clearSearchKeyword();
                                        return this.props.drugListForInput.clearForList();
                                        
                                        
                                    }
                                    if (e.keyCode === 27) {
                                        this.setState({keyword: '', focusParent: false, selected: -1})
                                        if (currentIndex < 0 || currentIndex === null) return false;
                                        this.props.drugListForInput.clear();
                                        
                                        this.props.treatment.pressESC(currentIndex);
                                        this.props.drugListItem.setSearchKeyword('');
                                    }

                                    if(e.keyCode === 38) {
                                        e.preventDefault();
                                        if(focusParent) {
                                            if (selectedIndex <= 0) {
                                                this._scroll(0);
                                                this.setState({keyword: drugs[0].name})
                                                return;
                                            }
                                            if (selectedIndex > 0) {
                                                index = selectedIndex - 1;
                                                this._scroll(index);
                                                this.setState({keyword: drugs[selectedIndex - 1].name})
                                                return this.props.drugListForInput.setSelectedIndex(index);
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
                                                this.setState({keyword: drugs[0].name})
                                                return this.props.drugListForInput.setSelectedIndex(index);
                                            }
                                            if (selectedIndex >= 0 && selectedIndex < maxIndex) {
                                                index = selectedIndex + 1;
                                                this._scroll(index);
                                                this.setState({keyword: drugs[index].name})
                                                return this.props.drugListForInput.setSelectedIndex(index);
                                            }
                                            if (selectedIndex === maxIndex) {
                                                this._scroll(maxIndex);
                                                this.setState({keyword: drugs[maxIndex].name})
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
                            <ul data-form="list-container-for-drug">
                                {
                                    drugs.map((drug, i) => {
                                        const { name } = drug;
                                        const { selectedIndex } = this.props.drugListForInput;

                                        return <li 
                                            className={cx({active: selectedIndex === i})}
                                            key={i}
                                            onClick={() => {
                                                this._handleSelectDrug(drug);
                                            }}
                                            onMouseEnter={() => {
                                                this.props.drugListForInput.setSelectedIndex(i);
                                            }}
                                            onMouseLeave={() => {
                                                this.props.drugListForInput.setSelectedIndex(-1);
                                            }}
                                        >
                                            {name || ''}
                                        </li>
                                    })
                                }
                                {
                                    drugs.length < 1 && <li className={cx('no-results')} style={{fontWeight: 100}}><span style={{letterSpacing: 1.2, fontWeight: 400, textDecoration: 'underline'}}>{this.state.keyword}</span> 와 일치하는 처방이 없습니다</li>
                                }
                            </ul>
                        </div>
                    }
                </div>
                <div className={cx('wrapper', 'drug-wrapper')}>
                    <ul>
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
                            <div className={cx('form-wrapper', 'guide', 'input')}>
                                <TextareaAutosize 
                                    className={cx('textarea')}
                                    name="guide" 
                                    id="guide" 
                                    type="text" 
                                    minRows={3}
                                    placeholder="올바른 처방 복용방법" 
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
                    </ul>
                </div>

                <div className={cx('wrapper', 'formula-wrapper')}>
                    <button className={cx('btn-add-formula')} onClick={this._handleClickOnAddFormula}>처방구성추가</button>
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
                                        />
                                        <label htmlFor={`herb-name-${i}`}>약초명</label>
                                    </div>
                                    <div className={cx('input', 'dose', 'form-wrapper')}>
                                        <input 
                                            data-index={i}
                                            className={cx('dose')}
                                            name="dose" 
                                            id={`formula-dose-${i}`} 
                                            type="number" 
                                            autoComplete='off' 
                                            placeholder="수량[g/일]" 
                                            onChange={this._handleChangeFormula}
                                            value={dose}
                                        />
                                        <label htmlFor={`formula-dose-${i}`}>수량[g/일]</label>
                                    </div>
                                    <div className={cx('trash')}>
                                        <FaTrash onClick={() => {this._deleteFormula(i);}}/>
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

export default Drug;