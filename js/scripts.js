// This is where you should write all JavaScript
// for your project. Remember a few things as you start!
// - Use let or const for all variables
// - Do not use jQuery - use JavaScript instead
// - Do not use onclick - use addEventListener instead
// - Run npm run test regularly to check autograding
// - You'll need to link this file to your HTML :)


//for the credit to appear after the info icon is clicked
const infoIcon = document.querySelector('.info-icon');
const creditText = document.querySelector('.credit-text');

if (infoIcon) {
	infoIcon.addEventListener('click', () => {
		creditText.classList.toggle('hidden');
	});
}


//for thought bubble changing on the homepage, gotten from GPT, prompt: how to make an img change into another after 1 second of delay
document.addEventListener("DOMContentLoaded", function () {
	const bubbleApear = document.querySelector('.thought-bubble');
	if (bubbleApear) {
		setTimeout(() => {
			bubbleApear.src = 'images/thought-bubble-2.svg';
		}, 2000);
	}
});

//make the menu container appear when the robot or the thought bubble is clicked, help from GPT
document.addEventListener("DOMContentLoaded", function () {
	const menuTriggers = document.querySelectorAll('.thought-bubble-container, .robot-click');
	const menuPopup = document.querySelector('.menu-container');

	if (menuTriggers.length > 0 && menuPopup) {
		menuTriggers.forEach(trigger => {
			trigger.addEventListener('click', () => {
				menuPopup.classList.remove('hidden');
			});
		});
	}
});

/*
// aiRecipePage — Now using Spoonacular API (requires API key), beginning GPT prompt: prompt: how can I make a chatbox on my website, where the user can input the ingredients they have, and the "robot" will respond with a ai generated recipe? With free API.
document.addEventListener("DOMContentLoaded", function () {
	const sendBtn = document.querySelector('.send-btn');
	const input = document.querySelector('.user-input');
	const chatLog = document.querySelector('.chat-log');

	input.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			sendBtn.click(); // Trigger the click event on the Send button
		}
	});


	const SPOONACULAR_API_KEY = '40af5ed6b42b45dbbc605534a9b7eb91';

	if (sendBtn && input && chatLog) {
		sendBtn.addEventListener('click', async () => {
			const userText = input.value.trim();
			if (!userText) return;

			const userMsg = document.createElement("div");
			userMsg.classList.add("user-message");
			userMsg.textContent = userText;
			chatLog.appendChild(userMsg);

			input.value = "";

			const botMsg = document.createElement("div");
			botMsg.classList.add("bot-message");
			botMsg.textContent = "Picking a recipe for you...";
			chatLog.appendChild(botMsg);

			botMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });

			try {
				const searchResponse = await fetch(
					`https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${encodeURIComponent(userText)}&number=5&type=main course&instructionsRequired=true&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`
				);

				const data = await searchResponse.json();

				if (!data.results || data.results.length === 0) {
					botMsg.textContent = "No recipes found with those ingredients.";
					return;
				}

				const meal = data.results[Math.floor(Math.random() * data.results.length)];
				const steps = meal.analyzedInstructions?.[0]?.steps.map(s => s.step) || ["No steps available."];

				botMsg.innerHTML = `
					<strong>🍽️ ${meal.title}</strong><br>
					<em>${meal.dishTypes?.join(', ') || 'Recipe'}</em><br><br>
					<strong>📋 Instructions:</strong><br>
					<div class="recipe-text">
					  ${steps.map(step => `<p>${step}</p>`).join('')}
					</div>
					${meal.sourceUrl ? `<br><a href="${meal.sourceUrl}" target="_blank">🔗 View Full Recipe</a><br><br>` : ''}
					<button class="copy-recipe-button">Copy Recipe</button>
				`;

				const copyButton = botMsg.querySelector('.copy-recipe-button');
				const recipeText = botMsg.querySelector('.recipe-text');

				copyButton.addEventListener('click', () => {
					const textToCopy = recipeText.innerText;
					navigator.clipboard.writeText(textToCopy)
						.then(() => {
							copyButton.textContent = '✓ Copied!';
							setTimeout(() => {
								copyButton.textContent = 'Copy Recipe';
							}, 2000);
						})
						.catch(err => {
							console.error('Copy failed:', err);
							copyButton.textContent = '✗ Copy Failed';
						});
				});

				// scroll again AFTER recipe is fully injected
				setTimeout(() => {
					botMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 50);
			} catch (err) {
				botMsg.textContent = "Something went wrong. Please try again.";
				console.error(err);
			}
		});
	}
});
*/

//airecipe — using Meta API, got from class
//import
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyBHpi_Q87VSBgW81H6_96qrNlTmKQYRwWE"; // 🔒 Replace with your actual key

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

const inputBox = document.querySelector(".user-input");
const sendButton = document.querySelector(".send-btn");
const chatLog = document.querySelector(".chat-log");

async function generateRecipe() {
	const userIngredients = inputBox.value.trim();
	if (!userIngredients) return;

	const prompt = `Generate a simple and fun recipe using the following ingredients: ${userIngredients}. Make it friendly and easy to follow.`;

	try {
		const result = await model.generateContent(prompt);
		const response = await result.response.text();

		chatLog.innerHTML += `
      <div class="user-message"><strong>You:</strong> ${userIngredients}</div>
      <div class="bot-message"><strong>Chef Bot:</strong> ${response}</div>
    `;
		inputBox.value = "";
		chatLog.scrollTop = chatLog.scrollHeight;
	} catch (error) {
		console.error("Error generating recipe:", error);
		chatLog.innerHTML += `<div class="bot-message error">Oops! Something went wrong.</div>`;
	}
}

sendButton?.addEventListener("click", generateRecipe);
inputBox?.addEventListener("keypress", (e) => {
	if (e.key === "Enter") generateRecipe();
});

//your mystery recipe page, GPT prompt:I want the page to pull a popular recipe from YouTube, and clicking on the "go to source" button on the bottom jumps right to the source
document.addEventListener("DOMContentLoaded", async () => {
	const outputBox = document.querySelector(".recipe-reveal-box");
	const sourceBtn = document.querySelector(".source-button a");

	const params = new URLSearchParams(window.location.search);
	const shouldGenerate = params.get('generate') === 'true';

	if (shouldGenerate && outputBox && sourceBtn) {
		const API_KEY = "AIzaSyAraWQNTPxoe4D8bv0upb9o-j-pOGNMpZ0"; // Replace with your key
		outputBox.innerHTML = `<p>Picking a viral recipe...</p>`;

		try {
			// Search using viral/trending recipe keywords
			const query = "easy recipe, viral recipe, TikTok recipe, TikTok food, chinese recipe, korean recipe, 30-minute dinner";
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query)}&order=viewCount&key=${API_KEY}`
			);

			const data = await response.json();

			if (data.items && data.items.length > 0) {
				const randomVideo = data.items[Math.floor(Math.random() * data.items.length)];
				const title = randomVideo.snippet.title;
				const channel = randomVideo.snippet.channelTitle;
				const videoId = randomVideo.id.videoId;
				const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

				outputBox.innerHTML = `
				<p>Here is a popular one!</p>
					<p><strong>🍽️ ${title}</strong></p>
					<p><em>by ${channel}</em></p>
					<iframe width="100%" height="215" src="https://www.youtube.com/embed/${videoId}"
						title="YouTube video player" frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen>
					</iframe>
				`;

				sourceBtn.href = videoUrl;
				sourceBtn.style.display = "inline-block";
			} else {
				outputBox.innerHTML = `<p>No popular recipes found right now.</p>`;
			}
		} catch (err) {
			outputBox.innerHTML = `<p>Something went wrong. Please try again.</p>`;
			console.error(err);
		}
	}
});

//for the another recipe button
document.addEventListener("DOMContentLoaded", function () {
	const retryBtn = document.querySelector('.another-recipe-button');

	if (retryBtn) {
		retryBtn.addEventListener('click', function () {
			location.reload();
		});
	}
});

//for the temperature conversion page, GPT prompt: I want the user to be able to input number in front of either C or F to get the other one.
//then added cute animation to the numbers, counting up to the converted degrees
document.addEventListener("DOMContentLoaded", function () {
	const convertBtn = document.querySelector('.convert-click img');
	const inputs = document.querySelectorAll('input[name="temperature-input"]');

	let lastChanged = null;

	function animateNumberChange(inputElement, targetValue) {
		const duration = 500;
		const start = parseFloat(inputElement.value) || 0;
		const end = parseFloat(targetValue);
		const startTime = performance.now();

		function update(currentTime) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const currentValue = start + (end - start) * progress;
			inputElement.value = currentValue.toFixed(2);

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	}

	if (convertBtn && inputs.length === 2) {
		const celsiusInput = inputs[0];
		const fahrenheitInput = inputs[1];

		// Track last changed input
		celsiusInput.addEventListener('input', () => lastChanged = 'c');
		fahrenheitInput.addEventListener('input', () => lastChanged = 'f');

		convertBtn.addEventListener('click', () => {
			const celsiusVal = celsiusInput.value.trim();
			const fahrenheitVal = fahrenheitInput.value.trim();

			if (lastChanged === 'c' && celsiusVal !== '') {
				const c = parseFloat(celsiusVal);
				const f = (c * 9 / 5) + 32;
				animateNumberChange(fahrenheitInput, f);
				if (c >= 100) animateThermometerToHot();
			} else if (lastChanged === 'f' && fahrenheitVal !== '') {
				const f = parseFloat(fahrenheitVal);
				const c = (f - 32) * 5 / 9;
				animateNumberChange(celsiusInput, c);
				if (f >= 212) animateThermometerToHot();
			}
		});
	}
});

//for the timer page, GPT: I want the users able to add the times to the timer using the buttons and click start icon; but also they can add the time to the timer when it's running. they can also pause or reset using the icon on the bottom.
document.addEventListener("DOMContentLoaded", function () {
	const timerDisplay = document.querySelector(".timer-display p");
	const add1min = document.querySelector(".timer-button-1");
	const add5min = document.querySelector(".timer-button-2");
	const add10min = document.querySelector(".timer-button-3");
	const startBtn = document.querySelector(".start-and-pause-buttons img[alt='start button']");
	const pauseBtn = document.querySelector(".start-and-pause-buttons img[alt='pause button']");
	const resetBtn = document.querySelector(".reset-button img");

	let totalSeconds = 0;
	let timerInterval = null;

	function updateDisplay() {
		const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
		const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
		const secs = String(totalSeconds % 60).padStart(2, "0");
		timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
	}

	function startTimer() {
		if (timerInterval !== null) return; // already running
		timerInterval = setInterval(() => {
			if (totalSeconds > 0) {
				totalSeconds--;
				updateDisplay();
			} else {
				clearInterval(timerInterval);
				timerInterval = null;
			}
		}, 1000);
	}

	function pauseTimer() {
		clearInterval(timerInterval);
		timerInterval = null;
	}

	function resetTimer() {
		clearInterval(timerInterval);
		timerInterval = null;
		totalSeconds = 0;
		updateDisplay();
	}

	function addTime(seconds) {
		totalSeconds += seconds;
		updateDisplay();
	}

	add1min.addEventListener("click", () => addTime(60));
	add5min.addEventListener("click", () => addTime(300));
	add10min.addEventListener("click", () => addTime(600));
	startBtn.addEventListener("click", startTimer);
	pauseBtn.addEventListener("click", pauseTimer);
	resetBtn.addEventListener("click", resetTimer);

	updateDisplay();
});


//now the volume converter page, GPT: I want the users to choose any two units and input number to get it converted to the other
document.addEventListener("DOMContentLoaded", function () {
	const unitButtons = document.querySelectorAll(".unit-btn");
	const inputs = document.querySelectorAll('input[name^="volume-input"]');
	const leftLabel = document.querySelector(".unit-label-left");
	const rightLabel = document.querySelector(".unit-label-right");
	const convertBtn = document.querySelector(".convert-volume-btn");

	if (unitButtons.length < 4 || inputs.length !== 2 || !leftLabel || !rightLabel || !convertBtn) return;

	const conversionToML = {
		milliliters: 1,
		cups: 236.588,
		tablespoons: 14.7868,
		teaspoons: 4.92892
	};

	let selectedUnits = []; // Store selected units (max 2)
	let lastChanged = "left";

	// Highlight selected unit buttons
	function updateButtonState() {
		unitButtons.forEach(btn => {
			if (selectedUnits.includes(btn.dataset.unit)) {
				btn.classList.add("selected");
			} else {
				btn.classList.remove("selected");
			}
		});
	}

	function resetConverter() {
		selectedUnits = [];
		inputs[0].value = "";
		inputs[1].value = "";
		leftLabel.textContent = "";
		rightLabel.textContent = "";
		updateButtonState();
	}

	unitButtons.forEach(button => {
		button.addEventListener("click", () => {
			const unit = button.dataset.unit;

			if (selectedUnits.includes(unit)) {
				selectedUnits = selectedUnits.filter(u => u !== unit);
			} else if (selectedUnits.length < 2) {
				selectedUnits.push(unit);
			} else {
				resetConverter();
				selectedUnits.push(unit);
			}

			updateButtonState();
			leftLabel.textContent = selectedUnits[0] || "";
			rightLabel.textContent = selectedUnits[1] || "";
		});
	});

	// Track which input was changed last
	inputs[0].addEventListener("input", () => lastChanged = "left");
	inputs[1].addEventListener("input", () => lastChanged = "right");

	function animateNumberChange(inputElement, targetValue) {
		const duration = 500;
		const start = parseFloat(inputElement.value) || 0;
		const end = parseFloat(targetValue);
		const startTime = performance.now();

		function update(currentTime) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const currentValue = start + (end - start) * progress;
			inputElement.value = currentValue.toFixed(2);

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	}

	convertBtn.addEventListener("click", () => {
		if (selectedUnits.length !== 2) {
			alert("Please select two units to convert between.");
			return;
		}

		const fromUnit = selectedUnits[lastChanged === "left" ? 0 : 1];
		const toUnit = selectedUnits[lastChanged === "left" ? 1 : 0];
		const fromInput = lastChanged === "left" ? inputs[0] : inputs[1];
		const toInput = lastChanged === "left" ? inputs[1] : inputs[0];

		const inputValue = parseFloat(fromInput.value);
		if (isNaN(inputValue)) return;

		const inML = inputValue * conversionToML[fromUnit];
		const converted = inML / conversionToML[toUnit];

		animateNumberChange(toInput, converted);
	});
});
