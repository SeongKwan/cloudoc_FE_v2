import { action, observable } from 'mobx';

class ModalStore {
    @observable open = false;
    @observable onLayer = false;
    @observable modalType = {
        confirm: false,
        alert: false,
        error: false,
        caseDelete: true,
        print: false
    }

    @action showModal(type, layer = false) {
        this.clear();
        if (layer) {
            this.onLayer = true;
        }
        this.open = true;
        // let checkOpenStatus = Object.values(this.modalType);
        // if (checkOpenStatus.findIndex(v => v === false) > -1) {
        //     this.clearModalType();
        // };

        this.modalType[type] = true;
    }

    @action closeModal(type) {
        this.clear();
    }

    @action clear() {
        this.open = false;
        this.onLayer = false;
        this.clearModalType();
    }
    @action clearModalType(){
        this.modalType = {
            confirm: false,
            alert: false,
            error: false,
            caseDelete: false,
            print: false
        }
    }
}

export default new ModalStore();