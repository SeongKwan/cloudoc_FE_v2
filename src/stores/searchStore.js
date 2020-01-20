import { observable, action } from 'mobx';

class SearchStore {
    @observable keyword = {
        cases: '',
        symptoms: '',
        diagnosis: '',
        drug: ''
    }

    @action setKeyword(type, keyword) {
        this.keyword[type] = keyword;
    }

    @action clearKeyword() {
        this.keyword = {
            cases: '',
            symptoms: '',
            diagnosis: '',
            drug: ''
        }
    }
}

export default new SearchStore();