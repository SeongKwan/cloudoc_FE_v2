import { observable, action } from 'mobx';

class SymptomListForInputStore {
    @observable position = {
        top: 0,
        left: -99999,
        inputHeight: 0,
        index: null,
        opacity: 0
    };
    @observable currentIndex = null;
    @observable currentSection = '';
    @observable status = 'invisible';
    @observable selectedListItem = '';
    @observable selectedIndex = -1;
    @observable maxIndex = null;
    
    @observable items = [];

    @action setPosition({top, left, height}) {
        this.position = {
            top: top,
            left: left,
            inputHeight: height,
            opacity: 1
        };
        this.status = 'visible';
    };

    @action setCurrentSection(section) {
        this.currentSection = section;
    }

    @action setCurrentIndex(index) {
        this.currentIndex = index;
    }

    @action setSelectedListItem(value) {
        this.selectedListItem = value;
    }

    @action setSelectedIndex(i) {
        this.selectedIndex = i;
    }

    @action setMaxIndex(i) {
        console.log('maxIndex setting')
        console.log('maxIndex', i)
        this.maxIndex = i;
    }

    @action clear() {
        this.position = {
            top: 0,
            left: -99999,
            inputHeight: 0,
            opacity: 0
        };
        this.selectedIndex = -1;
        this.status = 'invisible';
        this.selectedListItem = '';
        this.currentIndex = null;
        this.currentSection = '';
        this.items = [];
    };
    @action clearForList() {
        this.position = {
            top: 0,
            left: -99999,
            inputHeight: 0,
            opacity: 0
        };
        this.status = 'invisible';
        this.selectedListItem = '';
        this.currentIndex = null;
        this.currentSection = '';
        this.items = [];
    };
}

export default new SymptomListForInputStore()
