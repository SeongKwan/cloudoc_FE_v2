import { observable, action, computed } from 'mobx';

import modalStore from './modalStore';
import agent from '../utils/agent';
import bloodTestItems from '../constant/bloodTestItem';
import _ from 'lodash';
import basicStore from './caseEditorBasicStore';

class LabStore {
    @observable editableData = [];
    @observable staticData = [];

    @observable registry = [];

    @observable registryForExcel = [];
    @observable selectedDate = '';
    @observable selectedDateIndex = 0;
    @observable excelFile = null;

    @observable initLabs = [];
    @observable labCategories = [];
    @observable selectedLabCategory = [
        {}
    ];
    @observable readyForPaste = false;

    @observable addLab = {
        category: '간기능',
        name: '',
        value: '',
        selectLab: null
    }

    @computed get optionsCategory() {
        let categories = [];
        bloodTestItems.forEach((lab, i) => {
            return categories[i] = lab.category;
        });
        categories = _.uniqBy(categories);
        categories = _.sortBy(categories);
        return categories;
    }

    @computed get optionsName() {
        const gender = basicStore.editableData.gender === 'male' ? 'M' : 'F';
        let names = [];
        
        names = bloodTestItems.filter((lab) => {
            
            if (lab['sex'] !== null && lab['sex'] !== undefined) {
                return (lab.category === this.addLab.category) && (lab.sex === gender);
            } else {
                return lab.category === this.addLab.category;
            }
        });
        names = _.sortBy(names, 'name');
        return names;
    }

    @computed get labNames() {
        let names = [];
        bloodTestItems.forEach((lab, i) => {
            return names[i] = lab.name;
        });
        names = _.sortBy(names);
        return names;
    }
    
    @computed get lengthAlertMessage() {
        let count = 0;
        
        this.editableData.forEach((lab, i) => {
            const {
                alertMin,
                alertMax,
                state,
            } = lab;
            if ((state === '매우 낮음' && !!alertMin) || (state === '매우 높음' && !!alertMax)) {
                count++;
            }
        })
        return count;
    }

    @action toggleReadyForPaste() {
        this.readyForPaste = !this.readyForPaste;
    }


    @action selectAllLabCategory() {
        this.clearSelectedLabCategory();
        this.labCategories.forEach((item, i) => {
            return this.selectedLabCategory[i] = {
                value: item.value,
                label: item.value
            }
        });
    }


    @action changeGender() {
        const { gender } = basicStore.editableData;
        console.log('fn labstore')
    }





    @action filteredEditableData(gender = '', categoryIndex) {
        
        this.initLabs = [];
        this.initializeLabsForSelector();
        
        this.editableData = this._filter(gender, this.editableData, categoryIndex);
    };



    

    @action setLabCategories() { // 카테고리 체크박스용
        return agent.loadLabs()
        .then(action(res => {
            this.registry = res.data;
            let array;
            array = _.sortBy(res.data, 'category');
            array = _.uniqBy(array, 'category');
            array.forEach((item, i) => {
                this.labCategories[i] = {
                    label: item.category,
                    value: item.category,
                    category: item.category
                }
            });
            this.initialSelectLabCategory(array);
            return res;
        }))
        .catch(action(err => {
            throw err;
        }));
    }

    @action initialSelectLabCategory(categories) { // 카테고리 선택용
        
        categories.forEach((item, i) => {
            this.selectedLabCategory[i] = {
                label: item.category,
                value: ''
            }
        });
        
    }

    @action changeSelectedLabCategories(array) {
        array.forEach((item, i) => {
            if (!this.selectedLabCategory.includes({value: item.value})) {
                return this.selectedLabCategory[i] = {
                    value: item.value,
                    label: item.value
                }
            }
        });
    }

    @action handleSelectLabCategories(value, index) {
        // 체크해제
        if (this.selectedLabCategory.findIndex(x => x.value === value) >= 0) {
            return this.selectedLabCategory[index].value = '';
        }
        // 체크
        else {
            return this.selectedLabCategory[index].value = value;
        }
    }

    @action removeSelectedLabcategories(array) {
        let results = [];
        let total = [];
        this.clearSelectedLabCategory();
        this.selectedLabCategory = array;
        
        array.forEach(action(labCategory => {
            results = this.editableData.filter(item => {
                return item.category === labCategory.value;
            });
            total = total.concat(results);
        }));
        this.editableData = total;
    }
    

    _filter = (filterKeyword, items, categoryIndex = 'all') => {
        if (this.selectedLabCategory.length === 0 || this.selectedLabCategory === null || this.selectedLabCategory === undefined) {
            return [];
        }

        let genderedTest = [];
        let selectedCategoryTest = [];
        let totalTest = [];
        let filteredGender;

        let unisexItems = this.initLabs.filter((item) => {
            return item.sex === null;
        });

        if (filterKeyword === "male") {
            filteredGender = 'M';
        }

        if (filterKeyword === "female") {
            filteredGender = "F";
        }

        genderedTest = this.initLabs.filter(item => {
            return item.sex === filteredGender;
        });

        totalTest = genderedTest.concat(unisexItems);

        let results = this.editableData;
        let checked;
        this.selectedLabCategory.forEach((labCategory, i) => {
            if (labCategory.value === '') checked = false;
            if (labCategory.value.length > 0) checked = true;

            if (categoryIndex === i || categoryIndex === 'all') {
                if (checked) {
                    selectedCategoryTest = totalTest.filter(item => {  // 해당 혈검만 추출
                        return item.category === labCategory.value;
                    });
    
                    if (this.editableData.findIndex(x => x.category === labCategory.value) >= 0) {
                        return false;
                    } else {
                        selectedCategoryTest.forEach(item => {
                            return this.editableData.push(item);
                        })
                    }
                }
    
                if (!checked) { // 체크가 안된 카테고리 검사항목들 처리
                    let category = this.labCategories[categoryIndex].value;
                    results = this.editableData.filter(x => x.category !== category);
                    results.forEach((lab, i) => {
                        results[i] = {...lab, originalIndex: i};
                    })
                    return results;
                }
            }
        })

        results.forEach((lab, i) => {
            results[i] = {...lab, originalIndex: i};
        });
        return results;
    }



    @action setRegistry(labs) {
        this.registry = labs || [];
    }

    @action setEditableData(editableData) {
        if (this.editableData.length > 0) {
            this.editableData = [];
        }
        let results = [];

        bloodTestItems.forEach((item, i) => {
            return editableData.forEach((lab, INDEX) => {
                if (item.name === lab.name) {

                    const {
                        category,
                        name,
                        name_kor,
                        description,
                        unit,
                        refMin,
                        refMax,
                        optMin,
                        optMax,
                        sex,
                        alertMin,
                        alertMax,
                        alertMessage
                    } = item;



                    // const { 
                    //     category, 
                    //     refMin, 
                    //     refMax, optMin, optMax, alertMin, alertMax, alertMessage, reference, name_kor, description, sex} = item;

                    results[INDEX] = {
                        category,
                        name,
                        name_kor,
                        description: description || null,
                        value: lab.value,
                        unit,
                        state: '',
                        refMin,
                        refMax,
                        optMin,
                        optMax,
                        sex,
                        alertMin,
                        alertMax,
                        alertMessage,
                        originalIndex: INDEX
                    };

                    // if (sex !== null && sex !== undefined) {
                    //     results[INDEX]['sex'] = sex;
                    // }
                }
            })
        });
        
        this.editableData = results;
        this.staticData = results;

        results.forEach((editableData, i) => {
            const {
                refMin,
                refMax,
                optMin,
                optMax,
                alertMin,
                alertMax,
                value
            } = editableData;
            
            this.getState(i, refMin, refMax, optMin, optMax, alertMin, alertMax, +value);
        })


        let filteredArray = _.uniqBy(results, 'category');

        filteredArray.forEach((item, index) => {
            let selectedLabIndex = this.selectedLabCategory.findIndex(x => x.label === item.category);
            if (selectedLabIndex >= 0) {
                this.selectedLabCategory[selectedLabIndex]['value'] = item.category;
            }
        })
        
    }

    


    // @computed get testResults() {
    //     let results = [];
    //     console.log('testResults',JSON.parse(JSON.stringify(this.editableData)))
    //     // this.editableData.forEach((item, i) => { 
    //     //     results[i] = item;
    //     // });

    //     bloodTestItems.forEach((item, i) => {
    //         return this.editableData.forEach((result, INDEX) => {
    //             result.forEach((re, index) => {
    //                 if (item.name === re.name) {
    //                     const { category, refMin, refMax, optMin, optMax, alertMin, alertMax, alertMessage, reference, name_kor, description} = item;
    //                     results[INDEX][index] = {...re, category, refMin, refMax, optMin, optMax, alertMin: alertMin || null, alertMax: alertMax || null, alertMessage: alertMessage || '', reference: reference || '', name_kor, description: description || ''};
    //                 }
    //             })
    //         })
    //     });
    //     return results;
    // }



    @action handleChangeAddLab(name, value) {
        this.addLab[name] = value; 
    }

    @action setAddLab(lab) {
        this.addLab['selectLab'] = lab;
    }

    @action handleChangeLabBar(index, value) {
        // let index = this.editableData.findIndex(lab => lab._id === id);
        this.editableData[index]['value'] = value;
    }























    @action setSelectedLabCategoryForEditing(array) {
        this.selectedLabCategory = array;
    }

    @action setState(index, state) {
        this.editableData[index]['state'] = state;
    }

    @action pushEditableData(data) {
        this.editableData.push(data);
    }

    @action handleChange(index, key, value) {
        this.editableData[index][key] = value;
    }

    @action addBloodTest() {
        let index = this.editableData.length;
        if (this.editableData.filter(item => item.name === this.addLab.name).length > 0) {
            return alert('같은 혈액검사항목이 이미 존재합니다');
        } else {
            const {
                category,
                name,
                name_kor,
                description,
                unit,
                refMin,
                refMax,
                optMin,
                optMax,
                sex,
                alertMin,
                alertMax,
                alertMessage
            } = this.addLab.selectLab;
            
            this.editableData = [...this.editableData, {
                category,
                name,
                name_kor,
                description: description || null,
                value: this.addLab.value,
                unit,
                state: '',
                refMin,
                refMax,
                optMin,
                optMax,
                sex,
                alertMin,
                alertMax,
                alertMessage,
                originalIndex: index
            }];
            this.checkSelectedCategory();
            return this.getState(index, refMin, refMax, optMin, optMax, alertMin, alertMax, +this.addLab.value);
        }
    }

    

    @action getState(index, refMin, refMax, optMin, optMax, alertMin, alertMax, value) {
        if (alertMin !== null || alertMax !== null) {
            if (value === '' || value === null || value === undefined) {
                this.editableData[index]['state'] = '-';
                return '-';
            }
            if (value !== null && value !== '' && value < alertMin) {
                this.editableData[index]['state'] = '매우 낮음';
                return '매우 낮음'
            }
            if (value !== null && value !== '' && value > alertMax) {
                this.editableData[index]['state'] = '매우 높음';
                return '매우 높음'
            }
        }

        if (value === '' || value === 0 || value === null) {
            this.editableData[index]['state'] = '-';
            
            return '-';
        }
        else if (value === refMin && value === optMin) {
            
            this.editableData[index]['state'] = '최적';
            return '최적'
        }
        else if (value === refMax && value === optMax) {
            
            this.editableData[index]['state'] = '최적';
            return '최적'
        }
        else if (refMin <= value && value < optMin) {
            
            this.editableData[index]['state'] = '낮음';
            return '낮음';
        }
        else if (optMin <= value && value <= optMax) {
            
            this.editableData[index]['state'] = '최적';
            return '최적';
        }
        else if (optMax <= value && value <= refMax) {
            
            this.editableData[index]['state'] = '높음';
            return '높음';
        }
        else if (value < refMin) {
            this.editableData[index]['state'] = '매우 낮음';
            return '매우 낮음';
        }
        else if (refMax < value) {
            
            this.editableData[index]['state'] = '매우 높음';
            return '매우 높음';
        }
    }


    @action initCaseDetailData(labs) {
        this.staticData = labs;
        this.editableData = labs;

        let filteredArray = _.uniqBy(labs, 'category');

        filteredArray.forEach((item, index) => {
            let selectedLabIndex = this.selectedLabCategory.findIndex(x => x.label === item.category);
            if (selectedLabIndex >= 0) {
                this.selectedLabCategory[selectedLabIndex]['value'] = item.category;
            }
        })

        setTimeout(() => {this.resetOriginalIndex();}, 100);
    }

    @action initialize() {
            return this.registry.forEach((lab) => {
                this.pushEditableData(
                    {
                        category: lab.category,
                        name: lab.name,
                        name_kor: lab.name_kor,
                        description: lab.description,
                        value: '',
                        unit: lab.unit,
                        state: '-',
                        refMin: lab.refMin,
                        optMin: lab.optMin,
                        optMax: lab.optMax,
                        refMax: lab.refMax,
                        sex: lab.sex,
                        alertMin: lab.alertMin,
                        alertMax: lab.alertMax,
                        alertMessage: lab.alertMessage
                    }
                )
                
            })
    }

    @action initializeLabsForSelector() {
        return this.registry.forEach((lab, i) => {
            this.initLabs.push(
                {
                    category: lab.category,
                    name: lab.name,
                    name_kor: lab.name_kor,
                    description: lab.description,
                    value: '',
                    unit: lab.unit,
                    state: '-',
                    refMin: lab.refMin,
                    optMin: lab.optMin,
                    optMax: lab.optMax,
                    refMax: lab.refMax,
                    sex: lab.sex,
                    alertMin: lab.alertMin,
                    alertMax: lab.alertMax,
                    alertMessage: lab.alertMessage
                }
            )
            
        })
}

    @action loadLabs() {
        return agent.loadLabs()
            .then(action((response) => {
                this.registry = response.data || [];
                return response.data;
            }))
            .catch(action((error) => {
                console.log(error);
                throw error;
            }));
    }

    
    @action clearExcel() {
        this.excelFile = null;
    }

    @action deleteBloodTest(selectedIndex) {
        this.editableData.splice(selectedIndex, 1);
        this.checkSelectedCategory();
        this.resetOriginalIndex();
    }

    @action resetOriginalIndex() {
        this.editableData.forEach((lab, i) => {
            return this.editableData[i] = {
                ...lab,
                originalIndex: i
            }
        });
    }

    @action checkSelectedCategory() {
        this.selectedLabCategory.forEach((item , i) => {
            console.log(this.editableData.findIndex(x => x.category === item.value));
            if (item.value === '') {
                if (this.editableData.findIndex(x => x.category === item.label) >= 0) {
                    return this.selectedLabCategory[i] = {
                        label: item.label,
                        value: item.label
                    }
                }
            } else {
                if (this.editableData.findIndex(x => x.category === item.value) < 0) {
                    return this.selectedLabCategory[i] = {
                        label: item.label,
                        value: ''
                    }
                }
            }
        })
    }

    @action deleteAllInputValue() {
        this.editableData.forEach((item, i) => {
            item['value'] = '';
            item['state'] = '-';
        });
    }














    // Sorting

    @observable labsForReadOnly = [];

    @observable sortingType = {
        category: 'up',
        testName: '',
        state: ''
    };

    @computed get sortedLab() {
        let items = [];
        items = this.labsForReadOnly
        return items;
    }

    @action _sorting(type = 'editable') {
        const { category, testName, state } = this.sortingType;
        let items = [];

        if (type === 'editable') {
            this.editableData.forEach((item) => { items.push(item); });
    
            if (category === 'up') {
                items.sort(function (a, b) { 
                    return a.category < b.category ? -1 : a.category > b.category ? 1 : 0;  
                });
            }
            else if (category === 'down') {
                items.sort(function (a, b) { 
                    return a.category > b.category ? -1 : a.category < b.category ? 1 : 0;  
                });
            }
    
            else if (testName === 'up') {
                items.sort(function (a, b) { 
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;  
                });
            }
            else if (testName === 'down') {
                items.sort(function (a, b) { 
                    return a.name > b.name ? -1 : a.name < b.name ? 1 : 0;  
                });
            }

            else if (state === 'up') {
                items.sort(function (a, b) { 
                    return a.state < b.state ? -1 : a.state > b.state ? 1 : 0;  
                });
            }
            else if (state === 'down') {
                items.sort(function (a, b) { 
                    return a.state > b.state ? -1 : a.state < b.state ? 1 : 0;  
                });
            }
    
            return this.editableData = items;
        }

        if (type === 'readOnly') {
            this.labsForReadOnly.forEach((item) => { items.push(item); });
    
            if (category === 'up') {
                items.sort(function (a, b) { 
                    return a.category < b.category ? -1 : a.category > b.category ? 1 : 0;  
                });
            }
            else if (category === 'down') {
                items.sort(function (a, b) { 
                    return a.category > b.category ? -1 : a.category < b.category ? 1 : 0;  
                });
            }
    
            else if (testName === 'up') {
                items.sort(function (a, b) { 
                    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;  
                });
            }
            else if (testName === 'down') {
                items.sort(function (a, b) { 
                    return a.name > b.name ? -1 : a.name < b.name ? 1 : 0;  
                });
            }
            else if (state === 'up') {
                items.sort(function (a, b) { 
                    return a.state < b.state ? -1 : a.state > b.state ? 1 : 0;  
                });
            }
            else if (state === 'down') {
                items.sort(function (a, b) { 
                    return a.state > b.state ? -1 : a.state < b.state ? 1 : 0;  
                });
            }
    
            return this.labsForReadOnly = items;
        }
    }

    @action initializeLabsForReadOnly(labs) {
        this.labsForReadOnly = labs;
    }
    

    @action setClassNameToTh(type) {
        if (type === 'category') {
            if ( this.sortingType.category === 'up') {
                return this.changeSortingType(type, 'down');
            } else if (this.sortingType.category === 'down' || this.sortingType.category === '') {
                return this.changeSortingType(type, 'up');
            }
        } else if (type === 'name') {
            if (this.sortingType.testName === 'up') {
                return this.changeSortingType(type, 'down');
            } 
            if (this.sortingType.testName === 'down' || this.sortingType.testName === '') {
                return this.changeSortingType(type, 'up');
            }
        } else if (type === 'state') {
            if (this.sortingType.state === 'up') {
                return this.changeSortingType(type, 'down');
            } 
            if (this.sortingType.state === 'down' || this.sortingType.state === '') {
                return this.changeSortingType(type, 'up');
            }
        }
    }

    @action changeSortingType(type, direction) {
        this.sortingType = {
            category: '',
            testName: '',
            state: ''
        };
        if (type === 'name') {
            return this.sortingType['testName'] = direction;
        }
        return this.sortingType[type] = direction;
    }

    @action clearSortingType() {
        this.sortingType = {
            category: 'up',
            name: '',
            state: ''
        };
    }

    @action clear() {
        this.editableData = [];
        this.excelFile = null;
        this.selectedDate = '';
        this.selectedDateIndex = 0;
        this.excelFile = null;
        this.labsForReadOnly = [];
        this.addLab = {
            category: '간기능',
            name: '',
            value: '',
            selectLab: null
        }
    }
    @action clearAddLab() {
        this.addLab = {
            category: '간기능',
            name: '',
            value: '',
            selectLab: null
        }
    }
    @action clearAddLabSelectLab() {
        this.addLab['selectLab'] = null;
    }
    @action clearForSelector() {
        this.initialSelectLabCategory(this.labCategories);
        this.editableData = [];
    }
    @action clearSelectedLabCategory() {
        this.selectedLabCategory.forEach((category, i) => {
            this.selectedLabCategory[i]['value'] = '';
        })
    }

}

export default new LabStore()