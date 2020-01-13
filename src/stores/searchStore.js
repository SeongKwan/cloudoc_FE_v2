import { observable, action, computed } from 'mobx';

class SearchStore {
    @observable keyword = {
        cases: ''
    }

    @action setKeyword(type, keyword) {
        this.keyword[type] = keyword;
    }

    @action clearKeyword() {
        this.keyword = {
            cases: ''
        }
    }
}

export default new SearchStore();