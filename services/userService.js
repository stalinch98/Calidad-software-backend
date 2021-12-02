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
        } else {
            const userData = {
                status: 'ok',
                username: user[0].name,
            };
            return userData;
        }
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
        console.log("User service");
        console.log(user);
        const { name, lastName, age, email, password, passwordConfirm, ci, country, state, city, address, dateBirth, gender, civilStatus, postalCode, bloodType } = user;
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPasswordConfirm = await bcrypt.hash(passwordConfirm, 10);

        const createdUserId = await this.mongoDB.create(this.collection, {
            name,
            lastName,
            age,
            email,
            password: hashedPassword,
            confirmPassword: hashedPasswordConfirm,
            ci,
            country,
            state,
            city,
            address,
            dateBirth,
            gender,
            civilStatus,
            postalCode,
            bloodType
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
        const hashedCode = await bcrypt.hash(`${code}`, 10);
        const mail = {
            from: config.emailUser,
            to: email,
            subject: `${subj}`,
            html: `${text}${code}`,
        }
        const rta = await this.sendMail(mail);
        rta.code = code;
        rta.hashedCode = hashedCode;
        return rta;
    }
}
module.exports = UserService;