import { observable, action } from 'mobx';
import agent from '../utils/agent';
import drugListItemStore from './drugListItemStore';
import drugListForInputStore from './drugListForInputStore';

class TreatmentStore {
    @observable isLoading = false;
    @observable staticData = [];
    @observable staticDataForTreatment = {
        drugName: '',
        guide: '',
        caution: '',
        lifestyle: ''
    };
    @observable editableData = [];
    @observable editableDataForTreatment = {
        drugName: '',
        guide: '',
        caution: '',
        lifestyle: ''
    }

    @action initilize(treatmentData) {
        const {
            drugName,
            guide,
            caution,
            lifestyle
        } = treatmentData;

        this.editableDataForTreatment.drugName = drugName;
        this.editableDataForTreatment.guide = guide;
        this.editableDataForTreatment.caution = caution;
        this.editableDataForTreatment.lifestyle = lifestyle;

        this.staticDataForTreatment.drugName = drugName;
        this.staticDataForTreatment.guide = guide;
        this.staticDataForTreatment.caution = caution;
        this.staticDataForTreatment.lifestyle = lifestyle;
    }

    @action setEditableData(editableData) {
        if (this.editableData.length > 0) {
            this.editableData = [];
        }
        editableData.forEach((editableData) => { this.editableData.push(editableData) });
        this.staticData = editableData;
    }

    @action setEditableDataForTreatment(type, value) {
        this.editableDataForTreatment[type] = value;
        let indexOfList;
        drugListItemStore.drugs.forEach((item, i) => {
            if (item.name === value) {
                return indexOfList = i;
            } else return false;
        })
    
        drugListForInputStore.setSelectedIndex(indexOfList);
    }

    @action handleChange(index, key, value) {
        this.editableData[index][key] = value;
    }
    @action handleChangeTretment(key, value) {
        this.editableDataForTreatment[key] = value;
    }

    @action pressESC() {
        this.editableDataForTreatment['drugName'] = '';
    }

    @action addDrug() {
        this.editableData = [...this.editableData, {
            herbName: '',
            dose: ''
        }];
    }

    @action autoSetDrug(drug) {
        agent.loadDrug(drug._id)
            .then(action((response) => {
                let { 
                    formula,
                    name,
                    guide,
                    lifestyle,
                    caution
                } = response.data || [];
                
                this.editableDataForTreatment.drugName = name || '';
                this.editableDataForTreatment.guide = guide || '';
                this.editableDataForTreatment.caution = caution || '';
                this.editableDataForTreatment.lifestyle = lifestyle || '';

                if (formula.length === 0 || formula === undefined) {
                    return this.editableData = [];
                }
                if (formula.length > 0) {
                    this.editableData = [];
                    formula.forEach((formula) => { this.editableData.push(formula) });
                }
            }))
            .catch(action((error) => {
                throw error;
            }));
    }

    @action loadDrug(drugId) {
        this.isLoading = true;
        agent.loadDrug(drugId)
            .then(action((response) => {
                this.currentDrug = response.data;
                this.isLoading = false;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }

    @action fromClinicaldbSidebarSetDrug(_id) {
        agent.loadDrug(_id)
            .then(action((response) => {
                let { 
                    formula,
                    name,
                    guide,
                    lifestyle,
                    caution
                } = response.data || [];
                
                this.editableDataForTreatment.drugName = name || '';
                this.editableDataForTreatment.guide = guide || '';
                this.editableDataForTreatment.caution = caution || '';
                this.editableDataForTreatment.lifestyle = lifestyle || '';

                if (formula.length === 0 || formula === undefined) {
                    return this.editableData = [];
                }
                if (formula.length > 0) {
                    this.editableData = [];
                    formula.forEach((formula) => { this.editableData.push(formula) });
                }
            }))
            .catch(action((error) => {
                throw error;
            }));
    }

    @action deleteTreatment(selectedIndex) {
        this.editableData.splice(selectedIndex, 1);
    }

    @action clear() {
        this.staticData = [];
        this.editableData = [];
        this.clearTreatment();
    }

    @action clearTreatment() {
        this.editableDataForTreatment = {
            drugName: '',
            guide: '',
            caution: '',
            lifestyle: ''
        }
        this.staticDataForTreatment = {
            drugName: '',
            guide: '',
            caution: '',
            lifestyle: ''
        }
    }

    @action deleteAllInputValue() {
        this.editableData = [];
        this.editableDataForTreatment = {
            drugName: '',
            guide: '',
            caution: '',
            lifestyle: ''
        }
    }
}

export default new TreatmentStore()