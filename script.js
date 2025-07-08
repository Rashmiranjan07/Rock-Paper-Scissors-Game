
        document.addEventListener('DOMContentLoaded', () => {
            // Game state
            const gameState = {
                robot: {
                    playerScore: 0,
                    robotScore: 0,
                    rounds: 0,
                    playerChoice: null,
                    robotChoice: null
                },
                friend: {
                    player1Score: 0,
                    player2Score: 0,
                    rounds: 0,
                    player1Choice: null,
                    player2Choice: null,
                    currentPlayer: 1
                }
            };

            // Mode selection
            const modeBtns = document.querySelectorAll('.mode-btn');
            const gameSections = document.querySelectorAll('.game-section');

            modeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    modeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    gameSections.forEach(section => section.classList.remove('active'));
                    document.getElementById(`${btn.dataset.mode}-game`).classList.add('active');
                    
                    // Create particles on mode change
                    createParticles(50);
                });
            });

            // VS Robot Game Logic
            const robotChoices = document.querySelectorAll('#robot-game .choice');
            const playerSelection = document.getElementById('player-selection');
            const robotSelection = document.getElementById('robot-selection');
            const resultDisplay = document.getElementById('result');
            const playerScoreDisplay = document.getElementById('player-score');
            const robotScoreDisplay = document.getElementById('robot-score');
            const resetRobotBtn = document.getElementById('reset-robot');

            robotChoices.forEach(choice => {
                choice.addEventListener('click', () => {
                    if (gameState.robot.playerChoice) return;
                    
                    const playerChoice = choice.dataset.choice;
                    gameState.robot.playerChoice = playerChoice;
                    
                    // Animate player selection
                    animateSelection(choice, playerSelection, playerChoice);
                    
                    setTimeout(() => {
                        // Robot makes random choice
                        const choices = ['rock', 'paper', 'scissors'];
                        const robotChoice = choices[Math.floor(Math.random() * 3)];
                        gameState.robot.robotChoice = robotChoice;
                        
                        // Find the corresponding choice element for animation
                        const robotChoiceEl = Array.from(robotChoices).find(el => el.dataset.choice === robotChoice);
                        
                        // Animate robot selection
                        animateSelection(robotChoiceEl, robotSelection, robotChoice);
                        
                        setTimeout(() => {
                            // Determine winner
                            const result = determineWinner(playerChoice, robotChoice);
                            displayResult(result, 'robot');
                            
                            // Show celebration if player wins
                            if (result === 'player') {
                                celebrate();
                            }
                        }, 1000);
                    }, 1000);
                });
            });

            // VS Friend Game Logic
            const friendChoices = document.querySelectorAll('#friend-game .choice');
            const player1Selection = document.getElementById('player1-selection');
            const player2Selection = document.getElementById('player2-selection');
            const friendResultDisplay = document.getElementById('friend-result');
            const player1ScoreDisplay = document.getElementById('player1-score');
            const player2ScoreDisplay = document.getElementById('player2-score');
            const resetFriendBtn = document.getElementById('reset-friend');

            friendChoices.forEach(choice => {
                choice.addEventListener('click', () => {
                    if (gameState.friend.currentPlayer === 1) {
                        if (gameState.friend.player1Choice) return;
                        
                        const playerChoice = choice.dataset.choice;
                        gameState.friend.player1Choice = playerChoice;
                        
                        animateSelection(choice, player1Selection, playerChoice);
                        gameState.friend.currentPlayer = 2;
                        
                        // Inform player 2 to make choice
                        friendResultDisplay.textContent = "Player 2, make your choice!";
                    } else {
                        if (gameState.friend.player2Choice) return;
                        
                        const playerChoice = choice.dataset.choice;
                        gameState.friend.player2Choice = playerChoice;
                        
                        animateSelection(choice, player2Selection, playerChoice);
                        
                        setTimeout(() => {
                            const result = determineWinner(
                                gameState.friend.player1Choice, 
                                gameState.friend.player2Choice,
                                'friend'
                            );
                            displayResult(result, 'friend');
                            
                            // Reset for next round
                            setTimeout(() => {
                                gameState.friend.player1Choice = null;
                                gameState.friend.player2Choice = null;
                                gameState.friend.currentPlayer = 1;
                                document.getElementById('player1-selection').innerHTML = '<i class="fas fa-user"></i>';
                                document.getElementById('player2-selection').innerHTML = '<i class="fas fa-user"></i>';
                                friendResultDisplay.textContent = "Player 1, choose again!";
                                friendResultDisplay.classList.remove('active');
                            }, 2500);
                        }, 1000);
                    }
                });
            });

            // Reset buttons
            resetRobotBtn.addEventListener('click', () => resetGame('robot'));
            resetFriendBtn.addEventListener('click', () => resetGame('friend'));

            // Helper functions
            function animateSelection(choiceEl, selectionEl, choice) {
                // Add bounce animation to selected choice
                choiceEl.classList.add('bounce-animation');
                
                // Remove animation after a delay
                setTimeout(() => {
                    choiceEl.classList.remove('bounce-animation');
                }, 500);
                
                // Update selection display
                setTimeout(() => {
                    selectionEl.innerHTML = `<i class="fas fa-hand-${choice}"></i>`;
                    selectionEl.style.backgroundColor = getChoiceColor(choice);
                }, 300);
            }

            function getChoiceColor(choice) {
                switch(choice) {
                    case 'rock': return '#a29bfe';
                    case 'paper': return '#74b9ff';
                    case 'scissors': return '#ffeaa7';
                    default: return '#fff';
                }
            }

            function determineWinner(a, b, mode = 'robot') {
                gameState[mode].rounds++;
                if (mode === 'robot') {
                    document.getElementById('robot-round').textContent = gameState.robot.rounds;
                }
                
                if (a === b) {
                    return 'draw';
                }
                
                if (
                    (a === 'rock' && b === 'scissors') ||
                    (a === 'scissors' && b === 'paper') ||
                    (a === 'paper' && b === 'rock')
                ) {
                    if (mode === 'robot') {
                        gameState.robot.playerScore++;
                    } else {
                        gameState.friend.player1Score++;
                    }
                    return mode === 'robot' ? 'player' : 'player1';
                } else {
                    if (mode === 'robot') {
                        gameState.robot.robotScore++;
                    } else {
                        gameState.friend.player2Score++;
                    }
                    return mode === 'robot' ? 'robot' : 'player2';
                }
            }

            function autoResetRound(mode) {
                setTimeout(() => {
                    if (mode === 'robot') {
                        gameState.robot.playerChoice = null;
                        gameState.robot.robotChoice = null;
                        document.getElementById('player-selection').innerHTML = '<i class="fas fa-question"></i>';
                        document.getElementById('robot-selection').innerHTML = '<i class="fas fa-robot"></i>';
                        document.getElementById('result').textContent = '';
                        document.getElementById('result').classList.remove('winner');
                    } else {
                        gameState.friend.player1Choice = null;
                        gameState.friend.player2Choice = null;
                        gameState.friend.currentPlayer = 1;
                        document.getElementById('player1-selection').innerHTML = '<i class="fas fa-user"></i>';
                        document.getElementById('player2-selection').innerHTML = '<i class="fas fa-user"></i>';
                        document.getElementById('friend-result').textContent = 'Player 1, make your choice!';
                        document.getElementById('friend-result').classList.remove('winner');
                    }
                }, 2500);
            }

            function displayResult(result, mode) {
                const resultDisplay = mode === 'robot' ? document.getElementById('result') : document.getElementById('friend-result');
                const scoreboard = mode === 'robot' ? document.querySelector('#robot-game .scoreboard') : document.querySelector('#friend-game .scoreboard');
                
                // Activate scoreboard animation
                scoreboard.classList.add('active');
                setTimeout(() => {
                    scoreboard.classList.remove('active');
                }, 1000);

                // Activate result display
                resultDisplay.classList.add('active');
                
                switch(result) {
                    case 'player':
                    case 'player1':
                        resultDisplay.textContent = mode === 'robot' ? '🎉 You win! 🎉' : '🎉 Player 1 wins! 🎉';
                        resultDisplay.classList.add('winner-animation');
                        celebrate();
                        break;
                    case 'player2':
                        resultDisplay.textContent = 'Player 2 wins!';
                        resultDisplay.classList.add('winner-animation');
                        break;
                    case 'robot':
                        resultDisplay.textContent = 'Robot wins!';
                        resultDisplay.classList.add('winner-animation');
                        break;
                    case 'draw':
                        resultDisplay.textContent = 'It\'s a draw!';
                        resultDisplay.classList.remove('winner-animation');
                        break;
                }
                
                // Update scores
                if (mode === 'robot') {
                    playerScoreDisplay.textContent = gameState.robot.playerScore;
                    robotScoreDisplay.textContent = gameState.robot.robotScore;
                    
                    // Reset for next round
                    setTimeout(() => {
                        gameState.robot.playerChoice = null;
                        gameState.robot.robotChoice = null;
                        playerSelection.innerHTML = '<i class="fas fa-question"></i>';
                        robotSelection.innerHTML = '<i class="fas fa-robot"></i>';
                        playerSelection.style.backgroundColor = '#fff';
                        robotSelection.style.backgroundColor = '#fff';
                        resultDisplay.textContent = '';
                        resultDisplay.classList.remove('winner-animation');
                    }, 2000);
                } else {
                    player1ScoreDisplay.textContent = gameState.friend.player1Score;
                    player2ScoreDisplay.textContent = gameState.friend.player2Score;
                    
                    setTimeout(() => {
                        resultDisplay.classList.remove('winner-animation');
                    }, 2000);
                }
            }

            function resetGame(mode) {
                if (mode === 'robot') {
                    gameState.robot.playerScore = 0;
                    gameState.robot.robotScore = 0;
                    gameState.robot.rounds = 0;
                    gameState.robot.playerChoice = null;
                    gameState.robot.robotChoice = null;
                    
                    playerScoreDisplay.textContent = '0';
                    robotScoreDisplay.textContent = '0';
                    playerSelection.innerHTML = '<i class="fas fa-question"></i>';
                    robotSelection.innerHTML = '<i class="fas fa-robot"></i>';
                    playerSelection.style.backgroundColor = '#fff';
                    robotSelection.style.backgroundColor = '#fff';
                    resultDisplay.textContent = '';
                    resultDisplay.classList.remove('winner-animation');
                } else {
                    gameState.friend.player1Score = 0;
                    gameState.friend.player2Score = 0;
                    gameState.friend.rounds = 0;
                    gameState.friend.player1Choice = null;
                    gameState.friend.player2Choice = null;
                    gameState.friend.currentPlayer = 1;
                    
                    player1ScoreDisplay.textContent = '0';
                    player2ScoreDisplay.textContent = '0';
                    player1Selection.innerHTML = '<i class="fas fa-user"></i>';
                    player2Selection.innerHTML = '<i class="fas fa-user"></i>';
                    player1Selection.style.backgroundColor = '#fff';
                    player2Selection.style.backgroundColor = '#fff';
                    friendResultDisplay.textContent = 'Player 1, make your choice!';
                    friendResultDisplay.classList.remove('winner-animation');
                }
                
                // Create celebration animation on reset
                createParticles(100);
            }

            function celebrate() {
                createConfetti(30);
                createParticles(50);
            }

            function createConfetti(count) {
                for (let i = 0; i < count; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = `${Math.random() * 100}vw`;
                    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
                    confetti.style.animationDuration = `${3 + Math.random() * 2}s`;
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 5000);
                }
            }

            function createParticles(count) {
                for (let i = 0; i < count; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    
                    // Random position
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight;
                    
                    // Random properties
                    const size = Math.random() * 8 + 2;
                    const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
                    
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.backgroundColor = color;
                    particle.style.left = `${x}px`;
                    particle.style.top = `${y}px`;
                    
                    // Animation
                    const duration = Math.random() * 3 + 2;
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 100 + 50;
                    
                    particle.animate([
                        { 
                            opacity: 1,
                            transform: `translate(0, 0) rotate(0deg)`
                        },
                        { 
                            opacity: 0,
                            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${Math.random() * 360}deg)`
                        }
                    ], {
                        duration: duration * 1000,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    });
                    
                    document.body.appendChild(particle);
                    
                    // Remove after animation
                    setTimeout(() => {
                        particle.remove();
                    }, duration * 1000);
                }
            }

            // Initial animations
            setTimeout(() => {
                createParticles(30);
            }, 1000);
        });
   