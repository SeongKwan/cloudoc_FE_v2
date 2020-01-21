import { action, observable } from 'mobx';

class ModalStore {
    @observable show = false;

    @action showModal() {
        this.show = true;
    }

    @action closeModal() {
        this.show = false;
    }

    @action clear() {
        this.show = false;
    }
}

export default new ModalStore();