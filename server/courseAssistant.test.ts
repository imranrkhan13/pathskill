import { describe, expect, it } from "vitest";
import { buildCourseSystemPrompt, normalizeCourseMessages } from "./courseAssistant";

describe("course assistant safeguards", () => {
  it("builds a course-scoped prompt with only the provided course facts", () => {
    const prompt = buildCourseSystemPrompt({
      courseName: "Portfolio Practice",
      description: "Build a case-study led portfolio.",
      courseCode: "PORT-101",
      mainCategory: "Design",
      courseType: "Workshop",
      pricePaise: 499900,
      priceUsdCents: 5900,
      refundable: true,
    });

    expect(prompt).toContain("Portfolio Practice");
    expect(prompt).toContain("₹4999.00");
    expect(prompt).toContain("$59.00");
    expect(prompt).toContain("Do not use outside knowledge");
  });

  it("limits retained chat history and trims oversized user text", () => {
    const messages = Array.from({ length: 10 }, (_, index) => ({
      role: "user" as const,
      content: `${index}-${"x".repeat(1_300)}`,
    }));
    const normalized = normalizeCourseMessages(messages);

    expect(normalized).toHaveLength(8);
    expect(normalized[0]?.content.startsWith("2-")).toBe(true);
    expect(normalized[0]?.content).toHaveLength(1_200);
  });
});
