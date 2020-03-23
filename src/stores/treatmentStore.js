import { observable, action, computed } from 'mobx';
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
        lifestyle: '',
        description: ''
    };
    @observable editableData = [{
        herbName: '',
        dose: ''
    }];
    
    @observable editableDataForTreatment = {
        drugName: '',
        guide: '',
        caution: '',
        lifestyle: '',
        description: ''
    }

    @computed get diffForFormula() {
        return JSON.stringify(this.editableData) !== JSON.stringify(this.staticData);
    }
    @computed get diff() {
        return JSON.stringify(this.editableDataForTreatment) !== JSON.stringify(this.staticDataForTreatment);
    }

    @action initilize(treatmentData) {
        const {
            drugName,
            guide,
            caution,
            lifestyle,
            description,
        } = treatmentData;

        this.editableDataForTreatment.drugName = drugName;
        this.editableDataForTreatment.guide = guide;
        this.editableDataForTreatment.caution = caution;
        this.editableDataForTreatment.lifestyle = lifestyle;
        this.editableDataForTreatment.description = description;

        this.staticDataForTreatment.drugName = drugName;
        this.staticDataForTreatment.guide = guide;
        this.staticDataForTreatment.caution = caution;
        this.staticDataForTreatment.lifestyle = lifestyle;
        this.staticDataForTreatment.description = description;
    }

    @action setEditableData(editableData) {
        if (this.editableData.length > 0) {
            this.editableData = [];
        }
        editableData.forEach((editableData) => { this.editableData.push(editableData) });
        this.staticData = editableData;
    }

    @action compareData() {
        return JSON.stringify(this.editableDataForTreatment) === JSON.stringify(this.staticDataForTreatment);
    }

    @action compareArrayData() {
        return JSON.stringify(this.editableData) === JSON.stringify(this.staticData);
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
                    description,
                    caution
                } = response.data || [];
                
                this.editableDataForTreatment.drugName = name || '';
                this.editableDataForTreatment.guide = guide || '';
                this.editableDataForTreatment.caution = caution || '';
                this.editableDataForTreatment.lifestyle = lifestyle || '';
                this.editableDataForTreatment.description = description || '';

                if (formula.length === 0 || formula === undefined) {
                    return this.editableData = [{
                        herbName: '',
                        dose: ''
                    }];
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
                    description,
                    caution
                } = response.data || [];
                
                this.editableDataForTreatment.drugName = name || '';
                this.editableDataForTreatment.guide = guide || '';
                this.editableDataForTreatment.caution = caution || '';
                this.editableDataForTreatment.description = description || '';
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
        this.editableData = [{
            herbName: '',
            dose: ''
        }];
        this.clearTreatment();
    }

    @action clearTreatment() {
        this.editableDataForTreatment = {
            drugName: '',
            guide: '',
            caution: '',
            lifestyle: '',
            description: '',
        }
        this.staticDataForTreatment = {
            drugName: '',
            guide: '',
            caution: '',
            lifestyle: '',
            description: '',
        }
    }

    @action deleteAllInputValue() {
        this.editableData = [{
            herbName: '',
            dose: ''
        }];
        this.editableDataForTreatment = {
            drugName: '',
            guide: '',
            caution: '',
            lifestyle: '',
            description: ''
        }
    }
}

export default new TreatmentStore()