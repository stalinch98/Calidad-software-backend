const bcrypt = require('bcrypt');
const MongoLib = require('../lib/mongoDB');
const nodemailer = require('nodemailer');
const { config } = require('../config/config');

// bcrypt para crear password en modo hash y no guardarlos tan como llegan
class UserService {
    constructor() {
        this.collection = 'users';
        this.mongoDB = new MongoLib();
    }

    // para obtener todos los usuarios con getall
    async getUser(correo) {
        const user = await this.mongoDB.getOnly(this.collection, correo);
        const { email, password } = user[0];
        const isValidPassword = await bcrypt.compare(correo.password, password);
        const isValidEmail = email === correo.email;
        const isValidUser = isValidEmail && isValidPassword;
        if (!isValidUser) {
            const userData = {
                status: 'error',
            };
            return userData;
        }

        const userData = {
            status: 'ok',
            username: user[0].name,
        };
        return userData;
    }

    async confirmUser(data) {
        const user = await this.mongoDB.getOnly(this.collection, data);
        if (user.length === 0) {
            const userData = {
                status: 'vacio',
            };
            return userData;
        } else {
            const userData = {
                status: 'ok',
                username: user[0].name,
            };
            return userData;
        }
    }

    async createUser({ user }) {
        const { lastname, ci, city, password, passwordConfirm, age, email, civilStatus, dateBirth, gender, name } = user;
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPasswordConfirm = await bcrypt.hash(passwordConfirm, 10);

        const createdUserId = await this.mongoDB.create(this.collection, {
            lastname,
            ci,
            city,
            password: hashedPassword,
            passwordConfirm: hashedPasswordConfirm,
            age,
            email,
            civilStatus,
            dateBirth,
            gender,
            name
        });

        return createdUserId;
    }


    async updateUser(data) {
        const hashedNewPassword = await bcrypt.hash(data.password, 10);
        const hashedNewPasswordConfirm = await bcrypt.hash(data.passwordConfirm, 10);
        data.password = hashedNewPassword;
        data.passwordConfirm = hashedNewPasswordConfirm;
        const updateUser = await this.mongoDB.update(this.collection, data);
        return updateUser;
    }

    async sendMail(infoMail) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: true,
            port: 465,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        await transporter.sendMail(infoMail);
        return { message: 'Email sent' };
    }

    async sendCode(email, code, subj, text) {
        const mail = {
            from: config.emailUser,
            to: email,
            subject: `${subj}`,
            html: `${text}${code}`,
        }
        const rta = await this.sendMail(mail);
        rta.code = code;
        return rta;
    }
}
module.exports = UserService;