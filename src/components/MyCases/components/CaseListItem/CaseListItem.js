import React, { Component } from 'react';
import styles from './CaseListItem.module.scss';
import classNames from 'classnames/bind';
import { GoPerson } from "../../../../lib/react-icons/go";
import { CsSmartCondition, CsSmartDrug } from "../../../../lib/react-icons/fi";
import { FaNotesMedical } from "../../../../lib/react-icons/fa";
import { Link } from 'react-router-dom';
import { getLocaleSemiDateWithTime } from '../../../../utils/momentHelper';

const cx = classNames.bind(styles);

class CaseListItem extends Component {
    render() {
        const { Case } = this.props;
        const caseId = Case._id;
        const {
            gender,
            age
        } = Case.patient;
        
        let latestRecordIndex;

        if (Case.record.length === 0) {
            latestRecordIndex = 0;
        } else if (Case.record.length > 0) {
            latestRecordIndex = Case.record.length - 1;
        }
        
        const { symptom, diagnosis, treatment } = Case.record[latestRecordIndex] || [];
        const semiDate = getLocaleSemiDateWithTime(Case.created_date);

        return (
            <Link to={`/case/editor/detail/${caseId}/0`} 
                onClick={(e) => {
                    if (this.props.isLoadingMore) {
                        return e.preventDefault();
                        
                    } else {
                        
                    }
                }}
            >
                <li className={cx('CaseListItem')}>
                    <div className={cx('wrapper-top')}>
                        <div className={cx('memo')}>{Case.title || '빈 제목...'}</div>
                        <div className={cx('date-qna')}>
                            <div className={cx('created-at')}>
                                {semiDate}
                            </div>
                            <div className={cx('qna')}>
                                <div className={cx('count', 'question-count')}><div>질문</div><div className={cx('number')}>8</div></div>
                                <div className={cx('count', 'answer-count')}><div>답변</div><div className={cx('number')}>5</div></div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('divider-horizon')}></div>
                    <div className={cx('wrapper-bottom')}>
                        <div className={cx('flexbox', 'patient')}>
                            <span className={cx('label')}><GoPerson /></span>
                            <div className={cx('content')}>
                                {gender === 'male' ? '남자' : '여자'}, 만 {age}세
                            </div>
                        </div>
                        <div className={cx('flexbox', 'symptom')}>
                            <span className={cx('label')}><CsSmartCondition /></span>
                            <div className={cx('content')}>
                                {_renderSymptom(symptom)}
                            </div>
                        </div>
                        <div className={cx('flexbox', 'condition')}>
                            <span className={cx('label')}><FaNotesMedical /></span>
                            <div className={cx('content')}>
                                {_renderCondition(diagnosis)}
                            </div>
                        </div>
                        <div className={cx('flexbox', 'drug')}>
                            <span className={cx('label')}><CsSmartDrug /></span>
                            <div className={cx('content')}>
                                {_renderTreatments(treatment)}
                            </div>
                        </div>
                    </div>
                </li>
            </Link>
        );
    }
}

const _renderSymptom = (symptoms = []) => {

    return symptoms.map((symptom, i) => {
        let rest = symptoms.length - 3;
        const { name } = symptom;
        if (i === 3) {
            return <div key={i} className={cx('item')}>... <span>({`${rest}`})</span></div>
        } else if (i > 3) {
            return false;
        }
        return (
            <div key={i} className={cx('item')}>{name}</div>
        );
    })
}

const _renderCondition = (conditions =[]) => {
    return conditions.map((condition, i) => {
        const { name } = condition;
        let rest = conditions.length - 2;
        if (i === 2) {
            return <div key={i} className={cx('item')}>... <span>({`${rest}`})</span></div>
        } else if (i > 2) {
            return false;
        }
        return (
            <div key={i} className={cx('item')}>{name}</div>
        );
    
    })
}

const _renderTreatments = (treatment = []) => {
    const { drugName } = treatment;
    return (
        <div className={cx('item')}>{drugName}</div>
    );
}

export default CaseListItem;