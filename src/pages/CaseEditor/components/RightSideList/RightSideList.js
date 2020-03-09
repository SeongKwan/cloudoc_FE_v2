import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './RightSideList.module.scss';
import classNames from 'classnames/bind';
import CollapsibleBox from '../../../../components/CollapsibleBox/CollapsibleBox';
import _ from 'lodash'

const cx = classNames.bind(styles);

@inject('lab')
@observer
class RightSideList extends Component {
    
    render() {
        const { editableData, lengthAlertMessage } = this.props.lab;
        let { length } = editableData;
        let sortedLab = _.sortBy(editableData, 'category')
        let title = length > 0 ? `주의사항(${lengthAlertMessage})` : '주의사항';
        return (
            <div className={cx('RightSideList', {active: length > 0})}>
                <CollapsibleBox 
                    short
                    title={title}
                    initOpen={false}
                    sidebar
                    detail="caution"
                >
                {
                    length > 0 &&
                    <ul className={cx('cautions')}>
                        {
                            sortedLab.map((lab, i) => {
                                
                                const {
                                    alertMin,
                                    alertMax,
                                    alertMessage,
                                    state,
                                    name
                                } = lab;
                                let showTooltip = (state === '매우 낮음' && !!alertMin) || (state === '매우 높음' && !!alertMax);
                                if (showTooltip) {
                                    return <li key={i}><span className={cx('lab-name', {high: state === '매우 높음'}, {low: state === '매우 낮음'})}>{name}</span> - {alertMessage}</li>   
                                }
                                return false;
                            })
                        }
                    </ul>
                }
                </CollapsibleBox>
                
            </div>
        );
    }
}

export default RightSideList;