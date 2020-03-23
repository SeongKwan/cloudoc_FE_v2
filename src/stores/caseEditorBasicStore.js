import { observable, action, computed } from 'mobx';
// import labStore from './labStore';

class CaseEditorBasicStore {
    @observable staticData = {
        title: '',
        gender: '',
        age: '',
        pastHistory: '',
        familyHistory: '',
        socialHistory: '',
        memo: ''
    };
    @observable editableData = {
        title: '',
        gender: 'male',
        age: '30',
        pastHistory: '',
        familyHistory: '',
        socialHistory: '',
        memo: ''
    }

    @computed get diff() {
        return JSON.stringify(this.editableData) !== JSON.stringify(this.staticData);
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
        
        this.staticData.title = title;
        this.staticData.gender = gender;
        this.staticData.age = age;
        this.staticData.pastHistory = pastHistory;
        this.staticData.familyHistory = familyHistory;
        this.staticData.socialHistory = socialHistory;
        this.staticData.memo = memo;
    }

    @action changeEditableData = (type, value) => {
        if (window.confirm('성별을 바꾸면 혈액검사가 초기화 됩니다. 바꾸시겠습니까?')) {
            return this.editableData[type] = value;
        } else {
            return false;
        }
    }

    @action compareData() {
        return JSON.stringify(this.editableData) === JSON.stringify(this.staticData);
    }

    @action clear() {
        this.editableData = {
            title: '',
            gender: 'male',
            age: '30',
            pastHistory: '',
            familyHistory: '',
            socialHistory: '',
            memo: ''
        }
        this.staticData = {
            title: '',
            gender: '',
            age: '',
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
            age: '30',
            pastHistory: '',
            familyHistory: '',
            socialHistory: '',
            memo: ''
        }
    }
}

export default new CaseEditorBasicStore();