import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './ResultTeaching.module.scss';
import classNames from 'classnames/bind';
import ReactTooltip from 'react-tooltip';

const cx = classNames.bind(styles);

@withRouter
@inject( 'analyzeTeaching', 'caseEditor' )
@observer
class ResultTeaching extends Component {
    render() {
        const { teachingDetail, anlTeaching } = this.props;
        return (
            <div className={cx('results', 'teaching', {openDetail: true})}>
                <ul className={cx('scroll-box')}>
                    {
                        this.props.analyzeTeaching.openMores.length > 0 &&
                        anlTeaching.map((anl, i) => {
                            const { openMores } = this.props.analyzeTeaching;
                            const {
                                condition_id,
                                relatedDisease,
                                teachings
                            } = anl;

                            if (teachings.length > 0) {
                            return <li key={i}>
                                    <div className={cx('name-btn')}>
                                        <div className={cx('name', 'teaching-name')}>
                                            <div data-type="teaching" data-page="detail" onClick={(e) => {this.props.handleClickOnListitem(e, condition_id)}}>{relatedDisease}</div>
                                        </div>
                                        <div className={cx('btn-more')}>
                                            <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.props.analyzeTeaching.toggleOpenMores(i);
                                                }}>
                                                    {
                                                        openMores[i] ? '닫기' : '분석'
                                                    }
                                            </button>
                                        </div>
                                        <div className={cx('btn-add')}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.props.handleClickOnBtnAdd('teaching_all', '지도법', teachings)
                                                }}
                                            >
                                                모두입력
                                            </button>
                                        </div>
                                    </div>
                                    {
                                        openMores[i] &&
                                        <div className={cx('more')}>
                                            <div className={cx('row', 'matched')}>
                                                <ul className={cx('content')}>
                                                    {
                                                        teachings.length > 0 && teachings.map((teach, i) => {
                                                            const { 
                                                                description,
                                                                reference_id,
                                                                reference_summary
                                                            } = teach;
                                                            return <li key={i}>
                                                                    <div 
                                                                        className={cx('description')}
                                                                        data-tip={reference_summary} 
                                                                        data-for={`tooltip-teaching-${i}`}
                                                                        onClick={() => {
                                                                            if (!teachingDetail && +reference_id > 0) {
                                                                                this.props.analyzeTeaching.toggleOpenDetail();
                                                                            }
                                                                            this.props.caseEditor.loadReferenceByLink(reference_id);
                                                                        }}
                                                                    >
                                                                        {description}
                                                                    </div>
                                                                    <ReactTooltip className="custom-tooltip" place="right" effect="solid" id={`tooltip-teaching-${i}`} />
                                                                
                                                                <div className={cx('btn-add')}>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            this.props.handleClickOnBtnAdd('teaching', '지도법', teach)
                                                                        }}
                                                                    >
                                                                        입력
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    }
                                </li>
                            } else {
                                return false;
                            }
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default ResultTeaching;