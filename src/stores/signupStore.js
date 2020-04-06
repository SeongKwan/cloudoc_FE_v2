import { observable, action } from 'mobx';
import constInviteCode from '../constant/inviteCode';
import agent from '../utils/agent';

class SignupStore {
    @observable userInfo = {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        inviteCode: ''
    };
    @observable errors = null;
    @observable errorValues = {
        noUsernameValue: false,
        noIdValue: false,
        noPasswordValue: false,
        noConfirmPasswordValue: false,
        noInviteCode: false,
        inValidEmail: false,
        inValidPassword: false,
        inValidConfirm: false,
        inValidInviteCode: false
    }

    @action changeInput(key, value) {
        this.userInfo[key] = value;
        if (key === 'name') {
            if (value === '') {
                return this.errorValues.noUsernameValue = true;
            }
            this.errorValues.noUsernameValue = false;
        }
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
            if (value.length >= 8) {
                this.errorValues.inValidPassword = false;
            } else if (value.length < 8) {
                this.errorValues.inValidPassword = true;
            }
            this.errorValues.noPasswordValue = false;
        }
        if (key === 'confirmPassword') {
            if (value === '') {
                return this.errorValues.noConfirmPasswordValue = true;
            }
            this.errorValues.noConfirmPasswordValue = false;
        }
        if (key === 'inviteCode') {
            if (value === '') {
                return this.errorValues.noInviteCode = true;
            }
            this.errorValues.noInviteCode = false;
        }
    }

    @action manageError(type) {
        if (type === 'name') return this.errorValues.noUsernameValue = true;
        if (type === 'email') return this.errorValues.noIdValue = true;
        if (type === 'password') return this.errorValues.noPasswordValue = true;
        if (type === 'inValidEmail') return this.errorValues.inValidEmail = true;
        if (type === 'inValidPassword') return this.errorValues.inValidPassword = true;
        if (type === 'inValidConfirm') return this.errorValues.inValidConfirm = true;
        if (type === 'inviteCode') return this.errorValues.noInviteCode = true;
        if (type === 'inValidInviteCode') return this.errorValues.inValidInviteCode = true;
    }

    @action validation() {
        const {
            name,
            email,
            password,
            confirmPassword,
            inviteCode
        } = this.userInfo;
        
        let buttonOn = name.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0 && inviteCode.length > 0;
        let isEmailForm = email.search(/[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/) !== -1;
    
        if (name === '') {this.manageError('name')} 
        if (email === '') {this.manageError('email')}
        if (password === '') {this.manageError('password')}
        if (!isEmailForm) {this.manageError('inValidEmail')}
        if (password.length < 8) {this.manageError('inValidPassword')}
        if (password !== confirmPassword) {this.manageError('inValidConfirm')}
        if (inviteCode === '') {this.manageError('inviteCode')}
        if (inviteCode !== constInviteCode) {this.manageError('inValidInviteCode')}
        
        if (buttonOn) {
            return this.props.signup.signup()
            .then(res => {
                if(res.data.success) {
                    this.props.signup.signupCaseMaster();
                }
            })
            .then(res => {
                alert('가입해주셔서 감사합니다. 이제 Case Editor를 이용하실 수 있습니다.');
                    return this.props.history.replace('/login');
                })
            .catch(err => {
                console.log(err);
            });
        }
    }

    @action signup() {
        return agent.signup(this.userInfo)
        .then((res) => {
            this.clearErrorValues();
            return res;
        })
        .catch(err => {
            throw err;
        })
    }

    @action signupCaseMaster() {
        return agent.signupCaseMaster(this.userInfo)
        .then((res) => {
            this.clearErrorValues();
            return res;
        })
        .catch((err) => {
            throw err;
        })
    }

    @action clear() {
        this.userInfo = {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            inviteCode: ''
        };
    }

    @action clearValidation() {
        this.validated = false;
    }

    @action clearErrorValues() {
        this.errorValues = {
            noUsernameValue: false,
            noIdValue: false,
            noPasswordValue: false,
            noConfirmPasswordValue: false,
            noInviteCode: false,
            inValidEmail: false,
            inValidPassword: false,
            inValidConfirm: false,
            inValidInviteCode: false
        }
    }
}

export default new SignupStore();