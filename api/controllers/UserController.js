/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	//@API - создание пользователя

	/**
	 * Создание нового пользователя,
	 * в качестве параметров передаем
	 * имя пользователя, пароль, и булевое
	 * значение админ. После создания
	 * пользователя он аутентифицируется
	 * в сессии. После создания пользователя 
	 * администратора мы установили политику
	 * admin (api/policies/admin.js) чтобы к
	 * этой функции больше не могли обращаться
	 * не привелегированные пользователи
	 */
	 
	create: function (req, res) {

		var username = req.param("username");
		var password = req.param("password");

		var user = { 'username': username, 'password' : password};


		if(user.username == null ){

			res.send({
				status: -1,
				error: 'Необходимо ввести имя пользователя'
			});

			return;
		}


		if(user.password == null){

				res.send({
					status: -1,
					error: 'Необходимо ввести пароль пользователя'
				});
				return;
		
		}


		if(user.hasOwnProperty("id")){
			User.update(user.id, user).exec(function (err) {
				if (err) {
					console.log(err);
					return res.send(500);
				}
				
				res.send({
						status: 1,
						user: user
				});
			});
		} else {
			User.create(user).exec(function (err, newUser) {
				if (err) {
					console.log(err);
					return res.send(500);
				}
				
				res.send({
						status: 1,
						user: newUser
				});
			});
		}
		

		
	},

	update: function (req, res) {
		var id = req.param('id');

		var elem = {
			username       : req.param('username'),
			password       : req.param('password')
		};

		User.update(id, elem).exec(function (err) {
			if (err) return res.send(500);
			res.redirect('/');
		});
			
	},

	delete: function (req, res) {
		var id = req.param('id');
		User.destroy(id).exec(function (err) {
			if (err) return res.send(500);
			res.redirect('/');
		});
	},

	watch: function (req, res) {
		var id = req.param('id');
		User.findOne(id).exec(function (err, user) {
			if (!user) return res.send(404);
			if (err)   return res.send(500);
			res.view({
				user: user
			});

		});
	},

	
	// Get Current User
	getUser: function(req, res) {
		return res.json({user: req.session.User});
	},	


	// @MAIN
	index: function (req, res) {

		// Поиск в модели User
		User.find()
			.sort('id DESC')
			.limit(5)
			.exec(function (err, users) {
				if (err) return res.send(500);
				res.view({
					users: users
				});

			});
	}
};
