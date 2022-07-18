import crypto from 'crypto'
import {Service} from "typedi";

const salt = 'NordSalt';

@Service()
export default class PasswordUtil {

    encrypt(password: string): string {
        const hash = crypto.createHash('md5');
        return hash.update(salt + password).digest('hex');
    }
}