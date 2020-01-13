import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './SearchBar.module.scss';
import classNames from 'classnames/bind';
import { FiSearch } from "react-icons/fi";

const cx = classNames.bind(styles);

@withRouter
@inject(
    'search',
    'Case'
)
@observer
class SearchBar extends Component {
    state = { keyword: ''}
    componentDidMount() {
        this.setState({ keyword: this.props.search.keyword.cases })
    }
    componentWillUnmount() {
        this.handleClearKeyword();
    }
    _handleOnChange = (e) => {
        const { value } = e.target;
        this.setState({ keyword: value });
    }
    handleOnClick = (e) => {
        if (this.state.keyword === '') {
            this.props.Case.InitInfiniteStore();
            return this.props.search.setKeyword('cases', this.state.keyword);
        }
        this.props.Case.noLoadMore();
        this.props.search.setKeyword('cases', this.state.keyword);
        
        this.props.Case.casesOnSearching();
    }
    handleClearKeyword = () => {
        this.setState({ keyword: '' });
        this.props.search.clearKeyword();
    }
    render() {
        return (
            <div className={cx('SearchBar')}>
                <div className={cx('search-icon')}>
                    <FiSearch />
                </div>
                <label htmlFor="search-my-cases" hidden>증례 검색</label>
                <input 
                    id="search-my-cases" 
                    type="text" 
                    onChange={this._handleOnChange} 
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            this.handleOnClick();
                        }
                    }} 
                    value={this.state.keyword} />
            </div>
        );
    }
}

export default SearchBar;