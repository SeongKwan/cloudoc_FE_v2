import { observable, action, reaction } from 'mobx';
import agent from '../utils/agent';

class LoginStore {
    @observable loggedIn = false;

    @action setLoggedIn(status) {
        this.loggedIn = status;
    }
}

export default new LoginStore();