import { observable, action } from 'mobx';
import agent from '../utils/agent';

class AnalyzeRecommendationTreatmentStore {
    @observable staticData = [];
    @observable editableData = [];
    @observable firstTime = true;

    @observable openMores = [];
    @observable openDetail = false;

    @observable isLoading = false;
    @observable currentDrug = {
        name: '',
        description: '',
        category: '',
        reference: '',
        caution: '',
        guide: '',
        lifestyle: '',
        formula: []
    };

    @action initiateOpen() {
        this.openMores = [];
        this.editableData.forEach((editableData) => {
            this.openMores.push(false);
        })
    }

    @action setEditableData(editableData) {
        this.editableData = [];
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

    @action loadDrug(drugId) {
        this.isLoading = true;
        return agent.loadDrug(drugId)
            .then(action((response) => {
                this.currentDrug = response.data;
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }
}

export default new AnalyzeRecommendationTreatmentStore()