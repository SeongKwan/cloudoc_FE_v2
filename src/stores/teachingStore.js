import { observable, action, computed } from 'mobx';
import symptomListItemStore from './symptomListItemStore';
import symptomListForInputStore from './symptomListForInputStore';

class TeachingStore {
    @observable staticData = [
        {
            description: '',
            ref_id: ''
        }
    ];
    
    @observable editableData = [
        {
            description: '',
            ref_id: ''
        }
    ];
    
    @computed get sortedEditableData() {
        let sortedItems;
        sortedItems = this.editableData.slice().sort(function(a, b) {
            return a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0;
        });
        return sortedItems;
    }
    @computed get teachingsLength() {
        let length;
        length = this.editableData.length;
        return length;
    }

    @action initEditableData() {
        this.editableData = [];
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
            
            this.editableData.push(editableData);
            
        });

    }

    @action handleChange(index, key, value) {
        this.editableData[index][key] = value;
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
    

    @action setCategoryByAutoList(category, index) {
        this.editableData[index]['category'] = category;
    }

    @action addTeaching(type = null, data = null, name) {
        if (!data) {
            if (type === 'detail') {
                
                this.staticData = [...this.staticData, {
                    description: '',
                    ref_id: ''
                }];
            }
            if (this.editableData.filter(item => item.description === name).length > 0) {
                // symptomListItemStore.clearSearchKeyword();
                return alert('같은 지도법이 이미 존재합니다');
            }

            return this.editableData = [...this.editableData, {
                description: '',
                ref_id: ''
            }];
        }




        if (data) {
            if (type === 'all') {
                
                return data.forEach((teach, i) => {
                    if (this.editableData.filter(item => item.description === teach.description).length > 0) {
                        return alert('같은 지도법이 이미 존재합니다');
                    }
                    this.editableData = [...this.editableData, {
                        description: teach.description,
                        ref_id: teach.reference_id
                    }];
                })
            }
            if (type === 'detail' && this.staticData.filter(item => item.description === data.description).length > 0) {
                return alert('같은 지도법이 이미 존재합니다');
            }
            if (type === 'detail') {
                this.staticData = [...this.staticData, {
                    description: data.description,
                    ref_id: data.reference_id
                }];
            }

            if (this.editableData[0] === undefined || this.editableData[0] === null) {
                this.editableData[0] = {
                    description: data.description,
                    ref_id: data.reference_id
                }
            } else {
                if (this.editableData.filter(item => item.description === data.description).length > 0) {
                    return alert('같은 지도법이 이미 존재합니다');
                }
                return this.editableData = [...this.editableData, {
                    description: data.description,
                    ref_id: data.reference_id
                }];
            }

        }
    }

    @action deleteTeaching(selectedIndex) {
        this.editableData.splice(selectedIndex, 1);
        // this.editableData.forEach((item, index) => {
        //     if (index < Number(selectedIndex)) {
        //         return false;
        //     }
        //     if (index + 1 > Number(selectedIndex)) {
        //         if (item.rank - 1 === 0) {
        //             return item.rank = 1;
        //         }
        //         if (item.rank - 1 > 0) {
        //             return item.rank = item.rank - 1;
        //         }
        //     }
        // })
        // symptomListItemStore.deleteCategory(selectedIndex);
        // symptomListItemStore.deleteSearchKeyword(selectedIndex);

    }
    @action deleteSymptomForStatic(selectedIndex) {
        this.staticData.splice(selectedIndex, 1);
        // this.staticData.forEach((item, index) => {
        //     if (index < Number(selectedIndex)) {
        //         return false;
        //     }
        //     if (index + 1 > Number(selectedIndex)) {
        //         if (item.rank - 1 === 0) {
        //             return item.rank = 1;
        //         }
        //         if (item.rank - 1 > 0) {
        //             return item.rank = item.rank - 1;
        //         }
        //     }
        // })

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

    @action initializeSymptomsForReadOnly(teachings) {
        this.teachingsForReadOnly = teachings;
    }

    // @action setClassNameToTh(type) {
    //     if (type === 'category') {
    //         if ( this.sortingType.category === 'up') {
    //             return this.changeSortingType(type, 'down');
    //         } else if (this.sortingType.category === 'down' || this.sortingType.category === '') {
    //             return this.changeSortingType(type, 'up');
    //         }
    //     } else if (type === 'name') {
    //         if (this.sortingType.testName === 'up') {
    //             return this.changeSortingType(type, 'down');
    //         } 
    //         if (this.sortingType.testName === 'down' || this.sortingType.testName === '') {
    //             return this.changeSortingType(type, 'up');
    //         }
    //     } else if (type === 'rank') {
    //         if (this.sortingType.rank === 'up') {
    //             return this.changeSortingType(type, 'down');
    //         } 
    //         if (this.sortingType.rank === 'down' || this.sortingType.rank === '') {
    //             return this.changeSortingType(type, 'up');
    //         }
    //     } else if (type === 'onset') {
    //         if (this.sortingType.onset === 'up') {
    //             return this.changeSortingType(type, 'down');
    //         } 
    //         if (this.sortingType.onset === 'down' || this.sortingType.onset === '') {
    //             return this.changeSortingType(type, 'up');
    //         }
    //     } else if (type === 'degree') {
    //         if (this.sortingType.degree === 'up') {
    //             return this.changeSortingType(type, 'down');
    //         } 
    //         if (this.sortingType.degree === 'down' || this.sortingType.degree === '') {
    //             return this.changeSortingType(type, 'up');
    //         }
    //     } else if (type === 'unit') {
    //         if (this.sortingType.unit === 'up') {
    //             return this.changeSortingType(type, 'down');
    //         } 
    //         if (this.sortingType.unit === 'down' || this.sortingType.unit === '') {
    //             return this.changeSortingType(type, 'up');
    //         }
    //     }
    // }

    // @action changeSortingType(type, direction) {
    //     this.sortingType = {
    //         rank: '',
    //         category: '',
    //         testName: '',
    //         onset: '',
    //         degree: '',
    //         unit: ''
    //     };
    //     if (type === 'name') {
    //         return this.sortingType['testName'] = direction;
    //     }
    //     return this.sortingType[type] = direction;
    // }

    // @action clearSortingType() {
    //     this.sortingType = {
    //         rank: 'up',
    //         category: '',
    //         testName: '',
    //         onset: '',
    //         degree: '',
    //         unit: ''
    //     };
    // }

    @action clear() {
        this.staticData = [
            {
                description: '',
                ref_id: ''
            }
        ];
        this.editableData = [
            {
                description: '',
                ref_id: ''
            }
        ];

        this.symptomsForReadOnly = [];
    }

    @action deleteAllInputValue() {
        this.editableData = [
            {
                description: '',
                ref_id: ''
            }
        ];
    }
}

export default new TeachingStore()