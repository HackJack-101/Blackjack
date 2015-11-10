var deck = [];
var bankCards = [];
var playerCards = [];
var cardPath = "./assets/cards/";
var bankMoney = 100;
var playerMoney = 100;
var bet = 0;

var initCards = function ()
{
	var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'ace', 'jack', 'queen', 'king'];
	var colors = ['diamonds', 'hearts', 'spades', 'clubs'];
	for (var i = 0; i < values.length; i++)
	{
		for (var j = 0; j < colors.length; j++)
		{
			var value = 0;
			if (parseInt(values[i]) > 0)
				value = parseInt(values[i]);
			else
			{
				switch (values[i])
				{
					case 'ace':
						value = 1;
						break;
					case 'jack':
					case 'queen':
					case 'king':
						value = 10;
						break;
					default:
						break;
				}
			}

			var newCard = {
				name: values[i] + "_of_" + colors[j] + ".svg",
				value: value
			};
			deck.push(newCard);
		}
	}
	deck = shuffle(deck);
};

var shuffle = function (o) {
	for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
		;
	return o;
};

var giveACardToBank = function ()
{
	var bankBoard = document.getElementById('bankCards');
	if (deck.length > 0)
	{
		var newCard = deck.pop();
		var newElement = document.createElement("img");
		newElement.setAttribute("src", cardPath + newCard.name);
		bankBoard.appendChild(newElement);
		bankCards.push(newCard.value);
	}
	computeBankScore();
};

var giveACardToPlayer = function ()
{
	var playerBoard = document.getElementById('playerCards');
	if (deck.length > 0)
	{
		var newCard = deck.pop();
		var newElement = document.createElement("img");
		newElement.setAttribute("src", cardPath + newCard.name);
		playerBoard.appendChild(newElement);
		playerCards.push(newCard.value);
	}
	computePlayerScore();
};

var computeBankScore = function ()
{
	var bankScore = document.getElementById('bankScore');
	var score = 0;
	for (var i = 0; i < bankCards.length; i++)
		score += bankCards[i];
	if (score <= 11)
		if (bankCards.indexOf(1) > -1)
			score += 10;
	bankScore.innerText = score;
	return score;
};

var computePlayerScore = function ()
{
	var playerScore = document.getElementById('playerScore');
	var score = 0;
	for (var i = 0; i < playerCards.length; i++)
		score += playerCards[i];
	if (score <= 11)
		if (playerCards.indexOf(1) > -1)
			score += 10;
	playerScore.innerText = score;
	if (score > 21)
		display("loser");
	return score;
};

var computeBankMoney = function ()
{
	var bankMoneyElement = document.getElementById('bankMoney');
	bankMoneyElement.innerText = bankMoney;
	return bankMoney;
};

var computePlayerMoney = function ()
{
	var playerMoneyElement = document.getElementById('playerMoney');
	playerMoneyElement.innerText = playerMoney;
	return playerMoney;
};

var normalDisplay = function ()
{
	document.getElementById('loserDisplay').style.display = "none";
	document.getElementById('winnerDisplay').style.display = "none";
	document.getElementById('equalityDisplay').style.display = "none";
};

var display = function (type)
{
	document.getElementById(type + 'Display').style.display = "block";
	setTimeout(normalDisplay, 1000);
};

var playerWins = function ()
{
	playerMoney += bet;
	bankMoney -= bet;
	display("winner");
	newGame();
};
var bankWins = function ()
{
	playerMoney -= bet;
	bankMoney += bet;
	display("loser");
	newGame();
};
var equality = function ()
{
	display("equality");
	newGame();
};

var stop = function ()
{
	var bankScore = computeBankScore();
	var playerScore = computePlayerScore();
	if (bankScore > playerScore)
	{
		if (bankScore > 21)
		{
			if (playerScore > 21)
				equality();
			else
				playerWins();
		} else
			bankWins();
	} else if (bankScore < playerScore)
	{
		if (playerScore > 21)
		{
			if (bankScore > 21)
				equality();
			else
				bankWins();
		} else
			playerWins();
	} else
	{
		if (bankScore == 21)
		{
			if (bankCards.length == 2)
				bankWins();
			else if (playerCards.length == 2)
				playerWins();
			else
				equality();
		} else
			equality();
	}
};

var setBet = function ()
{
	bet = parseInt(prompt("Votre mise", "10"));
};

var removeChildren = function (parent)
{
	var myNode = document.getElementById(parent);
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
};

var resetBoard = function ()
{
	removeChildren("bankCards");
	removeChildren("playerCards");
	deck = [];
	bankCards = [];
	playerCards = [];
	computeBankScore();
	computePlayerScore();
	console.log(computeBankMoney());
	console.log(computePlayerMoney());
};

var newGame = function ()
{
	resetBoard();
	setBet();
	initCards();
	giveACardToBank();
	giveACardToBank();
};

var main = function ()
{
	document.getElementById('newCard').addEventListener('click', giveACardToPlayer);
	document.getElementById('stopGame').addEventListener('click', stop);
	newGame();
};

window.addEventListener('load', main);