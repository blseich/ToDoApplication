// -- MODEL
var Color = Backbone.Model.extend({
	
	defaults: function(){
		return {
			name: "white",
			colorValue: "#ffffff",
			selected: false
		};
	}
});

// -- COLLECTION
var AllColors = Backbone.Collection.extend({
	models: Color,
	initialize: function() {
		var blue = new Color({
			name: 'blue',
			colorValue: '#0000ff',
			selected: true});
		var red = new Color({
			name: 'red',
			colorValue: '#ff0000',
			selected: false});
		var green = new Color({
			name: 'green',
			colorValue: '#00ff00',
			selected: false});
		var purple = new Color({
			name: 'purple',
			colorValue: '#ff00ff',
			selected: false});
		this.add([blue, red, green, purple]);
	},
	setSelected: function(color) {
		for (var i = 0; i < this.length; i++) {
			if (this.at(i).get('name') === color) {
				this.at(i).set('selected', true);
			} else {
				this.at(i).set('selected', false);
			}
		}
	},
	getSelected: function() {
		var result = "";
		for (var i = 0; i < this.length; i++) {
			if (this.at(i).get('selected')) {
				result = this.at(i).get('name');
			}
		}
		return result;
	}
});

// -- VIEW
var ColorStyleBuilder = Backbone.View.extend({
	el: $('#styles'),
	allColors: new AllColors(),
	initialize: function() {
		var wrapper = {
			colors: this.allColors.toJSON()
		}

		$("#styles").load("template.html #style-template", function(){
			var output = "";
			var template = document.getElementById('style-template').innerHTML;
			output += Mustache.render(template, wrapper);
			$("#styles").html(output);
		});

	}
});

// -- INITIALIZER
var setupColorStyles = new ColorStyleBuilder();
