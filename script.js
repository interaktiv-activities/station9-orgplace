// The following variables below are all the sound variables and mute/unmute fucntions 
let backgroundMusic = new Audio();
backgroundMusic.src = "sounds/bg-music.mp3";
let backgroundMusicStatus = 0;
let backgroundMusicInterval;

function playBackgroundMusic() {
    backgroundMusic.play();
    if (backgroundMusicStatus == 1) {
        backgroundMusic.volume = 0;
    } else {
        backgroundMusic.volume = 0.5;
    }
}

function muteBackgroundMusic() {
    const muteBtnImg = document.getElementById("mute-btn-img");
    if (backgroundMusicStatus == 0) {
        muteBtnImg.setAttribute("src", "assets/header/mute.png");
        backgroundMusic.volume = 0;
        backgroundMusicStatus++;
    } else {
        muteBtnImg.setAttribute("src", "assets/header/unmute.png");
        backgroundMusic.volume = 0.5;
        backgroundMusicStatus--;
    }
}

document.getElementById("mute-header-btn").addEventListener("click", muteBackgroundMusic)
//END HERE

// The following lines of codes are for the swipe card to start
const cardSlot = document.querySelector('.card-slot');
const swipeCard = document.getElementById('swipe-card');
let startX = 0;
let currentX = 0;
let isSwiping = false;
let cardSlotWidth = cardSlot.offsetWidth; 

// Event Listeners for Swipe Actions
swipeCard.addEventListener('mousedown', startSwipe);
swipeCard.addEventListener('touchstart', startSwipe);
swipeCard.addEventListener('mousemove', swipeMove);
swipeCard.addEventListener('touchmove', swipeMove);
swipeCard.addEventListener('mouseup', endSwipe);
swipeCard.addEventListener('touchend', endSwipe);
window.addEventListener('resize', updateCardSlotWidth);

// Swipe Functions
function updateCardSlotWidth() {
    cardSlotWidth = cardSlot.offsetWidth;
}

function startSwipe(event) {
    isSwiping = true;
    startX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
}

function swipeMove(event) {
    if (!isSwiping) return;

    currentX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    const deltaX = currentX - startX;

    if (deltaX > 1) {  // Swiping to the right
        swipeCard.style.transform = `translateX(${deltaX}px)`;
    }

    // Check if swipe reached the threshold
    if (Math.abs(deltaX) > (cardSlotWidth/1.3) && isSwiping == true) {
        isSwiping = false;
        startCardInterval();
    }
}

function endSwipe() {
    isSwiping = false;
    swipeCard.style.transform = 'translateX(0)';
}
//END HERE

// The following variables below are all the timer fucntions 
let timer = 15;
let timeRemaining = timer;

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to start the countdown
function startCountdown() {
    const countdownInterval = setInterval(() => {
        timeRemaining--;

        if (timeRemaining < 0) {
            clearInterval(countdownInterval);
            if (roundIndex <= 8)
            {
                roundIndex++
                changeDisplay()
                startCountdown()
            }
            else
            {
                endGame()
            }
            return;
        }

        updateTimerDisplay();
    }, 1000);
}
//END HERE

// The following lines of codes include all of the functions and variables needed for you to transition from the start screen to the game board
let startScreenTimer

function startCardInterval() {
    startScreenTimer = setInterval(startGame, 500);
    startCountdown()
    changeDisplay()
}

// Add the function below to your start game function
function hideStartScreen(){
    document.getElementById("start-screen").style.display = "none"
    playBackgroundMusic()
    backgroundMusicInterval = setInterval(playBackgroundMusic, 120000)
    clearInterval(startScreenTimer)
}
// END HERE

// The following lines of codes hides all the header and gameboard elements, and shows the end message
function endGame(){
    scoreCounter
    document.getElementById("game-board").style.display = "none"
    document.getElementById("header").style.display = "none"
    clearInterval(backgroundMusicInterval)
    backgroundMusic.volume = 0
    if (scoreCounter >= 1){
        document.getElementById("pass-end-screen").style.display = "flex"
    } else {
        document.getElementById("fail-end-screen").style.display = "flex"
    }
}
// END HERE

// QUESTION BANK
//Initial References
document.addEventListener('DOMContentLoaded', function() {
    let currentQuestion = 1;
    const totalQuestions = 5; // Total number of questions
    let zIndexCounter = 1000; // Initialize z-index counter for stacking

    const dragItems = document.querySelectorAll('.draggable');
    const dropAreas = document.querySelectorAll('.droppable');

    // Set up drag and drop event listeners
    dragItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    dropAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('drop', handleDrop);
    });

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('dragged');

        // Store the original position
        const rect = e.target.getBoundingClientRect();
        e.target.dataset.originalTop = rect.top + window.scrollY;
        e.target.dataset.originalLeft = rect.left + window.scrollX;
        e.target.dataset.originalContainer = e.target.parentElement.id; // Store original container ID

        // Set z-index to make the dragged item appear on top
        e.target.style.zIndex = zIndexCounter++;
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (e.target.classList.contains('droppable')) {
            e.target.classList.add('droppable-hover');
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        const droppableElement = e.target.closest('.droppable');
        
        if (droppableElement) {
            e.target.classList.remove('droppable-hover');

            const draggableId = e.dataTransfer.getData('text/plain');
            const draggableElement = document.getElementById(draggableId);

            if (droppableElement.contains(draggableElement)) {
                // Draggable element is already inside the droppable element
                return; // Do nothing if it is already there
            } else {
                // Check if there are other draggable elements inside the droppable area
                const existingItems = Array.from(droppableElement.children).filter(child => child.classList.contains('draggable'));
                
                if (existingItems.length > 0) {
                    // Reset position of the draggable element if there are already items inside
                    resetPosition(draggableElement);
                } else {
                    // Append the draggable element to the droppable area
                    droppableElement.appendChild(draggableElement);
                    draggableElement.classList.remove('dragged');
                    draggableElement.style.position = ''; // Reset any inline styles
                    draggableElement.style.top = '';
                    draggableElement.style.left = '';
                    draggableElement.style.zIndex = ''; // Reset z-index after drop

                    // Store the new container
                    draggableElement.dataset.originalContainer = droppableElement.id;
                }
            }
        } else {
            // If dropped outside of a droppable area, reset the element
            const draggableId = e.dataTransfer.getData('text/plain');
            const draggableElement = document.getElementById(draggableId);
            resetPosition(draggableElement);
        }
    }

    function resetPosition(element) {
        // Reset the draggable element's position to its original place
        element.style.position = 'absolute';
        element.style.top = element.dataset.originalTop + 'px';
        element.style.left = element.dataset.originalLeft + 'px';

        // Reposition the element to its original container
        const originalContainerId = element.dataset.originalContainer;
        const originalContainer = document.getElementById(originalContainerId);
        if (originalContainer) {
            originalContainer.appendChild(element);
        }

        element.classList.remove('dragged');
    }

    function handleDragEnd(e) {
        const element = e.target;

        // Check if the element is still in its original place
        const parentElement = element.parentElement;
        if (!parentElement.classList.contains('droppable')) {
            // Reset position if not dropped in a droppable area
            resetPosition(element);
        }
    }

    function checkAnswer() {
        let allCorrect = true; // Assume all answers are correct initially

        for (let i = 1; i <= currentQuestion; i++) {
            const answer = document.getElementById(`A${i}`);
            const correct = Array.from(answer.children).every(child => {
                if (child.classList.contains('droppable')) {
                    const draggableId = child.getAttribute('data-draggable-id');
                    const draggableElement = document.getElementById(draggableId);

                    if (!draggableElement) return false;

                    return draggableElement.parentElement === child;
                }
                return true;
            });

            if (!correct) {
                allCorrect = false;
                break; // Exit loop if any question is incorrect
            }
        }

        if (allCorrect) {
            // Hide current question, answer, and paragraph
            document.getElementById(`Q${currentQuestion}`).style.display = 'none';
            document.getElementById(`A${currentQuestion}`).style.display = 'none';
            document.getElementById(`P${currentQuestion}`).style.display = 'none';

            // Move to the next question and answer
            currentQuestion++;
            if (currentQuestion <= totalQuestions) {
                document.getElementById(`Q${currentQuestion}`).style.display = 'block';
                document.getElementById(`A${currentQuestion}`).style.display = 'block';
                document.getElementById(`P${currentQuestion}`).style.display = 'block';
            } else {
                // All questions are correct
                document.getElementById('pass-end-screen').style.display = 'flex';
            }
        } else {
            // Display the fail overlay if any question is incorrect
            document.getElementById('fail-end-screen').style.display = 'flex';
        }
    }

    // Set up the submit button
    document.getElementById('submit-button').addEventListener('click', checkAnswer);

    function initializeGame() {
        // Hide all questions, answers, and paragraphs
        for (let i = 1; i <= totalQuestions; i++) {
            const question = document.getElementById(`Q${i}`);
            const answer = document.getElementById(`A${i}`);
            const paragraph = document.getElementById(`P${i}`);

            if (question) question.style.display = 'none';
            if (answer) answer.style.display = 'none';
            if (paragraph) paragraph.style.display = 'none';
        }

        // Show the first question, answer, and paragraph
        document.getElementById(`Q${currentQuestion}`).style.display = 'block';
        document.getElementById(`A${currentQuestion}`).style.display = 'block';
        document.getElementById(`P${currentQuestion}`).style.display = 'block';
    }

    // Initialize game with the first question, answer, and paragraph visible
    initializeGame();
});

// GAME FUNCTIONS PROPER

function startGame(){
    hideStartScreen()
}

