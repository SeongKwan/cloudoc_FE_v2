import { action, observable } from 'mobx';

class ModalStore {
    @observable open = false;
    @observable onLayer = false;
    @observable modalType = {
        confirm: false,
        alert: false,
        error: false,
        caseDelete: true,
        print: false,
        notification: false
    };
    
    @observable message = {
        notification: '',
        confirm: ''
    };

    @observable callBackFn = {
        confirm: null,
        cancel: null
    }

    @action showModal(type, layer = false) {
        this.clear();
        if (layer) {
            this.onLayer = true;
        }
        this.open = true;

        this.modalType[type] = true;
    }

    @action closeModal() {
        this.clear();
    }

    @action setMessage(type, message) {
        this.message[type] = message;
    }

    @action setFunction(type, callBackFn) {
        this.callBackFn[type] = callBackFn;
    }

    @action clear() {
        this.open = false;
        this.onLayer = false;
        this.clearModalType();
        this.message = {
            notification: '',
            confirm: ''
        };
    
        this.callBackFn = {
            confirm: null,
            cancel: null
        }
    }
    @action clearModalType(){
        this.modalType = {
            confirm: false,
            alert: false,
            error: false,
            caseDelete: false,
            print: false,
            notification: false
        }
    }
}

export default new ModalStore();