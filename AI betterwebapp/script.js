const scenarios = [
  {
    title: "Scenario 1: Gender Bias in Meetings",
    subscenarios: [
      {
        code: "1A",
        title: "Idea Attribution",
        question: "During a meeting, a woman’s idea is ignored until repeated by a man. What should you do?",
        options: [
          { text: "Give her credit publicly", feedback: "Correct! Recognition supports fairness.", type: "correct" },
          { text: "Stay silent", feedback: "Wrong. Silence allows bias to continue.", type: "incorrect" },
          { text: "Tell her privately later", feedback: "Supportive, but public credit is key.", type: "warning" }
        ]
      }
    ]
  },
  {
    title: "Scenario 2: Cultural Stereotypes",
    subscenarios: [
      {
        code: "2A",
        title: "Insensitive Joke",
        question: "A coworker makes a joke based on someone’s culture. What do you do?",
        options: [
          { text: "Laugh to avoid conflict", feedback: "Wrong. That normalizes bias.", type: "incorrect" },
          { text: "Respectfully explain the harm", feedback: "Correct! Addressing builds awareness.", type: "correct" },
          { text: "Ignore it", feedback: "Not ideal. Silence lets stereotypes spread.", type: "warning" }
        ]
      }
    ]
  },
  {
    title: "Scenario 3: Accessibility in the Workplace",
    subscenarios: [
      {
        code: "3A",
        title: "Blocked Access",
        question: "A colleague using a wheelchair cannot reach the meeting room upstairs. What’s your response?",
        options: [
          { text: "Move the meeting to accessible room", feedback: "Correct! Accessibility is inclusion.", type: "correct" },
          { text: "Tell them to catch up later", feedback: "Wrong. Exclusion is not acceptable.", type: "incorrect" },
          { text: "Apologize but proceed", feedback: "Intentions help, but action is needed.", type: "warning" }
        ]
      }
    ]
  }
];

// DOM elements

const startMenu = document.getElementById("start-menu");
const scenarioMenu = document.getElementById("scenario-menu");
const scenarioList = document.getElementById("scenario-list");
const scenarioContainer = document.getElementById("scenario-container");
const scenarioTitle = document.getElementById("scenario-title");
const scenarioQuestion = document.getElementById("scenario-question");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const backToMenuBtn = document.getElementById("back-to-menu");
const endScreen = document.getElementById("end-screen");
const restartBtn = document.getElementById("restart-btn");

let currentScenarioIndex = null;
let currentSubScenario = null;

// --- Fetch AI sub-scenarios ---
async function fetchGeneratedSubs(majorScenarioId, majorScenarioTitle, n = 2, used = []) {
  const params = new URLSearchParams({
    majorScenarioId: String(majorScenarioId),
    majorScenarioTitle,
    n: String(n),
    used: used.join(",")
  });
  try {
    const res = await fetch(`http://localhost:8080/api/subscenarios?${params.toString()}`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.subscenarios || [];
  } catch (e) {
    console.warn("AI generation failed, fallback to static:", e);
    return [];
  }
}

// --- Render scenario list with dropdowns ---
function renderScenarioList() {
  scenarioList.innerHTML = "";
  scenarios.forEach((s, idx) => {
    const majorBtn = document.createElement("button");
    majorBtn.textContent = s.title;
    majorBtn.classList.add("major-btn");
    scenarioList.appendChild(majorBtn);

    const subContainer = document.createElement("div");
    subContainer.classList.add("sub-container");
    scenarioList.appendChild(subContainer);

    majorBtn.addEventListener("click", async () => {
      if (subContainer.innerHTML === "") {
        const usedCodes = s.subscenarios.map(sc => sc.code);
        const aiSubs = await fetchGeneratedSubs(idx + 1, s.title, 2, usedCodes);
        const finalSubs = [...s.subscenarios, ...aiSubs];
        finalSubs.forEach(sub => {
          const subBtn = document.createElement("button");
          subBtn.textContent = sub.title;
          subBtn.classList.add("sub-btn");
          subBtn.addEventListener("click", () => startScenario(sub));
          subContainer.appendChild(subBtn);
        });
      }
      subContainer.classList.toggle("show");
    });
  });
}

// --- Start scenario ---
function startScenario(subScenario) {
  currentSubScenario = subScenario;
  scenarioMenu.classList.replace("active", "hidden");
  scenarioContainer.classList.replace("hidden", "active");
  loadScenario(subScenario);
}

// --- Load scenario ---
function loadScenario(subScenario) {
  scenarioTitle.textContent = subScenario.title;
  scenarioQuestion.textContent = subScenario.question;
  optionsContainer.innerHTML = "";
  feedback.textContent = "";
  nextBtn.classList.add("hidden");
  backToMenuBtn.classList.add("hidden");

  subScenario.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.classList.add("option-btn");
    btn.addEventListener("click", () => {
      feedback.textContent = opt.feedback;
      feedback.className = opt.type;
      nextBtn.classList.remove("hidden");
      backToMenuBtn.classList.remove("hidden");
    });
    optionsContainer.appendChild(btn);
  });
}

// --- Navigation ---
document.getElementById("start-btn").addEventListener("click", () => {
  startMenu.classList.replace("active", "hidden");
  scenarioMenu.classList.replace("hidden", "active");
  renderScenarioList();
});

document.getElementById("back-to-start").addEventListener("click", () => {
  scenarioMenu.classList.replace("active", "hidden");
  startMenu.classList.replace("hidden", "active");
});

backToMenuBtn.addEventListener("click", () => {
  scenarioContainer.classList.replace("active", "hidden");
  scenarioMenu.classList.replace("hidden", "active");
});

nextBtn.addEventListener("click", () => {
  scenarioContainer.classList.replace("active", "hidden");
  endScreen.classList.replace("hidden", "active");
});

restartBtn.addEventListener("click", () => {
  endScreen.classList.replace("active", "hidden");
  startMenu.classList.replace("hidden", "active");
});
