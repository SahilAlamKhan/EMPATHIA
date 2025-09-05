import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

export const subScenarioSchema = {
  type: "object",
  properties: {
    majorScenarioId: { type: "string" },
    majorScenarioTitle: { type: "string" },
    subscenarios: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          code: { type: "string" },
          title: { type: "string" },
          question: { type: "string" },
          options: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                feedback: { type: "string" },
                type: { enum: ["correct", "incorrect", "warning"] },
              },
              required: ["text", "feedback", "type"],
              additionalProperties: false,
            },
          },
        },
        required: ["code", "title", "question", "options"],
        additionalProperties: false,
      },
    },
  },
  required: ["majorScenarioId", "majorScenarioTitle", "subscenarios"],
  additionalProperties: false,
};

export const validateSubScenarios = ajv.compile(subScenarioSchema);
