$(function(){
	// Playing with Backbone.js because why the heck not?
	
	// Question Model and List
	var Question = Backbone.Model.extend();
	var QuestionList = Backbone.Collection.extend({
		model: Question,
		localStorage: new Store("questions")
	 });
	var questions = new QuestionList;
	
	// The Question as rendered in the admin
	var AdminQuestionView = Backbone.View.extend({
		className: "question",
		template:  _.template($("#admin-question-template").html()),
		
		events: {
			"click .selected dd" : "clickedAnswer",
			"click input[value='Ask']": "clickedAsk",
			"click input[value='Reveal All']": "clickedReveal",
			"click input[value='Clear']": "clickedClear",
		},
		
		initialize: function(){
			_.bindAll(this, 'render');
			this.model.view = this;
		},
		
		render: function(){
			$(this.el).html(this.template(this.model.toJSON()) );
			return this;
		},
		
		clickedAnswer: function(event){
			// Show correct answer on the public side
			var target = $(event.target);
			var clicked_answer = target.html().split(" ")[0];
			var selector = ":contains(" + clicked_answer + ")";
			var public_answer = $("#public dl").find(selector);
			public_answer.html(target.html());
			
			// Disable clicking on this answer in the admin
			target.addClass("answered")
			
			// Prompt for which team got the points
			$("#blackout").show();
			var prompt = $("#point-prompt")
			prompt.show();
			var position = target.offset();
			prompt.css({ top: position.top });
		},
		
		clickedAsk: function(event){
			var el  = $(this.el);
			el.addClass("selected");
			
			// Move question to top of the list
			$("#question-list").prepend(el);
						
			// Change the 'Ask' button to 'Reveal All'
			el.find("input").attr("value", "Reveal All");
			
			// Disable all the other 'ask' buttons in the admin
			$("input[value='Ask']").attr("disabled", true);
			
			// Show question and number of answers on public side
			var clone = el.find("dl").clone()
			var dds = clone.find("dd");
			
			// Mask out the answers in the cloned list				
			dds.each(function(){
				var $this = $(this);
				var text = $this.html();
				var q_num = text.split(" ")[0];
				var new_str = q_num + " " + Array(60).join("&#10074;");
				$this.html(new_str);
			});
						
			$("#question").html(clone);
		},
			
		
		clickedReveal: function(event){
			var el = $(this.el);
			
			// Change the 'Ask' button to 'Clear'
			el.find("input").attr("value", "Clear");
			
			// Show the question and ALL the answers on the public side
			var clone = el.find("dl").clone();
			$("#question").html(clone);
			
			strike = 0;
		},
		
		
		clickedClear: function(event){
			// Clear out the question/answers on the public side
			$("#question").html("")
			
			// Re-enable all the other 'ask' buttons in the admin
			$("input[value='Ask']").attr("disabled", false);
			
			// Remove the question from the admin, and set it's 'asked' value
			this.remove();
			this.model.set({'asked': true});
			this.model.save();
		}
		
	});


	var AdminView = Backbone.View.extend({
		el: $("#admin"),
		
		events: {
			"click input[value='Reset Game']": "resetApp",
			"click input[value='Strike 1']": "strike1",
			"click input[value='Strike 2']": "strike2",
			"change select": "recordPoints",
		},
		
		initialize: function(){
			_.bindAll(this, 'addOne', 'addAll');
			questions.bind('add', this.addOne, this);
			questions.bind('reset', this.addAll, this);
			questions.bind('all', this.render, this);
			
			questions.fetch();
		},
		
		
		addOne: function(question){
			var view = new AdminQuestionView({model: question});
			var html = view.render().el;
			if(question.get('asked') != true){
				this.el.append(html);
			}
		},
		
		addAll: function(){
			questions.each(this.addOne);
		},
		
		strikeAll: function(){
			var aud = $("audio")[0];
			aud.play();
			aud.addEventListener('ended', this.audioEnd );
			$("#strike").show();
		},
		
		strike1: function(){
			$("#strike img").attr("src", "/SAAFeud/img/strike.png");
			this.strikeAll();
		},
		
		strike2: function(){
			$("#strike img").attr("src", "/SAAFeud/img/strike2.png");
			this.strikeAll();
		},
		
		resetApp: function(){
			var do_it = confirm("This will reset the game to its default state.  Already-asked questions will be re-listed.  Are you sure?");
			if(do_it){
				localStorage.clear();
				window.location = window.location;
			}
		},
		
		recordPoints: function(event){
			$("#blackout").hide();
			var target = $(event.target);
			var team = target.val();
			
			// Get the scoreboard score and increment it
			var selector = "#" + team + "-score";
			var score = parseInt($(selector).html());
			score += 10;
			$(selector).html(score);
			
			// Reset the dropdown
			target.val(""); 
			target.hide();
		},
		
		audioEnd: function(event){
			//console.log(this);
			//this.currentTime = 0;
			$("#strike").hide();
		}
	});
		
	var admin = new AdminView();

	
	// Public scoreboard view.  Doesn't persist any data, but needs to listen
	// to events to update itself.
	var ScoreBoardView = Backbone.View.extend({
		template:  _.template($("#scoreboard-template").html()),
		
		events: {
			"click dd": "showInput",
			"click dt": "showInput",
			"blur .team-field": "updateBoard",
		},
		
		initialize: function(options){
			this.id = options.id;
			this.name = options.name;
			this.score = 0;
			this.render();
		},
		
		render: function(){
			$(this.el).html(this.template(
				{
					id: this.id,
					name: this.name,
					score: this.score
				}
			));
			
			return this;
		},
		
		showInput: function(event){
			$this = $(event.target);
			var txt = $this.html();
			var input = $("<input type='input' class='team-field'>").attr("value", txt);
			$this.html(input)
			$this.find("input").focus();
			$this.data("old", txt); // store this so we can use it later, in changeTeamName
		},
		
		updateBoard: function(event){
			$this = $(event.target);
			var value = $this.attr('value');
		
			// Change scoreboard
			var d = $this.parent();
			d.html(value);
			
			// Change points prompt Dropdown select
			var old = d.data('old');
			var selector = ":contains('" + old+ "')";
			var select = $("#admin").find("select").find(selector)[0];
			$(select).html(value);
		}
	});

	team1_board = new ScoreBoardView({'id': '1', 'name': 'Team 1'});
	team2_board = new ScoreBoardView({'id': '2', 'name': 'Team 2'});
	
	$("#public").append(team1_board.el);
	$("#public").append(team2_board.el);
	
});
