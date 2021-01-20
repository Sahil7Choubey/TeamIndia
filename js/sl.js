/*
* All Rights Reserved
* Author : teamIndia
*/


if(window.location.hash)
{
	var hash = window.location.hash.substring(1);
	if(hash == "debug")
		document.getElementById('debug').style.display = "block";
}

var teamIndia = new Object();
teamIndia.log = function(msg) {
	if(teamIndia.debug)
	{
		console.log(msg);
		document.getElementById('loganswer').textContent = msg;
	}
		
}

teamIndia.table = function(msg) {
	if(teamIndia.debug)
		console.table(msg);
}
	
var sl = TAFFY(config);
var packageMCQ = {};
teamIndia.debug = true;
teamIndia.prompt = [12, 17, 22, 27, 32, 37, 42, 47, 52, 57, 62, 67, 72, 77, 82, 87];
teamIndia.struct = [{point: 12, snake: 7, ladder: 28}, {point: 17, snake: 5, ladder: 45}, {point: 22, snake: "Start", ladder: 43}, {point: 27, snake: 15, ladder: 34}, {point: 32, snake: 30, ladder: 51}, {point: 37, snake: 3, ladder: 58}, {point: 42, snake: 38, ladder: 59}, {point: 47, snake: 36, ladder: 55}, {point: 52, snake: 48, ladder: 73}, {point: 57, snake: 35, ladder: 83}, {point: 62, snake: 60, ladder: 81}, {point: 67, snake: 46, ladder: 75}, {point: 72, snake: 35, ladder: 90}, {point: 77, snake: 43, ladder: 95}, {point: 82, snake: 63, ladder: 99}, {point: 87, snake: 68, ladder: 93}];

teamIndia.questionAttempt = 0;
teamIndia.currentpos;
teamIndia.filtered = [];
teamIndia.lastrolled = 0;
teamIndia.filteredIndex = 0;
teamIndia.setpos = function(curpos) {
	
	teamIndia.currentpos = curpos;
	console.log(curpos);
	
	var cellProp = $('td').filter(function(i,e){ return this.textContent.trim() == curpos }).get(0);
	
	var paddingX = 20;
	var paddingY = 20;
	
	var pX = ((54 * parseInt(cellProp.cellIndex)) );
	var pY = ((53.5 * parseInt(cellProp.parentNode.rowIndex)));
	
	$('#player').animate({top: pY + 'px', left: pX + 'px'});
	
	//document.getElementsByClassName('dice')[0].className = "dice";
	if(curpos == "Stop")
	{
		teamIndia.gameover();
	} else if(teamIndia.lastrolled == 6)
	{
		setTimeout(function()
		{
			$('.overlay, .sixDigitMsg').show();
			setTimeout (function(){
				$('.overlay, .sixDigitMsg').hide();
				document.getElementById('rolldicebtn').onclick = rolldice;
				document.getElementById('reddice').onclick = rolldice;
			}, 1500);
		}, 1000);
		
	} else if(teamIndia.prompt.indexOf(teamIndia.currentpos) == -1)
	{
		document.getElementById('rolldicebtn').onclick = rolldice;
		document.getElementById('reddice').onclick = rolldice;
	} else {
		setTimeout(setQuestion, 1000);
	}
}

teamIndia.gameover = function()
{
	//alert('game over');
	$('#replay').show();
	$('#msgComplete').show();
	setTimeout(function()
	{
		//playSound('well done');
		$('#msgComplete').addClass('open');
		setTimeout(function()
		{
			$('#msgComplete span img').each(function(i, e)
			{
				 $(this).show().addClass('textEffect' + (i+1));
			});
		}, 300);
	}, 10);
}

var slLevels = new Array();	
sl().each(function (r) {
	if(slLevels.indexOf(r.level) == -1)
		slLevels.push(r.level);
});

var nextscreen = function(oldscreen, newscreen) {
	document.getElementById(oldscreen).style.display = "none";
	document.getElementById(newscreen).style.display = "block";
}

var selectlevel = function(level) {
	nextscreen('screen3', 'screen4');
	packageMCQ.level = level;
	
	var slThemes = [];
	sl({level: level}).each(function (r) {
		if(slThemes.indexOf(r.theme) == -1)
			slThemes.push(r.theme);
	});

	teamIndia.log(slThemes);
	var themeHTML = "";
	for(var i=0; i<slThemes.length; i++)
		themeHTML += '<li onclick="selecttheme(\'' + slThemes[i] + '\')">' + slThemes[i] + '</li>';
	document.getElementById('selectTheme').innerHTML = themeHTML;
}

var selecttheme = function(theme) {
	nextscreen("screen4", "screen5");
	packageMCQ.theme = theme;
	
	teamIndia.filtered = new Array();
	sl({level: packageMCQ.level, theme: packageMCQ.theme}).each(function(r)
	{
		teamIndia.filtered.push(r);
	});
	
	teamIndia.table(teamIndia.filtered);
	
	shuffle(teamIndia.filtered);
	teamIndia.setpos("Start");
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


var rolldice = function()
{
	document.getElementById('rolldicebtn').onclick = "";	//remove click from the roll btn
	document.getElementById('reddice').onclick = "";	//remove click from the roll btn
	
	var randomNum;
	
	randomNum = Math.floor(Math.random() * 6) + 1;
	if(teamIndia.questionAttempt < 10)
	{
		parentloop: for(var i=0; i<teamIndia.prompt.length; i++)
		{
			for(var j=1; j<6; j++)
			{
				//console.log('current pos: ' + (teamIndia.currentpos+j) + '; prompt: ' + teamIndia.prompt[i]);
				if((teamIndia.currentpos+j) == teamIndia.prompt[i])
				{
					console.log('captured at ' + j);
					randomNum = j;
					break parentloop;
				}
			}
		}
	}
		
	if(window.toroll)
	{
		randomNum = parseInt(window.toroll);
	}
	teamIndia.log('dice rolled: ' + randomNum);
	document.getElementsByClassName('dice')[0].className = "dice digit" + randomNum;
	setTimeout(function()
	{
		document.getElementsByClassName('dice')[0].className += "static";
		if(teamIndia.currentpos == "Start") teamIndia.currentpos = 1;
		if(teamIndia.currentpos == "Stop") teamIndia.currentpos = 100;
		teamIndia.currentpos += randomNum;
		teamIndia.lastrolled = randomNum;
		var tempholder;
		
		if(teamIndia.currentpos == 0)		tempholder = "Start";
		else if(teamIndia.currentpos >= 100)	tempholder = "Stop";
		else 							tempholder = teamIndia.currentpos;

		
		teamIndia.setpos(tempholder);	
		
	}, 1200);
}


var levelHTML = "";
for(var i=0; i<slLevels.length; i++)
	levelHTML += '<li onclick="selectlevel(\'' + (i+1) + '\')">Level ' + slLevels[i] + '</li>';
document.getElementById('selectLevel').innerHTML = levelHTML;


var setQuestion = function()
{
	teamIndia.questionAttempt++;
	
	//reshuffle filtered questions before the question repeats
	if(teamIndia.filteredIndex >= teamIndia.filtered.length)
	{
		shuffle(teamIndia.filtered);
		teamIndia.filteredIndex = 0;
		teamIndia.table(teamIndia.filtered);
	}
	
	//insert information for q/a
	document.getElementById('questionTitleTxt').textContent = teamIndia.filtered[teamIndia.filteredIndex].question;
	
	for(var i=0; i<4; i++)
	{
		document.querySelectorAll('#userAnswer ul li')[i].textContent = teamIndia.filtered[teamIndia.filteredIndex].answers[i];
		if(i  == (parseInt(teamIndia.filtered[teamIndia.filteredIndex].correct) - 1))
		{
			document.querySelectorAll('#userAnswer ul li')[i].id = "correctans";
			teamIndia.log('Ans: ' + teamIndia.filtered[teamIndia.filteredIndex].answers[i]);
		}
	}
	
	//show question viewer
	document.getElementById('questionViewer').style.bottom = "0px";
	teamIndia.filteredIndex++;
}

var submitAnswer = function()
{
	//need to update a popup here -- validation for not selecting an answer
	if(document.getElementsByClassName('active').length < 1)
	{
		$('.overlay, .errorMsg').show();
		setTimeout (function(){
			$('.overlay, .errorMsg').hide();
		}, 3500);
		//alert("Please select an answer.");
		return false;
	}

	var newpos;
	for(var i=0; i<teamIndia.struct.length; i++)
	{
		if(teamIndia.currentpos == teamIndia.struct[i].point)
		{
			newpos = teamIndia.struct[i];
			break;
		}
	}
	
	var attempt = (document.getElementsByClassName('active')[0].id == "correctans") ? true : false;
	
	//hide question viewer
	document.getElementById('questionViewer').style.bottom = "";
	
	setTimeout(function()
	{
		teamIndia.setpos((attempt == true) ? newpos.ladder : newpos.snake);
		document.getElementById((attempt == true) ? "correctsound" : "incorrectsound").play();
		document.getElementsByClassName('active')[0].className = "";
	}, 1000);
	
	
}

var setactiveans = function(ele)
{
	if(document.querySelector('.active'))
		document.querySelector('.active').className = "";
	ele.className = "active";
}

function playagain() {
    location.href = document.URL;
}


var setfixroll = function(toroll)
{
	window.toroll = toroll;
}

var clearfixroll = function()
{
	window.toroll = "";
}

var preload = ["img/digit1.png",
    "img/digit2.png",
    "img/digit3.png",
    "img/digit4.png",
    "img/digit5.png",
    "img/digit6.png",
    "img/grass.png",
    "img/snake1.png",
    "img/snake2.png",
    "img/snakes/ludoSnake1.png",
    "img/snakes/ludoSnake2.png",
    "img/snakes/ludoSnake3.png",
    "img/snakes/ludoSnake4.png",
    "img/snakes/ludoSnake5.png",
    "img/snakes/ludoSnake6.png",
    "img/snakes/ludoSnake7.png",
    "img/snakes/ludoSnake8.png",
    "img/snakes/ludoSnake8.png",
    "img/snakes/ludoSnake9.png",
    "img/snakes/ludoSnake10.png",
    "img/snakes/ludoSnake11.png",
    "img/snakes/ludoSnake12.png",
    "img/snakes/ludoSnake13.png",
    "img/snakes/ludoSnake14.png",
    "img/snakes/ludoSnake15.png",
    "img/snakes/ludoSnake16.png"];
	
var promises = [];
for (var i = 0; i < preload.length; i++) {
    (function(url, promise) {
        var img = new Image();
        img.onload = function() {
          promise.resolve();
        };
        img.src = url;
    })(preload[i], promises[i] = $.Deferred());
}

$(document).ready(function() {

	$.when.apply($, promises).done(function() {
		$('body').addClass('done');
	});



});