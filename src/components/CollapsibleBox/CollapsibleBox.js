import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './CollapsibleBox.module.scss';
import classNames from 'classnames/bind';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from '../../lib/react-icons/md';
import './tooltip.css';

const cx = classNames.bind(styles);

@inject('collapsible', 'lab')
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
    _handleClickToggle = (e) => {
        e.stopPropagation();
        let type = this.props.sidebar ? 'sidebar' : 'basic';
        if (this.props.short) {
            if (this.props.lab.editableData.length > 0) {
                return this.props.collapsible.toggleSwitch(type, this.props.detail);
            } else {
                return false;
            }
        } else {
            this.props.collapsible.toggleSwitch(type, this.props.detail);
        }
    }
    render() {
        const { open } = this.props.collapsible;
        let type = this.props.sidebar ? 'sidebar' : 'basic';
        let openSidebar = type === 'basic' ? open[type] : open[type][this.props.detail];
        const { editableData } = this.props.lab;
        let { length } = editableData;
        if (this.props.short) {
            return (
                <div className={cx('CollapsibleBox2', {active: length > 0}, {sidebar: this.props.sidebar}, {open: openSidebar === true})}>
                    <div
                        className={cx({tool: length <= 0})}
                        data-tip="혈액검사가 필요합니다"
                    >
                        <div className={cx('header')} onClick={this._handleClickToggle}>
                            <h5>
                                {this.props.title}
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
                            </h5>
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
                    <div className={cx('header')} onClick={this._handleClickToggle}>
                        <h5>
                            {this.props.title}
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
                        </h5>
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