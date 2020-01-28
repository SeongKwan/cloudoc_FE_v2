import { observable, action, computed } from 'mobx';
import analyzeSymptomStore from './analyzeSymptomStore';
import analyzeBloodTestStore from './analyzeBloodTestStore';
import analyzeRecommendationTreatmentStore from './analyzeRecommendationTreatmentStore';
import agent from '../util/agent';
import momentHelper from '../util/momentHelper';
import Hangul from 'hangul-js';

class CaseCreateStore {
    @observable isOn = false;
    @observable isLoading = false;
    @observable isEditing = false;
    @observable isShowingTopbar = false;
    @observable referenceForIsShowingTopbar = 0;

    @observable registry = [];
    @observable currentCaseRecordDate = '';
    @observable currentCaseRecord = [];
    @observable currentCasePatient = [];
    @observable currentCaseDetail = [];
    @observable currentCase = {};
    @observable lastestCaseRecordData = {};
    @observable numberOfCases = null;

    @observable currentCaseIndex = '';


    @action toggleIsEditing() {
        this.isEditing = !this.isEditing;
    }

    
    @action postCase(newCase) {
        this.isLoading = true;
        return agent.postCase(newCase)
            .then(action((response) => {
                this.isLoading = false;
            }))
    }

    @action updateCase(dateIndex, caseId, updatedCase) {

        let reversedRecords = [];
        if (this.currentCase.record.length > 1) {
            reversedRecords = this.currentCase.record.slice().reverse();
            
            let willBeUpdatedRecords = JSON.parse(JSON.stringify(reversedRecords));
            willBeUpdatedRecords.splice(dateIndex, 1, updatedCase.record[0]);
            let reversedUpdatedRecords = willBeUpdatedRecords.slice().reverse();
            updatedCase = { ...updatedCase, record: reversedUpdatedRecords }
        }
        
        this.isLoading = true;

        return agent.updateCase(caseId ,updatedCase)
            .then(action((response) => {
                this.isLoading = false;
                
                this.setCurrentCase(caseId, dateIndex);
                this.toggleIsEditing();
            }));
    }

    @action deleteCase(id) {
        this.isLoading = true;
        return agent.deleteCase(id)
            .then(action((response) => {
                this.isLoading = false;
            }))
    }

    @action async setCurrentCase(caseId, dateIndex) {
        this.isLoading = true;
        return await agent.loadCase(caseId)
            .then(action((response) => {

                this.currentCase = response.data.case;
                this.currentCasePatient = response.data.case.patient;

                let reversedDetail = response.data.case.record.slice().reverse();
                this.currentCaseDetail = reversedDetail[dateIndex];

                let recordDates = [];
                response.data.case.record.forEach((record) => { recordDates.push(record.createdDate) });
                this.currentCaseRecord = recordDates.slice().reverse();
                
                this.currentCaseRecordDate = this.currentCaseRecord[dateIndex];

                this.isLoading = false;
            }))

    }
        
    @action addNewRecordToCase(currentCaseIndex, caseId) {
        const lengthOfRecord = this.cases[currentCaseIndex].record.length;
        const lastDate = this.cases[currentCaseIndex].record[lengthOfRecord - 1].createdDate;
        let createdDate =  momentHelper.getLocaleFullDateWithTime(new Date());

        const id = caseId;

        if (createdDate !== lastDate) {
            let oldCases = JSON.parse(JSON.stringify(this.cases));
            let latestRecord = oldCases[currentCaseIndex].record.splice(lengthOfRecord - 1, 1);
            let newCase = JSON.parse(JSON.stringify(this.currentCase));

            latestRecord[0].createdDate = createdDate;
            newCase.record.push(latestRecord[0]);

            return agent.addRecordToCase(id, newCase)
                .then(action((response) => {
                    const recordDates = [];
                    response.data.record.forEach((record) => {
                        recordDates.push(record.createdDate)
                    });
                    this.currentCaseRecord = recordDates.reverse();
                    this.toggleIsEditing();
                }));
        }
    }

    @action deleteRecordFromCase(currentCaseIndex, caseId) {
        const id = caseId;
        const willBeDeletedRecordDate = this.currentCaseRecordDate;
        
        let newCase = JSON.parse(JSON.stringify(this.cases[currentCaseIndex]));

        let recordDates = [];
        newCase.record.forEach((record) => { recordDates.push(record.createdDate) });
        const willBeDeletedRecordDateIndex = recordDates.indexOf(willBeDeletedRecordDate);

        if (recordDates.length > 1) {
            newCase.record.splice(willBeDeletedRecordDateIndex, 1);
            return agent.deleteRecordFromCase(id, newCase)
                .then(action((response) => {
                    const recordDates = [];
                    response.data.record.forEach((record) => {
                        recordDates.push(record.createdDate);
                    });
                    this.currentCaseRecord = recordDates.reverse();
                    if (this.isEditing === true) {
                        this.toggleIsEditing();
                    }
                }));
        }
    }

    @action analyzeSymptom(referenceData = {}) {
        return agent.analyzeSymptom({ referenceData })
            .then(action((response) => {
                analyzeSymptomStore.setEditableData(response.data.result);
            }))
            .catch(err => {
                throw(err);
            })
    }

    @action analyzeLab(referenceData = {}) {
        return agent.analyzeLab({ referenceData })
            .then(action((response) => {
                analyzeBloodTestStore.setEditableData(response.data.result);
            }))
            .catch(err => {
                throw(err);
            })
    }

    @action analyzeTreatment(referenceData = {}) {
        return agent.analyzeTreatment({ referenceData })
            .then(action((response) => {
                analyzeRecommendationTreatmentStore.setEditableData(response.data.result);
            }))
            .catch(err => {
                throw(err);
            })
    }

    @action switchOn() {
        this.isOn = true;
    }

    @action clear() {
        this.isLoading = false;
        
        this.registry = observable.array();
        this.currentCaseRecordDate = '';
        this.currentCaseRecord = [];
        this.currentCasePatient = [];
        this.currentCaseDetail = [];
        this.currentCase = {};
        this.lastestCaseRecordData = {};

        this.referenceForIsShowingTopbar = 0;

        this.clearIsShowingTopbar();
        this.clearIsEditing();
        this.isOn = false;
    }

    @action clearIsShowingTopbar() {
        this.isShowingTopbar = false;
    }

    @action clearIsEditing() {
        this.isEditing = false;
    }

    @action clearSearchKeyword() {
        this.searchKeyword = '';
    }
}
    
export default new CaseCreateStore()