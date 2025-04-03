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