/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req,res) {
	   
			Project.find()
					.sort("id DESC")
					.exec(function(err, items){

						if(err) {
							sails.log.warn(err);
							res.send(500);
						}

						res.view({
							items: items,
							moment: moment
						});

					});
		
	},

	projectList: function(req, res) {

		Project.find()
			.sort("id DESC")
			.exec(function(err, items){

				if(err) {
					sails.log.warn(err);
					res.send(500);
				}

				res.send(items);
			});

	},

	create: function (req, res) {


		// I'm loving JSON
		var project = req.param("project"); 

		// simple validation
		if(project.title == null){

			res.send({
				status: -1,
				error: 'Необходимо ввести наименование проекта'
			});

			return;
		}


		// Should we save or update project? 
		// Anyway we should send it back
		if(project.hasOwnProperty("id")) {

			Project.update(project.id, project).exec(function (err) {
				if (err) {
					return res.send(500);	
				} 

				res.send({
					status: 1,
					project: project
				});

			});

		} else {
		
			Project.create(project).exec(function (err, newProject) {
				if (err) {
					console.log(err);
					return res.send(500);	
				} 
				
				res.send({
					status: 1,
					project: newProject
				});
			});
		}
	},

	watch: function(req,res){
		var id = req.param('id');
		Project.findOne(id).exec(function (err, project) {
			if (!project) return res.send(404);
			if (err)   return res.send(500);
			res.send({
					project: project
			});
		});
	},

	update: function (req, res) {
		var id = req.param('id');
	
		var elem = {
			title: req.param('title'),
			description : req.param('description'),
			completionDate : req.param('completionDate'),
			stages: req.param('stages')
		};


		console.log("Updated Id: " + req.param('id'));
		Project.update(id, elem).exec(function (err) {
			if (err) return res.send(500);
			res.redirect('/');
		});
			
	},

	delete: function (req, res) {
		var id = req.param('id');
		Project.destroy(id).exec(function (err) {
			if (err) return res.send(500);
			res.send({
					status: 1
			});
		});
	}

};

