import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styles from './LeftSideToolbar.module.scss';
import classNames from 'classnames/bind';
import './LeftSideToolbar.css';
import $ from 'jquery';
import { FaUserCheck, FaNotesMedical, FaChalkboard } from "react-icons/fa"; 
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { getLocaleDateWithYMS } from '../../../../utils/momentHelper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResultCondition from './components/ResultCondition';
import ResultDrug from './components/ResultDrug';
import ResultTeaching from './components/ResultTeaching/ResultTeaching';
import DetailCondition from './components/DetailCondition/DetailCondition';
import DetailDrug from './components/DetailDrug/DetailDrug';
import DetailTeaching from './components/DetailTeaching/DetailTeaching';
import ReferenceCondition from './components/ReferenceCondition/ReferenceCondition';
import ReferenceDrug from './components/ReferenceDrug/ReferenceDrug';
import ReferenceTeaching from './components/ReferenceTeaching/ReferenceTeaching';
import DetailDrugCondition from './components/DetailDrugCondition/DetailDrugCondition';

const cx = classNames.bind(styles);

@withRouter
@inject(
    'Case', 'caseEditorBasic', 'symptom',
    'lab', 'diagnosis', 'treatment', 
    'analyzeSymptom', 'analyzeDrug', 'analyzeTeaching',
    'teaching', 'caseEditor', 'modal'
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
            let offset1 = objDiv.position();
            
            let adj1 = offset1.top;
            let offset2 = objDivDrug.position();
            let adj2 = offset2.top;
            
            if (!scrollBox || !objDiv || !objDivDrug) {
                return false;
            }
            if (offset1 === undefined) {
                return false;
            }
            this.setState({diagnosisScrollTop: scrollBox.scrollTop() + adj1, drugScrollTop: scrollBox.scrollTop() + adj2})
            scrollBox.on('scroll', this._setScrollTop);
        }
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Case.isEditing || this.props.type === "create") {
            let scrollBox = $('#case-editor-center-container-scroll-box');
            let objDiv = $('#case-editor-diagnosis');
            if (scrollBox.length <= 0 || objDiv.length <= 0) {
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
                    if (countResult === 0) this._handleModal('notification', '해당하는 분석결과가 없습니다');
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
                    if (countResult === 0) this._handleModal('notification', '해당하는 분석결과가 없습니다');
                    this.props.analyzeDrug.initiateOpen();
                });
            }
            return null;
        } else if (type === 'teaching') {
            this.props.analyzeTeaching.clear();
            if (!this.props.analyzeTeaching.isLoading) {
                this.props.Case.analyzeTeaching(referenceData)
                .then(result => {
                    let counts = 0;

                    result.forEach((res, i) => {
                        const { teachings } = res;
                        teachings.forEach((teaching, i) => {
                            if (teachings.length > 0) {
                                return counts++;
                            } else {
                                return true;
                            }
                        })
                    });

                    if (counts <= 0) this._handleModal('notification', '해당하는 분석결과가 없습니다');
                    this.props.analyzeTeaching.initiateOpen();
                });
            }
            return null;
        } else {
            return false;
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

    _handleModal = (type, message) => {
        this.props.modal.showModal(type, true);
        this.props.modal.setMessage(type, message);
    }

    toastUpdateComplete = () => toast("증례가 수정되었습니다");

    render() {
        const { openList } = this.state;
        const {
            isLoadingForSymptom,
            isLoadingForTreatment,
            isLoadingForTeaching,
        } = this.props.Case;
        
        let symptomDetail, drugDetail, teachingDetail;
        symptomDetail = this.props.analyzeSymptom.openDetail;
        drugDetail = this.props.analyzeDrug.openDetail;
        teachingDetail = this.props.analyzeTeaching.openDetail;
        const anlSymptom = this.props.analyzeSymptom.editableData;
        const anlDrug = this.props.analyzeDrug.editableData;
        const anlTeaching = this.props.analyzeTeaching.editableData;
        const lengthSymptom = this.props.symptom.editableData.length > 0;
        const lengthLab = this.props.lab.editableData.length > 0;
        const lengthDiagnosis = this.props.diagnosis.editableData.length > 0;

        const { isEditing, currentCaseRecord } = this.props.Case;
        const { type, dateIndex, caseId } = this.props.match.params;
        const { caseEditorBasic, symptom, lab, diagnosis, treatment } = this.props;
        let difference = (
            caseEditorBasic.diff ||
            symptom.diff ||
            lab.diff ||
            diagnosis.diff ||
            treatment.diff ||
            treatment.diffForFormula ||
            this.props.teaching.diff
            ) ? true : false;
        
        return (
            <div className={cx('LeftSideToolbar', {openList: openList !== ''})} ref={ref => this.toolbar = ref}>
                {
                currentCaseRecord.length > 1 && type === 'detail' &&
                    <>
                        {
                            +dateIndex !== currentCaseRecord.length - 1 &&
                            <div 
                            className={cx('prevRecord', 'btn-move-record')} 
                            onClick={() => {
                                if (isEditing) {
                                    if (difference) {
                                        this.props.modal.setFunction('cancel', () => {
                                        this.props.history.push(`/case/editor/detail/${caseId}/${+dateIndex + 1}`)
                                    })
                                    
                                    this._handleModal('confirm', '저장되지 않은 내용이 있습니다. 저장하고 다른 진료일자로 바꾸시겠습니까?');
                                    return this.props.modal.setFunction('confirm', () => {
                                    this.props.Case.updateCase(dateIndex)
                                        .then(res => {
                                            if (res) {
                                                this.toastUpdateComplete();
                                                this.props.history.push(`/case/editor/detail/${caseId}/${+dateIndex + 1}`)
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        });
                                    })
                                    }
                                } 
                                return this.props.history.push(`/case/editor/detail/${caseId}/${+dateIndex + 1}`)
                            }}
                            >
                                <MdKeyboardArrowLeft />
                                <div className={cx('date')}>{getLocaleDateWithYMS(currentCaseRecord[+dateIndex + 1])}</div>
                            </div>
                        }
                    </>
                }
                
                {
                    (type === "create" || isEditing) &&
                    <div className={cx('tool-box')}>
                    {
                        !isLoadingForSymptom ? 
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
                        : <div className={cx('btn', {isLoading: isLoadingForSymptom})}>분석중...</div>
                    }
                    {
                        !isLoadingForTreatment ? 
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
                        : <div className={cx('btn', {isLoading: isLoadingForTreatment})}>분석중...</div>
                    }
                    {
                        !isLoadingForTeaching ? 
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
                        : <div className={cx('btn', {isLoading: isLoadingForTeaching})}>분석중...</div>
                    }
                    
                    <div className={cx('content-container')}>
                        {
                            openList === 'condition' &&
                            <ResultCondition symptomDetail={symptomDetail} anlSymptom={anlSymptom} handleClickOnBtnAdd={this._handleClickOnBtnAdd} handleClickOnListitem={this._handleClickOnListitem}/>
                        }
                        {
                            openList === 'drug' &&
                            <ResultDrug drugDetail={drugDetail} anlDrug={anlDrug} handleClickOnBtnAdd={this._handleClickOnBtnAdd} handleClickOnListitem={this._handleClickOnListitem}/>
                        }
                        {
                            openList === 'teaching' &&
                            <ResultTeaching teachingDetail={teachingDetail} anlTeaching={anlTeaching} handleClickOnBtnAdd={this._handleClickOnBtnAdd} handleClickOnListitem={this._handleClickOnListitem} />
                        }
                    </div>
                    {
                        this.props.analyzeSymptom.openMores.length > 0 && !this.props.analyzeSymptom.isLoading && symptomDetail && this.props.caseEditor.pageType === "detail" &&
                        <DetailCondition symptomDetail={symptomDetail} />
                    }
                    {
                        this.props.analyzeSymptom.openMores.length > 0 && !this.props.analyzeSymptom.isLoading && symptomDetail && this.props.caseEditor.pageType === "reference" &&
                        <ReferenceCondition symptomDetail={symptomDetail} />
                    }
                    {
                        !this.props.analyzeDrug.isLoading && drugDetail && this.props.caseEditor.pageType === "drug" &&
                        <DetailDrug drugDetail={drugDetail} />
                    }

                    {
                        !this.props.analyzeDrug.isLoading && drugDetail && this.props.caseEditor.pageType === "detail" &&
                        <DetailDrugCondition drugDetail={drugDetail} />
                    }

                    {
                        !this.props.analyzeDrug.isLoading && drugDetail && this.props.caseEditor.pageType === "reference" &&
                        <ReferenceDrug drugDetail={drugDetail} />
                    }
                    {
                        !this.props.analyzeTeaching.isLoading && teachingDetail && this.props.caseEditor.pageType === "detail" &&
                        <DetailTeaching teachingDetail={teachingDetail} />
                    }
                    {
                        !this.props.analyzeTeaching.isLoading && teachingDetail && this.props.caseEditor.pageType === "reference" &&
                        <ReferenceTeaching teachingDetail={teachingDetail} />
                    }
                    </div>
                }
            </div>
        );
    }
}

export default LeftSideToolbar;