import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './LeftSideToolbar.module.scss';
import classNames from 'classnames/bind';
import './LeftSideToolbar.css';
import ReactTooltip from 'react-tooltip';
import $ from 'jquery';
// import Info from '../../../../styles/img/info.png';
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
    'analyzeDrug',
    'analyzeTeaching',
    'teaching',
    'caseEditor'
)
@observer
class LeftSideToolbar extends Component {
    state = {
        openList: '',
        diagnosisScrollTop: 0,
        drugScrollTop: 0
    }
    componentDidMount() {
        if (this.props.Case.isEditing || this.props.type === "create") {
            let scrollBox = $('#case-editor-center-container-scroll-box');
            let objDiv = $('#case-editor-diagnosis');
            let objDivDrug = $('#case-editor-drug');
            if (!scrollBox || !objDiv || !objDivDrug) {
                return false;
            }
            let THIS = this;
            let offset1 = objDiv.position();
            let adj1 = offset1.top;
            let offset2 = objDivDrug.position();
            let adj2 = offset2.top;
            setTimeout(() => {
                THIS.setState({diagnosisScrollTop: scrollBox.scrollTop() + adj1, drugScrollTop: scrollBox.scrollTop() + adj2})
            }, 100)
            scrollBox.on('scroll', this._setScrollTop);
        }
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Case.isEditing || this.props.type === "create") {
            let scrollBox = $('#case-editor-center-container-scroll-box');
            let objDiv = $('#case-editor-diagnosis');
            if (scrollBox.lenght <= 0 || objDiv.length <= 0) {
                return false;
            }
            let offset1 = objDiv.position();
            let adj1 = offset1.top;
            let currentScrollTop = scrollBox.scrollTop() + adj1;
            if (prevState.diagnosisScrollTop !== currentScrollTop) {
                this.setState({diagnosisScrollTop: currentScrollTop});
            }
        }
    }

    componentWillUnmount() {
        let scrollBox = $('#case-editor-center-container-scroll-box');
        if (scrollBox.length > 0) {
            scrollBox.off('scroll', this._setScrollTop);
        }
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    _setScrollTop = () => {
        let scrollBox = $('#case-editor-center-container-scroll-box');
        let objDiv = $('#case-editor-diagnosis');
        let objDivDrug = $('#case-editor-drug');
        if (objDiv.length > 0) {
            let offset = objDiv.position();
            let adj = offset.top;
            let offset2 = objDivDrug.position();
            let adj2 = offset2.top;
            this.setState({diagnosisScrollTop: scrollBox.scrollTop() + adj, drugScrollTop: scrollBox.scrollTop() + adj2})
        }
    }

    // 스마트도구 버튼
    _handleOnClick = (e) => {
        const { dataset } = e.currentTarget;

        if (dataset.disabled === 'true') {
            return false;
        }
        
        e.preventDefault();
        e.stopPropagation();
        this._handleAnalyze(dataset.anl);
        if (this.state.openList !== dataset.type) {
            this.setState({openDetail: ''});
            this.props.analyzeSymptom.closeDetail();
            this.props.analyzeDrug.closeDetail();
            this.props.analyzeTeaching.closeDetail();
        }
        this.setState({openList: dataset.type});
    }

    // _handleClick = (e) => {
    //     console.log(e.target)
    // }
    
    // 진단, 처방 리스트
    _handleClickOnListitem = (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        const { dataset } = e.target;
        let symptomDetail = this.props.analyzeSymptom.openDetail;
        let drugDetail = this.props.analyzeDrug.openDetail;
        let teachingDetail = this.props.analyzeTeaching.openDetail;

        this.props.caseEditor.setPageType(dataset.page);

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
                if (dataset.page === 'detail') {
                    this.props.analyzeSymptom.loadCondition(id);
                } else {
                    this.props.analyzeDrug.loadDrug(id);
                }
            } else {
                if (dataset.page === 'detail') {
                    this.props.analyzeSymptom.loadCondition(id);
                } else {
                    this.props.analyzeDrug.loadDrug(id);
                }
            }
        } else if (dataset.type === 'teaching') {
            if (!teachingDetail) {
                this.props.analyzeTeaching.toggleOpenDetail();
                if (dataset.page === 'detail') {
                    this.props.analyzeSymptom.loadCondition(id);
                }
            } else {
                if (dataset.page === 'detail') {
                    this.props.analyzeSymptom.loadCondition(id);
                }
            }
        }

        setTimeout(() => {
            $('#detail-container ul').scrollTop(0);
        }, 50);
        

    }

    handleClickOutside = (event) => {
        if (this.toolbar && !this.toolbar.contains(event.target)) {
            this.setState({openList: ''});
            this.props.analyzeSymptom.clearOpen();
            this.props.analyzeDrug.clearOpen();
            this.props.analyzeTeaching.clearOpen();
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
            if (!this.props.analyzeSymptom.isLoading) {
                this.props.Case.analyzeSymptom(referenceData)
                .then(result => {
                    let countResult = result.length;
                    if (countResult === 0) alert('해당하는 분석결과가 없습니다');
                    this.props.analyzeSymptom.initiateOpen();
                });
            }
            return null;
        } else if (type === 'drug') {
            this.props.analyzeDrug.clear();
            if (!this.props.analyzeDrug.isLoading) {
                this.props.Case.analyzeTreatment(referenceData)
                .then(result => {
                    let countResult = result.length;
                    if (countResult === 0) alert('해당하는 분석결과가 없습니다');
                    this.props.analyzeDrug.initiateOpen();
                });
            }
            return null;
        } else if (type === 'teaching') {
            this.props.analyzeTeaching.clear();
            if (!this.props.analyzeTeaching.isLoading) {
                this.props.Case.analyzeTeaching(referenceData)
                .then(result => {
                    let countResult = result.length;
                    if (countResult === 0) alert('해당하는 분석결과가 없습니다');
                    this.props.analyzeTeaching.initiateOpen();
                });
            }
            return null;
        }
    }

    _handleClickOnBtnAdd = (type, name, data = null) => {
        let scrollBox = $('#case-editor-center-container-scroll-box');
        
        if (type === "condition") {
            this.props.diagnosis.addDiagnosis(null, null, name);

            scrollBox.animate({scrollTop: this.state.diagnosisScrollTop});
        }
        if (type === "drug" && !!data) {
            this.props.treatment.handleChangeTretment('drugName', name);
            this.props.treatment.autoSetDrug({_id: data.id});
            // let objDiv = $('#case-editor-center-container-scroll-box');
            // let h = objDiv.get(0).scrollHeight;
            // objDiv.animate({scrollTop: h});
            scrollBox.animate({scrollTop: this.state.drugScrollTop});
            this.props.analyzeDrug.clearOpen();
            this.setState({openList: ''});
        }
        if (type === 'teaching') {
            this.props.teaching.addTeaching(null, data, '')
            let objDiv = $('#case-editor-center-container-scroll-box');
            let h = objDiv.get(0).scrollHeight;
            objDiv.animate({scrollTop: h});
        }
        if (type === 'teaching_all') {
            this.props.teaching.addTeaching('all', data, '')
            let objDiv = $('#case-editor-center-container-scroll-box');
            let h = objDiv.get(0).scrollHeight;
            objDiv.animate({scrollTop: h});
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
        
        let symptomDetail, drugDetail, teachingDetail;
        // symptomMores = this.props.analyzeSymptom.openMores;
        symptomDetail = this.props.analyzeSymptom.openDetail;
        drugDetail = this.props.analyzeDrug.openDetail;
        teachingDetail = this.props.analyzeTeaching.openDetail;
        // drugMores = this.props.analyzeDrug.openMores;
        // console.log(JSON.parse(JSON.stringify(this.props.diagnosis.editableData)))
        // console.log(JSON.parse(JSON.stringify(openDetails)))
        const anlSymptom = this.props.analyzeSymptom.editableData;
        const anlDrug = this.props.analyzeDrug.editableData;
        const anlTeaching = this.props.analyzeTeaching.editableData;
        const lengthSymptom = this.props.symptom.editableData.length > 0;
        const lengthLab = this.props.lab.editableData.length > 0;
        const lengthDiagnosis = this.props.diagnosis.editableData.length > 0;

        const { currentReference, pageType } = this.props.caseEditor;

        
        return (
            <div className={cx('LeftSideToolbar', {openList: openList !== ''})} ref={ref => this.toolbar = ref}>
                
                <div 
                    className={cx('btn', {open: openList === 'condition'}, {tool: (!lengthSymptom && !lengthLab)}, 'symptom', {disabled: (!lengthSymptom && !lengthLab)})} 
                    id="btn-smart-condition" 
                    data-anl="symptom" 
                    data-type="condition" 
                    onClick={this._handleOnClick} 
                    data-disabled={(!lengthSymptom && !lengthLab) ? 'true' : 'false'} 
                    data-tip="증상 또는 혈액검사가 최소 1개 이상 필요합니다"
                >
                    <FaUserCheck />
                    <div className={cx('label')}>스마트진단</div>
                </div>
                <div 
                    className={cx('btn', {open: openList === 'drug'}, {tool: !lengthDiagnosis}, 'drug', {disabled: !lengthDiagnosis})} 
                    data-type="drug" 
                    data-anl="drug" 
                    onClick={this._handleOnClick} 
                    data-disabled={!lengthDiagnosis ? 'true' : 'false'} 
                    data-tip="진단이 최소 1개 이상 필요합니다"
                >
                    <FaNotesMedical />
                    <div className={cx('label')}>스마트처방</div>
                </div>
                <div 
                    className={cx('btn', {open: openList === 'teaching'}, {tool: !lengthDiagnosis}, 'teaching', {disabled: !lengthDiagnosis})} 
                    data-type="teaching" 
                    data-anl="teaching" 
                    onClick={this._handleOnClick} 
                    data-disabled={!lengthDiagnosis ? 'true' : 'false'} 
                    data-tip="진단이 최소 1개 이상 필요합니다"
                >
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
                                                    <div data-type="condition" data-page="detail" onClick={(e) => {this._handleClickOnListitem(e, id)}}>{conditionName}</div>
                                                </div>
                                                {/* <div className={cx('btn-condition')}> */}
                                                    {/* <img data-type="condition" data-page="detail" onClick={(e) => {this._handleClickOnListitem(e, id)}} src={Info} alt="질환상세" /> */}
                                                    {/* <button>
                                                    </button> */}
                                                {/* </div> */}
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
                                                            this._handleClickOnBtnAdd('condition', conditionName)
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
                                                            {
                                                                analyzeSymptom.needToCheck.length > 0 &&
                                                                analyzeSymptom.needToCheck.map((item, i) => {
                                                                    return <li key={i}>
                                                                        <div>[증상]</div>
                                                                        <div> {item}</div>
                                                                    </li>
                                                                })
                                                            }
                                                            {
                                                                analyzeLab.needToCheck.length > 0 &&
                                                                analyzeLab.needToCheck.map((item, i) => {
                                                                    return <li key={i}>
                                                                        <div>[혈검]</div>
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
                    }
                    {
                        openList === 'drug' &&
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

                                        {/* const {
                                            id,
                                            drugName,
                                            evidence,
                                            reference_id
                                        } = anl; */}

                                        {/* console.log(JSON.parse(JSON.stringify(this.props.analyzeDrug.openMores))) */}

                                        return <li key={indexAnl}>
                                            <div className={cx('name-btn')}>
                                                <div className={cx('name', 'condition-name')}>
                                                    <div data-type="drug" data-page="detail" onClick={(e) => {this._handleClickOnListitem(e, condition_id)}}>{relatedDisease}</div>
                                                </div>
                                            </div>
                                            
                                            <div className={cx('more', 'drug')}>
                                                <div className={cx('row', 'evidence')}>
                                                    <ul className={cx('content')}>
                                                        {
                                                            this.props.analyzeDrug.openMores.length > 0 &&
                                                            drugs.map((drug, indexDrug) => {
                                                                const {
                                                                    id, section, drugName, evidences
                                                                } = drug;
                                                                return <li key={indexDrug}>
                                                                    <div className={cx('drug-container')}>
                                                                        <div data-type="drug" data-page="drug" className={cx('drug-name')} onClick={(e) => {this._handleClickOnListitem(e, id)}}>
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
                                                                                    this._handleClickOnBtnAdd('drug', drugName, drug)
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
                                                                                                        <a 
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
                                                                                                        </a>
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
                    }


                    {
                        openList === 'teaching' &&
                        <div className={cx('results', 'teaching', {openDetail: true})}>
                            <ul className={cx('scroll-box')}>
                                {
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
                                                        <div data-type="teaching" data-page="detail" onClick={(e) => {this._handleClickOnListitem(e, condition_id)}}>{relatedDisease}</div>
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
                                                                this._handleClickOnBtnAdd('teaching_all', '지도법', teachings)
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
                                                                            <div className={cx('description-wrapper')}>
                                                                                <a 
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
                                                                                </a>
                                                                                <ReactTooltip className="custom-tooltip" place="right" effect="solid" id={`tooltip-teaching-${i}`} />
                                                                            </div>
                                                                            <div className={cx('btn-add')}>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        this._handleClickOnBtnAdd('teaching', '지도법', teach)
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
                                        }
                                    })
                                }
                            </ul>
                        </div>
                    }
                </div>









                {
                    !this.props.analyzeSymptom.isLoading && symptomDetail && this.props.caseEditor.pageType === "detail" &&
                    <div id="detail-container" className={cx('detail-container', {open: !this.props.analyzeSymptom.isLoading && symptomDetail})}>
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
                                                                            <a 
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
                                                                            </a>
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
                                                                                    <a 
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
                                                                                    </a>
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
                                                                            <a 
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
                                                                            </a>
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
                                                                                <a 
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
                                                                                </a>
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
                                                                            <a 
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
                                                                            </a>
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
                    !this.props.analyzeSymptom.isLoading && symptomDetail && this.props.caseEditor.pageType === "reference" &&
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
                }

                {
                    !this.props.analyzeDrug.isLoading && drugDetail && this.props.caseEditor.pageType === "drug" &&
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









                {
                    !this.props.analyzeDrug.isLoading && drugDetail && this.props.caseEditor.pageType === "detail" &&
                    <div id="detail-container" className={cx('detail-container', {open: !this.props.analyzeDrug.isLoading && drugDetail})}>
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
                                                                            <a 
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
                                                                            </a>
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
                                                                                    <a 
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
                                                                                    </a>
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
                                                                            <a 
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
                                                                            </a>
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
                                                                                <a 
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
                                                                                </a>
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
                                                                            <a 
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
                                                                            </a>
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
                    !this.props.analyzeDrug.isLoading && drugDetail && this.props.caseEditor.pageType === "reference" &&
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
                }






                {
                    !this.props.analyzeTeaching.isLoading && teachingDetail && this.props.caseEditor.pageType === "detail" &&
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
                                                                            <a 
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
                                                                            </a>
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
                                                                                    <a 
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
                                                                                    </a>
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
                                                                            <a 
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
                                                                            </a>
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
                                                                                <a 
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
                                                                                </a>
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
                                                                            <a 
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
                                                                            </a>
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
                    !this.props.analyzeTeaching.isLoading && teachingDetail && this.props.caseEditor.pageType === "reference" &&
                    <div className={cx('detail-container', {open: !this.props.analyzeTeaching.isLoading && teachingDetail})}>
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
                                                <div className={cx('box')}>티칭{currentReference.name}</div>
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
                }

                
            </div>
        );
    }
}

export default LeftSideToolbar;