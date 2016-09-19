if(localStorage.getItem("str") == null ) {
	var streamers = ["esl_sc2", "freecodecamp", "ogamingsc2"];
	localStorage.setItem("str", streamers);
	streamers = localStorage.getItem("str").split(",");
	console.log(streamers);
} else if(!jQuery.isEmptyObject(localStorage.getItem("str"))) {
	var streamers = localStorage.getItem("str").split(",");
}

function removeStreamer(this_close) {
	var streamers = localStorage.getItem("str");
	streamers = streamers.split(",");
	streamers.splice(streamers.indexOf($(this_close).siblings(".streamer").children(".left-side").children(".nick")[0].textContent.toLowerCase()), 1);
	localStorage.setItem("str", streamers);
	$(this_close).closest('li').remove();
	if(jQuery.isEmptyObject(localStorage.getItem("str"))) {
		showModal(1);
	}
}

function updateStreamersList(nick_value) {
	if(jQuery.isEmptyObject(localStorage.getItem("str"))) {
		localStorage.setItem("str", nick_value);	
	} else {
		var addToArray = localStorage.getItem("str").split(",");
		addToArray.push(nick_value);
		localStorage.setItem("str", addToArray);
		console.log(localStorage.getItem("str"));
	}
}

function getStreamerData(nick) {
	$.ajax({
 		type: 'GET',
 		url: 'https://api.twitch.tv/kraken/streams/'+nick,
 		headers: {
   			'Client-ID': 'sh853vhazveefca5gd35njc6ehn4hq7'
 		},
		success: function(data) {
			$(".preloader .preimage").fadeOut();
			$(".preloader").delay(350).fadeOut("slow");
			var avatar, nick, game, status, activeStatus;
			if(data.stream == null) {
				$.ajax({
					url: data._links.channel, 
					headers: {
						'Client-ID': 'sh853vhazveefca5gd35njc6ehn4hq7'
 					},
					success: function(data) {
						if(data.logo) { avatar = "<img src=\""+data.logo+"\" alt=\"Avatar\">"; } 
						else { avatar = "<img src=\"images/Twitch-Icon-small.png\" alt=\"Avatar\">"; }
						nick = data.display_name;
						game = "Offline";
						status = "";
						game = game + status;
						activeStatus = "streamerOffline";
						makeLi(avatar, nick, game, activeStatus);
					}
				})
			} 
			else {
				if(data.stream.channel.logo) { avatar = "<img src=\""+data.stream.channel.logo+"\" alt=\"Avatar\">"; } 
				else { avatar = "<img src=\"images/Twitch-Icon-small.png\" alt=\"Avatar\">"; }
				nick = data.stream.channel.display_name;
				game = data.stream.channel.game;
				status = ": "+data.stream.channel.status;
				game = "<a target=\"_blank\" href=\""+data.stream.channel.url+"\">"+game+status+"</a>";
				activeStatus = "streamerOnline";
				makeLi(avatar, nick, game, activeStatus);

			}
		},
		error: function(data) {
			alert("ERROR!\nNot found "+nick+".\nStreamers does not exist or account is closed or banned.");
			$(".preloader .preimage").fadeOut();
			$(".preloader").delay(500).fadeOut("slow");
			var streamers = localStorage.getItem("str");
			streamers = streamers.split(",");
			streamers.splice(streamers.indexOf(nick), 1)
			localStorage.setItem("str", streamers);
		}
	})
}

function getData() {
	if(streamers) {
		streamers.forEach(function (nick) {
			getStreamerData(nick);
		})
	}
}

function makeLi(avatar, nick, game, activeStatus) {
	var streamersList = $(".streamersList");
	var $liElement = $('<li></li>').addClass("ui-state-default").addClass(activeStatus);
	var $streamerContainer = $('<div>').addClass("streamer");
	var $leftSide = $('<div>').addClass("left-side").addClass("text-center");
	var $rightSide = $('<div>').addClass("right-side").addClass("text-center");
	var $avatar = $('<div>').addClass("avatar").html(avatar);
	var $nick = $('<div>').addClass("nick").text(nick);
	var $game = $('<div>').addClass("game").html(game);
	var $close = $('<div>').addClass("close").html("<i class=\"fa fa-times\" aria-hidden=\"true\"></i>").attr("onclick", "removeStreamer(this)");
	$leftSide.append($avatar).append($nick);
	$rightSide.append($game); 
	$streamerContainer.append($leftSide).append($rightSide);
	$liElement.append($close).append($streamerContainer);
	$liElement.appendTo(streamersList);
}

function showModal(modalNumber) {
	$(".n"+modalNumber).css("display", "block").animate({
		'opacity': '1.'
	}, 400);
	$(".modal-content").animate({
		'top': '100px',
		'opacity': '1.'
	}, 400, 'swing');
}

var preImage,preLoader;

function addStreamerAction() {
	if($(".input input").val() == "") {
		alert("You have to define Twitch Streamer's nick.");	
	} else if(localStorage.getItem("str").split(",").indexOf($(".input input").val().toLowerCase()) !== -1) {
		alert("This streamer is already on your list.");	
	} else {
		preImage = $('<div>').addClass("preimage");
		preLoader = $('<div>').addClass("preloader");
		preLoader.append(preImage);
		preLoader.appendTo($('body'));
		preLoader.animate({"opacity": "1."}, "slow");
		console.log("przekazuje nick do funkcji dodawania"+$(".input input").val().toLowerCase());
		updateStreamersList($(".input input").val().toLowerCase());
		getStreamerData($(".input input").val());
	}	
}
	
$(document).ready(function() {

$(window).load(function() {
	$(".preloader0 .preimage0").fadeOut(); 
	$(".preloader0").delay(250).fadeOut("medium");
		
	if(jQuery.isEmptyObject(localStorage.getItem("str"))) {
		showModal(1);
	} else {
		getData();
	}
})
	
$( "#sortable" ).sortable();
$( "#sortable" ).disableSelection();
	
$("#myBtn").click(function(e) { showModal(1); });
$("#visibility").click(function(e) { showModal(2); });
$(".learnMore").click(function(e) {	showModal(3); });
	
$(window).click(function(e) {
	if (e.target == $(".n1")[0] || e.target == $(".n2")[0] || e.target == $(".n3")[0]) {
		$(".modal").animate({
			'opacity': '0.0'
		}, {
			duration: 400,
			complete: function(){
				$(".modal").css("display", "none")	
			},
			easing: 'swing'
		});
		$(".modal-content").animate({
			'top': '-300px',
			'opacity': '0.0'
		}, 400);
	}
});
	
$(".closeModal").click(function() {
	$(".modal").animate({
		'opacity': '0.0'
	}, {
		duration: 400,
		complete: function(){
			$(".modal").css("display", "none")	
		},
		easing: 'swing'
	});
	$(".modal-content").animate({
		'top': '-300px',
		'opacity': '0.0'
	}, 400);	
})
	
$(".input input").click(function(event) {
	event.stopPropagation();
	$(".input .lbl").css("font-size", "10px");
	$(".input .lbl").addClass("labelActive");
})
	
$(".modal").click(function()  {
	if($(".input input").val() == "") {
		$(".input .lbl").css("font-size", "14px");
		$(".input .lbl").removeClass("labelActive");
	}
})
	
$(".modal-body .addStreamer").click(function(event) {
	event.stopPropagation();
	addStreamerAction();
})
	
$("body").keypress(function(e) {
	e.stopPropagation();
	if(e.keyCode === 13) {
		if( $("#myModal").css('display') == 'block') {
			addStreamerAction();
		}
	} 
});
	
$(".onlineActions").click(function() {
	$(".onlineActions").text($(".onlineActions").text() == 'HIDE online' ? 'SHOW online' : 'HIDE online');
	$(".streamersList .streamerOnline").toggle("fast");
})
	
$(".offlineActions").click(function() {
	$(".offlineActions").text($(".offlineActions").text() == 'HIDE offline' ? 'SHOW offline' : 'HIDE offline');
	$(".streamersList .streamerOffline").toggle("fast");
})

});