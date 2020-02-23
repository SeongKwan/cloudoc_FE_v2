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
        let THIS = this;
        if (this.editableData.length > 0) {
            this.editableData.forEach(action((diseases, i) => {
                THIS.openMores[i] = [];
                diseases['drugs'].forEach(action((drug, index) => {
                    THIS.openMores[i][index] = false;
                }))
            }))
        }
        // console.log(JSON.parse(JSON.stringify(this.openMores)))
    }

    @action setEditableData(editableData) {
        this.editableData = [];
        editableData.forEach((editableData) => { this.editableData.push(editableData) });
    }


    @action toggleOpenMores(indexAnl, indexDrug) {
        this.openMores[indexAnl][indexDrug] = !this.openMores[indexAnl][indexDrug];
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