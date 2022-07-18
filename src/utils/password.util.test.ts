import PasswordUtil from "./password.util";

const passwordUtil = new PasswordUtil();

describe("Password util", () => {
    test('encrypt success', () => {
        const password = "pass";
        const expected = "b2c6c67d6e61e1611c8a0d99a4128e96";

        const encrypted = passwordUtil.encrypt(password);

        expect(encrypted).toEqual(expected);
    });
});
