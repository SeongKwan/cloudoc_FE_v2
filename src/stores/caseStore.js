import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import searchStore from './searchStore';
import user from './userStore';
// import _ from 'lodash';
import Hangul from 'hangul-js';
import { getLocaleFullDateWithTime } from '../utils/momentHelper';
import basicStore from './caseEditorBasicStore';
import symptomStore from './symptomStore';
import labStore from './labStore';
import diagnosisStore from './diagnosisStore';
import drugStore from './treatmentStore';
import analyzeSymptomStore from './analyzeSymptomStore';
import analyzeDrugStore from './analyzeRecommendationTreatmentStore';
import analyzeTeachingStore from './analyzeTeachingStore';

const windowWidth = window.outerWidth;
let initialLoadAmount;
let loadAmount;

if (windowWidth > 1411) {
    initialLoadAmount = 7;
    loadAmount = 4;
} else {
    initialLoadAmount = 5;
    loadAmount = 3;
}

class CaseStore {
    @observable isLoading = false;
    @observable isLoadingMore = false;
    @observable isLoadingForAnalyze = false;
    @observable isLoadingForTreatment = false;
    @observable isLoadingForTeaching = false;
    @observable registry = [];
    @observable infiniteStore = [];
    @observable searchedInfiniteStore = [];
    @observable currentPage = 1;
    @observable lastPage = 0;
    @observable lastPageForSearching = 0;
    @observable rest = 0;
    @observable restForSearch = 0;
    @observable loadMore = true;


    @computed get cases() {
        let cases = [];
        this.infiniteStore.forEach((article) => { cases.push(article); });
        return cases || [];
    }

    @action casesOnSearching() {
        const { keyword } = searchStore;
        let plusOne;
        if (searchStore.keyword['cases'].length > 0) {
            plusOne = 1;
        } else {
            plusOne = 0;
        }

        let database = [];
        this.searchedInfiniteStore = [];
        this.registry.forEach((article) => { database.push(article); });
        database = this._search(keyword['cases'], database);
        // database = this._filter(this.filterKeyword, database);
        // database = _.sortBy(database, 'section', 'name')

        this.lastPageForSearching = Math.floor(database.length / loadAmount) + 1;
        this.restForSearch = database.length%loadAmount;
        this.currentPage = 1;
        
        if (this.lastPageForSearching > 1) {
            this.loadMore = true
        } else {
            this.loadMore = false;
        }
        
        this.searchedInfiniteStore = database.slice(0, ((this.currentPage) * (initialLoadAmount + plusOne)));
        this.registryForSearching = database;
        
        return database || [''];
    };


    @action loadCases() {
        this.isLoading = true;
        return agent.loadCases()
                .then(action((response) => {
                    this.isLoading = false;
                    this.registry = response.data.cases;
                    // this.registry = this.registry.sort(function (a, b) { 
                    //     let unixA = momentHelper.toUnix(a.created_date);
                    //     let unixB = momentHelper.toUnix(b.created_date);
                    //     return unixA > unixB ? -1 : unixA < unixB ? 1 : 0;
                    // });
                    this.InitInfiniteStore();
                }))
                .catch(error => {
                    
                });
    }

    @action InitInfiniteStore() {
        let database = this.registry;
        let plusOne;
        if (searchStore.keyword['cases'].length > 0) {
            plusOne = 1;
        } else {
            plusOne = 0;
        }
        // database = this._filter(filterKeyword, this.registry);
        this.lastPage = Math.floor(database.length / loadAmount) + 1;
        this.rest = database.length%initialLoadAmount;
        this.currentPage = 1;

        if (this.currentPage === this.lastPage) {
            this.loadMore = false;
        } else if (this.currentPage === this.lastPage - 1) {
            if (windowWidth > 1411) {
                if (database.length <= 7) {
                    this.loadMore = false;
                } else {
                    this.loadMore = true;
                }
            } else {
                if (database.length <= 5) {
                    this.loadMore = false;
                } else {
                    this.loadMore = true;
                }
            }
        }
        this.infiniteStore = [];
        this.infiniteStore = database.slice(0, ((this.currentPage) * (initialLoadAmount + plusOne)));
    }

    @action addToInfiniteStore() {
        let cases = [];
        cases = this.registry;
        
        // cases = this._filter({reference: true}, this.registry);
        this.isLoadingMore = false;
        if ((this.currentPage + 1) < this.lastPage) {
            this.infiniteStore = [...this.infiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage + 1) * loadAmount))]
            this.currentPage++;
        } else if (this.currentPage + 1 === this.lastPage) {
            this.infiniteStore = [...this.infiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage) * loadAmount + this.rest))]
            this.currentPage++;
        } else if (this.currentPage >= this.lastPage) {
            return this.loadMore = false;
        }
    }

    @action addToSearchedStore() {
        let cases = [];
        cases = this.registryForSearching;
        // cases = this._filter({reference: true}, this.registryForSearching);
        this.isLoadingMore = false;
        if ((this.currentPage + 1) < this.lastPageForSearching) {
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage + 1) * loadAmount))]
            this.currentPage++;
        } else if (this.currentPage + 1 === this.lastPageForSearching) {
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage) * loadAmount + this.restForSearch))]
            this.currentPage++;
        } else if (this.currentPage >= this.lastPageForSearching) {
            return this.loadMore = false;
        }
    }

    @action noLoadMore() {
        this.loadMore = false;
    }

    @action setIsLoadingMore(status) {
        this.isLoadingMore = status;
    }

    // _filter = (filterBoolean, items) => {
    //     const { symptom, lab, condition, exam, drug, reference } = this.distributedClinicaldbs;

    //     let database = [];
    //     if (filterBoolean.symptom) database = database.concat(symptom);
    //     if (filterBoolean.lab) database = database.concat(lab);
    //     if (filterBoolean.condition) database = database.concat(condition);
    //     if (filterBoolean.exam) database = database.concat(exam);
    //     if (filterBoolean.drug) database = database.concat(drug);
    //     if (filterBoolean.reference) database = database.concat(reference);
        
    //     return database;
    // }

    // 불러온 데이터의 특정 property에 keyword가 포함되어있는지 검색하는 필터입니다.
    _search = (searchKeyword, items) => {
        if (!searchKeyword) return [...items];
        const searcher = new Hangul.Searcher(searchKeyword.toLowerCase());
        return items.filter((item) => {
            return this._hasSearchKeywordInItem(searcher, item);
        });
    }

    _hasSearchKeywordInItem(searcher, item) {
        const latestRecordIndex = item.record.length - 1;
        const { treatment } = item.record[latestRecordIndex]; 
        return (
                this._hasSearchKeywordInProperty(searcher, item.patient['memo'] || '') 
                || this._hasSearchKeywordInProperty(searcher, this._getRecordLatestData(item, 'symptom') || '') 
                || this._hasSearchKeywordInProperty(searcher, this._getRecordLatestData(item, 'diagnosis') || '') 
                || this._hasSearchKeywordInProperty(searcher, treatment.drugName || '') 
            ) ? true : false;


            // return (
            //     this._hasSearchKeywordInProperty(searcher, item.patient['chart_id'] || '') 
            //     || this._hasSearchKeywordInProperty(searcher, this._getRecordLatestData(item, 'symptom') || '') 
            //     || this._hasSearchKeywordInProperty(searcher, this._getRecordLatestData(item, 'diagnosis') || '') 
            //     || this._hasSearchKeywordInProperty(searcher, treatment.drugName || '') 
            // )
    }

    // _hasSearchKeywordInProperty(searcher, property_string) {
    //     return searcher.search(property_string.toLowerCase()) >= 0 ? true : false;
    // }

    _hasSearchKeywordInProperty(searcher, property_string) {
        if (typeof property_string === 'string') {
            return searcher.search(property_string.toLowerCase()) >= 0 ? true : false;
        }
        if (Array.isArray(property_string)) {
            let a = [];
            property_string.forEach((word) => {
                a.push(searcher.search(word.toLowerCase()) >= 0);
            });
            return a.find(str => str === true);
        }
    }

    _getRecordLatestData = (item, type) => {
        const latestRecordIndex = item.record.length - 1;
        const { symptom, diagnosis } = item.record[latestRecordIndex]; 
        let items = [];
        
        if (type === 'symptom') {
            symptom.map((symptom, i) => {
                return items.push(symptom.name);
            });
            return items;
        }
        if (type === 'diagnosis') {
            diagnosis.map((diagnosis, i) => {
                return items.push(diagnosis.name);
            });
            return items;
        }
    }



    /**
     * 
     * @param {object} postCase create new case 
     * @return {object}
     */
    @action postCase() {
        this.isLoading = true;
        const dateNow =  getLocaleFullDateWithTime(Date.now());
        const { currentUser } = user;
        let newCase = {
        user_id: currentUser.user_id || 'admin',
        created_date: dateNow,
        record: [
            {
            createdDate: dateNow,
            symptom: [],
            exam: [],
            selectedLabCategory: [],
            lab: [],
            analyzeCondition: [],
            analyzeSymptom: [],
            analyzeLab: [],
            diagnosis: [],
            analyzeTreatment: [],
            treatment: {},
            memo: ''
            }
        ]
        };
        const patientInfo = JSON.parse(JSON.stringify(basicStore.editableData));
        const symptom = JSON.parse(JSON.stringify(symptomStore.editableData));
        // const exam = JSON.parse(JSON.stringify(examStore.editableData));
        const exam = [];
        const lab = JSON.parse(JSON.stringify(labStore.editableData));
        
        // const selectedLabCategory = JSON.parse(JSON.stringify(bloodTestStore.selectedLabCategory));
        const selectedLabCategory = [];
        // const analyzeSymptom = JSON.parse(JSON.stringify(analyzeSymptomStore.editableData));
        const analyzeSymptom = [];
        // const analyzeLab = JSON.parse(JSON.stringify(analyzeBloodTestStore.editableData));
        const analyzeLab = [];
        const diagnosis = JSON.parse(JSON.stringify(diagnosisStore.editableData));
        // const analyzeTreatment = JSON.parse(JSON.stringify(analyzeRecommendationTreatmentStore.editableData));
        const analyzeTreatment = [];
        const treatment = JSON.parse(JSON.stringify(drugStore.editableDataForTreatment));
        const fomula = JSON.parse(JSON.stringify(drugStore.editableData));
        // const { memo } = memoStore.editableData;
        const { memo } = '';
        
        newCase = { ...newCase, patient: patientInfo };
        newCase.record[0].symptom = symptom.slice();
        newCase.record[0].exam = exam.slice();
        newCase.record[0].lab = lab.slice();
        newCase.record[0].selectedLabCategory = selectedLabCategory.slice();

        newCase.record[0].analyzeCondition = analyzeSymptom.slice();
        newCase.record[0].analyzeSymptom = analyzeSymptom.slice();
        newCase.record[0].analyzeLab = analyzeLab.slice();

        newCase.record[0].diagnosis = diagnosis.slice();
        newCase.record[0].analyzeTreatment = analyzeTreatment.slice();
        newCase.record[0].treatment = {...treatment, fomula};
        newCase.record[0].memo = memo;


        // 공란 필터링 -- 증상
        let filteredSymptoms = newCase.record[0].symptom.filter((item) => {
            return item.name !== '';
        })
        // 중요도 재배치
        filteredSymptoms.forEach((item, i) => {
            item.rank = i + 1;
        });

        // 공란 필터링 -- 진찰
        let filteredExam = newCase.record[0].exam.filter((item) => {
            return item.name !== '';
        })
        // 중요도 재배치
        filteredExam.forEach((item, i) => {
            item.rank = i + 1;
        });

        // 공란 필터링 -- 진단
        let filteredDiagnosis = newCase.record[0].diagnosis.filter((item) => {
            return item.name !== '';
        })

        newCase.record[0].symptom = filteredSymptoms;
        newCase.record[0].exam = filteredExam;
        newCase.record[0].diagnosis = filteredDiagnosis;

        return agent.postCase(newCase)
            .then(action((response) => {
                console.log(response.data)
                this.isLoading = false;
                // this.clearAutoSavedCaseForCreate();
                return response;
            }))
    }

    // @action updateCase(id, dateIndex) {
    //     const { currentCaseRecordDate, currentCase } = this;
    //     const { currentLoginUser } = userStore;

    //     let updatedCase = {
    //     created_date: currentCase.created_date,
    //     user_id: currentLoginUser.user_id || 'admin',
    //     record: [
    //         {
    //         createdDate: currentCaseRecordDate,
    //         symptom: [],
    //         exam: [],
    //         selectedLabCategory: [],
    //         lab: [],
    //         analyzeCondition: [],
    //         analyzeSymptom: [],
    //         analyzeLab: [],
    //         diagnosis: [],
    //         analyzeTreatment: [],
    //         treatment: {},
    //         memo: ''
    //         }
    //     ]
    //     };

    //     let patientInfo = JSON.parse(JSON.stringify(patientInfoStore.editableData));
    //     let symptom = JSON.parse(JSON.stringify(symptomStore.editableData));
    //     let exam = JSON.parse(JSON.stringify(examinationStore.editableData));
    //     let selectedLabCategory = JSON.parse(JSON.stringify(bloodTestStore.selectedLabCategory));
    //     let lab = JSON.parse(JSON.stringify(bloodTestStore.editableData));
    //     let analyzeSymptom = JSON.parse(JSON.stringify(analyzeSymptomStore.editableData));
    //     let analyzeLab = JSON.parse(JSON.stringify(analyzeBloodTestStore.editableData));
    //     let diagnosis = JSON.parse(JSON.stringify(diagnosisStore.editableData));
    //     let analyzeTreatment = JSON.parse(JSON.stringify(analyzeRecommendationTreatmentStore.editableData));
    //     let treatment = JSON.parse(JSON.stringify(treatmentStore.editableDataForTreatment));
    //     let fomula = JSON.parse(JSON.stringify(treatmentStore.editableData));
    //     let { memo } = memoStore.editableData;

    //     updatedCase = { ...updatedCase, patient: patientInfo };
    //     updatedCase.record[0].symptom = symptom.slice();

    //     updatedCase.record[0].exam = exam.slice();
    //     updatedCase.record[0].selectedLabCategory = selectedLabCategory.slice();
    //     updatedCase.record[0].lab = lab.slice();

    //     updatedCase.record[0].analyzeCondition = analyzeSymptom.slice();
    //     updatedCase.record[0].analyzeSymptom = analyzeSymptom.slice();
    //     updatedCase.record[0].analyzeLab = analyzeLab.slice();
    //     updatedCase.record[0].diagnosis = diagnosis.slice();
    //     updatedCase.record[0].analyzeTreatment = analyzeTreatment.slice();
    //     updatedCase.record[0].treatment = {...treatment, fomula};
    //     updatedCase.record[0].memo = memo;

    //     // 공란 필터링 -- 증상
    //     let filteredSymptoms = updatedCase.record[0].symptom.filter((item) => {
    //     return item.name !== '';
    //     })
    //     // 중요도 재배치
    //     filteredSymptoms.forEach((item, i) => {
    //     item.rank = i + 1;
    //     });

    //     // 공란 필터링 -- 진찰
    //     let filteredExam = updatedCase.record[0].exam.filter((item) => {
    //     return item.name !== '';
    //     })
    //     // 중요도 재배치
    //     filteredExam.forEach((item, i) => {
    //     item.rank = i + 1;
    //     });

    //     // 공란 필터링 -- 진단
    //     let filteredDiagnosis = updatedCase.record[0].diagnosis.filter((item) => {
    //     return item.name !== '';
    //     })

    //     updatedCase.record[0].symptom = filteredSymptoms;
    //     updatedCase.record[0].exam = filteredExam;
    //     updatedCase.record[0].diagnosis = filteredDiagnosis;


    //     let reversedRecords = [];
    //     if (this.currentCase.record.length > 1) {
    //         reversedRecords = this.currentCase.record.slice().reverse();
    //         let willBeUpdatedRecords = JSON.parse(JSON.stringify(reversedRecords));
    //         willBeUpdatedRecords.splice(dateIndex, 1, updatedCase.record[0]);
    //         let reversedUpdatedRecords = willBeUpdatedRecords.slice().reverse();
    //         updatedCase = { ...updatedCase, record: reversedUpdatedRecords }
    //     }
        
    //     this.isLoading = true;

    //     return agent.updateCase(id ,updatedCase)
    //         .then(action(async (response) => {
    //             this.isLoading = false;
    //             const { Case } = response.data;
    //             this.currentCase = Case;
    //             this.currentCasePatient = Case.patient;

    //             let reversedDetail = Case.record.slice().reverse();
    //             this.currentCaseDetail = reversedDetail[dateIndex];

    //             let recordDates = [];
    //             Case.record.forEach((record) => { recordDates.push(record.createdDate) });
    //             this.currentCaseRecord = recordDates.slice().reverse();
                
    //             this.currentCaseRecordDate = this.currentCaseRecord[dateIndex];

    //         }))
    //         .catch(action((err) => {
    //             throw err;
    //         }));
    // }

    @action deleteCase(id) {
        this.isLoading = true;
        return agent.deleteCase(id)
            .then(action((response) => {
                this.isLoading = false;
            }))
    }


    @action analyzeSymptom(referenceData = {}) {
        this.isLoadingForAnalyze = true;
        return agent.analyzeCondition({ referenceData })
            .then(action((response) => {
                // console.log(response.data.result)
                analyzeSymptomStore.setEditableData(response.data.result);
                this.isLoadingForAnalyze = false;
                return response.data.result;
            }))
            .catch(err => {
                throw(err);
            })
    }

    @action analyzeTreatment(referenceData = {}) {
        this.isLoadingForTreatment = true;
        return agent.analyzeTreatment({ referenceData })
            .then(action((response) => {
                this.isLoadingForTreatment = false;
                analyzeDrugStore.setEditableData(response.data.result);
                return response.data.result;
            }))
            .catch(err => {
                throw(err);
            })
    }
    @action analyzeTeaching(referenceData = {}) {
        this.isLoadingForTeaching = true;
        return agent.analyzeTeaching({ referenceData })
            .then(action((response) => {
                this.isLoadingForTeaching = false;
                analyzeTeachingStore.setEditableData(response.data.result);
                return response.data.result;
            }))
            .catch(err => {
                throw(err);
            })
    }






}
    
export default new CaseStore()