---
title: Experimenting with OpenAI Realtime API, the next level of Advance Voice Mode!
language-th-link: "[[ลองเล่นกับ-OpenAI-Realtime-API-ขั้นกว่าของ-Advance-Voice-Mode!]]"
extracted: '{  "summarize": "OpenAI has released a new Realtime API for developers, enhancing voice interactions with AI. This API offers features like setting instructions, using tools for information retrieval, handling both text and voice inputs, and improved conversation flow. However, it comes with high costs and some technical complexities. The post includes an example of the API in action, demonstrating its capabilities in answering weather-related questions.",  "keywords": [    "OpenAI",    "Realtime API",    "Voice interaction",    "AI development",    "System Prompt",    "Tools integration",    "Voice-to-text",    "WebSocket",    "Stateful API",    "Speech to Speech",    "Weather information",    "API pricing",    "Voice Activity Detection",    "Whisper-1",    "ChatGPT App"  ]}'
---
Following up on the previous post, we introduced Advance Voice Mode in the ChatGPT App, which makes conversations flow as smoothly as talking to a real person. However, it had major limitations regarding the information in the GPT-4o model's memory and communication through voice only.

Recently, OpenAI released an API for developers to build upon on October 1, 2024. We've tried it out and found these interesting points:

🔹 You can set instructions or System Prompt to guide the conversation or define AI personality 
🔹 Allow AI to use tools to fetch additional information, similar to when we use Chat Completion and AI searches Google to supplement answers 🔍 
🔹 Can send both text 📝 and voice 🔊 
🔹 Voice-to-text transcription uses Whisper-1, separate from the AI answering part. So it's not unusual for the transcription to be incorrect, but AI still understands us correctly 
🔹 Option to disable voice-to-text transcription 
🔹 For interruptions or Voice Activity Detection (VAD), you can choose whether OpenAI checks or you check yourself. But be cautious, if OpenAI checks, it means sending your voice continuously and you'll be charged even when silent and listening 
🔹 Price 💰 is still high, currently at $5.00 / 1M input tokens and $20.00 / 1M output tokens. In real usage, it's about 2 baht per minute for input voice and 8 baht per minute for output voice. Need to use it wisely 
🔹 This API can only be used via WebSocket, which might be complicated to set up 
🔹 This API is stateful, so throughout the conversation, you don't need to send previous messages like when using Chat Completion 
🔹 The API can choose to respond with text only, like Chat Completion, but if you want to use Speech to Speech, you must use this Realtime API

As usual, we have an example. We've modified OpenAI's sample code and tried it out in the video.

In this example, AI will answer questions about weather conditions. When we specify a location, AI will fetch the latest data to answer. The video starts with a greeting message, followed by a voice question. AI responds very quickly, taking only 2 seconds to process and answer. But actually, AI takes just 0.3 seconds to decide to use a tool and another 0.3 seconds to convert the result to voice. The rest is waiting time for the tool to respond.

<video src="https://cdn.indevmined.com/video/openai-realtime-api.mp4" controls></video>

This short 30-second conversation cost ฿6. It seems to have potential for further development, but we need to be careful, or costs will definitely skyrocket 💸

Interested or want to know more? Feel free to chat with us in the comments or message!