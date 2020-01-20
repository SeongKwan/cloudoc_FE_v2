import { observable, action } from 'mobx';

class CaseEditorBasicStore {
    @observable editableData = {
        title: '',
        gender: 'male',
        age: '0',
        pastHistory: '',
        familyHistory: '',
        socialHistory: '',
        memo: ''
    }

    @action initialize(patientInfoData) {
        
        const {
            title,
            gender,
            age,
            pastHistory,
            familyHistory,
            socialHistory,
            memo
        } = patientInfoData;

        this.editableData.title = title;
        this.editableData.gender = gender;
        this.editableData.age = age;
        this.editableData.pastHistory = pastHistory;
        this.editableData.familyHistory = familyHistory;
        this.editableData.socialHistory = socialHistory;
        this.editableData.memo = memo;
    }

    @action changeEditableData = (type, value) => {
        this.editableData[type] = value;
    }

    @action clear() {
        this.editableData = {
            title: '',
            gender: 'male',
            age: '0',
            pastHistory: '',
            familyHistory: '',
            socialHistory: '',
            memo: ''
        }
    }
    @action clearOptional() {
        this.editableData['pastHistory'] = '';
        this.editableData['familyHistory'] = '';
        this.editableData['socialHistory'] = '';
        this.editableData['memo'] = '';
    }

    @action deleteAllInputValue() {
        this.editableData = {
            title: this.editableData.title,
            gender: 'male',
            age: '0',
            pastHistory: '',
            familyHistory: '',
            socialHistory: '',
            memo: ''
        }
    }
}

export default new CaseEditorBasicStore();