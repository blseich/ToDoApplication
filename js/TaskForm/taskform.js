// -- VIEW
var TaskFormView = Backbone.View.extend({
	el: $('.task-form'),
	events: {
		"click .color-button" : "changeColor",
		"click #submitButton" : "submit",
		"click #closeButton" : "close"
	},
	changeColor: function(ev){
		this.color = ev.target.innerHTML;
		var color = this.color;
		$(".color-button").each(function() {
                buttonColor = this.innerHTML
                if (buttonColor === color) {
                    this.classList.add(buttonColor+'-button-selected');
                	this.classList.remove(buttonColor+'-button');    
                } else {
                    this.classList.remove(buttonColor+'-button-selected');
                    this.classList.add(buttonColor+'-button');
                }
            });
	},
	submit: function(ev) {
		this.title = $('#new-task-title').val();
		this.taskId = ev.target.value;
		this.trigger("submitted:task", this.title, this.color, this.taskId);
		this.close();
	},
	close: function() {
		$(".task-form").html("");
		$("#tester").html("");
	},
	render: function(taskJSONObject) {
		if (taskJSONObject.new) {
			this.$el = $("#new-task");
		} else {
			this.$el = $("#edit-form-"+taskJSONObject.taskId);
		}
		var context = this;
		$("#tester").load("template.html #task-form-template", function(){
			var output = "";
			var template = document.getElementById('task-form-template').innerHTML;
			output += Mustache.render(template, taskJSONObject);
			context.$el.html(output);
		});
		this.delegateEvents();
		return this;
	}
});

// -- CONTROLLER
var TaskFormController = ({

	initialize: function(){
		this.taskFormView = new TaskFormView();
		this.taskFormView.on("submitted:task", this.submitTask);
	},
	submitTask: function(title, color, taskId) {
		var task = new Task;
		var checkColor = color;
		if (title !== "") {task.set('title', title);}
		if (typeof color !== 'undefined') {
			task.get('color').setSelected(checkColor);
		}
		if (typeof toDoList.get(taskId) === 'undefined') {
			ToDoListController.addTaskToList(task);
		} else {
			ToDoListController.updateTaskInList(title, color, taskId);
		}
	},
	renderTaskForm: function(task) {
		if (typeof task === 'undefined') {
			var task = new Task();
			this.taskFormView.color = 'blue';	
		}
		var jsonObject = this.buildFormJSONObject(task);
		this.taskFormView.close();
		this.taskFormView.render(jsonObject);
	},
	buildFormJSONObject: function(task) {
		var json = {};
		json.title = task.get('title');
		json.taskId = task.get('taskId');
		json.color = task.get('color').toJSON();
		json.new = (typeof toDoList.get(task.cid) === 'undefined');
		return json;
	}

});

// -- INITIALIZER
TaskFormController.initialize();