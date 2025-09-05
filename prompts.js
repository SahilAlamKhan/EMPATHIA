export const buildSubScenarioPrompt = ({
  majorScenarioId,
  majorScenarioTitle,
  difficulty = "medium",
  n = 2,
  alreadyUsedCodes = [],
}) => {
  return `
You are generating workplace bias training *sub-scenarios* for a fixed MAJOR scenario.

MAJOR SCENARIO:
- id: "${majorScenarioId}"
- title: "${majorScenarioTitle}"

TASK:
- Create ${n} realistic sub-scenarios under this major scenario.
- Each sub-scenario should be concise, workplace-relevant, and educational.
- Difficulty: ${difficulty}.
- Avoid reusing codes in [${alreadyUsedCodes.join(", ")}].

RULES:
- Each sub-scenario must have:
  • "code" (string like "1C", "2D")
  • "title" (short, 3–6 words)
  • "question" (1–2 sentences, workplace situation)
  • "options": exactly 3, with one of each type: "correct", "incorrect", "warning".
- Each option has:
  • text: the possible action
  • feedback: 1–2 sentences explaining WHY it’s correct/incorrect/warning
  • type: must be exactly "correct", "incorrect", or "warning".

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "majorScenarioId": "${majorScenarioId}",
  "majorScenarioTitle": "${majorScenarioTitle}",
  "subscenarios": [
    {
      "code": "1C",
      "title": "Short Title",
      "question": "What should you do in this situation?",
      "options": [
        { "text": "Answer A", "feedback": "Reasoning…", "type": "correct" },
        { "text": "Answer B", "feedback": "Reasoning…", "type": "incorrect" },
        { "text": "Answer C", "feedback": "Reasoning…", "type": "warning" }
      ]
    }
  ]
}

STRICT:
- Return JSON ONLY. No markdown, no commentary.
- Do not wrap in backticks.
- Must validate as strict JSON.
`;
};
