import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './DetailTeaching.module.scss';
import classNames from 'classnames/bind';
import ReactTooltip from 'react-tooltip';

const cx = classNames.bind(styles);

@withRouter
@inject( 'analyzeTeaching', 'caseEditor', 'analyzeSymptom' )
@observer
class DetailTeaching extends Component {
    render() {
        const { teachingDetail } = this.props;
        const {
            name,
            detail,
            teaching,
            pathology,
            linked_symptoms,
            linked_drugs,
        } = this.props.analyzeSymptom.currentCondition;
        return (
            <div id="detail-container" className={cx('detail-container', {open: !this.props.analyzeTeaching.isLoading && teachingDetail})}>
            {
                <div className={cx('detail')}>
                    <ul className={cx('scroll-box')}>
                        <li>
                            <div className={cx('header')}>
                                <div className={cx('btn-close')}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.props.analyzeTeaching.closeDetail();
                                        }}
                                    >
                                        닫기
                                    </button>
                                </div>
                                <div className={cx('title')}>
                                    <div className={cx('box')}>{name}</div>
                                </div>
                            </div>
                            <div className={cx('top-content')}>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>질환설명</div>
                                    
                                    
                                    <div className={cx('box')}>
                                        {
                                            detail.map((detail, i) => {
                                                return <div key={i} className={cx('detail-item')}>
                                                    <div>
                                                        -&nbsp;{detail.description || '-'}&nbsp;
                                                        {
                                                            detail.description && 
                                                            <>
                                                                <div 
                                                                    data-tip={detail.ref_content} 
                                                                    data-for={`tooltip-detail-${i}`}
                                                                    className={cx('anchor')}
                                                                    key={i} 
                                                                    onClick={() => {
                                                                        if (+detail.ref_id > 0) {
                                                                            this.props.caseEditor.loadReferenceByLink(detail.ref_id)
                                                                        }
                                                                    }}
                                                                >
                                                                    [{detail.ref_id}]
                                                                </div>
                                                                <ReactTooltip className="custom-tooltip" place="bottom" effect="solid" id={`tooltip-detail-${i}`} />
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>관련기전</div>
                                    <div className={cx('box')}>
                                        {
                                            pathology.map((path, i) => {
                                                return <div key={i} className={cx('pathology-item')}>
                                                    <div className={cx('pathology-wrapper')}>
                                                        <div className={cx('pathology')}>
                                                            <div className={cx('pathology-content')}>
                                                                -&nbsp;{path.level1}&nbsp;
                                                                {
                                                                    path.level1 &&
                                                                    <>
                                                                        <div 
                                                                            data-tip={path.ref_content} 
                                                                            data-for={`tooltip-path-${i}`}
                                                                            className={cx('anchor')}
                                                                            key={i} 
                                                                            onClick={() => {
                                                                                if (+path.ref_id > 0) {
                                                                                    this.props.caseEditor.loadReferenceByLink(path.ref_id)
                                                                                }
                                                                            }}
                                                                        >
                                                                            [{path.ref_id}]
                                                                        </div>
                                                                        <ReactTooltip className="custom-tooltip" place="bottom" effect="solid" id={`tooltip-path-${i}`} />
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                        {
                                                            path.level2 !== undefined && path.level2 !== '' &&
                                                            <div className={cx('pathology')}>
                                                                <div className={cx('pathology-content')}>-&nbsp;{path.level2}&nbsp;</div>
                                                            </div>
                                                        }
                                                        {
                                                            path.level3 !== undefined && path.level3 !== '' &&
                                                            <div className={cx('pathology')}>
                                                                <div className={cx('pathology-content')}>-&nbsp;{path.level3}&nbsp;</div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>관련증상</div>
                                    <div className={cx('box')}>
                                        {
                                            linked_symptoms.map((symptom, i) => {
                                                return <div key={i} className={cx('symptom-item', 'linked')}>
                                                    <div>
                                                        -&nbsp;{symptom.name || '-'}&nbsp;
                                                        {
                                                            symptom.name &&
                                                            <>
                                                                <div 
                                                                    data-tip={symptom.ref_content} 
                                                                    data-for={`tooltip-symptom-${i}`}
                                                                    className={cx('anchor')}
                                                                    key={i} 
                                                                    onClick={() => {
                                                                        if (+symptom.ref_id > 0) {
                                                                            this.props.caseEditor.loadReferenceByLink(symptom.ref_id)
                                                                        }
                                                                    }}
                                                                >
                                                                    [{symptom.ref_id}]
                                                                </div>
                                                                <ReactTooltip className="custom-tooltip" place="bottom" effect="solid" id={`tooltip-symptom-${i}`} />
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>관련처방</div>
                                    <div className={cx('box')}>
                                        {
                                            linked_drugs.map((drug, i) => {
                                                return <div key={i} className={cx('drug-card', 'drug-item', 'linked', 'drug')}>
                                                    <div className={cx('drug-card-body')}>
                                                        <div className={cx('drug-label')}>
                                                            처방명
                                                        </div>
                                                        <div className={cx('drug-content')}>
                                                            {drug.name || '-'}
                                                        </div>
                                                    </div>
                                                    <div className={cx('drug-card-body')}>
                                                        <div className={cx('drug-label')}>
                                                            관련효능
                                                        </div>
                                                        <div className={cx('drug-content')}>
                                                            {drug.target_pathology || '-'}
                                                        </div>
                                                    </div>
                                                    <div className={cx('drug-card-body')}>
                                                        <div className={cx('drug-label')}>
                                                            관련연구결과
                                                        </div>
                                                        <div className={cx('drug-content')}>
                                                            {drug.effect || '-'}&nbsp;
                                                            {
                                                                drug.effect &&
                                                                <>
                                                                    <div 
                                                                        data-tip={drug.ref_content} 
                                                                        data-for={`tooltip-drug-${i}`}
                                                                        className={cx('anchor')}
                                                                        key={i} 
                                                                        onClick={() => {
                                                                        if (+drug.ref_id > 0) {
                                                                            this.props.caseEditor.loadReferenceByLink(drug.ref_id)
                                                                        }
                                                                    }}
                                                                    >
                                                                        [{drug.ref_id}]
                                                                    </div>
                                                                    <ReactTooltip className="custom-tooltip" place="bottom" effect="solid" id={`tooltip-drug-${i}`} />
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>

                                <div className={cx('divider', 'horizon-divider')}></div>

                                <div className={cx('content-wrapper')}>
                                    <div className={cx('label')}>환자지도</div>
                                    <div className={cx('box')}>
                                        {
                                            teaching.map((teach, i) => {
                                                return <div key={i} className={cx('teach-item')}>
                                                    <div>
                                                        -&nbsp;{teach.description}&nbsp;
                                                        {
                                                            teach.description &&
                                                            <>
                                                                <div 
                                                                    data-tip={teach.ref_content} 
                                                                    data-for={`tooltip-teach-${i}`}
                                                                    className={cx('anchor')}
                                                                    key={i} 
                                                                    onClick={() => {
                                                                        if (+teach.ref_id > 0) {
                                                                            this.props.caseEditor.loadReferenceByLink(teach.ref_id)
                                                                        }
                                                                    }}
                                                                >
                                                                    [{teach.ref_id}]
                                                                </div>
                                                                <ReactTooltip className="custom-tooltip" place="top" effect="solid" id={`tooltip-teach-${i}`} />
                                                            </>
                                                        }
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

export default DetailTeaching;