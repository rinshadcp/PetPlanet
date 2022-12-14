
const User = require('../../models/user/userModel');
const addProduct = require("../../models/admin/addProduct");
const {isLoggedIn}= require('../../middlewrares/authentication');

module.exports.home = async (req, res) => {
const  products  =await addProduct.find();
     res.render('user/index',{products});
}
module.exports.renderRegister = (req, res) => {
    res.render('user/signup');
}

module.exports.register = async (req, res, next) => {
    try {
        const { phone,email, username, password } = req.body;
        const user = new User({ email, username,phone });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to home!');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    
}

module.exports.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}
