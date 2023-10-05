class UserSessionKeys {
    BRANCH_ID: string = '';
    NAME: string = '';
    ROLE_ID: string = '';
    USER_ID: string = '';
}


export class SessionUserDetails {

    static user_keys: UserSessionKeys = new UserSessionKeys();

    static checkSessionStorage() {
        let success = true;

        for (let item in this.user_keys) {
            if (!sessionStorage.getItem(item)) {
                success = false;
            }
        }

        return success;
    }

    static getSessionStorage() {
        let result: any = {};

        for (let item in this.user_keys) {
            result[item] = sessionStorage.getItem(item)
        }
        return result;
    }

    static setSessionStorage(data: any) {
        for (let item in this.user_keys) {
            if (item != 'USER_ID') {
                sessionStorage.setItem(item, data[item]);
            }
            else {
                sessionStorage.setItem(item, data['ID']);
            }

        }
    }
}

