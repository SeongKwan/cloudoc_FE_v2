import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './ReferenceCondition.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

@withRouter
@inject( 'analyzeSymptom', 'caseEditor' )
@observer
class ReferenceCondition extends Component {
    render() {
        const { symptomDetail } = this.props;
        const { currentReference } = this.props.caseEditor;
        return (
            <div className={cx('detail-container', {open: !this.props.analyzeSymptom.isLoading && symptomDetail})}>
            {
                <div className={cx('detail')}>
                    <ul className={cx('scroll-box')}>
                        <li>
                            <div className={cx('header')}>
                                <div className={cx('btn-close')}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.props.caseEditor.setPageType('detail');
                                        }}
                                    >
                                        뒤로
                                    </button>
                                </div>
                                <div className={cx('title')}>
                                    <div className={cx('box')}>{currentReference.name}</div>
                                </div>
                            </div>
                            <div className={cx('top-content')}>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>분류</div>
                                    
                                    
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.category || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>연구분류</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.method || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>저자</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.author || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>출판연도</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.year || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>출판사(저널명)</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.publisher || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>원문링크</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.url || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>참고사항</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.memo || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>주요내용</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.description || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>연구방법</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {currentReference.methodDetail || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            }
        </div>
        );
    }
}

export default ReferenceCondition;