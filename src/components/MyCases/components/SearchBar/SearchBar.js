import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './SearchBar.module.scss';
import classNames from 'classnames/bind';
import { FiSearch } from "../../../../lib/react-icons/fi";

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
    componentDidUpdate(prevProps, prevState) {
        if (this.state.keyword === '' && prevProps.search.keyword.cases !== '' ) {
            this.handleClearKeyword();
            this.props.Case.clearLoadMore();
            this.props.Case.loadCases();
        }
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
                    placeholder="제목, 증상, 진단, 처방을 검색해 주세요"
                    value={this.state.keyword} />
            </div>
        );
    }
}

export default SearchBar;