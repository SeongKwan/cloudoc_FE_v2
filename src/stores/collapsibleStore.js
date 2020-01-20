import { observable, action } from 'mobx';

class CollapsibleStore {
    @observable open = false;

    @action toggleSwitch() {
        this.open = !this.open;
    }
    
    @action initOpen() {
        this.open = true;
    }

    @action clear() {
        this.open = false;
    }
}

export default new CollapsibleStore();