import React, { Component } from 'react';
import styles from './LabBar.module.scss';
import classNames from 'classnames/bind';
import './LabBar.css';
import $ from 'jquery';

const cx = classNames.bind(styles);

class LabBar extends Component {
    _renderBar = () => {
        const {
            labs, categoryIndex, inputIndex, 
            changeValue, isEditing, index, 
            value, refMax = 100, refMin = 0
        } = this.props;

        let widthBar, widthCoverBar;
        widthBar = (( value - refMin ) / ( refMax - refMin )) * 100;
        if (widthBar > 101) {
            widthBar = 100;
        } else if (widthBar < 0) {
            widthBar = 0;
        }
        widthCoverBar = 100 - widthBar;
        return (
            <div className={cx('bar-container')}>
                <div className={cx('min')}>
                    <div className={cx('ref', 'refMin')}>{refMin}</div>
                </div>
                <div style={{left: `${widthBar}%`}} className={cx('current-position', {isEditing: isEditing})}>
                    {
                        isEditing ? 
                        <input 
                            name="value" 
                            id={`lab-bar-value-${categoryIndex}-${inputIndex}`} 
                            type="number"
                            placeholder="검사값" 
                            onChange={(e) => {
                                if (e.target.value === 0) {
                                    changeValue(index, '');
                                }
                                    changeValue(index, e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.keyCode === 38 || e.keyCode === 40) {
                                    e.preventDefault();
                                }
                                let categoryLength = labs.length;
                                let lastIndex;
                                if (categoryIndex - 1 >= 0) {
                                    lastIndex = labs[categoryIndex - 1].length - 1;
                                }

                                if (e.keyCode === 38) {
                                    if (inputIndex - 1 >= 0) {
                                        $(`#lab-bar-value-${categoryIndex}-${inputIndex - 1}`).focus();
                                    } else if (inputIndex - 1 < 0) {
                                        if (categoryIndex - 1 >= 0) {
                                            $(`#lab-bar-value-${categoryIndex - 1}-${lastIndex}`).focus();
                                        }
                                    }
                                }
                                if (e.keyCode === 40 || e.keyCode === 13) {
                                    if (inputIndex + 1 > labs[categoryIndex].length - 1) {
                                        if (categoryIndex + 1 <= categoryLength - 1) {
                                            $(`#lab-bar-value-${categoryIndex + 1}-${0}`).focus();
                                        } else {

                                        }
                                    }
                                    $(`#lab-bar-value-${categoryIndex}-${inputIndex + 1}`).focus();
                                }
                            }}
                            value={value}
                        />
                        :
                        value
                    }
                </div>
                <div className={cx('gauge')}></div>
                <div className={cx('gauge-cover')} style={{width: `${widthCoverBar}%`}}></div>
                <div className={cx('max')}><div className={cx('ref', 'refMax')}>{refMax}</div></div>
            </div>
        )
    }
    render() {
        return (
            <div className={cx('LabBar')}>
                {this._renderBar()}
            </div>
        );
    }
}

export default LabBar;