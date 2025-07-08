
        // Game state
        const gameState = {
            friend: {
                player1Choice: null,
                player2Choice: null,
                player1Score: 0,
                player2Score: 0,
                round: 0
            },
            robot: {
                playerChoice: null,
                robotChoice: null,
                playerScore: 0,
                robotScore: 0,
                round: 0
            }
        };
        
        // DOM elements
        const friendGame = document.getElementById('friend-game');
        const robotGame = document.getElementById('robot-game');
        const toggleFriendBtn = document.getElementById('toggle-friend');
        const toggleRobotBtn = document.getElementById('toggle-robot');
        
        // Initialize game
        document.addEventListener('DOMContentLoaded', () => {
            toggleFriendBtn.classList.add('bg-blue-700');
            toggleRobotBtn.classList.remove('bg-purple-700');
            
            toggleFriendBtn.addEventListener('click', () => {
                friendGame.classList.remove('hidden');
                robotGame.classList.add('hidden');
                toggleFriendBtn.classList.add('bg-blue-700');
                toggleRobotBtn.classList.remove('bg-purple-700');
            });
            
            toggleRobotBtn.addEventListener('click', () => {
                robotGame.classList.remove('hidden');
                friendGame.classList.add('hidden');
                toggleRobotBtn.classList.add('bg-purple-700');
                toggleFriendBtn.classList.remove('bg-blue-700');
            });
        });
        
        // Friend game logic
        function makeFriendChoice(btn, player) {
            const choice = btn.getAttribute('data-choice');
            
            if (player === 'player1') {
                gameState.friend.player1Choice = choice;
                document.getElementById('player1-choice').textContent = choice;
                document.querySelectorAll('[onclick*="player1"]').forEach(b => b.disabled = true);
            } else {
                gameState.friend.player2Choice = choice;
                document.getElementById('player2-choice').textContent = choice;
                document.querySelectorAll('[onclick*="player2"]').forEach(b => b.disabled = true);
            }
            
            animateChoice(btn);
            
            if (gameState.friend.player1Choice && gameState.friend.player2Choice) {
                setTimeout(() => {
                    determineFriendWinner();
                }, 500);
            }
        }
        
        function determineFriendWinner() {
            gameState.friend.round++;
            document.getElementById('round-friend').textContent = gameState.friend.round;
            
            const p1 = gameState.friend.player1Choice;
            const p2 = gameState.friend.player2Choice;
            const resultText = document.getElementById('friend-result');
            
            if (p1 === p2) {
                resultText.textContent = "It's a tie!";
                resultText.className = "text-2xl font-bold mb-8 text-center h-10 text-yellow-400";
            } else if (
                (p1 === '✊' && p2 === '✌️') ||
                (p1 === '✋' && p2 === '✊') ||
                (p1 === '✌️' && p2 === '✋')
            ) {
                gameState.friend.player1Score++;
                document.getElementById('player1-score').textContent = gameState.friend.player1Score;
                resultText.textContent = "Player 1 wins!";
                resultText.className = "text-2xl font-bold mb-8 text-center h-10 text-green-400 shake";
                document.getElementById('player1-choice').parentElement.classList.add('winner', 'pulse');
            } else {
                gameState.friend.player2Score++;
                document.getElementById('player2-score').textContent = gameState.friend.player2Score;
                resultText.textContent = "Player 2 wins!";
                resultText.className = "text-2xl font-bold mb-8 text-center h-10 text-green-400 shake";
                document.getElementById('player2-choice').parentElement.classList.add('winner', 'pulse');
            }
            
            setTimeout(() => {
                resetFriendChoices();
            }, 1500);
        }
        
        function resetFriendChoices() {
            gameState.friend.player1Choice = null;
            gameState.friend.player2Choice = null;
            document.getElementById('player1-choice').textContent = '';
            document.getElementById('player2-choice').textContent = '';
            document.getElementById('friend-result').textContent = '';
            document.getElementById('friend-result').className = "text-2xl font-bold mb-8 text-center h-10";
            document.querySelectorAll('.choice-btn').forEach(b => b.disabled = false);
            document.getElementById('player1-choice').parentElement.classList.remove('winner', 'pulse');
            document.getElementById('player2-choice').parentElement.classList.remove('winner', 'pulse');
        }
        
        // Robot game logic
        function makeRobotChoice(btn) {
            const choices = ['✊', '✋', '✌️'];
            const playerChoice = btn.getAttribute('data-choice');
            
            gameState.robot.playerChoice = playerChoice;
            document.getElementById('player-choice').textContent = playerChoice;
            
            // Disable buttons
            document.querySelectorAll('#robot-game .choice-btn').forEach(b => b.disabled = true);
            
            // Animate player choice
            animateChoice(btn);
            
            // Robot "thinking" animation
            const robotEl = document.getElementById('robot-choice');
            let counter = 0;
            const interval = setInterval(() => {
                robotEl.textContent = choices[counter % 3];
                counter++;
                
                if (counter > 5) {
                    clearInterval(interval);
                    
                    // Robot makes random choice
                    const robotChoice = choices[Math.floor(Math.random() * choices.length)];
                    gameState.robot.robotChoice = robotChoice;
                    robotEl.textContent = robotChoice;
                    
                    setTimeout(() => {
                        determineRobotWinner();
                    }, 500);
                }
            }, 200);
        }
        
        function determineRobotWinner() {
            gameState.robot.round++;
            document.getElementById('round-robot').textContent = gameState.robot.round;
            
            const playerChoice = gameState.robot.playerChoice;
            const robotChoice = gameState.robot.robotChoice;
            const resultText = document.getElementById('robot-result');
            
            if (playerChoice === robotChoice) {
                resultText.textContent = "It's a tie!";
                resultText.className = "text-2xl font-bold mb-8 text-center h-10 text-yellow-400";
            } else if (
                (playerChoice === '✊' && robotChoice === '✌️') ||
                (playerChoice === '✋' && robotChoice === '✊') ||
                (playerChoice === '✌️' && robotChoice === '✋')
            ) {
                gameState.robot.playerScore++;
                document.getElementById('player-score').textContent = gameState.robot.playerScore;
                resultText.textContent = "You win!";
                resultText.className = "text-2xl font-bold mb-8 text-center h-10 text-green-400 shake";
                document.getElementById('player-choice').parentElement.classList.add('winner', 'pulse');
            } else {
                gameState.robot.robotScore++;
                document.getElementById('robot-score').textContent = gameState.robot.robotScore;
                resultText.textContent = "Robot wins!";
                resultText.className = "text-2xl font-bold mb-8 text-center h-10 text-red-400 shake";
                document.getElementById('robot-choice').parentElement.classList.add('winner', 'pulse');
            }
            
            setTimeout(() => {
                resetRobotChoices();
            }, 1500);
        }
        
        function resetRobotChoices() {
            gameState.robot.playerChoice = null;
            gameState.robot.robotChoice = null;
            document.getElementById('player-choice').textContent = '';
            document.getElementById('robot-choice').textContent = '';
            document.getElementById('robot-result').textContent = '';
            document.getElementById('robot-result').className = "text-2xl font-bold mb-8 text-center h-10";
            document.querySelectorAll('#robot-game .choice-btn').forEach(b => b.disabled = false);
            document.getElementById('player-choice').parentElement.classList.remove('winner', 'pulse');
            document.getElementById('robot-choice').parentElement.classList.remove('winner', 'pulse');
        }
        
        // Animation helper
        function animateChoice(btn) {
            const highlight = document.createElement('div');
            highlight.className = 'highlight-selection';
            btn.parentNode.insertBefore(highlight, btn);
            
            setTimeout(() => {
                highlight.style.transform = 'translate(-50%, -50%) scale(1.5)';
                highlight.style.opacity = '0';
                
                setTimeout(() => {
                    highlight.remove();
                }, 300);
            }, 100);
            
            btn.classList.add('shake');
            setTimeout(() => {
                btn.classList.remove('shake');
            }, 500);
        }
    