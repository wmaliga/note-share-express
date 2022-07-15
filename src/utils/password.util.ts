import crypto from 'crypto'

const salt = 'NordSalt';

export default class PasswordUtil {

    static encrypt(password: string): string {
        const hash = crypto.createHash('md5');
        return hash.update(salt + password).digest('hex');
    }
}