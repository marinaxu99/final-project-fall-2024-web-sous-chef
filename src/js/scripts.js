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

infoIcon.addEventListener('click', () => {
	creditText.classList.toggle('hidden');
});


//for thought bubble changing on the homepage, gotten from GPT, prompt: how to make an img change into another after 1 second of delay
const img = document.querySelector('.thought-bubble');
setTimeout(() => {
	img.src = 'images/thought-bubble-2.svg';
}, 2000);

//make the menu container appear when the robot is clicked
const menuTrigger = document.querySelector('.robot-click, .thought-bubble-container');
const menuPopup = document.querySelector('.menu-container');

menuTrigger.addEventListener('click', () => {
	menuPopup.classList.remove('hidden');
});