import { observable, action } from 'mobx';

class SearchStore {
    @observable keyword = {
        cases: '',
        symptoms: ''
    }

    @action setKeyword(type, keyword) {
        this.keyword[type] = keyword;
    }

    @action clearKeyword() {
        this.keyword = {
            cases: '',
            symptoms: ''
        }
    }
}

export default new SearchStore();