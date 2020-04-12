import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './DetailDrug.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

@withRouter
@inject( 'analyzeDrug', 'caseEditor' )
@observer
class DetailDrug extends Component {
    render() {
        const {
            description,
            category,
            reference,
            caution,
            guide,
            lifestyle,
            formula
        } = this.props.analyzeDrug.currentDrug;
        const { drugDetail } = this.props;
        return (
            <div className={cx('detail-container', {open: !this.props.analyzeDrug.isLoading && drugDetail})}>
            {
                <div className={cx('detail')}>
                    <ul className={cx('scroll-box')}>
                        <li>
                            <div className={cx('header')}>
                                <div className={cx('btn-close')}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.props.analyzeDrug.closeDetail();
                                        }}
                                    >
                                        닫기
                                    </button>
                                </div>
                                <div className={cx('title')}>
                                    <div className={cx('box')}>{this.props.analyzeDrug.currentDrug.name}</div>
                                </div>
                            </div>
                            <div className={cx('top-content')}>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>분류</div>
                                    
                                    
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {category || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>출전</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {reference || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>복약법</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {guide || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>주의사항</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {caution || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>처방설명</div>
                                    <div className={cx('box')}>
                                        <div className={cx('detail-item')}>
                                            <div>
                                                {description || '-'}
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
                                                {lifestyle || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>처방구성</div>
                                    <div className={cx('box')}>
                                        {
                                            formula.map((drug, i) => {
                                                return <div key={i} className={cx('teach-item')}>
                                                    <div>
                                                        -&nbsp;{drug.herbName}&nbsp;[{drug.dose}g / 일]
                                                    </div>
                                                </div>
                                            })
                                        }
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

export default DetailDrug;