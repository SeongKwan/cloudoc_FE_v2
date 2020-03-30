import { observable, action } from 'mobx';
// import analyzeSymptomStore from './analyzeSymptomStore';
// import analyzeBloodTestStore from './analyzeBloodTestStore';
// import analyzeRecommendationTreatmentStore from './analyzeRecommendationTreatmentStore';
import agent from '../utils/agent';
// import momentHelper from '../utils/momentHelper';
// import Hangul from 'hangul-js';

class CaseCreateStore {
    @observable pageType = '';
    @observable currentReference = {};
    @observable isLoading = false;

    @action setPageType(type) {
        this.pageType = type;
    }

    @action loadReferenceByLink(referenceId) {
        this.isLoading = true;
        return agent.loadReferenceByLink(referenceId)
            .then(action((response) => {
                this.currentReference = response.data;
                this.isLoading = false;
                this.setPageType('reference');
                return response.data;
            }))
            .catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    };

    @action clear() {
        this.pageType = '';
    }
}
    
export default new CaseCreateStore()