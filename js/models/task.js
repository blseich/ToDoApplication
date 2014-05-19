var Task = Backbone.Model.extend({

	defaults: function(){
		return {
			title: 'New Task',
			color: 'blue'
		};
	},

	initialize: function(){
		console.log("Task Created");
	}

});

console.log("TASKS");
