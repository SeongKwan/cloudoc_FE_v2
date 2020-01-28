import { observable, action } from 'mobx';

class CollapsibleStore {
    @observable open = {
        basic: false,
        sidebar: {
            symptom: false,
            lab: false,
            caution: false
        }
    };

    @action toggleSwitch(type, detail) {
        if (type === 'basic') {
            return this.open[type] = !this.open[type];
        }
        this.open[type][detail] = !this.open[type][detail];
    }
    
    @action initOpen(type, detail) {
        if (type === 'basic') {
            return this.open[type] = true;
        }
        this.open[type][detail] = true;
    }

    @action clear() {
        this.open = {
            basic: false,
            sidebar: {
                symptom: false,
                lab: false,
                caution: false
            }
        }
    }
}

export default new CollapsibleStore();