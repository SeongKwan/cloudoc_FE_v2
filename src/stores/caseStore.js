import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import searchStore from './searchStore';
import _ from 'lodash';
import Hangul from 'hangul-js';

const windowWidth = window.outerWidth;
let initialLoadAmount;
let loadAmount;

if (windowWidth > 1411) {
    initialLoadAmount = 7;
    loadAmount = 4;
} else {
    initialLoadAmount = 5;
    loadAmount = 3;
}

class CaseStore {
    @observable isLoading = false;
    @observable isLoadingMore = false;
    @observable registry = [];
    @observable infiniteStore = [];
    @observable searchedInfiniteStore = [];
    @observable currentPage = 1;
    @observable lastPage = 0;
    @observable lastPageForSearching = 0;
    @observable rest = 0;
    @observable restForSearch = 0;
    @observable loadMore = true;


    @computed get cases() {
        let cases = [];
        this.infiniteStore.forEach((article) => { cases.push(article); });
        return cases || [];
    }

    @action casesOnSearching() {
        const { keyword } = searchStore;
        let plusOne;
        if (searchStore.keyword['cases'].length > 0) {
            plusOne = 1;
        } else {
            plusOne = 0;
        }

        let database = [];
        this.searchedInfiniteStore = [];
        this.registry.forEach((article) => { database.push(article); });
        database = this._search(keyword['cases'], database);
        // database = this._filter(this.filterKeyword, database);
        // database = _.sortBy(database, 'section', 'name')

        this.lastPageForSearching = Math.floor(database.length / loadAmount) + 1;
        this.restForSearch = database.length%loadAmount;
        this.currentPage = 1;
        
        if (this.lastPageForSearching > 1) {
            this.loadMore = true
        } else {
            this.loadMore = false;
        }
        
        this.searchedInfiniteStore = database.slice(0, ((this.currentPage) * (initialLoadAmount + plusOne)));
        this.registryForSearching = database;
        
        return database || [''];
    };


    @action loadCases() {
        this.isLoading = true;
        return agent.loadCases()
                .then(action((response) => {
                    this.isLoading = false;
                    this.registry = response.data.cases;
                    // this.registry = this.registry.sort(function (a, b) { 
                    //     let unixA = momentHelper.toUnix(a.created_date);
                    //     let unixB = momentHelper.toUnix(b.created_date);
                    //     return unixA > unixB ? -1 : unixA < unixB ? 1 : 0;
                    // });
                    this.InitInfiniteStore();
                }))
                .catch(error => {
                    
                });
    }

    @action InitInfiniteStore() {
        let database = this.registry;
        let plusOne;
        if (searchStore.keyword['cases'].length > 0) {
            plusOne = 1;
        } else {
            plusOne = 0;
        }
        // database = this._filter(filterKeyword, this.registry);
        this.lastPage = Math.floor(database.length / loadAmount) + 1;
        this.rest = database.length%loadAmount;
        this.currentPage = 1;
        this.loadMore = true;
        this.infiniteStore = [];
        this.infiniteStore = database.slice(0, ((this.currentPage) * (initialLoadAmount + plusOne)));
    }

    @action addToInfiniteStore() {
        let cases = [];
        cases = this.registry;
        
        // cases = this._filter({reference: true}, this.registry);
        this.isLoadingMore = false;
        if ((this.currentPage + 1) < this.lastPage) {
            this.infiniteStore = [...this.infiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage + 1) * loadAmount))]
            this.currentPage++;
        } else if (this.currentPage + 1 === this.lastPage) {
            this.infiniteStore = [...this.infiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage) * loadAmount + this.rest))]
            this.currentPage++;
        } else if (this.currentPage >= this.lastPage) {
            return this.loadMore = false;
        }
    }

    @action addToSearchedStore() {
        let cases = [];
        cases = this.registryForSearching;
        // cases = this._filter({reference: true}, this.registryForSearching);
        this.isLoadingMore = false;
        if ((this.currentPage + 1) < this.lastPageForSearching) {
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage + 1) * loadAmount))]
            this.currentPage++;
        } else if (this.currentPage + 1 === this.lastPageForSearching) {
            this.searchedInfiniteStore = [...this.searchedInfiniteStore, ...cases.slice(this.currentPage * loadAmount, ((this.currentPage) * loadAmount + this.restForSearch))]
            this.currentPage++;
        } else if (this.currentPage >= this.lastPageForSearching) {
            return this.loadMore = false;
        }
    }

    @action noLoadMore() {
        this.loadMore = false;
    }

    @action setIsLoadingMore(status) {
        this.isLoadingMore = status;
    }

    // _filter = (filterBoolean, items) => {
    //     const { symptom, lab, condition, exam, drug, reference } = this.distributedClinicaldbs;

    //     let database = [];
    //     if (filterBoolean.symptom) database = database.concat(symptom);
    //     if (filterBoolean.lab) database = database.concat(lab);
    //     if (filterBoolean.condition) database = database.concat(condition);
    //     if (filterBoolean.exam) database = database.concat(exam);
    //     if (filterBoolean.drug) database = database.concat(drug);
    //     if (filterBoolean.reference) database = database.concat(reference);
        
    //     return database;
    // }

    // 불러온 데이터의 특정 property에 keyword가 포함되어있는지 검색하는 필터입니다.
    _search = (searchKeyword, items) => {
        if (!searchKeyword) return [...items];
        const searcher = new Hangul.Searcher(searchKeyword.toLowerCase());
        return items.filter((item) => {
            return this._hasSearchKeywordInItem(searcher, item);
        });
    }

    _hasSearchKeywordInItem(searcher, item) {
        const latestRecordIndex = item.record.length - 1;
        const { treatment } = item.record[latestRecordIndex]; 
        return (
                this._hasSearchKeywordInProperty(searcher, item.patient['memo'] || '') 
                || this._hasSearchKeywordInProperty(searcher, this._getRecordLatestData(item, 'symptom') || '') 
                || this._hasSearchKeywordInProperty(searcher, this._getRecordLatestData(item, 'diagnosis') || '') 
                || this._hasSearchKeywordInProperty(searcher, treatment.drugName || '') 
            ) ? true : false;


            // return (
            //     this._hasSearchKeywordInProperty(searcher, item.patient['chart_id'] || '') 
            //     || this._hasSearchKeywordInProperty(searcher, this._getRecordLatestData(item, 'symptom') || '') 
            //     || this._hasSearchKeywordInProperty(searcher, this._getRecordLatestData(item, 'diagnosis') || '') 
            //     || this._hasSearchKeywordInProperty(searcher, treatment.drugName || '') 
            // )
    }

    // _hasSearchKeywordInProperty(searcher, property_string) {
    //     return searcher.search(property_string.toLowerCase()) >= 0 ? true : false;
    // }

    _hasSearchKeywordInProperty(searcher, property_string) {
        if (typeof property_string === 'string') {
            return searcher.search(property_string.toLowerCase()) >= 0 ? true : false;
        }
        if (Array.isArray(property_string)) {
            let a = [];
            property_string.forEach((word) => {
                a.push(searcher.search(word.toLowerCase()) >= 0);
            });
            return a.find(str => str === true);
        }
    }

    _getRecordLatestData = (item, type) => {
        const latestRecordIndex = item.record.length - 1;
        const { symptom, diagnosis } = item.record[latestRecordIndex]; 
        let items = [];
        
        if (type === 'symptom') {
            symptom.map((symptom, i) => {
                return items.push(symptom.name);
            });
            return items;
        }
        if (type === 'diagnosis') {
            diagnosis.map((diagnosis, i) => {
                return items.push(diagnosis.name);
            });
            return items;
        }
    }
}
    
export default new CaseStore()