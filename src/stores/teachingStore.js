import { observable, action, computed } from 'mobx';

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

    @computed get diff() {
        return JSON.stringify(this.editableData) !== JSON.stringify(this.staticData);
    }
    
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

    @action initStaticData(teachings) {
        this.staticData = teachings;
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
                return alert('빈 내용의 지도법이 있습니다');
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