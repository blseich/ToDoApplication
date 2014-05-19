// -- COLLECTION
var ToDoList = Backbone.Collection.extend({

	models: Task

});

// -- VIEW
var ToDoListView = Backbone.View.extend({
	el: $('#container'),
	events: {
		"click #addButton": "showAddTaskField",
		"click #removeButton": "toggleRemoveButtons"
	},
	showAddTaskField: function(){
		this.trigger("show:add:task");
	},
	toggleRemoveButtons: function(){
		$('.delete-button').each(function(){
			$('#removeButton').html('Remove Task');
			if (this.classList.contains('delete-button-show')) {
				this.classList.remove('delete-button-show');
				this.classList.add('delete-button-hide');
			} else {
				this.classList.add('delete-button-show');
				this.classList.remove('delete-button-hide');
				if (toDoList.length > 0) {
					$('#removeButton').html('Finished');
				}
			}		
		});
	},
	render: function(){
		var wrapper = {
			items: JSON.parse(JSON.stringify(toDoList.toJSON()))
		}
		console.log(toDoList.toJSON())
		$("#tester").load("template.html #task-template", function(){
			var output = "";
			var template = document.getElementById('task-template').innerHTML;
			output += Mustache.render(template, wrapper);
			$("#taskListContainer").html(output);
		});
	}

});

// -- CONTROLLER
var ToDoListController = ({

	initialize: function(){
		this.toDoView = new ToDoListView();
		this.toDoView.on("show:add:task", this.showAddTask);
	},
	showAddTask: function() {
		TaskFormController.renderTaskForm();
	},
	addTaskToList: function(task){
		if (this.isUnique(task)) {
			toDoList.add(task);
			this.toDoView.render();
		} else {
			alert('ERROR: Task is not unique');
		}
		
	},
	removeTaskFromList: function(task){
		toDoList.remove(task);
		this.toDoView.render();
		this.toDoView.toggleRemoveButtons();
	},
	isUnique: function(task) {
		var result = true;
		toDoList.each(function (existingTask) {
			if(existingTask.get('title') === task.get('title')&&
			   existingTask.get('color').getSelected() ===
			   task.get('color').getSelected()) {
				result = false;
			}
		});
		return result;
	},
	updateTaskInList: function(title, color, taskId) {
		var testTask = new Task;
		testTask.set('title', title);
		for(var i = 0; i < testTask.get('color').length; i++) {
			if (testTask.get('color').at(i).get('name') === color) {
				testTask.get('color').at(i).set('selected', true);
			} else {
				testTask.get('color').at(i).set('selected', false);
			}
		}
		if (this.isUnique(testTask)) {
			toDoList.get(taskId).set('title', testTask.get('title'));
			toDoList.get(taskId).set('color', testTask.get('color'));
			this.toDoView.render();
		} else {
			alert('ERROR: Changes make task not unique');
		}
	}
});

// -- INITIALIZER
var toDoList = new ToDoList();
ToDoListController.initialize();