// -- MODEL
var Task = Backbone.Model.extend({

	defaults: function(){
		return {
			taskId: this.cid,
			title: 'New Task',
			color: new AllColors()
		};
	}
});


// -- VIEW
var TaskView = Backbone.View.extend({
	el: $('#taskListContainer'),
	events: {
		'click .delete-button-icon': 'removeTask',
		'click .edit-button-icon': 'editTask'
	},
	removeTask: function(ev){
		var cid = ev.target.parentElement.value;
		this.trigger("remove:task", cid);
	},
	editTask: function(ev){
		var cid = ev.target.parentElement.value;
		this.trigger("edit:task", cid);
	}
});

// -- CONTROLLER
var TaskController = ({

	initialize: function(){
		this.taskView = new TaskView();
		this.taskView.on("remove:task", this.getTaskToRemove);
		this.taskView.on("edit:task", this.getTaskToEdit);
	},
	getTaskToRemove: function(cid){
		var taskToRemove = toDoList.get(cid);
		ToDoListController.removeTaskFromList(taskToRemove);
	},
	getTaskToEdit: function(cid){
		var task = toDoList.get(cid);
		TaskFormController.renderTaskForm(task);
	}

});

// -- INITIALIZER
TaskController.initialize();