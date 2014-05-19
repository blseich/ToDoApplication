// -- MODELS
var Task = Backbone.Model.extend({

	defaults: function(){
		return {
			taskId: this.cid,
			title: 'New Task',
			color: 'blue'
		};
	},

	initialize: function(){

	}

});
// -- END OF MODELS

// -- COLLECTIONS
var ToDoList = Backbone.Collection.extend({

	models: Task

});
// -- END OF COLLECTIONS

// -- VIEWS
var ToDoListView = Backbone.View.extend({
	el: $('#container'),
	events: {
		"click #addButton": "showAddTaskField",
		"click #removeButton": "toggleRemoveButtons"
	},
	showAddTaskField: function(){
		$('.newTaskDisplay').show(500);
		this.trigger("add:task");
	},
	toggleRemoveButtons: function(){
		$('.delete-button').each(function(){
			if (this.classList.contains('delete-button-show')) {
				this.classList.remove('delete-button-show');
				this.classList.add('delete-button-hide');
				$('#removeButton').html('Remove Task');
			} else {
				this.classList.add('delete-button-show');
				this.classList.remove('delete-button-hide');
				$('#removeButton').html('Finished');
			}		
		});
	},
	render: function(){
		var wrapper = {
			items: toDoList.toJSON()
		}

		$("#tester").load("template.html #template1", function(){
			var output = "";
			var template = document.getElementById('template1').innerHTML;
			output += Mustache.render(template, wrapper);
			$("#taskListContainer").html(output);
		});

	}

});

var NewTaskView = Backbone.View.extend({
	el: $('#newTask'),
	events: {
		"click #blueButton" : "changeColor",
		"click #greenButton": "changeColor",
		"click #redButton"  : "changeColor",
		"click #submitButton" : "submit",
		"click #closeButton" : "close"
	},
	changeColor: function(ev){
		this.color = ev.target.innerHTML;
		$(".color-button").each(function() {
                buttonColor = this.innerHTML
                if (buttonColor == this.color) {
                    this.classList.add(buttonColor+'-button-selected');
                	this.classList.remove(buttonColor+'-button');    
                } else {
                    this.classList.remove(buttonColor+'-button-selected');
                    this.classList.add(buttonColor+'-button');
                }
            });
		this.trigger("update:color", this.color);
	},
	submit: function() {
		this.title = $('#newTaskTitle').val();
		this.trigger("submitted:task", this.title, this.color);
		this.close();
	},
	close: function() {
		$('.newTaskDisplay').hide(500);
	}

});

var TaskView = Backbone.View.extend({
	el: $('#taskListContainer'),
	events: {
		'click .delete-button-icon': 'removeTask'
	},
	removeTask: function(ev){
		var cid = ev.target.parentElement.value;
		this.trigger("remove:task", cid);
	}
});
// -- END OF VIEWS

// -- CONTROLLERS
var ToDoListController = ({

	initialize: function(){
		this.toDoView = new ToDoListView();
		this.newTaskView = new NewTaskView();

		this.toDoView.on("add:task", this.addTask);
	},
	addTaskToList: function(task){
		toDoList.add(task);
		this.toDoView.render();
	},
	removeTaskFromList: function(task){
		toDoList.remove(task);
		this.toDoView.render();
		this.toDoView.toggleRemoveButtons();
	}
});

var NewTaskController = ({

	initialize: function(){
		this.newTaskView = new NewTaskView();
		this.newTaskView.on("submit:task", this.buildTask);
		this.newTaskView.on("update:color", this.changeColor);
		this.newTaskView.on("submitted:task", this.submitTask);
	},
	submitTask: function(title, color) {
		var task = new Task;
		if (title !== "") {task.set('title', title);}
		if (typeof color !== 'undefined') {task.set('color', color);}
		ToDoListController.addTaskToList(task);		
	}

});

var TaskController = ({

	initialize: function(){
		this.taskView = new TaskView();
		this.taskView.on("remove:task", this.getTaskToRemove);
	},
	getTaskToRemove: function(cid){
		var taskToRemove = toDoList.get(cid);
		ToDoListController.removeTaskFromList(taskToRemove);
	}

});
// -- END OF CONTROLLERS

//APPLICATION CODE
ToDoListController.initialize();
NewTaskController.initialize();
TaskController.initialize();
var toDoList = new ToDoList;
