import { action, observable } from 'mobx';

class ModalStore {
    @observable open = false;
    @observable modalType = {
        confirm: false,
        alert: false,
        error: false,
        print: false
    }

    @action showModal(type) {
        this.clear();
        this.open = true;
        this.modalType[type] = true;
    }

    @action closeModal(type) {
        this.open = false;
        this.modalType[type] = false;
    }

    @action clear() {
        this.open = false;
        this.modalType = {
            confirm: false,
            alert: false,
            error: false,
            print: false
        }
    }
}

export default new ModalStore();