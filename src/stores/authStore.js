import { observable, action, reaction } from 'mobx';
import agent from '../utils/agent';
import loginStore from './loginStore';

class AuthStore {
    @observable token = window.localStorage.getItem('token');
    @observable refreshToken = window.localStorage.getItem('refreshToken');
    @observable email = window.localStorage.getItem('email');
    @observable username = window.localStorage.getItem('username');
    @observable user_id = window.localStorage.getItem('user_id');
    @observable authError = false;
    @observable expiredToken = false;

    constructor() {
        this._initTokenAndUuidWithLocalStorage();

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('token', token);
                } else {
                    window.localStorage.removeItem('token');
                }
            }
        );

        reaction(
            () => this.refreshToken,
            refreshToken => {
                if (refreshToken) {
                    window.localStorage.setItem('refreshToken', refreshToken);
                } else {
                    window.localStorage.removeItem('refreshToken');
                }
            }
        );

        reaction(
            () => this.email,
            email => {
                if (email) {
                    window.localStorage.setItem('email', email);
                } else {
                    window.localStorage.removeItem('email');
                }
            }
        );

        reaction(
            () => this.username,
            username => {
                if (username) {
                    window.localStorage.setItem('username', username);
                } else {
                    window.localStorage.removeItem('username');
                }
            }
        );

        reaction(
            () => this.user_id,
            user_id => {
                if (user_id) {
                    window.localStorage.setItem('user_id', user_id);
                } else {
                    window.localStorage.removeItem('user_id');
                }
            }
        );
    }

    _initTokenAndUuidWithLocalStorage() {
        if (this.refreshToken && this.token && this.email && this.username && this.user_id) {
            this.setTokenAndEmailAndUserTypeAndType(this.token, this.refreshToken, this.email, this.username, this.user_id);
        }
    }

    @action setTokenAndEmailAndUserTypeAndType(token, refreshToken, email, username, user_id) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.email = email;
        this.username = username;
        this.user_id = user_id;
    }

    @action destroyTokenAndUuid() {
        this.token = undefined;
        this.refreshToken = undefined;
        this.username = undefined;
        this.email = undefined;
        this.user_id = undefined;
    }

    @action setToken() {
        this.token = window.localStorage.getItem('token');
    }

    @action setExpiredToken(status) {
        this.expiredToken = status;
    }

    @action validateToken() {
        return agent.validateToken()
        .then(action((response) => {
            if (!response.data) {
                this.setExpiredToken(true);
            }
            return response;
        }))
        .then((response) => {
            if (!response.data) {
                setTimeout(() => {
                    alert("로그인 시간이 만료되었습니다. 다시 로그인하여 주세요.")
                }, 100);
                setTimeout(() => {
                    loginStore.logout('expiredRefreshToken');
                }, 150);
                setTimeout(() => {
                    window.location.href = "http://cloudoc.net.s3-website.ap-northeast-2.amazonaws.com/login";
                }, 200);
            }
            return response.data;
        })
        .catch((error) => {
            throw error;
        })
    }

    @action clearAuthError() {
        this.authError = false;
    }
    
}

export default new AuthStore();