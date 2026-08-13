import { describe, expect, it } from "vitest";
import courseAssistant from "./course-assistant.js";
import health from "./health.js";

function responseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    setHeader() {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

describe("Vercel-native endpoints", () => {
  it("returns a health response without booting the shared Express application", () => {
    const res = responseRecorder();
    health({}, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok", service: "skillpath-api" });
  });

  it("rejects non-POST course-assistant requests", async () => {
    const res = responseRecorder();
    await courseAssistant({ method: "GET" }, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ error: "Method not allowed" });
  });

  it("rejects an empty course question before making a provider request", async () => {
    const res = responseRecorder();
    await courseAssistant({ method: "POST", body: { course: {}, messages: [] } }, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "A course question is required" });
  });
});
