import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './LeftSideToolbar.module.scss';
import classNames from 'classnames/bind';
// import Floater from 'react-floater';
import './LeftSideToolbar.css';
import ReactTooltip from 'react-tooltip'
import $ from 'jquery';

// import { 
//     CsSmartCondition,
//     CsSmartDrug,
//     CsTeaching
// } from "react-icons/fi";
import { 
    FaUserCheck,
    FaNotesMedical,
    FaChalkboard
} from "react-icons/fa"; 


const cx = classNames.bind(styles);

@inject(
    'Case',
    'caseEditorBasic',
    'symptom',
    'lab',
    'diagnosis',
    'treatment', 
    'analyzeSymptom',
    'analyzeDrug'
)
@observer
class LeftSideToolbar extends Component {
    state = {
        openList: '',
        diagnosisScrollTop: 0
    }
    componentDidMount() {
        let scrollBox = $('#case-editor-center-container-scroll-box');
        let objDiv = $('#case-editor-diagnosis');
        let THIS = this;
        let offset1 = objDiv.position();
        let adj1 = offset1.top;
        setTimeout(() => {
            THIS.setState({diagnosisScrollTop: scrollBox.scrollTop() + adj1})
        }, 100)
        scrollBox.on('scroll', this._setScrollTop);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState) {
        let scrollBox = $('#case-editor-center-container-scroll-box');
        let objDiv = $('#case-editor-diagnosis');
        let offset1 = objDiv.position();
        let adj1 = offset1.top;
        let currentScrollTop = scrollBox.scrollTop() + adj1;
        if (prevState.diagnosisScrollTop !== currentScrollTop) {
            this.setState({diagnosisScrollTop: currentScrollTop});
        }
    }

    componentWillUnmount() {
        let scrollBox = $('#case-editor-center-container-scroll-box');
        scrollBox.off('scroll', this._setScrollTop);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    _setScrollTop = () => {
        let scrollBox = $('#case-editor-center-container-scroll-box');
        let objDiv = $('#case-editor-diagnosis');
        let offset = objDiv.position();
        let adj = offset.top
        this.setState({diagnosisScrollTop: scrollBox.scrollTop() + adj})
    }

    _handleOnClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { dataset } = e.currentTarget;
        this._handleAnalyze(dataset.anl);
        if (this.state.openList !== dataset.type) {
            this.setState({openDetail: ''});
            this.props.analyzeSymptom.closeDetail();
        }
        this.setState({openList: dataset.type});
    }

    _handleClick = (e) => {
        console.log(e.target)
    }
    
    _handleClickOnListitem = (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        const { dataset } = e.target;
        let symptomDetail = this.props.analyzeSymptom.openDetail;
        let drugDetail = this.props.analyzeDrug.openDetail;

        if (dataset.type === 'condition') {
            if (!symptomDetail) {
                this.props.analyzeSymptom.toggleOpenDetail();
                this.props.analyzeSymptom.loadCondition(id);
            } else {
                this.props.analyzeSymptom.loadCondition(id);
            }
        } else if (dataset.type === 'drug') {
            if (!drugDetail) {
                this.props.analyzeDrug.toggleOpenDetail();
                this.props.analyzeDrug.loadDrug(id);
            } else {
                this.props.analyzeDrug.loadDrug(id);
            }
        }


    }

    handleClickOutside = (event) => {
        if (this.toolbar && !this.toolbar.contains(event.target)) {
            this.setState({openList: ''});
            this.props.analyzeSymptom.clearOpen();
            this.props.analyzeDrug.clearOpen();
        }
    }

    _handleAnalyze = (type) => {
        let referenceData = {};
        const symptom = JSON.parse(JSON.stringify(this.props.symptom.editableData));
        const exam = [];
        const lab = JSON.parse(JSON.stringify(this.props.lab.editableData));
        const diagnosis = JSON.parse(JSON.stringify(this.props.diagnosis.editableData));

        referenceData = {
            symptom: symptom.slice(),
            exam: exam.slice(),
            lab: lab.slice(),
            diagnosis: diagnosis.slice()
        }

        
        if (type === 'symptom') {
            this.props.analyzeSymptom.clear();
            this.props.Case.analyzeSymptom(referenceData)
            .then(result => {
                let countResult = result.length;
                if (countResult === 0) alert('해당하는 분석결과가 없습니다');
                this.props.analyzeSymptom.initiateOpen();
            });
            return null;
        } else if (type === 'drug') {
            this.props.analyzeDrug.clear();
            this.props.Case.analyzeTreatment(referenceData)
            .then(result => {
                let countResult = result.length;
                if (countResult === 0) alert('해당하는 분석결과가 없습니다');
                this.props.analyzeDrug.initiateOpen();
            });
            return null;
        }
    }

    _handleClickOnBtnAdd = (type, name, drug = null) => {
        
        if (type === "condition") {
            this.props.diagnosis.addDiagnosis(null, null, name);
            let scrollBox = $('#case-editor-center-container-scroll-box');

            scrollBox.animate({scrollTop: this.state.diagnosisScrollTop});
        }
        if (type === "drug" && !!drug) {
            this.props.treatment.handleChangeTretment('drugName', name);
            this.props.treatment.autoSetDrug({_id: drug.id});
            let objDiv = $('#case-editor-center-container-scroll-box');
            let h = objDiv.get(0).scrollHeight;
            objDiv.animate({scrollTop: h});
            this.props.analyzeDrug.clearOpen();
            this.setState({openList: ''});
        }
    }

    render() {
        const { openList } = this.state;
        const {
            name,
            detail,
            teaching,
            pathology,
            linked_symptoms,
            linked_drugs,
        } = this.props.analyzeSymptom.currentCondition;

        const {
            description,
            category,
            reference,
            caution,
            guide,
            lifestyle,
            formula
        } = this.props.analyzeDrug.currentDrug;
        
        let symptomDetail, drugDetail;
        // symptomMores = this.props.analyzeSymptom.openMores;
        symptomDetail = this.props.analyzeSymptom.openDetail;
        drugDetail = this.props.analyzeDrug.openDetail;
        // drugMores = this.props.analyzeDrug.openMores;
        // console.log(JSON.parse(JSON.stringify(this.props.analyzeDrug.openMores)))
        // console.log(JSON.parse(JSON.stringify(openDetails)))
        const anlSymptom = this.props.analyzeSymptom.editableData;
        const anlDrug = this.props.analyzeDrug.editableData;

        
        return (
            <div className={cx('LeftSideToolbar', {openList: openList !== ''})} ref={ref => this.toolbar = ref}>
                
                <div className={cx('btn')} id="btn-smart-condition" data-anl="symptom" data-type="condition" onClick={this._handleOnClick} >
                    <FaUserCheck />
                    <div className={cx('label')}>스마트진단</div>
                </div>
                <div className={cx('btn')} data-type="drug" data-anl="drug" onClick={this._handleOnClick} >
                    <FaNotesMedical />
                    <div className={cx('label')}>스마트처방</div>
                </div>
                <div className={cx('btn')} data-type="teaching" data-anl="teaching" onClick={this._handleOnClick} >
                    <FaChalkboard />
                    <div className={cx('label')}>스마트티칭</div>
                    
                </div>
                <div className={cx('content-container')}>
                    {
                        openList === 'condition' &&
                        <div className={cx('results', {openDetail: symptomDetail})}>
                            <ul className={cx('scroll-box')}>
                                {
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
                                                    <div data-type="condition" onClick={(e) => {this._handleClickOnListitem(e, id)}}>{conditionName}</div>
                                                </div>
                                                <div className={cx('btn-more')}>
                                                    <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.props.analyzeSymptom.toggleOpenMores(i);
                                                            }
                                                        }
                                                    >
                                                        {
                                                            openMores[i] ? '닫기' : '더보기'
                                                        }
                                                    </button>
                                                </div>
                                                <div className={cx('btn-add')}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            this._handleClickOnBtnAdd('condition', conditionName)
                                                        }}
                                                    >
                                                        선택
                                                    </button>
                                                </div>
                                            </div>
                                            {
                                                openMores[i] &&
                                                <div className={cx('more')}>
                                                    <div className={cx('row', 'matched')}>
                                                        <div className={cx('title')}>
                                                            일치하는 증상/검사결과
                                                        </div>
                                                        <ul className={cx('content')}>
                                                            {
                                                                matchedItem.length > 0 &&
                                                                matchedItem.map((item, i) => {
                                                                    return <li key={i}>
                                                                        <div>[증상]</div>
                                                                        <div> {item}</div>
                                                                    </li>
                                                                })
                                                            }
                                                            {
                                                                matchedItemWithState.length > 0 &&
                                                                matchedItemWithState.map((item, i) => {
                                                                    return <li key={i}>
                                                                        <div>[혈검]</div>
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
                                                            불일치하는 증상/검사결과
                                                        </div>
                                                        <ul className={cx('content')}>
                                                            {
                                                                unmatchedItem.length > 0 &&
                                                                unmatchedItem.map((item, i) => {
                                                                    return <li key={i}>
                                                                        <div>[증상]</div>
                                                                        <div> {item}</div>
                                                                    </li>
                                                                })
                                                            }
                                                            {
                                                                unmatchedItemWithState.length > 0 &&
                                                                unmatchedItemWithState.map((item, i) => {
                                                                    return <li key={i}>
                                                                        <div>[혈검]</div>
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
                                                            추가확인이 필요한 증상/검사결과
                                                        </div>
                                                        <ul className={cx('content')}>
                                                            <li>항목1</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            }
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    }
                    {
                        openList === 'drug' &&
                        <div className={cx('results', 'drug', {openDetail: drugDetail})}>
                            <ul className={cx('scroll-box')}>
                                {
                                    anlDrug.map((anl, i) => {
                                        const { openMores } = this.props.analyzeDrug;
                                    const {
                                        id,
                                        drugName,
                                        evidence,
                                    } = anl;
                                        return <li key={i}>
                                        <div className={cx('name-btn')}>
                                                <div className={cx('name', 'condition-name')}>
                                                    <div data-type="drug" onClick={(e) => {this._handleClickOnListitem(e, id)}}>{drugName}</div>
                                                </div>
                                                <div className={cx('btn-more')}>
                                                    <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.props.analyzeDrug.toggleOpenMores(i);
                                                            }
                                                        }
                                                    >
                                                        {
                                                            openMores[i] ? '닫기' : '더보기'
                                                        }
                                                    </button>
                                                </div>
                                                <div className={cx('btn-add')}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            this._handleClickOnBtnAdd('drug', drugName, anl)
                                                        }}
                                                    >
                                                        선택
                                                    </button>
                                                </div>
                                            </div>
                                            {
                                                openMores[i] &&
                                                <div className={cx('more')}>
                                                    <div className={cx('row', 'evidence')}>
                                                        <div className={cx('title')}>
                                                            관련 연구결과
                                                        </div>
                                                        <ul className={cx('content')}>
                                                            <li>{evidence}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            }
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    }
                    {
                        openList === 'teaching' &&
                        <div className={cx('results', 'teaching', {openDetail: true})}>
                            <ul className={cx('scroll-box')}>
                                <li>
                                    <div className={cx('name-btn')}>
                                        <div className={cx('name', 'teaching-name')}>
                                            <div data-type="teaching" onClick={this._handleClickOnListitem}>진단명 (3)</div>
                                        </div>
                                        <div className={cx('btn-more')}>
                                            <button onClick={() => {this.setState({openMore: !this.state.openMore})}}>
                                                {
                                                    this.state.openMore ? '줄이기' : '더보기'
                                                }
                                            </button>
                                        </div>
                                        <div className={cx('btn-add')}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this._handleClickOnBtnAdd('teaching', '지도법')
                                                }}
                                            >
                                                선택
                                            </button>
                                        </div>
                                    </div>
                                    {
                                        this.state.openMore &&
                                        <div className={cx('more')}>
                                            <div className={cx('row', 'matched')}>
                                                <ul className={cx('content')}>
                                                    <li>환자지도 내용1</li>
                                                    <li>환자지도 내용2</li>
                                                    <li>환자지도 내용3</li>
                                                </ul>
                                            </div>
                                        </div>
                                    }
                                </li>
                            </ul>
                        </div>
                    }
                </div>









                {
                    !this.props.analyzeSymptom.isLoading && symptomDetail &&
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
                                                        this.props.analyzeSymptom.closeDetail();
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
                                                                            <Link 
                                                                                data-tip={detail.ref_content} 
                                                                                data-for={`tooltip-detail-${i}`}
                                                                                className={cx('anchor')}
                                                                                key={i} 
                                                                                to={`/cloudoc/clinicaldb/detail/reference/link/${detail.ref_id}`}
                                                                                target='_blank'
                                                                            >
                                                                                [{detail.ref_id}]
                                                                            </Link>
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
                                                                                    <Link 
                                                                                        data-tip={path.ref_content} 
                                                                                        data-for={`tooltip-path-${i}`}
                                                                                        className={cx('anchor')}
                                                                                        key={i} 
                                                                                        to={`/cloudoc/clinicaldb/detail/reference/link/${path.ref_id}`}
                                                                                        target='_blank'
                                                                                    >
                                                                                        [{path.ref_id}]
                                                                                    </Link>
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
                                                                            <Link 
                                                                                data-tip={symptom.ref_content} 
                                                                                data-for={`tooltip-symptom-${i}`}
                                                                                className={cx('anchor')}
                                                                                key={i} 
                                                                                to={`/cloudoc/clinicaldb/detail/reference/link/${symptom.ref_id}`}
                                                                                target='_blank'
                                                                            >
                                                                                [{symptom.ref_id}]
                                                                            </Link>
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
                                                                                <Link 
                                                                                    data-tip={drug.ref_content} 
                                                                                    data-for={`tooltip-drug-${i}`}
                                                                                    className={cx('anchor')}
                                                                                    key={i} 
                                                                                    to={`/cloudoc/clinicaldb/detail/reference/link/${drug.ref_id}`}
                                                                                    target='_blank'
                                                                                >
                                                                                    [{drug.ref_id}]
                                                                                </Link>
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
                                                                            <Link 
                                                                                data-tip={teach.ref_content} 
                                                                                data-for={`tooltip-teach-${i}`}
                                                                                className={cx('anchor')}
                                                                                key={i} 
                                                                                to={`/cloudoc/clinicaldb/detail/reference/link/${teach.ref_id}`}
                                                                                target='_blank'
                                                                            >
                                                                                [{teach.ref_id}]
                                                                            </Link>
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
                }






                {
                    !this.props.analyzeDrug.isLoading && drugDetail &&
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
                }
            </div>
        );
    }
}

export default LeftSideToolbar;