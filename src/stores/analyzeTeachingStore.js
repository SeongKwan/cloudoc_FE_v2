import { observable, action } from 'mobx';

class AnalyzeTeachingStore {
    @observable staticData = [];
    @observable editableData = [];
    @observable firstTime = true;

    @observable openMores = [];
    @observable openDetail = false;
    @observable isLoading = false;

    @action initiateOpen() {
        this.openMores = [];
        this.editableData.forEach((editableData) => {
            this.openMores.push(true);
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

}

export default new AnalyzeTeachingStore()