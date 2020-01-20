import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import Hangul from 'hangul-js';
import drugListForInputStore from './drugListForInputStore';
class DrugListItemStore {
    @observable isLoading = false;
    @observable category = '';
    @observable registry = [];

    @observable currentIndex = -1;

    @computed get drugs() {
        // let drugs = [];
        // if (this.category !== '' && this.category !== null && this.category !== undefined) {
        //     drugs = this.registry.filter((drug) => {
        //         return drug.category === this.category 
        //     });
        //     drugs = this._searchForCase(this.searchKeywordForCase, drugs);

        //     drugListForInputStore.setMaxIndex(drugs.length - 1);
        //     return this._sorting(drugs);
        // }

        drugListForInputStore.setMaxIndex(this._sorting(this._search(this.searchKeyword, this.registry)).length - 1);
        return this._sorting(this._search(this.searchKeyword, this.registry));
    }

    @computed get drugsForReference() {
        if (drugListForInputStore.currentIndex === null || drugListForInputStore.currentIndex === undefined) {
            drugListForInputStore.setMaxIndex(this._sorting(this.registry).length - 1);
            return this._sorting(this.registry);
        }
        drugListForInputStore.setMaxIndex(this._sorting(this._search(this.searchKeyword[drugListForInputStore.currentIndex], this.registry)).length - 1);
        return this._sorting(this._search(this.searchKeyword[drugListForInputStore.currentIndex], this.registry));
    }




    @action setCurrentIndex(index) {
        this.currentIndex = index;
    }

    @action clearCurrentIndex() {
        this.currentIndex = -1;
    }


    

    @action _sorting(registry) {
        registry.sort(function (a, b) { 
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;  
        });

        return registry;
    }

    // 문헌용
    // 불러온 데이터의 특정 property에 keyword가 포함되어있는지 검색하는 필터입니다.
    // @observable searchKeyword = []; //사용자가 검색창에 검색한 키워드
    // @action setSearchKeyword = (index, searchKeyword) => { this.searchKeyword[index] = searchKeyword; }

    // _search = (searchKeyword, items) => {
    //     items.forEach(action((item) => {
    //         var dis = Hangul.disassemble(item.name, true);
    //         var cho = dis.reduce(function (prev, elem) {
    //             elem = elem[0] ? elem[0] : elem;
    //             return prev + elem;
    //         }, "");
    //         item.diassembled = cho;
    //     }));

    //     if (!searchKeyword) return [...items];

    //     let searchKeywordSpacer = Hangul.disassemble(searchKeyword).join("");
    //     const searcher = new Hangul.Searcher(searchKeyword.toLowerCase());
    //     return items.filter(action((item) => {
    //         return searcher.search(item.name.toLowerCase()) >= 0 ? true : false
    //             || item.diassembled.includes(searchKeywordSpacer);
    //         }));
    // };


    // 증례용
    @observable searchKeyword = ""; //사용자가 검색창에 검색한 키워드
    @action setSearchKeyword = (searchKeyword) => { 
        this.searchKeyword = searchKeyword; 
    }
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




    @action loadDrugs() {
        this.isLoading = true;
        return agent.loadDrugs()
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

    @action initSearchKeyword(drugs) {
        if (this.searchKeyword.length > 0) {
            this.searchKeyword = [];
        }
        drugs.forEach(() => { this.searchKeyword.push('') });
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

    @action clearSearchKeyword() {
        this.searchKeyword = ''
    }

    @action clear() {
        this.isLoading = false;
        this.category = '';
        this.registry = [];
    }
}

export default new DrugListItemStore()