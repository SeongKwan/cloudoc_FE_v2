import { observable, action, computed } from 'mobx';
import symptomListItemStore from './symptomListItemStore';
import symptomListForInputStore from './symptomListForInputStore';

class SymptomStore {
    @observable staticData = [
        {
            rank: 1,
            category: '',
            name: '',
            onset: '',
            value: '',
            unit: 'NRS',
            min: 0,
            max: 10,
            description: ''
        }
    ];
    
    @observable editableData = [
        {
            rank: 1,
            category: '',
            name: '',
            onset: '',
            value: '',
            unit: 'NRS',
            min: 0,
            max: 10,
            description: ''
        }
    ];
    
    @computed get sortedEditableData() {
        let sortedItems;
        sortedItems = this.editableData.slice().sort(function(a, b) {
            return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;
        });
        return sortedItems;
    }
    @computed get symptomsLength() {
        let length;
        length = this.editableData.length;
        return length;
    }

    @computed get diff() {
        console.log(JSON.stringify(this.editableData) !== JSON.stringify(this.staticData))
        return JSON.stringify(this.editableData) !== JSON.stringify(this.staticData);
    }

    // @action initEditableData() {
    //     this.editableData = [];
    // }

    @action initStaticData(symptoms) {
        this.staticData = symptoms;
    }

    @action compareData() {
        return JSON.stringify(this.editableData) === JSON.stringify(this.staticData);
    }

    @action sortEditableData() {
        this.editableData.slice().sort(function(a, b) {
            return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;
        });
    }

    @action setEditableData(editableData) {
        if (this.editableData.length > 0) {
            this.editableData = [];
        }
        JSON.parse(JSON.stringify(editableData)).forEach((editableData) => { 
            
            // if (editableData.degree === null || editableData.degree === undefined) {
            //     // editableData.degree = '';
            // }
            if (editableData.unit === null || editableData.unit === undefined) {
                editableData.unit = '';
            }
            // editableData.isPopoverOpen = false;
            this.editableData.push(editableData);
            
        });

    }

    @action handleChange(index, key, value) {
        this.editableData[index][key] = value;

        let indexOfList;
        symptomListItemStore.symptoms.forEach((item, i) => {
            if (item.name === value) {
                return indexOfList = i;
            } else return false;
        })

        if (indexOfList > -2) {
            symptomListForInputStore.setSelectedIndex(indexOfList);
        } else symptomListForInputStore.setSelectedIndex(-1);
        
        if (key === 'rank') {
            let items = [];
            this.editableData.forEach((item) => { items.push(item); });
            items.sort(function (a, b) { 
                return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;  
            });
            return this.editableData = items;
        }
    }
    @action handleChangeForStatic(index, key, value) {
        this.staticData[index][key] = value;
        
        if (key === 'rank') {
            let items = [];
            this.staticData.forEach((item) => { items.push(item); });
            items.sort(function (a, b) { 
                return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;  
            });
            return this.staticData = items;
        }
    }
    

    @action pressESC(index) {
        this.editableData[index]['name'] = '';
        this.editableData[index]['category'] = '';
    }

    @action setCategoryByAutoList(category, index) {
        this.editableData[index]['category'] = category;
    }

    @action addSymptom(type = null, data = null, name) {
        if (!data) {
            if (type === 'detail') {
                
                this.staticData = [...this.staticData, {
                    rank: this.staticData.length + 1,
                    category: '',
                    name: '',
                    onset: '',
                    
                    value: '',
                    unit: 'NRS',
                    min: 0,
                    max: 10,
                    description: ''
                }];
            }
            if (this.editableData.filter(item => item.name === name).length > 0) {
                symptomListItemStore.clearSearchKeyword();
                return alert('같은 증상이 이미 존재합니다');
            }

            return this.editableData = [...this.editableData, {
                rank: this.editableData.length + 1,
                category: '',
                name: name,
                onset: '',
                
                value: '',
                unit: 'NRS',
                min: 0,
                max: 10,
                description: ''
            }];
        }




        if (data) {
            if (type === 'detail' && this.staticData.filter(item => item.name === data.name).length > 0) {
                return alert('같은 증상이 이미 존재합니다');
            }
            if (type === 'detail') {
                symptomListItemStore.addCategory(data.category);
                symptomListItemStore.addSearchKeyword(data.name);
                this.staticData = [...this.staticData, {
                    rank: this.staticData.length + 1,
                    category: data.category,
                    name: data.name,
                    onset: '',
                    
                    value: '',
                    unit: 'NRS',
                    min: 0,
                    max: 10,
                    description: ''
                }];
            }

            if (this.editableData[0] === undefined || this.editableData[0] === null || this.editableData[0].name === '') {
                symptomListItemStore.category[0] = data.category;
                symptomListItemStore.searchKeyword[0] = data.name;
                this.editableData[0] = {
                    rank: 1,
                    category: data.category,
                    name: data.name,
                    onset: '',
                    
                    value: '',
                    unit: 'NRS',
                    min: 0,
                    max: 10,
                    description: ''
                }
            } else {
                if (this.editableData.filter(item => item.name === data.name).length > 0) {
                    return alert('같은 증상이 이미 존재합니다');
                }
                symptomListItemStore.addCategory(data.category);
                symptomListItemStore.addSearchKeyword(data.name);
                return this.editableData = [...this.editableData, {
                    rank: this.editableData.length + 1,
                    category: data.category,
                    name: data.name,
                    onset: '',
                    
                    value: '',
                    unit: 'NRS',
                    min: 0,
                    max: 10,
                    description: ''
                }];
            }

        }
    }

    @action deleteSymptom(selectedIndex) {
        this.editableData.splice(selectedIndex, 1);
        this.editableData.forEach((item, index) => {
            if (index < Number(selectedIndex)) {
                return false;
            }
            if (index + 1 > Number(selectedIndex)) {
                if (item.rank - 1 === 0) {
                    return item.rank = 1;
                }
                if (item.rank - 1 > 0) {
                    return item.rank = item.rank - 1;
                }
            }
        })
        // symptomListItemStore.deleteCategory(selectedIndex);
        // symptomListItemStore.deleteSearchKeyword(selectedIndex);

    }
    @action deleteSymptomForStatic(selectedIndex) {
        this.staticData.splice(selectedIndex, 1);
        this.staticData.forEach((item, index) => {
            if (index < Number(selectedIndex)) {
                return false;
            }
            if (index + 1 > Number(selectedIndex)) {
                if (item.rank - 1 === 0) {
                    return item.rank = 1;
                }
                if (item.rank - 1 > 0) {
                    return item.rank = item.rank - 1;
                }
            }
        })

    }


    // Sorting
    @observable symptomsForReadOnly = [];
    @observable sortingType = {
        rank: 'up',
        category: '',
        testName: '',
        onset: '',
        degree: '',
        unit: ''
    };


    @action _sorting(type = 'editable') {
        const { 
            rank,
            category, 
            testName,
            onset,
            degree,
            unit
        } = this.sortingType;
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

            else if (rank === 'up') {
                items.sort(function (a, b) { 
                    return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;  
                });
            }
            else if (rank === 'down') {
                items.sort(function (a, b) { 
                    return a.rank > b.rank ? -1 : a.rank < b.rank ? 1 : 0;  
                });
            }

            else if (onset === 'up') {
                items.sort(function (a, b) { 
                    return a.onset < b.onset ? -1 : a.onset > b.onset ? 1 : 0;  
                });
            }
            else if (onset === 'down') {
                items.sort(function (a, b) { 
                    return a.onset > b.onset ? -1 : a.onset < b.onset ? 1 : 0;  
                });
            }

            else if (degree === 'up') {
                items.sort(function (a, b) { 
                    if ( ! isNaN( a.degree ) &&  ! isNaN( b.degree )  ) {
                        return a.degree - b.degree;
                    }
                    let c,d;
                    c = a.degree.toString(); 
                    d = b.degree.toString(); 
                    return ( c < d ) ? -1 : ( c === d ) ? 0 : 1;
                });
            }
            else if (degree === 'down') {
                items.sort(function (a, b) { 
                    if ( ! isNaN( a.degree ) &&  ! isNaN( b.degree )  ) {
                        return b.degree - a.degree;
                    }
                    let c,d;
                    c = a.degree.toString(); 
                    d = b.degree.toString(); 
                    return ( d < c ) ? -1 : ( d === c ) ? 0 : 1;
                });
            }

            else if (unit === 'up') {
                items.sort(function (a, b) { 
                    return a.unit < b.unit ? -1 : a.unit > b.unit ? 1 : 0;  
                });
            }
            else if (unit === 'down') {
                items.sort(function (a, b) { 
                    return a.unit > b.unit ? -1 : a.unit < b.unit ? 1 : 0;  
                });
            }

    
            symptomListItemStore.reorder(items);
            return this.editableData = items;
        }

        if (type === 'readOnly') {
            this.symptomsForReadOnly.forEach((item) => { items.push(item); });
    
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

            else if (rank === 'up') {
                items.sort(function (a, b) { 
                    return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;  
                });
            }
            else if (rank === 'down') {
                items.sort(function (a, b) { 
                    return a.rank > b.rank ? -1 : a.rank < b.rank ? 1 : 0;  
                });
            }

            else if (onset === 'up') {
                items.sort(function (a, b) { 
                    return a.onset < b.onset ? -1 : a.onset > b.onset ? 1 : 0;  
                });
            }
            else if (onset === 'down') {
                items.sort(function (a, b) { 
                    return a.onset > b.onset ? -1 : a.onset < b.onset ? 1 : 0;  
                });
            }

            else if (degree === 'up') {
                items.sort(function (a, b) { 
                    if ( ! isNaN( a.degree ) &&  ! isNaN( b.degree )  ) {
                        return a.degree - b.degree;
                    }
                    let c,d;
                    c = a.degree.toString(); 
                    d = b.degree.toString(); 
                    return ( c < d ) ? -1 : ( c === d ) ? 0 : 1;
                });
            }
            else if (degree === 'down') {
                items.sort(function (a, b) { 
                    if ( ! isNaN( a.degree ) &&  ! isNaN( b.degree )  ) {
                        return b.degree - a.degree;
                    }
                    let c,d;
                    c = a.degree.toString(); 
                    d = b.degree.toString(); 
                    return ( d < c ) ? -1 : ( d === c ) ? 0 : 1;
                });
            }

            else if (unit === 'up') {
                items.sort(function (a, b) { 
                    return a.unit < b.unit ? -1 : a.unit > b.unit ? 1 : 0;  
                });
            }
            else if (unit === 'down') {
                items.sort(function (a, b) { 
                    return a.unit > b.unit ? -1 : a.unit < b.unit ? 1 : 0;  
                });
            }

    
            symptomListItemStore.reorder(items);
            return this.symptomsForReadOnly = items;
        }
    }

    @action initializeSymptomsForReadOnly(symptoms) {
        this.symptomsForReadOnly = symptoms;
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
        } else if (type === 'rank') {
            if (this.sortingType.rank === 'up') {
                return this.changeSortingType(type, 'down');
            } 
            if (this.sortingType.rank === 'down' || this.sortingType.rank === '') {
                return this.changeSortingType(type, 'up');
            }
        } else if (type === 'onset') {
            if (this.sortingType.onset === 'up') {
                return this.changeSortingType(type, 'down');
            } 
            if (this.sortingType.onset === 'down' || this.sortingType.onset === '') {
                return this.changeSortingType(type, 'up');
            }
        } else if (type === 'degree') {
            if (this.sortingType.degree === 'up') {
                return this.changeSortingType(type, 'down');
            } 
            if (this.sortingType.degree === 'down' || this.sortingType.degree === '') {
                return this.changeSortingType(type, 'up');
            }
        } else if (type === 'unit') {
            if (this.sortingType.unit === 'up') {
                return this.changeSortingType(type, 'down');
            } 
            if (this.sortingType.unit === 'down' || this.sortingType.unit === '') {
                return this.changeSortingType(type, 'up');
            }
        }
    }

    @action changeSortingType(type, direction) {
        this.sortingType = {
            rank: '',
            category: '',
            testName: '',
            onset: '',
            degree: '',
            unit: ''
        };
        if (type === 'name') {
            return this.sortingType['testName'] = direction;
        }
        return this.sortingType[type] = direction;
    }

    @action clearSortingType() {
        this.sortingType = {
            rank: 'up',
            category: '',
            testName: '',
            onset: '',
            degree: '',
            unit: ''
        };
    }

    @action clear() {
        this.staticData = [
            
        ];
        this.editableData = [
            
        ];

        this.symptomsForReadOnly = [];
    }

    @action deleteAllInputValue() {
        this.editableData = [
            {
                rank: 1,
                category: '',
                name: '',
                onset: '',
                
                value: '',
                unit: 'NRS',
                min: 0,
                max: 10,
                description: ''
            }
        ];
    }
}

export default new SymptomStore()