import { observable, action } from 'mobx';
import agent from '../utils/agent';

class AnalyzeSymptomStore {
    @observable staticData = [];
    @observable editableData = [];
    @observable firstTime = true;
    @observable openMores = [];
    @observable openDetail = false;

    @observable isLoading = false;
    @observable currentCondition = {
        section: '',
        name: '',
        category: '',
        severity: '',
        detail: [],
        teaching: [],
        pathology: [],
        linked_symptoms: [],
        linked_labs: [],
        linked_drugs: [],
        linked_tags: []
    };

    @action initiateOpen() {
        this.openMores = [];
        this.editableData.forEach((editableData) => {
            this.openMores.push(false);
        })
    }

    @action setEditableData(editableData) {
        editableData.forEach((editableData) => { this.editableData.push(editableData) });
    }

    @action toggleOpenMores(i) {
        this.openMores[i] = !this.openMores[i];
    }
    @action toggleOpenDetail() {
        this.openDetail = !this.openDetail;
    }
    @action closeDetail() {
        this.openDetail = false;
    }
    @action handleChange(index, key, value) {
        this.editableData[index][key] = value;
    }

    @action falseFirstTime() {
        this.firstTime = false;
    }

    @action clear() {
        this.staticData = [];
        this.editableData = [];
    }

    @action clearFirstTime() {
        this.firstTime = true;
    }

    @action clearOpen() {
        this.openMores = [];
        this.openDetail = false;
    }

    @action loadCondition(conditionId) {
        this.isLoading = true;
        return agent.loadCondition(conditionId)
            .then(action((response) => {
                this.currentCondition = response.data;
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }
}

export default new AnalyzeSymptomStore()