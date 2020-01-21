import React from 'react';
import styles from './LabBar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const LabBar = ({value, unit, refMax = 100, refMin = 0, optMax, optMin, currentPosition, state, alertMin, alertMax }) => {

    const _renderBar = () => {
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
                <div style={{left: `${widthBar}%`}} className={cx('current-position')}>
                    {value}
                </div>
                <div className={cx('gauge')}>
                </div>
                <div className={cx('gauge-cover')} style={{width: `${widthCoverBar}%`}}></div>
                <div className={cx('max')}>
                    <div className={cx('ref', 'refMax')}>{refMax}</div>
                </div>
            </div>
        )
    }

    return (
        <div className={cx('LabBar')}>
            {
                _renderBar()
            }
            {/* <div className={cx('unit')}>[{unit}]</div> */}
        </div>
    );
};

export default LabBar;