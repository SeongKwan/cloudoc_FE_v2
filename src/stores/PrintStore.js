import { action, observable } from 'mobx';

class PrintStore {
    @observable content = {
        basic: true,
        optionalBasic: true,
        symptom: true,
        lab: true,
        diagnosis: true,
        drug: true,
        fomula: true,
        teaching: true,
    };

    @action switchContent(type, status) {
        if (type === 'drug') {
            if (this.content['fomula'] === true) {
                this.content['fomula'] = false;
            }
        }
        this.content[type] = status;
    };

    @action clear() {
        this.content = {
            basic: true,
            optionalBasic: true,
            symptom: true,
            lab: true,
            diagnosis: true,
            drug: true,
            fomula: true,
            teaching: true,
        };
    }
    
}

export default new PrintStore();