import React, { Component } from 'react';
import styles from './SearchBar.module.scss';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import { FiSearch, FiX } from '../../../../../../lib/react-icons/fi';
import $ from 'jquery';

const cx = classNames.bind(styles);

@inject('Case', 'search', 'treatment', 'drugListItem', 'drugListForInput')
@observer
class SearchBar extends Component {
    state = { 
        keyword: '',
        focusParent: false,
        selected: -1
    }
    componentDidMount() {
        this.setState({ keyword: this.props.search.keyword.drug })
        document.addEventListener('mousedown', this._handleClickOutside);
    }
    componentWillUnmount() {
        this.setState({ selected: -1, focusParent: false });
        document.removeEventListener('mousedown', this._handleClickOutside);
        this._handleClearKeyword();
        this.props.treatment.clear();
    }
    _handleClickOutside = (event) => {
        if (this.searchInput && !this.searchInput.contains(event.target)) {
            this.setState({ keyword: '', focusParent: false, selected: -1});
            this.props.search.clearKeyword();
            this.props.drugListForInput.clearSelectedIndex();
            this.props.drugListItem.clearSearchKeyword();
        }
    }
    _addDrug = (type, value) => {
        const { keyword } = this.state;
        const { drugs } = this.props.drugListItem;
        const { selectedIndex } = this.props.drugListForInput;
        if (keyword === '') { return false; }
        if (type === 'enter') {
                this.props.treatment.handleChangeTretment('drugName', value);
                this.props.treatment.autoSetDrug(drugs[selectedIndex]);
                return this.setState({ keyword: '', focusParent: false, selected: -1});
            }
        this.props.treatment.handleChangeTretment('drugName', value);
        this.setState({ keyword: '', focusParent: false, selected: -1});
    }
    _handleOnChange = (e) => {
        const { value } = e.target;
        this.setState({ keyword: value, focusParent: true, selected: -1 });
        this.props.drugListForInput.clearSelectedIndex();
        this.props.drugListItem.setSearchKeyword(value)
    }
    _drugMatchingCheck = (drugName) => {
        const drugs = this.props.drugListItem.drugs || [];
        if (drugs.filter(item => item.name === drugName).length > 0) {
            return true;
        } else return false;
    }
    _handleClearKeyword = () => {
        this.setState({ keyword: '', selected: -1});
        this.props.search.clearKeyword();
        this.props.drugListItem.clearSearchKeyword();
    }
    _focusListItem = () => {
        $(this.input).focus();
    }
    _toggleOnFocus = () => {
        this.setState({ focusParent: true})
    }
    _handleSelectDrug = (drug) => {
        this.props.treatment.handleChangeTretment('drugName', drug.name);
        this.props.treatment.autoSetDrug(drug);
        this.props.drugListForInput.setSelectedIndex(-1);
        this.props.search.setKeyword('drug', '');
        this.props.drugListItem.clearSearchKeyword();
        this.setState({ keyword: '', focusParent: false, selected: -1});
    }
    render() {
        const { drugs } = this.props.drugListItem;
        return (
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
                                const { selectedIndex, maxIndex } = this.props.drugListForInput;
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
                                    this.props.drugListForInput.clearSelectedIndex();
                                    this.props.drugListItem.setSearchKeyword('');
                                }

                                if(e.keyCode === 38) {
                                    e.preventDefault();
                                    if (drugs.length > 0) {
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
                                    }
                                    return;
                                }
                                if(e.keyCode === 40) {
                                    e.preventDefault();
                                    if (drugs.length > 0) {
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
                                }
                            }}
                            onFocus={this._toggleOnFocus}
                        />
                    </div>
                    <div onClick={() => {
                        this._handleClearKeyword();
                        this._focusListItem();
                    }}
                    className={cx('btn-clear')}>
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
        );
    }
}

export default SearchBar;