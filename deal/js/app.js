$(document).ready(function(){
	//console.log("Howdy");
	var doors = $(".door");
	
	doors.click(function(){
		$(this).toggleClass("spin");
		doors.not(this).hide();
	});
	
	doors.each(function(){
		this.addEventListener("transitionend", transitionEnded, true);
	});
	
	function transitionEnded(event){
		//console.log(event);
		var target = $(event.target);
		var height_percent = Math.round(target.height() / target.parent().height() * 100)/100;
		var top_percent = target.position().top / window.innerHeight;
		console.log(top_percent);
		
		// When the door gets to full screen size
		
		if(event.propertyName == "width" && height_percent == 1){
			target.addClass("open");
			var prize = $("<div class='prize'>");
			var imgString = "/media/saturdayplace/deal/img/" + target.attr("id") + ".jpg";
			var img = $("<img>").attr("src", imgString);
			prize.append(img);
			$("#wrapper").append(prize);
		}
		
		// When the door finishes opening
		if(event.propertyName == "top" && top_percent == -1){
			function close(){
				target.removeClass("open");
			}
			setTimeout(close, 3000);
		}
		
		// When the door finishes closing
		if(event.propertyName == "top" && target.position().top == 0){
			target.toggleClass("spin");
			$(".prize").remove();
		}
		
		// When the door gets back to original size
		if(event.propertyName == "width" && height_percent == 0.50){
			//console.log("orig size")
			doors.not(target).show();
			target.unbind("click");
			target.addClass("done");
		}
	}
});