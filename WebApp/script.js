const scenarios = {
  "Hiring Bias": [
    {
      question: "You are reviewing resumes and notice one candidate has a foreign-sounding name. What do you do?",
      options: [
        { text: "Evaluate based on skills and experience only.", feedback: "✅ Correct! Focus on merit, not names.", type: "correct" },
        { text: "Assume they might not fit the company culture.", feedback: "❌ Wrong. This is bias.", type: "incorrect" },
        { text: "Set aside for later review.", feedback: "⚠️ Not ideal — delays often mask bias.", type: "warning" }
      ]
    },
    {
      question: "During interviews, a candidate mentions they are a single parent. How should you respond?",
      options: [
        { text: "Respect their openness and continue evaluating job fit.", feedback: "✅ Correct. Personal details shouldn’t bias hiring.", type: "correct" },
        { text: "Worry they won’t balance work and life.", feedback: "❌ Wrong. That’s stereotyping.", type: "incorrect" },
        { text: "Ask detailed questions about childcare.", feedback: "⚠️ Not appropriate — irrelevant to job performance.", type: "warning" }
      ]
    }
  ],

  "Microaggressions": [
    {
      question: "A colleague repeatedly mispronounces another coworker’s name. What should you do?",
      options: [
        { text: "Correct them politely and ensure names are respected.", feedback: "✅ Correct. Names are part of identity.", type: "correct" },
        { text: "Ignore it — it’s not a big deal.", feedback: "❌ Wrong. Small acts accumulate harm.", type: "incorrect" },
        { text: "Laugh it off.", feedback: "⚠️ Not okay — it normalizes disrespect.", type: "warning" }
      ]
    },
    {
      question: "Someone tells a female engineer: 'You’re good at this for a woman.' What’s the best response?",
      options: [
        { text: "Call out the comment as inappropriate.", feedback: "✅ Correct. Address bias directly but respectfully.", type: "correct" },
        { text: "Stay silent to avoid conflict.", feedback: "❌ Wrong. Silence enables bias.", type: "incorrect" },
        { text: "Change the subject.", feedback: "⚠️ Weak response — doesn’t resolve issue.", type: "warning" }
      ]
    }
  ],

  "Psychological Safety": [
    {
      question: "A junior employee hesitates to share ideas in a meeting. What’s the best approach?",
      options: [
        { text: "Invite them to share and affirm their contributions.", feedback: "✅ Correct. Encourages inclusion.", type: "correct" },
        { text: "Ignore it — they’ll speak when ready.", feedback: "❌ Wrong. This discourages participation.", type: "incorrect" },
        { text: "Press them strongly to speak up.", feedback: "⚠️ Not ideal — may increase anxiety.", type: "warning" }
      ]
    },
    {
      question: "You notice teammates avoiding feedback discussions. What should you do?",
      options: [
        { text: "Foster open dialogue and model vulnerability.", feedback: "✅ Correct. Leaders set culture.", type: "correct" },
        { text: "Avoid bringing up difficult issues.", feedback: "❌ Wrong. Avoidance worsens trust.", type: "incorrect" },
        { text: "Force feedback sessions aggressively.", feedback: "⚠️ Not healthy — undermines safety.", type: "warning" }
      ]
    }
  ]
};

let currentScenario = null;
let currentIndex = 0;

const startMenu = document.getElementById("start-menu");
const scenarioMenu = document.getElementById("scenario-menu");
const scenarioList = document.getElementById("scenario-list");
const scenarioContainer = document.getElementById("scenario-container");

const startBtn = document.getElementById("start-btn");
const backToStartBtn = document.getElementById("back-to-start");
const backToMenuBtn = document.getElementById("back-to-menu");

const scenarioTitle = document.getElementById("scenario-title");
const scenarioQuestion = document.getElementById("scenario-question");
const optionsDiv = document.getElementById("options");
const feedbackDiv = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

// Show start menu initially
showScreen(startMenu);

startBtn.addEventListener("click", () => {
  showScreen(scenarioMenu);
  renderScenarioMenu();
});

backToStartBtn.addEventListener("click", () => {
  showScreen(startMenu);
});

backToMenuBtn.addEventListener("click", () => {
  showScreen(scenarioMenu);
  renderScenarioMenu();
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < scenarios[currentScenario].length) {
    renderQuestion();
  } else {
    feedbackDiv.innerHTML = `<p><strong>✅ You finished the "${currentScenario}" scenario!</strong></p>`;
    nextBtn.classList.add("hidden");
    backToMenuBtn.classList.remove("hidden");
  }
});

function renderScenarioMenu() {
  scenarioList.innerHTML = "";
  for (let key in scenarios) {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.onclick = () => {
      currentScenario = key;
      currentIndex = 0;
      showScreen(scenarioContainer);
      renderQuestion();
    };
    scenarioList.appendChild(btn);
  }
}

function renderQuestion() {
  const q = scenarios[currentScenario][currentIndex];
  scenarioTitle.textContent = currentScenario;
  scenarioQuestion.textContent = q.question;
  optionsDiv.innerHTML = "";
  feedbackDiv.innerHTML = "";
  nextBtn.classList.add("hidden");
  backToMenuBtn.classList.add("hidden");

  // Shuffle options
  const shuffled = [...q.options].sort(() => Math.random() - 0.5);
  shuffled.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt.text;
    btn.onclick = () => {
      feedbackDiv.innerHTML = `<p class="${opt.type}">${opt.feedback}</p>`;
      nextBtn.classList.remove("hidden");
    };
    optionsDiv.appendChild(btn);
  });
}

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}
