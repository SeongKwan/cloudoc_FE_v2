import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './ResultCondition.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

@withRouter
@inject( 'analyzeSymptom' )
@observer
class ResultCondition extends Component {
    render() {
        const { symptomDetail, anlSymptom } = this.props;
        return (
            <div className={cx('results', {openDetail: symptomDetail})}>
                <ul className={cx('scroll-box')}>
                    {
                        this.props.analyzeSymptom.openMores.length > 0 &&
                        anlSymptom.map((anl, i) => {
                            const { openMores } = this.props.analyzeSymptom;
                            const {
                                conditionName,
                                analyzeSymptom,
                                analyzeLab,
                                id
                            } = anl;
                            const {
                                matchedItem,
                                unmatchedItem
                            } = analyzeSymptom;
                            const {
                                matchedItemWithState,
                                unmatchedItemWithState
                            } = analyzeLab;

                            return <li key={i}>
                                    <div className={cx('name-btn')}>
                                    <div className={cx('name', 'condition-name')}>
                                        <div data-type="condition" data-page="detail" onClick={(e) => {this.props.handleClickOnListitem(e, id)}}>{conditionName}</div>
                                    </div>
                                    
                                    <div className={cx('btn-more')}>
                                        <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.props.analyzeSymptom.toggleOpenMores(i);
                                                }
                                            }
                                        >
                                            {
                                                openMores[i] ? '닫기' : '분석'
                                            }
                                        </button>
                                    </div>
                                    <div className={cx('btn-add')}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.props.handleClickOnBtnAdd('condition', conditionName)
                                            }}
                                        >
                                            입력
                                        </button>
                                    </div>
                                </div>
                                {
                                    openMores[i] &&
                                    <div className={cx('more')}>
                                        <div className={cx('row', 'matched')}>
                                            <div className={cx('title')}>
                                                # 일치하는 증상/검사결과
                                            </div>
                                            <ul className={cx('content')}>
                                                {
                                                    matchedItem.length > 0 &&
                                                    matchedItem.map((item, i) => {
                                                        return <li key={i}>
                                                            <div className={cx('badge', 'symptom')}>[증상]</div>
                                                            <div> {item}</div>
                                                        </li>
                                                    })
                                                }
                                                {
                                                    matchedItemWithState.length > 0 &&
                                                    matchedItemWithState.map((item, i) => {
                                                        return <li key={i}>
                                                            <div className={cx('badge', 'lab')}>[혈검]</div>
                                                            <div> {item.name}</div>
                                                            <div> - {item.state}</div>
                                                        </li>
                                                    })
                                                }
                                                {
                                                    matchedItem.length < 1 && matchedItemWithState.length < 1 &&
                                                    <li>-</li>
                                                }
                                            </ul>
                                        </div>
                                        <div className={cx('row', 'unmatched')}>
                                            <div className={cx('title')}>
                                                # 불일치하는 증상/검사결과
                                            </div>
                                            <ul className={cx('content')}>
                                                {
                                                    unmatchedItem.length > 0 &&
                                                    unmatchedItem.map((item, i) => {
                                                        return <li key={i}>
                                                            <div className={cx('badge', 'symptom')}>[증상]</div>
                                                            <div> {item}</div>
                                                        </li>
                                                    })
                                                }
                                                {
                                                    unmatchedItemWithState.length > 0 &&
                                                    unmatchedItemWithState.map((item, i) => {
                                                        return <li key={i}>
                                                            <div className={cx('badge', 'lab')}>[혈검]</div>
                                                            <div> {item.name} </div>
                                                            <div> - {item.state}</div>
                                                        </li>
                                                    })
                                                }
                                                {
                                                    unmatchedItem.length < 1 && unmatchedItemWithState.length < 1 &&
                                                    <li>-</li>
                                                }
                                            </ul>
                                        </div>
                                        <div className={cx('row', 'be-advised')}>
                                            <div className={cx('title')}>
                                                # 추가확인이 필요한 증상/검사결과
                                            </div>
                                            <ul className={cx('content')}>
                                                {
                                                    analyzeSymptom.needToCheck.length > 0 &&
                                                    analyzeSymptom.needToCheck.map((item, i) => {
                                                        return <li key={i}>
                                                            <div className={cx('badge', 'symptom')}>[증상]</div>
                                                            <div> {item}</div>
                                                        </li>
                                                    })
                                                }
                                                {
                                                    analyzeLab.needToCheck.length > 0 &&
                                                    analyzeLab.needToCheck.map((item, i) => {
                                                        return <li key={i}>
                                                            <div className={cx('badge', 'lab')}>[혈검]</div>
                                                            <div> {item.name} </div>
                                                            <div> - {item.state}</div>
                                                        </li>
                                                    })
                                                }
                                                {
                                                    analyzeSymptom.needToCheck.length < 1 && analyzeLab.needToCheck.length < 1 &&
                                                    <li>-</li>
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                }
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default ResultCondition;