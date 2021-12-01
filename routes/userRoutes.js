// rutas para las peliculas del usuario
const express = require('express');
const UserService = require('../services/userService');

const userApi = (app) => {
    const router = express.Router();
    app.use('/api/user', router);

    const service = new UserService();

    router.post('/login', async(req, res) => {
        const { body: email } = req;
        try {
            const findUser = await service.getUser(email);
            res.status(200).json({
                data: findUser,
                message: 'user finded',
            });
        } catch (error) {
            res.status(400).json({
                message: 'user not finded',
            });
        }
    });

    router.post('/', async(req, res) => {
        const { body: user } = req;
        try {
            const confirmUser = await service.confirmUser(user);
            if (confirmUser.status === 'ok') {
                res.status(400).json({
                    message: 'User could not be created',
                });
            } else {
                const createUserId = await service.createUser({ user });
                res.status(201).json({
                    data: createUserId,
                    message: 'User created',
                });
            }
        } catch (error) {
            res.status(400).json({
                message: 'Error creating user',
            });
        }
    });

    router.post('/code', async(req, res) => {
        const { body: data } = req;
        const code = Math.floor(Math.random() * 500);
        const subj = "Authentication"
        const text = "Your code for authentication is: ";
        try {
            const UserCode = await service.sendCode(data.email, code, subj, text);
            res.json(UserCode);
        } catch (error) {
            res.status(400).json({
                message: 'Error sending mail',
            });
        }
    });

    router.post('/recovery', async(req, res) => {
        const { body: data } = req;
        const code = Math.floor(Math.random() * 500);
        const subj = "Recovery Password"
        const text = "Your code to recovery your password is: ";
        try {
            const confirmUser = await service.confirmUser(data);
            if (confirmUser.status === 'ok') {
                const UserCode = await service.sendCode(data.email, code, subj, text);
                res.json(UserCode);
            } else {
                res.status(400).json({
                    message: 'Recovery code could not be sent',
                });
            }
        } catch (error) {
            res.status(400).json({
                message: 'Error sending mail',
            });
        }
    });

    router.post('/update', async(req, res) => {
        const { body: data } = req;
        try {
            const confirmUser = await service.confirmUser(data);
            if (confirmUser.status === 'ok') {
                const updateUser = await service.updateUser(data);
                res.status(200).json({
                    data: updateUser,
                    message: 'Password update',
                });
            } else {
                res.status(400).json({
                    message: 'Could not update password',
                });
            }
        } catch (error) {
            res.status(400).json({
                message: 'Error update password',
            });
        }
    });
};

module.exports = userApi;