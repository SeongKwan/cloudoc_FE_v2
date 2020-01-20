import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import Hangul from 'hangul-js';
import symptomListForInputStore from './symptomListForInputStore';
import _ from 'lodash';

class SymptomListItemStore {
    @observable isLoading = false;
    @observable category = [""];
    @observable registry = [];
    @observable optionCategories = [];

    @observable currentIndex = -1;

    @computed get symptoms() {
        let symptoms = [];
        if (this.registry.length > -1) {
            
            // if (this.category[symptomListForInputStore.currentIndex] !== '' && this.category[symptomListForInputStore.currentIndex] !== null && this.category[symptomListForInputStore.currentIndex] !== undefined) {
            //     symptoms = this.registry.filter((symptom) => {
            //         return symptom.category === this.category[symptomListForInputStore.currentIndex] 
            //     });
    
            //     symptoms = this._search(this.searchKeyword[symptomListForInputStore.currentIndex], symptoms);
    
            //     symptomListForInputStore.setMaxIndex(symptoms.length - 1);
            //     return this._sorting(symptoms);
                
            // }

            symptomListForInputStore.setMaxIndex(this._sorting(this._search(this.searchKeyword, this.registry)).length - 1);
            return this._sorting(this._search(this.searchKeyword, this.registry));
        }
        return symptoms;
    }

    @computed get symptomsForReference() {
        if (this.registry.length > -1) {
            symptomListForInputStore.setMaxIndex(this._sorting(this._search(this.searchKeyword[symptomListForInputStore.currentIndex], this.registry)).length - 1);
            return this._sorting(this._search(this.searchKeyword[symptomListForInputStore.currentIndex], this.registry));
        }
        return [];
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

    // 불러온 데이터의 특정 property에 keyword가 포함되어있는지 검색하는 필터입니다.
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

    @action loadSymptoms() {
        this.isLoading = true;
        return agent.loadSymptoms()
            .then(action((response) => {
                this.registry = response.data || [];
                this.isLoading = false;
                let array;
                array = _.sortBy(response.data, 'category');
                array = _.uniqBy(array, 'category');
                array.forEach((item, i) => {
                    this.optionCategories[i] = item.category;
                });
                return !!response;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    };

    @action initSearchKeyword(symptoms) {
        if (this.searchKeyword.length > 0) {
            this.searchKeyword = [];
        }
        
        symptoms.forEach(() => { this.searchKeyword.push('') });
    }

    @action setUpCategory(symptoms) {
        if (this.category.length > 0) {
            this.category = [];
        }
        
        symptoms.forEach(symptom => this.category.push(symptom.category || ''));
    }

    @action setCategory(category, i) {
        this.category[i] = category;
    }

    @action addCategory(category = '') {
        if (category === '') {
            return this.category = [...this.category, ''];
        }
        if (category !== '') {
            return this.category = [...this.category, category];
        }
    }

    @action addSearchKeyword(searchKeyword = '') {
        if (searchKeyword === '') {
            return this.searchKeyword = [...this.searchKeyword, ''];
        }
        if (searchKeyword !== '') {
            return this.searchKeyword = [...this.searchKeyword, searchKeyword];
        }
    }

    @action reorder(newOrderedDatas) {
        this.category = [];
        this.searchKeyword = [];
        newOrderedDatas.forEach((item) => {
            this.category.push(item.category);
            this.searchKeyword.push('');
        })
    }

    @action deleteCategory(selectedIndex) {
        this.category.splice(selectedIndex, 1);
    }
    
    @action deleteSearchKeyword(selectedIndex) {
        this.searchKeyword.splice(selectedIndex, 1);
    }

    @action clear() {
        this.isLoading = false;
        this.category = [""];
        this.registry = [];
        this.clearSearchKeyword();
    }

    @action clearSearchKeyword() {
        this.searchKeyword = ''
    }

    @action clearCategory() {
        this.category = [""];
    }
}

export default new SymptomListItemStore()