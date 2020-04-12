import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './ResultDrug.module.scss';
import classNames from 'classnames/bind';
import ReactTooltip from 'react-tooltip';

const cx = classNames.bind(styles);

@withRouter
@inject( 'analyzeDrug', 'caseEditor' )
@observer
class ResultDrug extends Component {
    render() {
        const { drugDetail, anlDrug } = this.props;
        return (
            <div className={cx('results', 'drug', {openDetail: drugDetail})}>
                <ul className={cx('scroll-box')}>
                    {
                        anlDrug.map((anl, indexAnl) => {
                            const { openMores } = this.props.analyzeDrug;
                            const {
                                condition_id,
                                relatedDisease,
                                drugs
                            } = anl;

                            return <li key={indexAnl}>
                                <div className={cx('name-btn')}>
                                    <div className={cx('name', 'condition-name')}>
                                        <div data-type="drug" data-page="detail" onClick={(e) => {this.props.handleClickOnListitem(e, condition_id)}}>{relatedDisease}</div>
                                    </div>
                                </div>
                                
                                <div className={cx('more', 'drug')}>
                                    <div className={cx('row', 'evidence')}>
                                        <ul className={cx('content')}>
                                            {
                                                this.props.analyzeDrug.openMores.length > 0 &&
                                                drugs.map((drug, indexDrug) => {
                                                    const {
                                                        id, drugName, evidences
                                                    } = drug;
                                                    return <li key={indexDrug}>
                                                        <div className={cx('drug-container')}>
                                                            <div data-type="drug" data-page="drug" className={cx('drug-name')} onClick={(e) => {this.props.handleClickOnListitem(e, id)}}>
                                                                {drugName}
                                                            </div>
                                                            <div className={cx('btn-more')}>
                                                                <button onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            this.props.analyzeDrug.toggleOpenMores(indexAnl, indexDrug);
                                                                        }
                                                                    }
                                                                >
                                                                    {
                                                                        openMores[indexAnl][indexDrug] ? '닫기' : '분석'
                                                                    }
                                                                </button>
                                                            </div>
                                                            <div className={cx('btn-add')}>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        this.props.handleClickOnBtnAdd('drug', drugName, drug)
                                                                    }}
                                                                >
                                                                    입력
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {
                                                            openMores[indexAnl][indexDrug] &&
                                                            <ul className={cx('more', 'deep')}>
                                                                {
                                                                    evidences.length > 0 &&
                                                                    evidences.map((evi, i) => {
                                                                        const {
                                                                            evidence,
                                                                            references
                                                                        } = evi;
                                                                        return <li key={i}>
                                                                            <div className={cx('evidence')}>
                                                                                {evidence || '-'}
                                                                            </div>
                                                                            <div className={cx('references-wrapper')}>
                                                                                {
                                                                                    references.length > 0 &&
                                                                                    references.map((ref, i) => {
                                                                                        const {
                                                                                            reference_id,
                                                                                            reference_summary
                                                                                        } = ref;
                                                                                        return <div key={i}>
                                                                                            <div 
                                                                                                className={cx('drug')}
                                                                                                data-tip={reference_summary} 
                                                                                                data-for={`tooltip-evidence-${condition_id}-${id}-${i}`}
                                                                                                onClick={() => {
                                                                                                    if (!drugDetail && +reference_id > 0) {
                                                                                                        this.props.analyzeDrug.toggleOpenDetail();
                                                                                                    }
                                                                                                    this.props.caseEditor.loadReferenceByLink(reference_id);
                                                                                                }}
                                                                                            >
                                                                                                {reference_id}
                                                                                            </div>
                                                                                            <ReactTooltip className="custom-tooltip" place="top" effect="solid" id={`tooltip-evidence-${condition_id}-${id}-${i}`} />
                                                                                        </div>
                                                                                    })
                                                                                }
                                                                            </div>
                                                                            
                                                                        </li>
                                                                    })
                                                                }
                                                            </ul>
                                                        }
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default ResultDrug;