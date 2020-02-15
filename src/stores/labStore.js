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
        selectLab: {}
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

    @action filteredEditableData(gender = '', categoryIndex) {
        
        this.initLabs = [];
        this.initializeLabsForSelector();
        
        this.editableData = this._filter(gender, this.editableData, categoryIndex);
    };

    @action selectAllLabCategory() {
        this.clearSelectedLabCategory();
        this.labCategories.forEach((item, i) => {
            return this.selectedLabCategory[i] = {
                value: item.value,
                label: item.value
            }
        });

        
    }

    @action setSelectedLabCategoryFromExcel(array) {
        
        let originalArray = [];
        let filteredArray = [];
        let results = [];

        this.selectedLabCategory.forEach(() => {
            return results.push({label: '', value: ''});
        })

        
        array.forEach(action((item, i) => {
            
            return originalArray[i] = {
                value: item.category,
                label: item.category
            }
        }));

        filteredArray = _.uniqBy(originalArray, 'label');
        

        filteredArray.forEach((item, i) => {
            this.selectedLabCategory.forEach((category, i) => {
                
                if (category.label === item.label) {
                    
                    results[i] = {
                        label: item.label,
                        value: item.label
                    }
                } else return false;
            })
        })

        return this.selectedLabCategory = results;
    }

    @action setLabCategories() { // 카테고리 체크박스용
        return agent.loadLabs()
        .then(action(res => {
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

        if (filterKeyword === "남자") {
            filteredGender = 'M';
        }

        if (filterKeyword === "여자") {
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
                    return results = this.editableData = this.editableData.filter(x => x.category !== category);
                }
            }
        })

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
                    const { category, refMin, refMax, optMin, optMax, alertMin, alertMax, alertMessage, reference, name_kor, description} = item;
                    results[INDEX] = {...lab, originalIndex: INDEX, category, refMin, refMax, optMin, optMax, alertMin: alertMin || null, alertMax: alertMax || null, alertMessage: alertMessage || '', reference: reference || '', name_kor, description: description || ''};
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

        // editableData.forEach((editableData) => { 
        //     this.editableData.push(editableData) 
        // });
        
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
            return this.editableData = [...this.editableData, {
                ...this.addLab.selectLab,
                value: this.addLab.value,
                originalIndex: index
            }];
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


    

    @action changeExcelFile(file) {
        this.excelFile = file;
    }

    @action postExcel() {
        const formData = new FormData();
        formData.append('xlsxFile', this.excelFile);

        return agent.postExcel(formData)
            .then(action((res) => {
                this.registryForExcel = res.data || [];
                
                modalStore.showModal();
            }))
            .catch(action((err) => {
                alert('엑셀내용이 검사결과가 아닌 다른 파일입니다. 잘못된 파일 또는 엑셀의 양식이 올바른지 확인이 필요합니다')
                throw err;
            }))
    }

    @action changeCheckbox(date, i) {
        this.selectedDate = date;
        this.selectedDateIndex = i;
    }

    @computed get labDates() {
        let dates = [];
        this.registryForExcel.forEach((item) => { dates.push(item.date); });
        return dates;
    }

    

    @action initCaseDetailData(labs) {
        this.staticData = labs;
        this.editableData = labs;
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
        return this.registry.forEach((lab) => {
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
            if (item.value === '') return false;
            if (this.editableData.findIndex(x => x.category === item.value) < 0) {
                return this.selectedLabCategory[i] = {
                    value: '',
                    label: ''
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
            selectLab: {}
        }
    }
    @action clearAddLab() {
        this.addLab = {
            category: '간기능',
            name: '',
            value: '',
            selectLab: {}
        }
    }
    @action clearForSelector() {
        this.initialSelectLabCategory(this.labCategories);
        this.editableData = [];
        this.excelFile = null;
        this.selectedDate = '';
        this.selectedDateIndex = 0;
        this.excelFile = null;
    }
    @action clearSelectedLabCategory() {
        this.selectedLabCategory = [{}];
    }

}

export default new LabStore()