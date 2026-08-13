import { describe, expect, it } from "vitest";

describe("AI provider configuration", () => {
  it("accepts the configured OpenRouter credential", async () => {
    const apiKey = process.env.OPENROUTER_API;
    expect(apiKey, "OPENROUTER_API must be configured for the primary assistant provider").toBeTruthy();

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(12_000),
    });

    expect(response.status, "OpenRouter rejected the configured server-side credential").not.toBe(401);
    expect(response.status, "OpenRouter rejected the configured server-side credential").not.toBe(403);
    expect(response.ok, "OpenRouter model discovery should succeed with the configured credential").toBe(true);
  }, 15_000);
});
