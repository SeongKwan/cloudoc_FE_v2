import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import Hangul from 'hangul-js';
import labListForInputStore from './labListForInputStore';

class LabListItemStore {
    @observable isLoading = false;
    @observable category = '';
    @observable registry = [];

    @computed get labsForReference() {
        if (labListForInputStore.currentIndex === null || labListForInputStore.currentIndex === undefined) {
            labListForInputStore.setMaxIndex(this._sorting(this.registry).length - 1);
            return this._sorting(this.registry);
        }
        labListForInputStore.setMaxIndex(this._sorting(this._search(this.searchKeyword[labListForInputStore.currentIndex], this.registry)).length - 1);
        return this._sorting(this._search(this.searchKeyword[labListForInputStore.currentIndex], this.registry));
    }

    @action _sorting(registry) {
        registry.sort(function (a, b) { 
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;  
        });

        return registry;
    }

    // 불러온 데이터의 특정 property에 keyword가 포함되어있는지 검색하는 필터입니다.
    @observable searchKeyword = []; //사용자가 검색창에 검색한 키워드
    @action setSearchKeyword = (index, searchKeyword) => { this.searchKeyword[index] = searchKeyword; }

    _search = (searchKeyword, items) => {
        items.forEach(action((item) => {
            var dis = Hangul.disassemble(item.name, true);
            var cho = dis.reduce(function (prev, elem) {
                elem = elem[0] ? elem[0] : elem;
                return prev + elem;
            }, "");
            item.diassembled = cho;
        }));

        if (!searchKeyword) return [...items];

        let searchKeywordSpacer = Hangul.disassemble(searchKeyword).join("");
        const searcher = new Hangul.Searcher(searchKeyword.toLowerCase());
        return items.filter(action((item) => {
            return searcher.search(item.name.toLowerCase()) >= 0 ? true : false
                || item.diassembled.includes(searchKeywordSpacer);
            }));
    }

    @action loadLabs() {
        this.isLoading = true;
        return agent.loadLabs()
            .then(action((response) => {
                this.registry = response.data || [];
                this.isLoading = false;
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    };

    @action initSearchKeyword(labs) {
        if (this.searchKeyword.length > 0) {
            this.searchKeyword = [];
        }
        labs.forEach(() => { this.searchKeyword.push('') });
    }

    @action addSearchKeyword(searchKeyword = '') {
        if (searchKeyword === '') {
            return this.searchKeyword = [...this.searchKeyword, ''];
        }
        if (searchKeyword !== '') {
            return this.searchKeyword = [...this.searchKeyword, searchKeyword];
        }
    }

    @action deleteCategory(selectedIndex) {
        this.category.splice(selectedIndex, 1);
    }
    
    @action deleteSearchKeyword(selectedIndex) {
        this.searchKeyword.splice(selectedIndex, 1);
    }


    @action setCategory(category) {
        this.category = category;
    }

    @action clear() {
        this.isLoading = false;
        this.category = '';
        this.registry = [];
    }
}

export default new LabListItemStore()