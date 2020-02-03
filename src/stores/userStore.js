import { computed } from 'mobx';

class UserStore {
    // @observable loginUser = null;

    @computed get currentUser() {
        let user;
        user = {
            email: window.localStorage.getItem('email') || null,
            username: window.localStorage.getItem('username') || null,
            user_id: window.localStorage.getItem('user_id') || null
        }
        return user;
    }
}

export default new UserStore();