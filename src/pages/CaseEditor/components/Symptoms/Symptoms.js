import React, { Component } from 'react';
import styles from './Symptoms.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import {
    FiSearch, FiX
} from '../../../../lib/react-icons/fi';
import {
    FaTrash
} from '../../../../lib/react-icons/fa';
import $ from 'jquery';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'symptom', 'symptomListItem', 'symptomListForInput')
@observer
class Symptoms extends Component {
    state = { 
        keyword: '',
        focusParent: false,
        selected: -1
    }
    componentDidMount() {
        this.props.symptom.initEditableData();
        this.setState({ keyword: this.props.search.keyword.symptoms })
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        this.setState({ selected: -1, focusParent: false });
        document.removeEventListener('mousedown', this._handleClickOutside);
        this._handleClearKeyword();
    }
    _handleClickOutside = (event) => {
        if (this.searchInput && !this.searchInput.contains(event.target)) {
            this.setState({ keyword: '', focusParent: false, selected: -1});
            this.props.search.clearKeyword();
            this.props.symptomListItem.clearSearchKeyword();
            this.props.symptomListForInput.clearSelectedIndex();
        }
    }
    _toggleOnFocus = () => {
        this.setState({ focusParent: true})
    }
    _handleClickListItem = (index, name) => {
        this.setState({ selected: index, keyword: name });
        this._focusListItem();
        this.props.symptomListForInput.setSelectedIndex(-1);
    }
    _handleOnChange = (e) => {
        const { value } = e.target;
        this.setState({ keyword: value, focusParent: true, selected: -1 });
        
        this.props.symptomListForInput.clearSelectedIndex();
        this.props.symptomListItem.setSearchKeyword(value)

    }
    _handleClearKeyword = () => {
        this.setState({ keyword: '', selected: -1});
        this.props.search.clearKeyword();
        this.props.symptomListItem.clearSearchKeyword();
        $(this.input).focus();
    }
    _focusListItem = () => {
        $(this.input).focus();
    }

    _onChangeName = (e) => {
        const { dataset, name, value } = e.target;
        this.props.symptom.handleChange(dataset.index, name, value);
    }
    _handleSelectSymptom = (name) => {
        const { selected } = this.state;
        if (selected > -1) {
            this.props.symptom.handleChange(selected, 'name', name);
            this.props.search.setKeyword('symptoms', '');
            this.props.symptomListItem.clearSearchKeyword();
            return this.setState({ keyword: '', focusParent: false, selected: -1});
        }
        this.props.symptom.addSymptom(null, null, name);
        this.props.symptomListForInput.setSelectedIndex(-1);
        this.props.symptomListItem.clearSearchKeyword();
        this.props.search.setKeyword('symptoms', '');
        this.setState({ keyword: '', focusParent: false, selected: -1});
    }
    _addSymptom = (type, value) => {
        const { keyword, selected } = this.state;
        if (keyword === '') { return false; }
        if (type === 'enter') {
            if (selected > -1) {
                this.props.symptom.handleChange(selected, 'name', value);

            } else {
                this.props.symptom.addSymptom(null, null, value);
                return this.setState({ keyword: '', focusParent: false, selected: -1});
            }
        }
        if (selected > -1) {
            this.props.symptom.handleChange(selected, 'name', keyword);
        }
        this.props.symptom.addSymptom(null, null, this.state.keyword);
        this.setState({ keyword: '', focusParent: false, selected: -1});
    }
    _deleteSymptom = (i) => {
        // const { editableData } = this.props.symptom;
        if (i !== undefined) {
            const selectedIndex = i;
            
            this.props.symptom.deleteSymptom(selectedIndex);
            
        }
    }

    _scroll = (index) => {
        const windowWidth = window.outerWidth;
        let offTop, listItemHeight;
        

        if (windowWidth > 1411) {
            listItemHeight = 40;
        } else {
            listItemHeight = 32;
        }

        
        if (index <= 3 && index >= 0) {
            offTop = 0;
        }
        if (index > 3) {
            offTop = (index - 2.5) * listItemHeight;
        }
        $(function() {
            let listContainer = $("ul[data-form='list-container-for-symptom']");
            
            listContainer.scrollTop(offTop);
            listContainer.on("scroll", () => {
            })
        })
    }

    _symptomMatchingCheck = (symptomName) => {
        const symptoms = this.props.symptomListItem.symptoms || [];
        if (symptoms.filter(item => item.name === symptomName).length > 0) {
            return true;
        } else return false;
    }
    
    render() {
        const { isEditing } = this.props.Case;
        const { type } = this.props;
        const { editableData, staticData } = this.props.symptom;
        // const { length } = editableData;
        const { symptoms } = this.props.symptomListItem;

        return (
            <div className={cx('Symptoms', {view: !isEditing})}>
                <h5>증상</h5>
                
                {
                    (type === "create" || isEditing) &&
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
                                    id="keyword-symptom" 
                                    type="text" 
                                    autoComplete='off' 
                                    placeholder="증상 검색 & 추가" 
                                    onChange={this._handleOnChange}
                                    value={this.state.keyword}
                                    onKeyDown={(e) => {
                                        const { focusParent, keyword } = this.state;
                                        const { selectedIndex, maxIndex } = this.props.symptomListForInput;
                                        const symptoms = this.props.symptomListItem.symptoms || [];
                                        let index;

                                        if(e.keyCode === 13) {
                                            if (selectedIndex < 0) {
                                                if (this._symptomMatchingCheck(keyword)) {
                                                    this.props.symptomListItem.clearSearchKeyword();
                                                    return this._addSymptom('enter', keyword);
                                                } else {
                                                    this.setState({keyword: ''});
                                                    this.props.symptomListItem.clearSearchKeyword();
                                                    return alert('아래 목록에서 알맞는 증상을 선택 후 입력해 주세요')
                                                }
                                            }
                                            this._addSymptom('enter', symptoms[selectedIndex].name);
                                            this.props.symptomListForInput.setSelectedIndex(-1);
                                            this.props.symptomListItem.clearSearchKeyword();
                                            return this.props.symptomListForInput.clearForList();
                                            
                                            
                                        }
                                        if (e.keyCode === 27) {
                                            this.setState({keyword: '', focusParent: false, selected: -1})
                                            this.props.symptomListForInput.clearSelectedIndex();
                                            this.props.symptomListItem.setSearchKeyword('');;
                                        }

                                        if(e.keyCode === 38) {
                                            e.preventDefault();
                                            if (symptoms.length > 0) {
                                                if(focusParent) {
                                                    if (selectedIndex <= 0) {
                                                        this._scroll(0);
                                                        this.setState({keyword: symptoms[0].name})
                                                        return;
                                                    }
                                                    if (selectedIndex > 0) {
                                                        index = selectedIndex - 1;
                                                        this._scroll(index);
                                                        this.setState({keyword: symptoms[selectedIndex - 1].name})
                                                        return this.props.symptomListForInput.setSelectedIndex(index);
                                                    }
                                                }
                                            }
                                            return;
                                        }
                                        if(e.keyCode === 40) {
                                            e.preventDefault();
                                            if (symptoms.length > 0) {
                                                if(!focusParent) {
                                                    this.setState({focusParent: true})
                                                } else {
                                                    if (selectedIndex < 0) {
                                                        index = 0;
                                                        this._scroll(index);
                                                        this.setState({keyword: symptoms[0].name})
                                                        return this.props.symptomListForInput.setSelectedIndex(index);
                                                    }
                                                    if (selectedIndex >= 0 && selectedIndex < maxIndex) {
                                                        index = selectedIndex + 1;
                                                        this._scroll(index);
                                                        this.setState({keyword: symptoms[index].name})
                                                        return this.props.symptomListForInput.setSelectedIndex(index);
                                                    }
                                                    if (selectedIndex === maxIndex) {
                                                        this._scroll(maxIndex);
                                                        this.setState({keyword: symptoms[maxIndex].name})
                                                        return;
                                                    }
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
                                <ul data-form="list-container-for-symptom">
                                    {
                                        symptoms.map((symptom, i) => {
                                            const { name } = symptom;
                                            const { selectedIndex } = this.props.symptomListForInput;

                                            return <li 
                                                className={cx({active: selectedIndex === i})}
                                                key={i}
                                                onClick={() => {
                                                    this._handleSelectSymptom(name);
                                                }}
                                                onMouseEnter={() => {
                                                    this.props.symptomListForInput.setSelectedIndex(i);
                                                }}
                                                onMouseLeave={() => {
                                                    this.props.symptomListForInput.setSelectedIndex(-1);
                                                }}
                                            >
                                                {name || ''}
                                            </li>
                                        })
                                    }
                                    {
                                        symptoms.length < 1 && <li className={cx('no-results')} style={{fontWeight: 100}}><span style={{letterSpacing: 1.2, fontWeight: 400, textDecoration: 'underline'}}>{this.state.keyword}</span> 와 일치하는 증상이 없습니다</li>
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                }
                <div className={cx('wrapper', 'symptoms-wrapper')}>
                    <ul>
                        {   type === "create" || isEditing ?
                            editableData.map((symptom, i) => {
                                const { name, description } = symptom;
                                return <li key={i} className={cx('')}>
                                    <div className={cx('form-wrapper', 'symptom-name', 'input')}>
                                        <input 
                                            className={cx('name')}
                                            name="name" 
                                            id={`symptom-name-${i}`} 
                                            type="text" 
                                            placeholder="증상" 
                                            readOnly
                                            onClick={()=>{this._handleClickListItem(i, name)}}
                                            value={name || ''}
                                        />
                                        <label htmlFor={`symptom-name-${i}`}>증상명</label>
                                    </div>
                                    <div className={cx('input', 'description', 'form-wrapper')}>
                                        <input 
                                            data-index={i}
                                            className={cx('description')}
                                            name="description" 
                                            id={`symptom-description-${i}`} 
                                            type="text" 
                                            autoComplete='off' 
                                            placeholder="입력란" 
                                            onChange={this._onChangeName}
                                            value={description}
                                        />
                                        <label htmlFor={`symptom-description-${i}`}>상세설명</label>
                                    </div>
                                    <div className={cx('trash')}>
                                        <FaTrash onClick={() => {this._deleteSymptom(i);}}/>
                                    </div>
                                </li>
                            })
                            : staticData.map((symptom, i) => {
                                const { name, description } = symptom;
                                return <li key={i} className={cx('')}>
                                    <div className={cx('form-wrapper', 'symptom-name', 'input')}>
                                        <input 
                                            className={cx('name', 'static')}
                                            name="name" 
                                            id={`symptom-name-${i}`} 
                                            type="text" 
                                            readOnly
                                            value={name || ''}
                                        />
                                        <label htmlFor={`symptom-name-${i}`}>증상명</label>
                                    </div>
                                    <div className={cx('input', 'description', 'form-wrapper')}>
                                        <input 
                                            className={cx('description', 'static')}
                                            name="description" 
                                            id={`symptom-description-${i}`} 
                                            type="text" 
                                            readOnly
                                            value={description}
                                        />
                                        <label htmlFor={`symptom-description-${i}`}>상세설명</label>
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

export default Symptoms;