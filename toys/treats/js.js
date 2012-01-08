$(document).ready(function(){
	
	// Utility functions.  Called elsewhere
	function pad_digits(num){
		if(num < 10){
			return "0" + num;
		}
		else{
			return num;
		}
	}
	

	// Get the difference between the current time and the next instance of Friday
	// Treats.  Returns an object with days, hours, minutes, and seconds properties
	function draw_page(){
		var now = new Date();		
		var days_till_fri = 5 - now.getDay();  // Fri == 5.
			
		if(days_till_fri == -1){
			days_till_fri = 6;
		} else if (days_till_fri == -2){
			days_till_fri = 5;
		}
			
		// After 3PM on Friday
		if(now.getDay() == 5 && now.getHours() >= 15){
			days_till_fri = 7;
		}
		
		var next_fri_treats =  new Date(now.getFullYear(), now.getMonth(), now.getDate() + days_till_fri, 15);
		var diff = (next_fri_treats - now) / 1000; // Calculate difference and get rid of milliseconds
		
		var SECS_IN_DAY = 24 * 60 * 60;
		var SECS_IN_HR = 60 * 60;
		
		var days = Math.floor(diff / SECS_IN_DAY);
		diff -= SECS_IN_DAY * days;
		
		var hours = Math.floor(diff / SECS_IN_HR);
		diff -= SECS_IN_HR * hours;
		
		var minutes = Math.floor(diff / 60);
		diff -= minutes * 60;
		
		seconds = Math.floor(diff);
		
		var delta = {
			"days": days,
			"hours": hours,
			"minutes": minutes,
			"seconds": seconds
		}
		
		
		$("#days").html(pad_digits(delta.days));
		$("#hours").html(pad_digits(delta.hours));
		$("#minutes").html(pad_digits(delta.minutes));
		$("#seconds").html(pad_digits(delta.seconds));
		
		
		// Draw the colorful clock.
		var ctx =document.getElementById('canvas').getContext('2d');
		ctx.clearRect(0,0,700,700); // Blank out the canvas
		
		ctx.lineWidth = 100;
		var secColor = "#70A612";
		var minColor = "#2271CD";
		var hrColor = "#DC5C1D";
		var dayColor = "yellow";
		var blank = "#777777";
		
		// 360 degres == 2*Math.PI
		var circle = -2*Math.PI;
		var stroke_start = 3 * Math.PI/2
		var dayRadians = delta.days != 0 ? (circle/7)*delta.days : 2*Math.PI;
		var hrRadians = delta.hours != 0 ? (circle/24)*delta.hours : 2*Math.PI;
		var minRadians = delta.minutes != 0 ? (circle/60)*delta.minutes : 2*Math.PI;
		var secRadians = delta.seconds != 0 ? (circle/60)*delta.seconds : 2*Math.PI;
		
		// Day Stroke
		ctx.strokeStyle = dayColor;
		ctx.beginPath();
		ctx.arc(350, 350, 300, stroke_start, dayRadians + stroke_start);
		ctx.stroke();
		
		// Hours Stroke
		ctx.beginPath();
		ctx.strokeStyle = hrColor;
		ctx.arc(350, 350, 200, stroke_start, hrRadians + stroke_start);
		ctx.stroke();
		
		// Mins Stroke
		ctx.beginPath();
		ctx.strokeStyle = minColor;
		ctx.arc(350, 350, 100, stroke_start, minRadians + stroke_start);
		ctx.stroke();
		
		// Secs Stroke
		ctx.beginPath();
		ctx.strokeStyle = secColor;
		ctx.lineWidth = 49.5;
		ctx.arc(350, 350, 25, stroke_start, secRadians + stroke_start);
		ctx.stroke();
	}
	
	
	draw_page();
	setInterval(draw_page, 1000);
});