import React, { Component } from 'react';
import styles from './CheckBox.module.scss';
import classNames from 'classnames/bind';
import { inject, observer } from 'mobx-react';

const cx = classNames.bind(styles);

@inject('print')
@observer
class CheckBox extends Component {
    render() {
        const { itemName, content, labelTitle } = this.props;
        return (
            <li className={cx('checkbox')}>
                <div className={cx('input')}>
                    <input 
                        type="checkbox"
                        id={itemName}
                        name={itemName}
                        value={itemName}
                        checked={content}
                        onChange={(e) => {
                            this.props.print.switchContent(itemName, !content);
                        }}
                    />
                </div>
                <label className={cx('label')} htmlFor={itemName}>{labelTitle}</label>
            </li>
        );
    }
}

export default CheckBox;