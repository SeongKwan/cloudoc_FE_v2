import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './LayoutCloudoc.module.scss';
import classNames from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import HeaderCloudoc from '../HeaderCloudoc';
import FooterCloudoc from '../FooterCloudoc';
import $ from 'jquery';

const cx = classNames.bind(styles);

@withRouter
@inject('auth', 'Case', 'search', 'login', 'user')
@observer
class LayoutCloudoc extends Component {
    state = {
        loadingState: false
    };
    componentDidMount() {
        // this.setState({loadingState: false});
        window.addEventListener("scroll", () => {
            this._loadCases();
        });
    }
    
    componentWillUnmount() {
        window.removeEventListener("scroll", () => {
            this._loadCases();
        });
    }
    

    _loadCases = () => {
        const { loadMore } = this.props.Case;
        const totalHeight = Math.floor($(this.layout).prop("scrollHeight"));
        const windowHeight = Math.floor($(window).height());
        const offset = 150;
        
        
        // IE에서는 document.documentElement 를 사용.
        const scrollTop = Math.floor($(window).scrollTop());
        if (totalHeight - windowHeight - scrollTop <= offset) {
            if(!this.state.loadingState) {
                if (loadMore) {
                    // this.setState({ loadingState: true });
                    this.props.Case.setIsLoadingMore(true);
                    if (this.props.search.keyword['cases'] === '') {
                        setTimeout(() => {
                            this.props.Case.addToInfiniteStore();
                        }, 0);
                    } else if (this.props.search.keyword['cases'] !== '') {
                        setTimeout(() => {
                            this.props.Case.addToSearchedStore();
                        }, 0);
                    }
                }
            }
        } else {
            if (this.state.loadingState) {
                // this.setState({ loadingState: false });
            }
        }
    }


    render() {
        const { children } = this.props;
        
        return (
            <div className={cx('LayoutCloudoc')} ref={ref => {
                    this.layout = ref;
                }}>
                <div className={cx('app-cover', {cover: this.props.auth.expiredToken})}></div>
                <div className={cx('header-container')}>
                    <HeaderCloudoc />
                </div>
                <main className={cx('main-container')}>
                    {children}
                </main>
                <footer className={cx('footer-container')}>
                    <FooterCloudoc />
                </footer>
            </div>
        );
    }
}

LayoutCloudoc.propTypes = {
    children: PropTypes.object
}

export default LayoutCloudoc;