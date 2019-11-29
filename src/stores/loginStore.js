import { observable, action, computed } from 'mobx';
import authStore from './authStore';
import userStore from './userStore';
import agent from '../utils/agent';

class LoginStore {
    @observable loggedIn = false;
    @observable isLoading = false;
    @observable inputValuesForLogin = {
        email: '',
        password: ''
    };
    @observable errors = null;
    @observable errorValues = {
        noIdValue: false,
        noPasswordValue: false,
        inputError: false
    }

    @computed get inLoggedIn() {
        const token = window.localStorage.getItem('token') || null;
        if (token) {
            return true;
        }
        if (this.loggedIn) {
            return true;
        }
        return false;
    }

    @action changeInput(key, value) {
        this.inputValuesForLogin[key] = value;
        if (key === 'email') {
            if (value === '') {
                return this.errorValues.noIdValue = true;
            }
            this.errorValues.noIdValue = false;
        }
        if (key === 'password') {
            if (value === '') {
                return this.errorValues.noPasswordValue = true;
            }
            this.errorValues.noPasswordValue = false;
        }
    }

    @action login() {
        this.isLoading = true;
        const { email, password } = this.inputValuesForLogin;
        return agent.login({email, password})
        .then(action((res) => {
            let { 
                token,
                refreshToken
            } = res.data;
            this.clearErrorValues();
            authStore.setTokenAndEmailAndUserTypeAndType(token, refreshToken, email, res.data.user.name, res.data.user.user_id);

            this.loggedIn = true;
            this.isLoading = false;
            return res.data;
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.isLoading = false;
            this.loggedIn = false;
            const { email, password } = err.data.errors || {};
            const { message } = err.data || {};

            if (email && !password) {
                this.errorValues.noIdValue = true;
                throw err;
            } 
            if (!email && password) {
                this.errorValues.noPasswordValue = true;
                throw err;
            } 
            if (email && password) {
                this.errorValues.noIdValue = true;
                this.errorValues.noPasswordValue = true;
                throw err;
            }
            if (message === "unregistered email" || message === "Incorrect password") {
                this.errorValues.inputError = true;
                throw err;
            }
        }));
    }

    @action setLoggedIn(status) {
        this.loggedIn = status;
    }

    @action logout(type) {
        const THIS = this;
        return new Promise(function (resolve, reject) {
            if (type !== 'expiredRefreshToken') {
                const gostop = window.confirm('로그아웃 하시겠습니까?');
                if (gostop) {
                    window.localStorage.removeItem('caseCounts');
                    window.localStorage.removeItem('email');
                    window.localStorage.removeItem('length');
                    window.localStorage.removeItem('refreshToken');
                    window.localStorage.removeItem('token');
                    window.localStorage.removeItem('user_id');
                    window.localStorage.removeItem('username');
                    THIS.setLoggedIn(false);
                    authStore.destroyTokenAndUuid();
                    userStore.clearUser();
                    resolve({success: true});
                }
            } else {
                window.localStorage.removeItem('caseCounts');
                window.localStorage.removeItem('email');
                window.localStorage.removeItem('length');
                window.localStorage.removeItem('refreshToken');
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('user_id');
                window.localStorage.removeItem('username');
                THIS.setLoggedIn(false);
                authStore.destroyTokenAndUuid();
                userStore.clearUser();
                resolve({success: true});
            }
        });
    }

    @action clearInputValuesForLogin() {
        this.inputValuesForLogin = {
            email: '',
            password: ''
        };
    }

    @action clearErrorValues() {
        this.errorValues = {
            noIdValue: false,
            noPasswordValue: false,
            inputError: false
        }
    }
}

export default new LoginStore();