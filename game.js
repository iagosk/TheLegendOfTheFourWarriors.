let players = [];
let currentPlayerIndex = 0;
let step = 0;

const setup = document.getElementById("setup");
const game = document.getElementById("game");
const story = document.getElementById("story");
const turnInfo = document.getElementById("turnInfo");
const questionText = document.getElementById("question");
const answerInput = document.getElementById("answer");
const feedbackText = document.getElementById("feedback");
const challengeBox = document.getElementById("challenge");
const scoreboard = document.getElementById("scoreboard");
const nextBtn = document.getElementById("nextBtn");

const steps = [
  {
    text: "You find yourselves at the Gate of Vocabulary.",
    challenge: {
      question: "List 3 fruits in English.",
      validate: (input) => {
        const fruits = ["apple", "banana", "orange", "grape", "pear", "pineapple"];
        const words = input.toLowerCase().split(/[\s,]+/);
        const matches = words.filter(word => fruits.includes(word));
        return matches.length >= 3;
      }
    }
  },
  {
    text: "A magical scroll blocks your path. Fix the sentence:",
    challenge: {
      question: "Correct: 'She don't like apples.'",
      validate: (input) => {
        return input.toLowerCase().trim() === "she doesn't like apples";
      }
    }
  },
  {
    text: "The dragon of Grammar awakens. Final question:",
    challenge: {
      question: "What's the past tense of 'go'?",
      validate: (input) => input.toLowerCase().trim() === "went"
    }
  }
];

function startGame() {
  const nameInput = document.getElementById("playerNames").value;
  const names = nameInput.split(',').map(name => name.trim()).filter(n => n);
  if (names.length === 0) return alert("Enter at least one name!");

  players = names.map(name => ({ name, score: 0 }));
  setup.classList.add("hidden");
  game.classList.remove("hidden");
  nextStep();
}

function nextStep() {
  if (step >= steps.length) {
    story.textContent = "🎉 The adventure ends! Final scores:";
    challengeBox.classList.add("hidden");
    nextBtn.style.display = "none";
    renderScores();
    return;
  }

  const currentStep = steps[step];
  story.textContent = currentStep.text;
  questionText.textContent = currentStep.challenge.question;
  feedbackText.textContent = "";
  answerInput.value = "";
  challengeBox.classList.remove("hidden");

  turnInfo.textContent = `🔁 It's ${players[currentPlayerIndex].name}'s turn`;
  nextBtn.disabled = true;
}

function checkAnswer() {
  const input = answerInput.value;
  const currentChallenge = steps[step].challenge;

  if (currentChallenge.validate(input)) {
    feedbackText.textContent = "✅ Correct!";
    players[currentPlayerIndex].score += 10;
    nextBtn.disabled = false;
  } else {
    feedbackText.textContent = "❌ Try again.";
  }

  renderScores();
}

function renderScores() {
  scoreboard.innerHTML = "<h3>Scoreboard</h3><ul>" +
    players.map(p => `<li>${p.name}: ${p.score} pts</li>`).join('') +
    "</ul>";
}

nextBtn.addEventListener("click", () => {
  currentPlayerIndex++;
  if (currentPlayerIndex >= players.length) {
    currentPlayerIndex = 0;
    step++;
  }
  nextStep();
});
