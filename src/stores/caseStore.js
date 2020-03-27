import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import searchStore from './searchStore';
import user from './userStore';
// import _ from 'lodash';
import Hangul from 'hangul-js';
import { getLocaleFullDateWithTime, toUnix } from '../utils/momentHelper';
import basicStore from './caseEditorBasicStore';
import symptomStore from './symptomStore';
import labStore from './labStore';
import diagnosisStore from './diagnosisStore';
import drugStore from './treatmentStore';
import teachingStore from './teachingStore';
import analyzeSymptomStore from './analyzeSymptomStore';
import analyzeDrugStore from './analyzeRecommendationTreatmentStore';
import analyzeTeachingStore from './analyzeTeachingStore';
import { v1 } from 'uuid';

const windowWidth = window.outerWidth;
let initialLoadAmount;
let loadAmount;

if (windowWidth > 1411) {
    initialLoadAmount = 7;
    loadAmount = 8;
} else {
    initialLoadAmount = 5;
    loadAmount = 6;
};

class CaseStore {
    @observable onReady = false;
    @observable isLoading = false;
    @observable isLoadingMore = false;
    @observable isLoadingForSymptom = false;
    @observable isLoadingForTreatment = false;
    @observable isLoadingForTeaching = false;
    @observable isEditing = false;
    @observable registry = [];
    @observable currentCase = null;
    @observable infiniteStore = [];
    @observable searchedInfiniteStore = [];
    @observable currentPage = 1;
    @observable lastPage = 0;
    @observable lastPageForSearching = 0;
    @observable rest = 0;
    @observable restForSearch = 0;
    @observable loadMore = true;

    @observable currentCaseRecordDate = '';
    @observable currentCaseRecord = [];
    @observable currentCasePatient = [];
    @observable currentCaseDetail = {};
    @observable dateIndex = 0;


    @computed get cases() {
        let cases = [];
        this.infiniteStore.forEach((article) => { cases.push(article); });
        return cases || [];
    };

    @computed get checkDiff() {
        let difference = [];
        let check = false;
        difference.push(basicStore.diff);
        difference.push(symptomStore.diff);
        difference.push(labStore.diff);
        difference.push(diagnosisStore.diff);
        difference.push(drugStore.diff);
        difference.push(drugStore.diffForFormula);
        difference.push(teachingStore.diff);

        if (difference.findIndex(diff => diff === false) >= 0) {
            check = true;
        } else {
            check = false;
        }
        return check;
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
        // console.log(database.length)
        // database = this._filter(this.filterKeyword, database);
        // database = _.sortBy(database, 'section', 'name')

        // this.lastPageForSearching = Math.floor(database.length / loadAmount) + 1;
        this.restForSearch = database.length%loadAmount;

        if (database.length - initialLoadAmount + 1 <= 0) {
            this.lastPageForSearching = 1;
        } else if (database.length - initialLoadAmount + 1 > 0) {
            if (this.restForSearch > 0) {
                this.lastPageForSearching = Math.floor((database.length) / loadAmount) + 1;
            } else {
                this.lastPageForSearching = Math.floor((database.length) / loadAmount);
            }
        }
        // console.log(this.lastPageForSearching)
        
        
        // console.log(this.restForSearch)
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
                    this.clear();
                    this.isLoading = false;
                    this.registry = response.data.cases;
                    this.registry = this.registry.sort(function (a, b) { 
                        let unixA = toUnix(a.created_date);
                        let unixB = toUnix(b.created_date);
                        return unixA > unixB ? -1 : unixA < unixB ? 1 : 0;
                    });
                    this.InitInfiniteStore();
                }))
                .catch(error => {
                    
                });
    };

    @action InitInfiniteStore() {
        let database = this.registry;
        let plusOne;
        if (searchStore.keyword['cases'].length > 0) {
            plusOne = 1;
        } else {
            plusOne = 0;
        }
        this.rest = (database.length + 1)%loadAmount;
        // database = this._filter(filterKeyword, this.registry);
        if (database.length - initialLoadAmount <= 0) {
            this.lastPage = 1;
        } else if (database.length - initialLoadAmount > 0) {
            if (this.rest === 0) {
                // console.log('111')
                this.lastPage = Math.floor((database.length + 1) / loadAmount);
            } else {
                // console.log('222')
                this.lastPage = Math.floor((database.length - initialLoadAmount) / loadAmount) + 2;
            }
        }
        // console.log('last page : ', this.lastPage)
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
    };

    @action addToInfiniteStore() {
        let cases = [];
        cases = this.registry;
        // console.log('current Page : ', this.currentPage)
        // console.log('rest: ', this.rest)
        this.isLoadingMore = false;
        if ((this.currentPage + 1) < this.lastPage) {
            // console.log('1')
            if (this.currentPage === 1) {
                this.infiniteStore = [...this.infiniteStore, ...cases.slice((initialLoadAmount), (initialLoadAmount + (this.currentPage) * loadAmount))]
                return this.currentPage++;
            }
            this.infiniteStore = [...this.infiniteStore, ...cases.slice((initialLoadAmount + (this.currentPage - 1) * loadAmount), (initialLoadAmount + (this.currentPage) * loadAmount))]
            this.currentPage++;
        } else if (this.currentPage + 1 === this.lastPage) {
            // console.log('2')
            if (this.currentPage === 1) {
                this.infiniteStore = [...this.infiniteStore, ...cases.slice((initialLoadAmount), (initialLoadAmount + (this.currentPage) * loadAmount))]
                return this.currentPage++;
            }
            this.infiniteStore = [...this.infiniteStore, ...cases.slice((initialLoadAmount + (this.currentPage - 1) * loadAmount), (initialLoadAmount + (this.currentPage) * loadAmount ))]
            if (this.rest === 0) {
                this.loadMore = false;
            } else {
                this.loadMore = true;
            }
            this.currentPage++;
        } else if (this.currentPage >= this.lastPage) {
            // console.log('3')
            this.infiniteStore = [...this.infiniteStore, ...cases.slice((initialLoadAmount + (this.currentPage) * loadAmount), (initialLoadAmount + (this.currentPage) * loadAmount + this.rest))]
            return this.loadMore = false;
        }
    };

    @action addToSearchedStore() {
        let cases = [];
        cases = this.registryForSearching;
        // cases = this._filter({reference: true}, this.registryForSearching);
        this.isLoadingMore = false;
        // console.log('current Page : ', this.currentPage)
        if ((this.currentPage + 1) < this.lastPageForSearching) {
            // console.log('1')
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage + 1) * loadAmount))]
            this.currentPage++;
        } else if (this.currentPage + 1 === this.lastPageForSearching) {
            // console.log('2')
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage + 1) * loadAmount))]
            if (this.restForSearch === 0) {
                this.loadMore = false;
            } else {
                this.loadMore = true;
            }
            this.currentPage++;
        } else if (this.currentPage >= this.lastPageForSearching) {
            // console.log('3')
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage) * loadAmount) + this.restForSearch)]
            return this.loadMore = false;
        }
    };

    @action noLoadMore() {
        this.loadMore = false;
    };

    @action clearLoadMore() {
        this.loadMore = true;
    };

    @action setIsLoadingMore(status) {
        this.isLoadingMore = status;
    };

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
    };

    _hasSearchKeywordInItem(searcher, item) {
        const latestRecordIndex = item.record.length - 1;
        const { treatment } = item.record[latestRecordIndex]; 
        return (
                this._hasSearchKeywordInProperty(searcher, item.title || '') 
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
    };

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
    };

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
    };

    @action setCurrentCaseDetail(dateIndex) {
        this.currentCaseDetail = this.currentCase.record.slice().reverse()[dateIndex];
        this.currentCaseRecordDate = this.currentCaseRecord[dateIndex];
    };

    @action setCurrentCase(currentCase, dateIndex = 0) {
        // console.log('toggle')
        this.onReady = true;
        const {
            title,
            // created_date,
            patient,
            // record
        } = currentCase;

        let patientInfoData = {
            title: title,
            gender: patient.gender,
            age: patient.age,
            pastHistory: patient.pastHistory,
            familyHistory: patient.familyHistory,
            socialHistory: patient.socialHistory,
            memo: patient.memo
        }


        const { 
            symptom,
            // exam,
            // selectedLabCategory,
            lab,
            // analyzeCondition,
            // analyzeLab,
            diagnosis,
            // analyzeTreatment,
            treatment,
            // memo,
            teaching
        } = this.currentCaseDetail;

        basicStore.initialize(patientInfoData);
        symptomStore.initStaticData(symptom);
        symptomStore.setEditableData(symptom);
        labStore.initStaticData(lab);
        labStore.initCaseDetailData(lab);
        
        diagnosisStore.initStaticData(diagnosis);
        diagnosisStore.setEditableData(diagnosis);
        drugStore.initilize(treatment);
        drugStore.setEditableData(treatment.fomula);
        teachingStore.initStaticData(teaching);
        teachingStore.setEditableData(teaching);

    };

    @action toggleIsEditing(dateIndex = 0) {
        this.setCurrentCase(this.currentCase, dateIndex);
        this.isEditing = !this.isEditing;
    };

    @action checkDifferenceContent() {
        let difference = [];
        let check = false;
        difference.push(basicStore.compareData());
        difference.push(symptomStore.compareData());
        difference.push(labStore.compareData());
        difference.push(diagnosisStore.compareData());
        difference.push(drugStore.compareData());
        difference.push(drugStore.compareArrayData());
        difference.push(teachingStore.compareData());

        if (difference.findIndex(diff => diff === false) >= 0) {
            check = true;
        } else {
            check = false;
        }
        return check;
    }


    @action loadCase(id, dateIndex = 0) {
        this.isLoading = true;
        return agent.loadCase(id)
            .then(action((response) => {
                this.isLoading = false;
                this.currentCase = response.data.case;
                
                let reversedDetail = response.data.case.record.slice().reverse();
                this.currentCaseDetail = reversedDetail[dateIndex];

                let recordDates = [];
                response.data.case.record.forEach((record) => { recordDates.push(record.createdDate) });
                this.currentCaseRecord = recordDates.slice().reverse();
                
                this.currentCaseRecordDate = this.currentCaseRecord[dateIndex];

                this.setCurrentCase(response.data.case, dateIndex);
            }))
            .catch(action((err) => {
                this.isLoading = false;
                throw err;
            }))
    };
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
        title: '',
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
            memo: '',
            teaching: []
            }
        ]
        };
        const patientInfo = JSON.parse(JSON.stringify(basicStore.editableData));
        const symptom = JSON.parse(JSON.stringify(symptomStore.editableData));
        // const exam = JSON.parse(JSON.stringify(examStore.editableData));
        const exam = [];
        const lab = JSON.parse(JSON.stringify(labStore.editableData));
        
        const selectedLabCategory = JSON.parse(JSON.stringify(labStore.selectedLabCategory));
        // const selectedLabCategory = [];
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
        const teaching = JSON.parse(JSON.stringify(teachingStore.editableData))
        
        newCase = { ...newCase, patient: patientInfo };
        newCase['title'] = patientInfo.title;
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
        newCase.record[0].teaching = teaching.slice();


        

        // 공란 필터링 -- 증상
        let filteredSymptoms = newCase.record[0].symptom.filter((item) => {
            return item.name !== '';
        })
        // 중요도 재배치
        filteredSymptoms.forEach((item, i) => {
            item.rank = i + 1;
        });

        // 공란 필터링 -- 혈검
        let filteredLabs = newCase.record[0].lab.filter((item) => {
            return item.value !== '';
        })
        // 중요도 재배치
        

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
        });

        let filteredTeaching = newCase.record[0].teaching.filter((item) => {
            return item.description !== '';
        });

        let filteredFomula = newCase.record[0].treatment['fomula'].filter((item) => {
            return item.herbName !== '';
        });

        newCase.record[0].symptom = filteredSymptoms;
        newCase.record[0].lab = filteredLabs;
        newCase.record[0].exam = filteredExam;
        newCase.record[0].diagnosis = filteredDiagnosis;
        newCase.record[0].treatment = {...newCase.record[0].treatment, fomula: filteredFomula};
        newCase.record[0].teaching = filteredTeaching;


        return agent.postCase(newCase)
            .then(action((response) => {
                this.isLoading = false;
                return response;
            }))
    }


    /**
     * 
     * @param {object} updateCase
     * @return {object}
     */
    @action updateCase(dateIndex) {
        this.isLoading = true;
        const date = this.currentCase.created_date;
        const { currentCaseRecordDate } = this;
        const { currentUser } = user;
        let updatedCase = {
        user_id: currentUser.user_id || 'admin',
        created_date: date,
        title: '',
        record: [
            {
            createdDate: currentCaseRecordDate,
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
            memo: '',
            teaching: []
            }
        ]
        };
        const patientInfo = JSON.parse(JSON.stringify(basicStore.editableData));
        const symptom = JSON.parse(JSON.stringify(symptomStore.editableData));
        // const exam = JSON.parse(JSON.stringify(examStore.editableData));
        const exam = [];
        const lab = JSON.parse(JSON.stringify(labStore.editableData));
        
        const selectedLabCategory = JSON.parse(JSON.stringify(labStore.selectedLabCategory));
        // const selectedLabCategory = [];
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
        const teaching = JSON.parse(JSON.stringify(teachingStore.editableData))
        
        updatedCase = { ...updatedCase, patient: patientInfo };
        updatedCase['title'] = patientInfo.title;
        updatedCase.record[0].symptom = symptom.slice();
        updatedCase.record[0].exam = exam.slice();
        updatedCase.record[0].lab = lab.slice();
        updatedCase.record[0].selectedLabCategory = selectedLabCategory.slice();

        updatedCase.record[0].analyzeCondition = analyzeSymptom.slice();
        updatedCase.record[0].analyzeSymptom = analyzeSymptom.slice();
        updatedCase.record[0].analyzeLab = analyzeLab.slice();

        updatedCase.record[0].diagnosis = diagnosis.slice();
        updatedCase.record[0].analyzeTreatment = analyzeTreatment.slice();
        updatedCase.record[0].treatment = {...treatment, fomula};
        updatedCase.record[0].memo = memo;
        updatedCase.record[0].teaching = teaching.slice();


        
        // 공란 필터링 -- 증상
        let filteredSymptoms = updatedCase.record[0].symptom.filter((item) => {
            return item.name !== '';
        })
        // 중요도 재배치
        filteredSymptoms.forEach((item, i) => {
            item.rank = i + 1;
        });

        // 공란 필터링 -- 혈검
        let filteredLabs = updatedCase.record[0].lab.filter((item) => {
            return item.value !== '';
        })
        // 중요도 재배치
        

        // 공란 필터링 -- 진찰
        let filteredExam = updatedCase.record[0].exam.filter((item) => {
            return item.name !== '';
        })
        // 중요도 재배치
        filteredExam.forEach((item, i) => {
            item.rank = i + 1;
        });

        // 공란 필터링 -- 진단
        let filteredDiagnosis = updatedCase.record[0].diagnosis.filter((item) => {
            return item.name !== '';
        });

        let filteredTeaching = updatedCase.record[0].teaching.filter((item) => {
            return item.description !== '';
        });

        let filteredFomula = updatedCase.record[0].treatment['fomula'].filter((item) => {
            return item.herbName !== '';
        });

        updatedCase.record[0].symptom = filteredSymptoms;
        updatedCase.record[0].lab = filteredLabs;
        updatedCase.record[0].exam = filteredExam;
        updatedCase.record[0].diagnosis = filteredDiagnosis;
        updatedCase.record[0].treatment = {...updatedCase.record[0].treatment, fomula: filteredFomula};
        updatedCase.record[0].teaching = filteredTeaching;

        let reversedRecords = [];
        if (this.currentCase.record.length > 1) {
            reversedRecords = this.currentCase.record.slice().reverse();
            let willBeUpdatedRecords = JSON.parse(JSON.stringify(reversedRecords));
            willBeUpdatedRecords.splice(dateIndex, 1, updatedCase.record[0]);
            let reversedUpdatedRecords = willBeUpdatedRecords.slice().reverse();
            updatedCase = { ...updatedCase, record: reversedUpdatedRecords }
        }

        return agent.updateCase(this.currentCase._id ,updatedCase)
            .then(action((response) => {
                const { Case } = response.data;
                let reversedDetail = Case.record.slice().reverse();

                this.isLoading = false;
                this.currentCase = Case;
                this.currentCaseDetail = reversedDetail[dateIndex];


                let recordDates = [];
                Case.record.forEach((record) => { recordDates.push(record.createdDate) });
                this.currentCaseRecord = recordDates.slice().reverse();
                
                this.currentCaseRecordDate = this.currentCaseRecord[dateIndex];

                this.setCurrentCase(response.data.Case, dateIndex);
                
                
                return response;
            }))
            .catch(action((err) => {
                throw err;
            }));
    }

    

    @action deleteCase(id) {
        this.isLoading = true;
        return agent.deleteCase(id)
            .then(action((response) => {
                this.isLoading = false;
                return response;
            }))
            .catch((err) => {
                throw err;
            })
    }


    @action addNewRecordToCase(caseId) {
        const lengthOfRecord = this.currentCase.record.length;
        const lastDate = this.currentCase.record[lengthOfRecord - 1].createdDate;
        let createdDate = getLocaleFullDateWithTime(Date.now());
        
        if (createdDate !== lastDate) {
            let oldCase = JSON.parse(JSON.stringify(this.currentCase));
            let latestRecord = oldCase.record.splice(lengthOfRecord - 1, 1);
            let newCase = JSON.parse(JSON.stringify(this.currentCase));

            latestRecord[0].createdDate = createdDate;
            latestRecord[0]._id = v1();
            newCase.record.push(latestRecord[0]);

            this.isLoading = true;
            return agent.updateCase(caseId, newCase)
                .then(action((response) => {
                    this.isLoading = false;
                    const recordDates = [];
                    response.data.Case.record.forEach((record) => {
                        recordDates.push(record.createdDate)
                    });
                    this.currentCaseRecord = recordDates.reverse();
                    this.currentCaseRecordDate = this.currentCaseRecord[0];
                    this.currentCase = response.data.Case;
                    return response;
                }))
                .catch(action((error) => {
                    this.isLoading = false;
                    throw error;
                }));
        }
    }


    @action deleteRecordFromCase(caseId) {
        const willBeDeletedRecordDate = this.currentCaseRecordDate;
        
        let newCase = JSON.parse(JSON.stringify(this.currentCase));

        let recordDates = [];
        newCase.record.forEach((record) => { recordDates.push(record.createdDate) });
        const willBeDeletedRecordDateIndex = recordDates.indexOf(willBeDeletedRecordDate);
        this.isLoading = true;
        if (recordDates.length > 1) {
            newCase.record.splice(willBeDeletedRecordDateIndex, 1);

            return agent.updateCase(caseId, newCase)
                .then(action((response) => {
                    
                    const recordDates = [];
                    this.isLoading = false;
                    response.data.Case.record.forEach((record) => {
                        recordDates.push(record.createdDate);
                    });
                    this.currentCaseRecord = recordDates.reverse();
                    this.currentCaseRecordDate = this.currentCaseRecord[0];
                    this.currentCase = response.data.Case;
                    if (this.isEditing === true) {
                        this.toggleIsEditing();
                    }
                    return response.data;
                }))
                .catch(action((error) => {
                    this.isLoading = false;
                    throw error;
                }));
        }
    }


    @action analyzeSymptom(referenceData = {}) {
        this.isLoadingForSymptom = true;
        return agent.analyzeCondition({ referenceData })
            .then(action((response) => {
                // console.log(response.data.result)
                analyzeSymptomStore.setEditableData(response.data.result);
                this.isLoadingForSymptom = false;
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


    @action clear() {
        this.registry = [];
        this.infiniteStore = [];
        this.searchedInfiniteStore = [];
        this.currentPage = 1;
        this.lastPage = 0;
        this.lastPageForSearching = 0;
        this.rest = 0;
        this.restForSearch = 0;
        this.loadMore = true;
        this.currentCaseRecordDate = '';
        this.currentCaseRecord = [];
        this.currentCasePatient = [];
        this.currentCaseDetail = {};
        this.dateIndex = 0;
        this.onReady = false;
    }

    @action clearCurrentCase() {
        this.currentCase = null;
    }

    @action clearIsEditing() {
        this.isEditing = false;
    }

    @action clearAllEditableData() {
        basicStore.clear();
        basicStore.clearOptional();
        symptomStore.clear();
        labStore.clear();
        labStore.clearAddLab();
        diagnosisStore.clear();
        drugStore.clear();
        teachingStore.clear();
        analyzeSymptomStore.clear();
        analyzeSymptomStore.clearFirstTime();
        analyzeSymptomStore.clearOpen();
        analyzeDrugStore.clear();
        analyzeDrugStore.clearFirstTime();
        analyzeDrugStore.clearOpen();
        analyzeTeachingStore.clear();
        analyzeTeachingStore.clearFirstTime();
        analyzeTeachingStore.clearOpen();
    }


}
    
export default new CaseStore()