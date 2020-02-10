import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './CollapsibleBox.module.scss';
import classNames from 'classnames/bind';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

const cx = classNames.bind(styles);

@inject('collapsible')
@observer
class CollapsibleBox extends Component {
    componentDidMount() {
        if (this.props.initOpen) {
            this.props.collapsible.toggleSwitch('basic', null);
        }
    }
    componentWillUnmount() {
        this.props.collapsible.clear();
    }
    _handleClickToggle = () => {
        let type = this.props.sidebar ? 'sidebar' : 'basic';
        this.props.collapsible.toggleSwitch(type, this.props.detail);
    }
    render() {
        const { open } = this.props.collapsible;
        let type = this.props.sidebar ? 'sidebar' : 'basic';
        let openSidebar = type === 'basic' ? open[type] : open[type][this.props.detail];
        if (this.props.short) {
            return (
                <div className={cx('CollapsibleBox2', {sidebar: this.props.sidebar}, {open: openSidebar === true})}>
                    <div className={cx('header')}>
                        <h5 onClick={this._handleClickToggle}>{this.props.title}</h5>
                        <div
                            onClick={this._handleClickToggle} 
                            className={cx('btn-toggle')}
                        >
                            {
                                openSidebar ?
                                <MdKeyboardArrowUp />
                                :
                                <MdKeyboardArrowDown />
                            }
                        </div>
                    </div>
                    {
                        openSidebar && 
                        <div className={cx('content')}>
                            {this.props.children}
                        </div>
                    }
                </div>
            );
        } else {
            return (
                <div className={cx('CollapsibleBox', {sidebar: this.props.sidebar}, {open: openSidebar === true})}>
                    <div className={cx('header')}>
                        <h5 onClick={this._handleClickToggle}>{this.props.title}</h5>
                        <div
                            onClick={this._handleClickToggle} 
                            className={cx('btn-toggle')}
                        >
                            {
                                openSidebar ?
                                <MdKeyboardArrowUp />
                                :
                                <MdKeyboardArrowDown />
                            }
                        </div>
                    </div>
                    {
                        openSidebar && 
                        <div className={cx('content')}>
                            {this.props.children}
                        </div>
                    }
                </div>
            );
        }
    }
}

export default CollapsibleBox;