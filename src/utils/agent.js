import axios from 'axios';
import { computed } from 'mobx';
import authStore from '../stores/authStore';
import errorStore from '../stores/errorStore';
import loginStore from '../stores/loginStore';

const API_ROOT = `http://18.176.133.8:5001`;

class Agent {
    constructor(baseURL = null) {
        this.axios = axios.create({ baseURL });
    }

    /** 
     * 추후 자동으로 basic end points를 생성하는 로직이 필요하다고 여겨질 때 참고
     * https://codeburst.io/how-to-call-api-in-a-smart-way-2ca572c6fe86
     */
    /* APIs */


/* ------------------------ */
    // Login & SignUp

    signup(userInfo) {
        return this.axios
            .post('/auth/signup', 
            {email: userInfo.email, password: userInfo.password, name: userInfo.name})
            .catch(this._handleError);
    }

    login({email, password}) {
        return this.axios
                .post('/auth/login', {email, password}, { 
                    baseURL: API_ROOT,
                    headers: { 
                        
                    }
                })
                .catch(this._handleError);
    }

    signupCaseMaster(userInfo) {
        return this.axios
            .post(`/auth/casemaster`, {email: userInfo.email, password: userInfo.password}, {
                baseURL: API_ROOT
            })
            .catch(this._handleError);
    }

    refreshToken() {
        let { refreshToken, user_id } = authStore;
        return this.axios
                .post('/auth/token', {refreshToken, user_id}, { 
                    baseURL: API_ROOT,
                    headers: { 
                        
                    }
                })
                .catch(this._handleError);
    }

    validateToken() {
        let { refreshToken, user_id } = authStore;
        return this.axios
                .post('/auth/token/check', {refreshToken, user_id}, { 
                    baseURL: API_ROOT,
                    headers: { 
                        
                    }
                })
                .catch(this._handleError);
    }

    loadCase(caseId) {
        return this.get(`/cases/${caseId}`);
    }

    loadCases() {
        return this.get(`/cases`);
    }

    postCase(newCase) {
        return this.post(`/cases`, newCase);
    }

    updateCase(caseId, updatedCase) {
        return this.patch(`/cases/${caseId}`, updatedCase);
    }

    deleteCase(caseId) {
        return this.delete(`/cases/${caseId}`);
    }


    


    loadSymptoms() {
        return this.get(`/symptoms`);
    }
    
    loadSymptom(symptomId) {
        return this.get(`/symptoms/${symptomId}`);
    }

    postExcel(file) {
        let { token, email } = authStore;
        
        return this.axios
        .post(`/api/v1/cases/uploadxlsx`, file, { 
            baseURL: API_ROOT,
            headers: { 
                'content-type': 'multipart/form-data',
                'Authorization': `bearer ${token}`,
                'email': `${email}`
            }
        })
        .catch(this._handleError);
    }


    loadLabs() {
        return this.get(`/labs`);
    }






    loadConditions() {
        return this.get(`/conditions`);
    }
    
    loadCondition(conditionId) {
        return this.get(`/conditions/${conditionId}`);
    }


    loadDrugs() {
        return this.get(`/drugs`);
    }

    loadDrug(drugId) {
        return this.get(`/drugs/${drugId}`);
    }


    analyzeCondition(referenceData) {
        return this.post(`/cases/analyzeCondition`, referenceData);
    }

    analyzeTreatment(referenceData) {
        return this.post(`/cases/analyzeTreatment`, referenceData);
    }
    
    analyzeTeaching(referenceData) {
        return this.post(`/cases/analyzeTeaching`, referenceData);
    }

    loadReferenceByLink(referenceId) {
        return this.get(`/references/link/${referenceId}`);
    }


    /* Base REST API method */
    get(url) {
        return this.axios
            .get(`/api/v1${url}`, this.requestConfig)
            .catch(this._handleError);
    }
    put(url, body) {
        return this.axios
            .put(`/api/v1${url}`, body, this.requestConfig)
            .catch(this._handleError);
    }
    patch(url, body) {
        return this.axios
            .patch(`/api/v1${url}`, body, this.requestConfig)
            .catch(this._handleError);
    }
    post(url, body) {
        return this.axios
            .post(`/api/v1${url}`, body, this.requestConfig)
            .catch(this._handleError);
    }
    delete(url) {
        return this.axios
            .delete(`/api/v1${url}`, this.requestConfig)
            .catch(this._handleError);
    }

    @computed get requestConfig() {
        let requestConfig = { 
            baseURL: API_ROOT,
            headers: {} 
        };
        
        let { token, email, user_id } = authStore;
        requestConfig.headers['user-type'] = "ADMIN";
        
        if (token) { requestConfig.headers['Authorization'] = `bearer ${token}`; }
        if (email) { requestConfig.headers['email'] = `${email}`; }
        if (user_id) { requestConfig.headers['user_id'] = `${user_id}`; }

        return requestConfig;
    }


    _handleError(error) {
        let type = '';
        const { inLoggedIn } = loginStore;

        if (error.response !== undefined) {
            type = error.response.data.type;
            if (!window.navigator.onLine) {
                alert('오프라인 상태입니다');
            } else {
                errorStore.setErrorToken(true);
                if (Boolean(error.response.data.type) === true) {
                    if (type === "expired" || type === "refresh" || type === "error") {
                        return errorStore.authError(error.response.data);
                    } else if (type === 'guest') {
                        if (inLoggedIn) {
                            return window.location.reload(true);
                        }
                        return window.location.href = "http://cloudoc.net.s3-website.ap-northeast-2.amazonaws.com/";
                    }
                    return window.location.reload(true);
                }
            }
            
        }
        throw error.response;
    }
}

const agent = new Agent(API_ROOT);

export default agent;
