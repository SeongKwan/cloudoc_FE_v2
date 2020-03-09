import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './MyCases.module.scss';
import classNames from 'classnames/bind';
// import { Helmet } from "react-helmet";
import Loader from '../../components/Loader/Loader';
import { FiPlus } from "../../lib/react-icons/fi";
import SearchBar from './components/SearchBar/SearchBar';
import CaseListItem from './components/CaseListItem/CaseListItem';

const cx = classNames.bind(styles);

@withRouter
@inject(
    'auth',
    'Case',
    'login',
    'user', 
    'search'
)
@observer
class MyCases extends Component {
    componentDidMount() {
        this.props.Case.loadCases();
    }

    componentWillUnmount() {
        this.props.Case.clearLoadMore();
    }

    componentDidUpdate(prevProps) {
        let type = this.props.search.keyword['cases'].length > 0;
        if (type) {
            if (this.props.Case.lastPageForSearching === this.props.Case.currentPage) {
                this.props.Case.noLoadMore();
            }
        } else {
            if (this.props.Case.lastPage === this.props.Case.currentPage) {
                this.props.Case.noLoadMore();
            }
        }
    }

    _handleClickOnButton = () => {
        this.props.history.push('/case/editor/create');
    }

    

    render() {
        const { infiniteStore, searchedInfiniteStore, loadMore, isLoading, isLoadingMore } = this.props.Case;

        let database = 
            this.props.search.keyword['cases'].length > 0 
            ? searchedInfiniteStore
            : infiniteStore;
        let { length } = database || [];

        // console.log(JSON.parse(JSON.stringify(database)))
        // console.log(lastPage, rest, loadMore)

        return (
            <div 
                className={cx('MyCases')} 
                ref={ref => {
                    this.myCases = ref;
                }}
            >
                <div className={cx('toolbar')}>
                    <SearchBar />
                </div>
                <div className={cx('list-container')}>
                    <ul className={cx('case-list', {isLoading})}>
                        {
                            length <= 0 && this.props.search.keyword['cases'].length > 0 &&
                            <div className={cx('no-results')}>
                                <span>{this.props.search.keyword['cases']}</span>의 해당하는 증례가 없습니다
                            </div>
                        }
                        {
                            !isLoading && length > 0 && this.props.search.keyword['cases'].length === 0 &&
                            <li onClick={this._handleClickOnButton} className={cx('add-case')}>
                                <FiPlus />
                                <span>새 증례</span>
                            </li>
                        }
                        {
                            !isLoading ?
                            database.map((Case, i) => {
                                return <CaseListItem Case={Case} key={i} isLoadingMore={this.props.Case.isLoadingMore}/>
                            })
                            : <Loader />
                        }
                        {
                            !isLoading && isLoadingMore &&
                            <div className={cx('status', 'loader-more')}>
                                <Loader />
                            </div>
                        }
                        {
                            length > 0 && loadMore && !isLoading && !isLoadingMore &&
                            <div 
                                className={cx('status','load-more')}
                                onClick={() => {
                                    if (this.props.search.keyword['cases'].length > 0) {
                                        this.props.Case.addToSearchedStore();
                                    } else {
                                        this.props.Case.addToInfiniteStore();
                                    }
                                }}
                            >
                                <div className={cx('btn-load-more')}>더 불러오기</div>
                            </div>
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default MyCases;