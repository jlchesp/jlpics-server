import jwt from 'jsonwebtoken';

export default class Token {

    private static seed: string = 'this is the secret seed off my app';
    private static duration: string = '30d';

    constructor() { }
    
    // Function to obtain the token, where a payload is passed, which in our case will be a user
    static getJwtToken(payload: any): string {

        return jwt.sign({
            user: payload
        }, this.seed, { expiresIn: this.duration });
    }
    
    // Function to check the token
    static checkToken(userToken: string) {

        return new Promise((resolve, reject) => {

            jwt.verify(userToken, this.seed, (err, decoded) => {

                if (err) {
                    reject();
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}
