/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passwordHash = require('password-hash');

module.exports = {


	// @API основные функции сессии

	create: function (req, res) {
		/**
		 * Задаем переменные запрашиваемых
		 * параметров, в нашем случае номер телефона
		 * и пароль
		 */
		var username = req.param('username'),
			password = req.param('password');

		/**
		 * Если нет логина или пароля в запросе
		 * вывести ошибку, и перенаправить на 500
		 * (прим. здесь лучше сделать подробную
		 * обработку ошибок)
		 */

		if (!username || !password) {

			req.flash('error', 'Необходимо ввести имя пользователя и пароль');

			return res.redirect('/');
		};
		 
		User.findOneByUsername(username).exec(function (err, user) {
			if (err) return res.send(500, {error: "DB Error"})
			else{
				if(user){
					if (passwordHash.verify(password, user.encryptPassword)) {
						// Авторизовать пользователя в сессии
						req.session.auth = true;
						req.session.User = user;
						
						return res.redirect('/');
						
					}
					else {
						return res.send(400, { error: "Wrong Password" });
					}
				}
				else{
					res.send(404, { error: "User not Found" });
				}
			}
		});
	},
	/**
	 * Создаем выход из сессии который 
	 * просматривает есть ли пользователь
	 * в онлайне, и уничтожает сессию
	 */
	destroy: function (req, res) {
		User.findOne(req.session.User.id).exec(function (err, user) {
			if (user) {
				req.session.destroy();
				res.redirect('/');
			} else { res.redirect('/login'); };
		});
	},

	// @MAIN

	index: function (req, res) {
		res.view();
	}
};