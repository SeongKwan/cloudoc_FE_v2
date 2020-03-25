import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './RightSideList.module.scss';
import classNames from 'classnames/bind';
import CollapsibleBox from '../../../../components/CollapsibleBox/CollapsibleBox';
import _ from 'lodash'
import {
    MdKeyboardArrowRight
} from 'react-icons/md';
import { getLocaleDateWithYMS } from '../../../../utils/momentHelper';

const cx = classNames.bind(styles);

@withRouter
@inject(
    'Case',
    'caseEditorBasic',
    'symptom',
    'lab',
    'diagnosis',
    'treatment', 
    'analyzeSymptom',
    'analyzeDrug',
    'analyzeTeaching',
    'teaching',
    'caseEditor'
)
@observer
class RightSideList extends Component {
    
    render() {
        const { editableData, lengthAlertMessage } = this.props.lab;
        let { length } = editableData;
        const { type, dateIndex, caseId } = this.props.match.params;
        const { isEditing, currentCaseRecord } = this.props.Case;
        const { caseEditorBasic, symptom, lab, diagnosis, treatment, teaching } = this.props;
        let difference = (
            caseEditorBasic.diff ||
            symptom.diff ||
            lab.diff ||
            diagnosis.diff ||
            treatment.diff ||
            treatment.diffForFormula ||
            teaching.diff
            ) ? true : false;
        let sortedLab = _.sortBy(editableData, 'category')
        let title = length > 0 ? `주의사항(${lengthAlertMessage})` : '주의사항';
        return (
            <div className={cx('RightSideList', {active: length > 0})}>
                {
                    (type === "create" || isEditing) &&
                    <>
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
                    </>
                }
                
                {
                    currentCaseRecord.length > 1 && type === 'detail' &&
                    <>
                        {
                            +dateIndex !== 0 &&
                            <div 
                            className={cx('nextRecord', 'btn-move-record')} 
                            onClick={() => {
                                if (isEditing) {
                                    if (difference) {
                                        if (window.confirm('저장되지 않은 내용이 있습니다. 저장하고 다른 진료일자로 바꾸시겠습니까?')) {
                                        return this.props.Case.updateCase(dateIndex)
                                            .then(res => {
                                                if (res) {
                                                    alert('정상적으로 수정되었습니다')
                                                }
                                            })
                                            .then(() => {
                                            this.props.history.push(`/case/editor/detail/${caseId}/${+dateIndex - 1}`)
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            });
                                        }
                                        return this.props.history.push(`/case/editor/detail/${caseId}/${+dateIndex - 1}`)
                                    }
                                }
                                return this.props.history.push(`/case/editor/detail/${caseId}/${+dateIndex - 1}`)
                            }}
                            >
                                <MdKeyboardArrowRight />
                                <div className={cx('date')}>{getLocaleDateWithYMS(currentCaseRecord[+dateIndex - 1])}</div>
                            </div>
                        }
                    </>
                }
                
            </div>
        );
    }
}

export default RightSideList;