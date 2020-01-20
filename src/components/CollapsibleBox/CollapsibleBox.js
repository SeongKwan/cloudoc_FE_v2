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
            this.props.collapsible.initOpen();
        }
    }
    componentWillUnmount() {
        this.props.collapsible.clear();
    }
    _handleClickToggle = () => {
        this.props.collapsible.toggleSwitch();
    }
    render() {
        const { open } = this.props.collapsible;
        return (
            <div className={cx('CollapsibleBox', {open: open === true})}>
                <div className={cx('header')}>
                    <h5 onClick={this._handleClickToggle}>{this.props.title}</h5>
                    <div
                        onClick={this._handleClickToggle} 
                        className={cx('btn-toggle')}
                    >
                        {
                            open ?
                            <MdKeyboardArrowUp />
                            :
                            <MdKeyboardArrowDown />
                        }
                    </div>
                </div>
                {
                    open && 
                    <div className={cx('content')}>
                        {this.props.children}
                    </div>
                }
            </div>
        );
    }
}

export default CollapsibleBox;