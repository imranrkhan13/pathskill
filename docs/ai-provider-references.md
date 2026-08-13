# AI Provider Integration References

The course assistant keeps provider keys exclusively on the server and uses these documented request contracts as its resilient fallback chain.

| Provider | Implementation use | Official reference |
| --- | --- | --- |
| OpenRouter | Primary OpenAI-compatible chat completion and model discovery. | [Chat completions](https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion), [quickstart](https://openrouter.ai/docs/quickstart) |
| Groq | OpenAI-compatible fallback using a production model identifier. | [OpenAI compatibility](https://console.groq.com/docs/openai), [models](https://console.groq.com/docs/models) |
| Mistral | OpenAI-shaped chat-completions fallback with model aliases. | [Chat endpoint](https://docs.mistral.ai/api/endpoint/chat), [model lifecycle](https://docs.mistral.ai/inference/model-lifecycle) |
| Gemini | Interactions API fallback with server-side system instruction and text input. | [Text generation](https://ai.google.dev/gemini-api/docs/text-generation), [models](https://ai.google.dev/gemini-api/docs/models) |
| Cohere | Chat v2 fallback with role-based message history. | [Chat reference](https://docs.cohere.com/reference/chat), [chat guide](https://docs.cohere.com/docs/chat-api) |
| ScaleDown | Context-compression capability reserved for longer retrieved course material; current live course facts are short enough to send directly. | [Quickstart](https://docs.scaledown.ai/quickstart), [compression overview](https://docs.scaledown.ai/api-reference/compress-overview) |
