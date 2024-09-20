export const knowledge = { tha: `
  <POST>
  ---
title: LLM Gen AI กับ ความปลอดภัย
language: th
language-en-link: "[[en/LLM-Gen-AI-and-Security|LLM-Gen-AI-and-Security]]"
published: 2024-05-18
categories: learning
keywords:
  - GenAI
  - Generative AI
  - ChatGPT
extracted: '{  "summarize": "เมื่อนำ Generative AI มาใช้ในการทำงาน ควรคำนึงถึงความปลอดภัยของข้อมูลผู้ใช้และข้อมูลที่ Gen AI สร้างขึ้น รวมถึงประเมินความสำคัญของข้อมูลที่ส่งไปให้บริการ Gen AI และตรวจสอบให้ดีว่าบริการนั้นนำข้อมูลไปฝึกต่อหรือไม่",  "keywords": ["Generative AI", "ความปลอดภัย", "ข้อมูลผู้ใช้", "ข้อมูลที่ Gen AI สร้างขึ้น", "บริการ Gen AI", "การฝึกต่อ", "ความสำคัญของข้อมูล"]}'
---
![img-PY66Wa99IDGn9sUOhW3sNgqT_upscayl_2x_realesrgan-x4plus-anime.jpg](img-PY66Wa99IDGn9sUOhW3sNgqT_upscayl_2x_realesrgan-x4plus-anime.jpg)

หลังจากเราได้เคยแชร์แนวคิดว่า Generative AI เอาไปทำอะไรได้ วันนี้มาต่อกันที่ สิ่งที่ควรคำนึงเกี่ยวกับความปลอดภัย 🔒 เวลานำ Gen AI มาใช้ในการทำงานบ้าง ใครที่กำลังจะเอา Gen AI มาใช้ในองค์กร หรือเอาช่วยทำงานกับข้อมูลที่มีความอ่อนไหว ลองอ่านดูก่อนได้เลย 📝

เครื่องมือ Gen AI ถูกพัฒนาขึ้นมาเพื่อเพิ่มประสิทธิภาพในการทำงานของเรา แต่นอกจากการพิจารณาว่ามันจะช่วยงานเราได้อย่างไรแล้ว ยังมีประเด็นเรื่องความปลอดภัย 🔒 ที่ต้องคำนึงถึงด้วย เช่น

1️⃣ ข้อมูลที่นำเข้าไปใน Gen AI ควรคำนึงถึงความปลอดภัยของข้อมูลผู้ใช้ (PII) โดยเฉพาะข้อมูลสำคัญ 🔒 เราไม่ควรส่งข้อมูลเหล่านั้นเข้าไปให้ Gen AI โดยตรง ควรนำข้อมูลที่สำคัญออกไปหรือแทนที่ด้วยข้อมูลอื่นก่อน เช่น หากผู้ใช้ชื่อ Alpha เราอาจเปลี่ยนเป็น A ก่อนส่งข้อมูลให้ Gen AI ประมวลผล 🔍 นอกจากนี้ ควรระมัดระวังผู้ใช้งานที่ไม่หวังดีที่อาจใส่ข้อมูลที่อาจนำไปใช้ในทางที่ผิด ดังนั้นจำเป็นต้องมีกระบวนการกลั่นกรองข้อมูลก่อนนำเข้าไปในระบบ

2️⃣ ข้อมูลที่ Gen AI สร้างขึ้น อาจมีคำที่ไม่เหมาะสมหรือมีความหมายเชิงลบปะปนอยู่ เนื่องจากข้อมูลที่ใช้ในการฝึกสอนในช่วงเริ่มต้น บางครั้งถึงแม้เราจะตั้งคำถามที่ดี แต่คำตอบที่ได้รับอาจมีคำดังกล่าวปรากฏขึ้น ดังนั้นจึงจำเป็นต้องมีวิธีการตรวจสอบและกรองข้อความก่อนที่จะส่งต่อให้กับผู้ใช้งาน 🔍

สำหรับหัวข้อ 1️⃣ และ 2️⃣ หากใครต้องการข้อมูลเพิ่มเติม ลองค้นหาด้วยคำว่า "Guardrail”

3️⃣ อีกเรื่องหนึ่งที่ควรคำนึงถึงเมื่อใช้ Gen AI ผ่านบริการต่างๆ คือ ข้อความที่เราส่งไป อาจถูกนำไปฝึกหรือใช้งานอื่นๆ ต่อได้ ดังนั้นเราควรประเมินความสำคัญของข้อมูลที่เราส่งไปให้ดี และตรวจสอบให้ละเอียดว่าบริการที่เราใช้นั้นนำข้อมูลของเราไปฝึกต่อหรือไม่ โดยปกติแล้ว เมื่อเราใช้ Gen AI Chat ของผู้ให้บริการต่างๆ เช่น OpenAI ([[chatgpt.com]]) หรือ Google ([[gemini.google.com]]) ข้อมูลจะถูกนำไปฝึกต่อ ซึ่งเราอาจไม่ต้องการเช่นนั้น 😕 ดังนั้นเราควรพิจารณาใช้เวอร์ชั่นอื่นที่ไม่ทำเช่นนั้น เช่น ใช้ผ่าน Playground ของ OpenAI แทน หากยังไม่สบายใจ บริการเหล่านี้ยังมีตัวเลือกให้รัน AI บนเครื่องของเราเอง ซึ่งจะสามารถเพิ่มการป้องกันอีกชั้นหนึ่งและควบคุมการเข้าถึงเครื่องนั้นด้วยตนเอง 💻 เพื่อให้มั่นใจว่าไม่มีการแอบส่งข้อมูลไปที่อื่น

หมดแล้วกับตัวอย่างที่เตรียมมา ทั้งหมดนี้ เป็นเพียงสิ่งที่เราควรคำนึงถึงเบื้องต้น หากจะนำ Gen AI มาใช้ในองค์กรจริงจัง ควรศึกษาเพิ่มเติมให้ละเอียดก่อนนำไปใช้

ในยุคนี้ที่ Generative AI เข้ามามีบทบาท เราควรเรียนรู้และทำความเข้าใจกับมันให้ดี เพื่อให้สามารถใช้งานได้อย่างปลอดภัยและมีประสิทธิภาพมากที่สุด หวังว่าโพสนี้จะช่วยให้เพื่อนๆ ได้รับมุมมองใหม่ๆ เกี่ยวกับการใช้งาน Generative AI และข้อควรระวังที่ควรทราบกันนะ 😊
  </POST>
  
  <POST>
  ---
title: ความจำระยะสั้น ของ Gen AI
language: th
language-en-link: "[[en/Short-term-Memory-of-Gen-AI|Short-term-Memory-of-Gen-AI]]"
published: 2024-06-26
categories: learning
keywords:
  - GenAI
  - Generative AI
  - ChatGPT
extracted: '{  "summarize": "เมื่อถามคำถามเฉพาะทาง ให้แนบเอกสารที่เกี่ยวข้องไปด้วยและชี้แนะให้ Gen AI ใช้ความรู้จากข้อมูลนั้นมาตอบ จะช่วยให้ได้คำตอบที่แม่นยำขึ้น เพราะวิธีนี้จะใช้ความรู้ที่ควบคุมได้และไม่ขึ้นอยู่กับความจำระยะยาวของ Gen AI",  "keywords": ["Gen AI", "คำถามเฉพาะทาง", "เอกสารที่เกี่ยวข้อง", "ความรู้ที่ควบคุมได้", "ความจำระยะสั้น", "ความแม่นยำ", "คำตอบที่ตรงใจ"]}'
---
![PreviewCard.png](PreviewCard.png)
TL;DR เวลาถามคำถามเฉพาะทาง แทนที่จะถามตรงๆ ให้ลองแนบข้อมูล เอกสารที่เกี่ยวข้องไปด้วย แล้วชี้แนะให้ Gen AI ใช้ความรู้จากข้อมูลนั้นมาตอบเท่านั้น วิธีนี้จะช่วยให้ได้คำตอบที่แม่นยำขึ้นเยอะเลย

หลายๆคนใช้ Generative AI อย่าง ChatGPT หรือ Gemini แบบถามตอบ คล้ายกับการค้นหาใน Google ทั่วไป 🔍 วิธีนี้เป็นการดึงข้อมูลจาก ความจำระยะยาว (long term memory) ของ Gen AI ซึ่งเป็นความรู้ที่เรียนรู้มาตั้งแต่ตอนฝึกโมเดล เปรียบเสมือนเราอ่านหนังสือเมื่อสัปดาห์ที่แล้วเข้าห้องสอบ 📚 ข้อดีคือสะดวก นึกหยิบมาใช้ได้เร็ว แต่ก็มีข้อเสียที่ความรู้ที่จำมา อาจคลาดเคลื้อน หรือเป็นความรู้เมื่อนานมาแล้ว อาจจะล้าสมัย ทำให้คำตอบผิดพลาดได้

เพื่อให้ Gen AI ทำงานกับความรู้ที่ควบคุมได้ ไม่ว่าจะเป็นข้อมูลใหม่หรือน่าเชื่อถือกว่า จึงเกิดแนวคิด ความจำระยะสั้น (short term memory) เทียบกับคน ก็เหมือนกับการเข้าห้องสอบแบบเอาสรุปหรือหนังสือเข้าไปเปิดดูได้ วิธีนี้เพิ่มความถูกต้องของคำตอบได้อย่างมาก แต่ก็มีข้อเสียเช่นกัน คือทำให้ได้คำตอบช้าลง ⏱️ เพราะต้องมาเปิดหาว่าคำตอบอยู่ตรงไหนของหนังสือ สำหรับ Gen AI ก็คล้ายๆ กัน ถ้าเราป้อนข้อมูลเยอะๆ เข้าไป มันก็จะตอบช้าลง แต่ถ้าเทียบกับคนแล้ว ช้าของ Gen AI ก็ยังเร็วกว่าเราอยู่ดี 💨

ลองดูนะ ถ้ามีคำถามเฉพาะทางที่ต้องการคำตอบแบบเจาะลึก ลองเปลี่ยนวิธีถามดูครับ แนบเอกสารที่เกี่ยวข้องไปด้วย เช่น ไฟล์ PDF สัก 100 หน้า แล้วขอให้ AI ใช้ข้อมูลจากเอกสารนั้นมาตอบ อาจจะได้คำตอบที่ตรงใจมากขึ้น

แถม หากความแม่นยำยังไม่น่าพอใจ ลองปรับวิธีถาม Gen AI แทนที่จะถามตรงๆ อย่างเดียว ให้บอก Gen AI เพิ่มว่าช่วยระบุแหล่งที่มาของข้อมูลที่ใช้ตอบด้วย ถ้าเป็นหนังสือก็อาจให้บอกเลขหน้า หรือถ้าเป็นบทความยาวๆ ก็ให้ยกข้อความตรงนั้นมาทั้งก้อนเลย จากประสบการณ์ส่วนตัว วิธีนี้ช่วยให้ Gen AI ตอบได้น่าพอใจมากขึ้นมาก 👍

ลองแล้วเป็นยังไงบ้าง มาแชร์กันได้ในคอมเม้นเลยนะ
  </POST>
  
  <POST>
  ---
title: จบใหม่มา จะปรับตัวอย่างไรกับ LLM (Gen AI)
language: th
language-en-link: "[[en/How-to-Adapt-to-LLM-(Gen-AI)-as-a-Fresh-Graduate|How-to-Adapt-to-LLM-(Gen-AI)-as-a-Fresh-Graduate]]"
published: 2024-05-11
categories: learning
keywords:
  - GenAI
  - Generative AI
  - ChatGPT
extracted: '{  "summarize": "เครื่องมือ AI ภาษา (LLM) เช่น ChatGPT สามารถช่วยให้เด็กจบใหม่ปรับตัวเข้ากับการเรียนรู้ในยุคใหม่ได้ โดยสามารถถามคำถามและรับคำตอบที่ถูกต้องได้ โดยไม่ต้องเรียนรู้เชิงลึกเกี่ยวกับวิธีใช้ Gen AI และนำไปใช้ได้เลย",  "keywords": ["LLM", "Gen AI", "ChatGPT", "การเรียนรู้", "เด็กจบใหม่", "เครื่องมือ AI", "ภาษาไทย"]}'
---
แต่ไม่ใช่เด็กจบใหม่ ก็อ่านได้นะ 📚

![How-to-Adapt-to-LLM-(Gen-AI)-as-a-Fresh-Graduate.jpg](How-to-Adapt-to-LLM-(Gen-AI)-as-a-Fresh-Graduate.jpg)

วันนี้มาแนวแชร์ประสบการณ์กันบ้าง เน้นไปที่สายเขียนโปรแกรม แต่จะสายอื่นก็เป็นประโยชน์เช่นกัน

ในตอนนี้มีเครื่องมือ AI ภาษา (LLM) Gen AI หลายตัวเช่น ChatGPT, Claude, Gemini, LLaMa ที่สามารถสร้างข้อความมาตอบคำถามเราได้ 💬 เราสามารถถามด้วยข้อความ รูปภาพ หรือแม้แต่วีดีโอ แต่ก็ไม่ได้การันตีว่าจะตอบถูกต้องเสมอไป แล้วมันจะเป็นประโยชน์อะไรกับเด็กจบใหม่ได้บ้าง 🤔

สิ่งหนึ่งที่น่าสนใจสำหรับเครื่องมือแนวนี้ ที่ไม่จำเป็นต้องเรียนรู้เชิงลึกเกี่ยวกับวิธีใช้ Gen AI และนำไปใช้ได้เลย คือการถามคำถามมันตรงๆเลย เกี่ยวกับสิ่งที่เรากำลังเรียน หรือทำอยู่ เช่น

ถ้าสร้างเว็ปขายของขึ้นมาเว็ปหนึ่ง แล้วจะเจอปัญหาบางอย่างเช่น เวลาต้องโหลดสินค้าจำนวนมากๆ มาแสดง ปกติเขาทำอย่างไรให้เว็ปโหลดไม่ช้า และเซิฟเวอร์ ไม่ล่มจากการต้องส่งข้อมูลจำนวนมาก

เวลาเรากำลังเรียนรู้สิ่งใหม่ๆแบบนี้ เดิมๆ เราก็จะไปเสริช Google แล้วก็อ่าน stackoverflow แล้วก็หวังว่า คำที่เราพิมพ์ลงไปในช่องเสริชจะหาคำตอบที่เราต้องการเจอ 🔍

ในยุคที่เรามี Gen AI แล้ว เราก็ควรลองใช้มันตอบคำถามเราบ้าง ดังนั้นก็ลองเสริชเลย เช่น

I'm writing a website with React. How do you optimise your website when it need to load and display a lot of data.

มันก็พ่นคำศัพท์เทคนิคอย่างเช่น Lazy load, Code Splitting, Optimizing Renders, Performance Monitoring and Profiling มาให้พร้อมคำอธิบาย ⚡️ ตอนถาม จะสังเกตว่าเราสามารถถามอ้อมๆ แล้วให้มันพาไปถึงข้อมูล หรือศัพท์ที่เขาใช้กันในวงการได้เลย ไม่พอยังถามต่อยอดให้มันยกตัวอย่างพร้อมอธิบายโค๊ดนั้นๆ ได้อีก เพียงแค่นี้อุปสรรค์ในการเรียนรู้เราก็หายไปแล้ว 😆

การเรียนรู้ในโลกยุคใหม่เปลี่ยนไปเยอะเลย เราไม่ต้องเข้าถึง commumnity ที่รวมเหล่าคนในวงการ หรือรู้ข้อความ คำศัพท์ก่อนถึงจะไปเสริชหาคำตอบที่อยากได้ กำแพงภาษาเองก็บางลงไปอีก เพราะเราสามารถถามเป็นภาษาไทยได้ ดังนั้น การเรียนรู้ในยุคนี้ เราก็ต้องโฟกัสไปที่ความเข้าใจมากยิ่งขึ้นไปกว่าเดิม ในเมื่องานซ้ำๆ Gen AI สามารถทำได้ดีขึ้นมาก มันสามารถเขียนโค๊ดวาดหน้าเว็ปขึ้นมาให้เราได้ โดยเฉพาะยิ่งเรารู้วิธีถามมันให้ถูกต้อง เหมือนที่เราต้องถามคำถามให้ถูก ถึงจะเสริช google เจอ Gen AI จะเข้ามาช่วยให้งานเดินไวขึ้นอีกมาก ใช้คนน้อยลงในการเขียนโค๊ด แต่สุดท้ายก็ต้องมีเรา คนที่เข้าใจจริง มาช่วยตรวจทาน และนำพาไปสู่จุดหมายที่แท้จริง 🎯 ซึ่งคนๆนั้นจะเป็นเราไหม นั่นก็จะเป็นสิ่งที่เด็กจบใหม่มาควรปรับตัว เปลี่ยนจากเน้นทำงานได้ กลายเป็นทำงานให้เป็น ทำงานให้ถูก 👍 เครื่องมือเหล่านี้จะช่วยให้เราได้

หวังว่าโพสวันนี้จะช่วยเปิดโลกการเรียนรู้ในอีกแง่หนึ่ง 🌟 ไว้โอกาสหน้าจะมาแชร์ว่า Gen AI อาจจะทำได้มากกว่าที่คิดอีก จะออกมาเป็นอย่างไร ไว้รอชม 🔮
  </POST>
  
  <POST>
  ---
title: จะรู้ได้ยังไงว่า ChatGPT ช่วยอะไรเราได้
language: th
language-en-link: "[[en/How-Can-We-Know-What-ChatGPT-Can-Do|How-Can-We-Know-What-ChatGPT-Can-Do]]"
published: 2024-04-27
categories: learning
keywords:
  - GenAI
  - Generative AI
  - ChatGPT
extracted: '{  "summarize": "บทความนี้อธิบายวิธีการใช้ ChatGPT 4 เพื่อค้นหาศักยภาพของมัน โดยเริ่มจากการทดลองใช้งานและเข้าใจวิธีการทำงานของมัน จากนั้นจึงต่อยอดความรู้นั้นไปใช้ในชีวิตประจำวันและท้าทายให้คนอื่นใช้ได้ด้วย",  "keywords": ["ChatGPT 4", "การใช้งาน", "ศักยภาพ", "การเรียนรู้", "การประยุกต์", "เทคโนโลยี", "AI"]}'
---
#เดฟคนหนึ่งจะรู้ได้ไงว่ามันทำอะไรได้
หลังจาก ChatGPT 4 ออกมาได้ครบปีแล้ว 🎉 ได้เห็นการนำไปประยุกต์มากมาย 🌟 มีทั้งที่เห็นได้ตรงๆ และอยู่เบื้องหลังเทคโนโลยีที่เราใช้กันอยู่ทุกวันนี้ แต่จู่ๆเราจะรู้เองได้ยังไงละ 🤔 ว่ามันทำอะไรได้บ้าง ❓ วันนี้เลยมาแชร์แนวคิดที่เราใช้ค้นหาศักยภาพของมันกัน 🔍💡

เริ่มกันที่ สมมุติว่า เราเป็นคนแรกๆ ที่ได้ลองเล่น ChatGPT 4 ถามอะไรมันไป ก็ดูตอบได้หมด เราจะรู้ได้ยังไงว่า สิ่งที่ดูจะทำได้ทุกอย่าง ทำอะไรได้ดี อะไรไม่ดี ณ ตอนนั้น ยังไม่มีใครมาแชร์ว่า ต้องถามมันอย่างงั้น อย่างงี้นะ โจทย์แนวนี้ ต้องถามแพทเทิร์นนี้นะ

เอาละ ถ้าเป็นเรา จะเริ่มประมาณนี้ มาลองไล่ไปพร้อมกัน

![img-hRymhvO36HX2CJ9SXvrKFhzn.png](img-hRymhvO36HX2CJ9SXvrKFhzn.png)

1. ลองเล่นให้เต็มที่

ไม่ใช่ว่าลองอะไรก็ได้นะ เบื้องต้นก็ควรลองตามวัตถุประสงค์ที่มันถูกสร้างก่อน ในเคสนี้ เป็น ai แชทถามตอบ ที่เครมว่ารู้เยอะมาก ดังนั้นเราก็ควรลองถามคำถามมันดู แต่ให้ดีเพื่อจะวัดความสามารถมันได้ เราก็ควรเริ่มจากหัวข้อที่เราถนัดก่อน อย่างเช่น เราชอบเที่ยวแบบ backpacking เวลาวางแผนทริปก็ต้องเช็ครายละเอียดแบบเดินทางไปยังไง รถไฟ หรือรถเมย์ไปถึงไหม ช่วงเวลาที่อยากไปเปิดไหม ไปถูกฤดูเปล่า มีที่พักไหม คร่าวๆ ดังนั้นไหนๆแล้ว อยากไปญี่ปุ่นเดือน 6 ซัก 3-4 วัน ไปแนว adventure หน่อย จะมีให้เที่ยวไหมนะ

ดังนั้น ก็ลองถาม ChatGPT เลย พร้อมกับเสริช google หาเองด้วย สิ่งที่แน่นอนเลย ยังไม่ทันเปิดเว็ปแรก ChatGPT ก็ตอบแล้ว แต่ถูกต้องไหมเดี๋ยวว่ากัน

เริ่มจากฝั่งเสริช google ก่อน เวลาเรามีทริปที่ไม่ค่อยมีใครไปกัน ข้อมูลตามแต่ละเว็ป ก็จะแบบ ตอบคำถามเราซัก 30-40% ของคำถามเรา ดังนั้นเราก็ต้องเช็คหลายๆ เว็ปหน่อยเพื่อรวบรวมให้ได้ครบ 100% อย่างที่อยากรู้ แล้วเสริชเพิ่มเติมอีกหน่อย เพื่อตรวจทานข้อมูลของเรา

กลับกัน ฝั่ง ChatGPT ได้คำตอบเลยในครั้งเดี๋ยว อาจจะถามเข้าทางมันพอดี แต่เรามาคุยกันต่อว่าตอบได้ แต่ตอบถูกไหม ซึ่งก็แอบตกใจไม่น้อย เขียนแผนมาให้สวยงาม เรียบเรียงมาให้ Day 1 ไปไหน Day 2 ไปไหน ไม่พอลองตรวจเอาสถานที่ไปเสริชดู มันคิดเผื่อให้อีก สถานที่ในแต่ละวันต้องไม่ไกลกันมาก เดินทางไหว กลายเป็นว่า พอเราให้ ChatGPT มาช่วย เราก็ประหยัดเวลาไปได้เยอะ เราสามารถข้ามขั้นตอน ไปตรวจทานได้เลย อย่างบางสถานที่ในปีนี้ก็อาจจะไม่ได้เปิด อยู่ๆ เชื่อ 100% คงได้ยื่นเหวอหน้างาน

พอเริ่มเห็นว่ามันสรุปคำตอบได้เก่ง เราก็อาจจะเริ่มลองถามหัวข้อที่ยากขึ้นอีก หรือหัวข้อที่เราอยากรู้ที่ไม่เคยรู้มาก่อน แล้วลองดูคำถามมันดู ลองให้เต็มที่ แล้วเราจะเริ่มจับภาพได้ว่า มันเก่งแนวไหน

![60c031cb-18e8-4f47-8612-8afd52dd4bef.jpg](60c031cb-18e8-4f47-8612-8afd52dd4bef.jpg)

2. เข้าใจที่มา

พอเราเห็นแล้วว่า ChatGPT สามารถเอาข้อมูลสามารถนำข้อมูลมหาศาลมาตอบคำถามและเรียบเรียงเป็นข้อมูลใหม่ที่ไม่ได้มีอยู่ในโลกออนไลน์แบบตรงๆ

เพื่อให้เข้าใจการทำงานของมันได้ เบื้องต้นเราก็ลองหาที่มาที่ไปของมัน อย่างเช่น การที่เขาตั้งชื่อ ChatGPT มันมาจากไหน ลองสับย่อยคำดู ก็จะเป็น Chat + GPT คำแรกน่าจะรู้ความหมายอยู่แล้ว ว่าใช้คุยถามตอบ แต่คำหลัง GPT คืออะไร เช็คไวๆ ก็จะเจอว่ามันย่อมาจาก Generative Pre-trained Transformers เราก็ลองเช็คความหมายทีละคำ ซึ่งคำเหล่านี้ไม่ใช่คำศัพท์ใหม่เอี่ยม แต่มีอยู่ในวงการ AI อยู่แล้ว

คำสำคัญอยู่ที่ Transformers ที่แสดงถึงการทำงานของ ChatGPT คือรับข้อความ แปลงเป็นรูปแบบที่คอมพิวเตอร์เข้าใจ แล้วแปลงกลับเป็นข้อความที่คนเข้าใจ โดยใช้ความรู้จากการฝึกด้วยข้อมูลมหาศาลจากอินเทอร์เน็ต เพื่อตอบคำถามที่เกี่ยวข้องกับข้อความที่รับเข้ามา ผ่านการคิดพิจารณาอย่างรอบคอบ

ถึงจุดนี้เราก็พอจะรู้มากขึ้นแล้ว อาจจะพอเพียงเท่านี้ 😊 ไม่ก็ลองหาเปเปอร์ที่เข้าตีพิมพ์ไว้ เพื่อเข้าใจเชิงลึกต่อ 📜

![e2efe090-8020-4b7f-a13f-649b353dd6f3.jpg](e2efe090-8020-4b7f-a13f-649b353dd6f3.jpg)

3. ตกผลึกความรู้

เมื่อเราเข้าใจวิธีการทำงานของ ChatGPT แล้ว เราจะสังเกตเห็นว่ามันมีความรู้มหาศาลและความสามารถในการวิเคราะห์ข้อมูลเหล่านั้น แต่ความรู้ของมันจะถูกจำกัดอยู่ที่ข้อมูล ณ เวลาที่ถูกฝึก ยกตัวอย่างเช่น เคสวางแผนเที่ยว ChatGPT จะทราบว่าสถานที่ท่องเที่ยวในแผนเปิดให้บริการแน่นอน ณ ตอนที่มันถูกฝึก แต่มันจะไม่ทราบสถานะปัจจุบันของสถานที่เหล่านั้น

ดังนั้น หากต้องการให้ ChatGPT มีข้อมูลที่ทันสมัย เราจำเป็นต้องใช้เทคนิคต่างๆ 🛠️ เช่น ให้ข้อมูลเพิ่มเติมแก่มันในขณะที่ถาม หรือบอกให้มันวางแผนใหม่โดยคำนึงถึงการเปลี่ยนแปลงของสถานที่ท่องเที่ยวเหล่านั้น

![bd26207f-28c4-43cb-bacc-d5506b0f080f.jpg](bd26207f-28c4-43cb-bacc-d5506b0f080f.jpg)

4. ต่อยอด

😊 พอเรารู้ว่า ChatGPT ทำอะไรได้ รู้ที่มาแล้ว และได้ตกผลึกความเข้าใจ เราก็ควรต่อยอดความรู้นั้น เราควรลองเอา ChatGPT ไปใช้ให้สุดกว่านี้ในชีวิตประจำวัน และแล้วท้าทายโดยทำให้คนอื่นใช้ได้ด้วย

🧪 เราต้องลองสร้างอะไรซักอย่างมาพิสูจน์ เพื่อจะได้รู้ว่า ChatGPT รับ load ได้แค่ไหน และราคาเป็นอย่างไร แต่การเอาไปให้ใครใช้ก็ได้นั้น เราต้องมานั่งสอนให้เขาเขียน Prompt หรือข้อความในการถาม ChatGPT ให้เป็น ซึ่งอาจจะทำให้คนเข้าถึงยาก

💻 เราอาจจะเปลี่ยนเป็นมาเขียนเว็ปไซด์แทน ยกตัวอย่างจากในหัวข้อแรก เราสามารถสร้างเว็ปวางแผนท่องเที่ยว 🌴 โดยรับคำถามตามที่กำหนดไว้ เช่น อยากเที่ยวแถวไหน อยากเที่ยวแนวไหน อยากไปกี่วัน และระหว่างทริปอยากเดินทางยังไง แล้วเราก็เอาคำถามเหล่านี้ไปประกอบร่างเป็นข้อความไปถาม ChatGPT แล้วนำคำตอบมาแสดงผลให้สวยงาม อาจจะหารูปประกอบมาใส่ให้ด้วย คนเที่ยวจะได้เห็นภาพแผนการเที่ยวครบจบในที่เดียว 🗺️

ตอนเราทำโปรเจคพวกนี้ เราจะเจอปัญหาระหว่างทางที่รออยู่ เช่น เราจะทำยังไงให้เว็ปเราส่งคำถามไปให้ ChatGPT ได้ ซึ่งเราต้องหาช่องทาง คือ API 🔌 นอกจากนี้ เราอาจจะเจอผู้ใช้งานที่ถามคำถามรัวๆ ทำให้เราขาดทุนได้ 📉 เราจึงต้องศึกษาเรื่อง limit rate และถ้าจู่ๆ ทุกคนหันมาใช้เว็ปเราวางแผน เราก็ต้องไปศึกษาเรื่อง scaling อีกด้วย 📈

![2d500572-9376-4823-97f5-f7a797719d9c.jpg](2d500572-9376-4823-97f5-f7a797719d9c.jpg)

สุดท้ายนี้ เมื่อเรามีแนวคิดแบบนี้ 💡 เราจะสามารถนำเทรนการใช้งาน ChatGPT ได้บ้าง และยังได้เรียนรู้สกิลอื่นๆ เพิ่มเติมอีกด้วย 📚 ซึ่งจะช่วยเสริมความสามารถของเราให้ดียิ่งขึ้น 💪

เป็นอย่างไรกันบ้างกับเนื้อหาแนวนี้ 😊 มาแชร์กันได้ในคอมเมนต์เลยนะ 📝

เขียนโดย 🐹

เรียบเรียงโดย 🐹 & 🤖

![4ee98dd3-e90a-41f6-9a49-79fa9f20ff73.jpg](4ee98dd3-e90a-41f6-9a49-79fa9f20ff73.jpg)
  </POST>
  
  <POST>
  ---
title: อยากใช้ Gen AI นะ แต่เขียน Prompt ไม่เป็น
language: th
language-en-link: "[[en/Want-to-Use-Gen-AI-but-Don't-Know-How-to-Write-a-Prompt|Want-to-Use-Gen-AI-but-Don't-Know-How-to-Write-a-Prompt]]"
published: 2024-05-22
categories: learning
keywords:
  - GenAI
  - Generative AI
  - ChatGPT
extracted: '{  "summarize": "หลายคนอาจเจอปัญหาในการใช้ Generative AI โดยไม่สามารถถามคำถามได้ถูกต้อง แต่จริงๆ แล้วคุณเพียงต้องการเห็นตัวอย่างดีๆ ของ Prompt ที่เวิร์ค วันนี้เรารวมแหล่งตัวอย่างดีๆ จากผู้พัฒนาเอง เช่น OpenAI, Anthropic และ Google",  "keywords": ["Generative AI", "Prompt", "OpenAI", "Anthropic", "Google", "Prompt Engineering", "ChatGPT"]}'
---
![441580942_122116196402287989_7372035436482167927_n.jpg](441580942_122116196402287989_7372035436482167927_n.jpg)

หลายคนน่าจะเจอปัญหาว่า พยายามลองใช้ Generative AI แล้ว แต่สุดท้ายถามอะไรไปก็ตอบไม่ได้ อยากใช้ให้เป็น แต่ก็ไปไม่ถูก สงสัยคงต้องลงเรียนคอร์ส 🤔

แต่ช้าก่อน ✋ จริงๆแล้วคุณเพียงอยากได้เห็นตัวอย่างดีๆ ที่เขียน Prompt ออกมาแล้วเวิร์ค ได้คำตอบดังที่ต้องการ 💡 เช่นนั้นแล้ว วันนี้เลยรวมแหล่งตัวอย่างดีๆ จากต้นทางของผู้พัฒนาเอง 👨‍💻 เพราะใครจะไปรู้ดีกว่าผู้สร้างละ ลองเข้าไปดูได้ในลิงค์ข้างล่างเลย

🌟 OpenAI - ChatGPT

🔗 [https://platform.openai.com/examples](https://platform.openai.com/examples)

🌟 Anthropic - Claude 🔗 [https://docs.anthropic.com/en/prompt-library/library](https://docs.anthropic.com/en/prompt-library/library)

🌟 Google - Gemini 🔗 [https://ai.google.dev/gemini-api/prompts](https://ai.google.dev/gemini-api/prompts)

ส่วนใครอยากลงลึกไปกว่านั้น อยากเขียน Prompt ที่สามารถบังคับทิศทางของคำตอบได้ละเอียด อยากลองเป็น Prompt Engineering ทางผู้พัฒนาเอง 👨‍💻 ก็ได้รวบรวม Guideline และคำแนะนำดีๆ ที่เพียงปรับเล็กน้อยก็เพิ่มโอกาสความถูกต้องของคำตอบได้มาก 🎯 เราก็ได้รวมลิงค์ไว้ข้างล่างเช่นกัน

🔹 OpenAI 🔗 [https://platform.openai.com/docs/guides/prompt-engineering](https://platform.openai.com/docs/guides/prompt-engineering)

🔹 Anthropic 🔗 [https://docs.anthropic.com/en/docs/prompt-engineering](https://docs.anthropic.com/en/docs/prompt-engineering)

🔹 Google 🔗 [https://ai.google.dev/gemini-api/docs/prompting-strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)

ใครมี Use Case อะไรที่อยากมา Challenge ตัว Gen AI ทั้งหลาย แต่เขียน Prompt ไม่ถูก ลองส่งมาแชร์กันได้เลยนะ ไว้เจอกันใหม่ในโพสหน้า 👋
  </POST>
  
  <POST>
  ---
title: ไหนๆก็พูดถึง LLM เยอะแล้ว มารวมของฟรีให้
language: th
language-en-link: "[[en/Since-Weve-Talked-a-Lot-About-LLM-Here-Are-Some-Free-Ones|Since-Weve-Talked-a-Lot-About-LLM-Here-Are-Some-Free-Ones]]"
published: 2024-05-16
categories: learning
keywords:
  - GenAI
  - Generative AI
  - ChatGPT
extracted: '{  "summarize": "ผู้เขียนแนะนำ 3 ตัว AI ที่ใช้ฟรีและเก่งๆ ได้แก่ OpenAI - ChatGPT 4o, Anthropic - Claude 3 Sonnet และ Google - Gemini ซึ่งสามารถรับ input เป็นข้อความ ภาพ หรือเสียงได้ และมีฟีเจอร์เสริมให้คนทั่วไปเข้าถึงได้ง่าย",  "keywords": ["Generative AI", "OpenAI", "ChatGPT", "Anthropic", "Claude", "Google", "Gemini"]}'
---
ช่วงนี้โพสเกี่ยว Generative AI เยอะ 🧠 วันนี้เลยอยากมาแนะนำ AI ที่ใช้ฟรีและเก่ง ๆ ให้ทุกคนรู้จักกัน!

🌟 OpenAI - ChatGPT 4o 🔗 [https://chat.openai.com/](https://chat.openai.com/)

🌟 Anthropic - Claude 3 Sonnet 🔗 [https://claude.ai/](https://claude.ai/)

🌟 Google - Gemini 🔗 [https://gemini.google.com/](https://gemini.google.com/)

แค่ 3 ตัวนี้ ก็ทำได้หลากหลายมาก สามารถรับ input เป็นข้อความ ภาพ หรือเสียงได้ ถ้าตัว Gemini ส่งเป็นวีดีโอได้ด้วย ถ้าใช้ตัวจ่าย subscription $20 ก็จะได้ความฉลาดขึ้นมาอีกหน่อย ใน 3 ลิงก์นี้เป็นเวอร์ชันที่ใช้ง่าย และมีแบบฟรี แล้วมีฟีเจอร์เสริม ให้คนทั่วไปเข้าถึงได้ง่าย เช่น คำนวณสมการซับซ้อนได้ โดย AI จะส่งสมการเข้า Python แล้วเอาคำตอบมาให้เรา สิ่งเหล่านี้ตัว LLM ดิบๆ เดิมจะทำได้ไม่ค่อยเก่ง แต่ก็ไม่ใช่ปัญหาสำหรับเวอร์ชันนี้ 💪

กลับกันถ้าใครเป็น dev หรือเป็น tech savvy 💻 ชอบลองหาขีดจำกัดของเทคโนโลยี อยากแนะนำให้ไปเล่นในตัว playground ของแต่ละเจ้า

🔹 OpenAI 🔗 [https://platform.openai.com/playground/chat](https://platform.openai.com/playground/chat)

🔹 Anthropic 🔗 [https://console.anthropic.com/workbench/](https://console.anthropic.com/workbench/)

🔹 Google 🔗 [https://aistudio.google.com/app/prompts](https://aistudio.google.com/app/prompts)

ตอนมาใช้เว็บเวอร์ชั่นนี้ ก็จะไปเจอว่ามันมี config ให้ปรับแก้ได้อีกหลายจุด ซึ่งช่วยให้ทำงานได้ดีขึ้น ถึงแม้ว่าจะไม่ฟรี (ยกเว้นตัวของ Google ใช้ฟรี แต่จะต้องรอคิว) แนะนำว่าเติมเงินสัก $5 ก็ใช้ได้เยอะแล้ว ถ้าใช้ไม่หมดก็เก็บไว้ใช้เดือนถัดไปได้ ยิ่งใครชอบถามลักษณะที่ตัว LLM มันคล่อง มาใช่ตัวนี้อาจจะคุ้มกว่าเยอะเลย

ช่วงนี้จะเห็นข่าวทั้งเปิดตัว ChatGPT-4o 📣 ที่เห็นแล้ว ยอมใจในความพยายามให้เข้าถึงคนทั่วไปมากๆ มีฟีเจอร์อำนวนความสะดวกมาเพียบ แล้ววันต่อมาก็มี Gemini 1.5 Flash ที่ทำราคาลงมาได้ดีกว่าเดิมอีกหลายเท่า เข้าถึงง่ายแบบนี้ ลองใช้ดูแล้วมาแชร์ประสบการณ์กันใต้คอมเมนต์ได้เลย! ✨
  </POST>
  `, eng: `
  <POST>
  ---
title: How Can We Know What ChatGPT Can Do?
language-th-link: "[[จะรู้ได้ยังไงว่า-ChatGPT-ช่วยอะไรเราได้]]"
extracted: '{  "summarize": "To understand what ChatGPT can do, start by trying it thoroughly, asking questions on familiar topics and comparing its responses to Google search results. Then, explore its origin by understanding its name and how it processes information. Finally, crystallize its knowledge by recognizing its limitations and using techniques to keep its information updated.",  "keywords": ["ChatGPT", "AI", "Generative Pre-trained Transformers", "Travel Planning", "Natural Language Processing", "Machine Learning", "API"]}'
---
#HowADeveloperCanKnowWhatItCanDo

After a year of ChatGPT 4 being out 🎉, we've seen it applied in numerous ways 🌟, both directly visible and behind the technology we use today. But how do we suddenly know 🤔 what it can do ❓ Today, I'm sharing the approach we use to explore its potential 🔍💡.

Let's start by imagining we are among the first to try out ChatGPT 4. We ask it anything, and it seems to answer everything. How do we know what it does well and what it doesn't? At that time, no one had shared that we should ask it like this or that, or that certain types of questions require certain patterns.

Alright, if it were us, we'd start something like this. Let's explore together. 
![img-hRymhvO36HX2CJ9SXvrKFhzn.png](img-hRymhvO36HX2CJ9SXvrKFhzn.png)

1. Try Everything Thoroughly

It's not just about trying anything randomly. Initially, we should test it according to its intended purpose. In this case, it’s a chat AI that claims to know a lot, so we should ask it questions. To accurately gauge its capabilities, we should start with topics we are familiar with. For instance, if we like backpacking and need to plan a trip, we have to check details like travel routes, whether there are trains or buses, if the destination is open during our desired time, if it’s the right season, and if there’s accommodation.

So, let's say we want to go to Japan in June for 3-4 days, looking for an adventurous trip. Are there places to visit?

Let's ask ChatGPT and also search on Google ourselves. Without even opening the first website, ChatGPT responds right away. But is it correct? Let's see.

Starting with Google, when planning a trip to less popular places, the information on each website usually answers about 30-40% of our questions. We have to check several websites to gather 100% of the information we need and do some additional searches to verify our information.

Conversely, ChatGPT gives an answer immediately, possibly because we asked a suitable question. It’s quite surprising how it provides a well-organized plan, detailing Day 1, Day 2, etc. We can cross-check the suggested places, and it even considers distances between places, ensuring feasible travel plans. Using ChatGPT saves us a lot of time, as we can directly move to the verification step. However, relying on it 100% might result in surprises, like some places being closed.

Seeing its ability to summarize well, we might start asking more complex or unfamiliar topics. By experimenting extensively, we begin to understand its strengths. 

![60c031cb-18e8-4f47-8612-8afd52dd4bef.jpg](60c031cb-18e8-4f47-8612-8afd52dd4bef.jpg)

2. Understanding the Origin

Once we see that ChatGPT can use vast amounts of information to answer questions and create new data not directly available online, we need to understand its workings. For starters, let's find out where its name comes from. "ChatGPT" breaks down into Chat + GPT. We know "Chat" means conversational, but what is GPT? Quickly checking, it stands for Generative Pre-trained Transformers. We then explore these terms, which already exist in the AI field.

The key term is "Transformers," indicating how ChatGPT processes information: receiving text, transforming it into a format computers understand, then converting it back into human-readable text, using vast training data from the internet to answer related questions thoughtfully.

By this point, we understand more. This might be enough 😊, or we might look for published papers for deeper insights 📜. 

![e2efe090-8020-4b7f-a13f-649b353dd6f3.jpg](e2efe090-8020-4b7f-a13f-649b353dd6f3.jpg)

3. Crystallizing Knowledge

Understanding how ChatGPT works, we see it possesses immense knowledge and can analyze data, but its knowledge is limited to the data at the time of training. For example, in travel planning, ChatGPT knows which tourist spots are open when it was trained but not their current status.

To keep ChatGPT’s information updated, we need to use techniques 🛠️ such as providing additional data while asking questions or instructing it to plan considering recent changes in tourist spots.

![bd26207f-28c4-43cb-bacc-d5506b0f080f.jpg](bd26207f-28c4-43cb-bacc-d5506b0f080f.jpg)

4. Expanding Further

😊 Once we know what ChatGPT can do and understand its origin and our crystallized understanding, we should take it further. We should try to integrate ChatGPT into our daily lives and challenge others to use it.

🧪 We need to create something to test its load capacity and cost. However, letting anyone use it means teaching them to write effective prompts, which might be challenging.

💻 Alternatively, we could develop a website. From the first example, we can create a travel planning site 🌴 that asks specified questions like travel preferences, destinations, and travel methods during the trip. These questions can then be formatted into a prompt for ChatGPT, and the response can be displayed attractively, perhaps with images for visualization, providing a complete travel plan 🗺️.

In developing such projects, challenges will arise, like how to send questions to ChatGPT via API 🔌. We might also face issues with users overloading the system, risking losses 📉. Therefore, we need to study rate limiting, and if the website gains popularity, we must consider scaling 📈.

![2d500572-9376-4823-97f5-f7a797719d9c.jpg](2d500572-9376-4823-97f5-f7a797719d9c.jpg)

In conclusion, having such an approach 💡 allows us to follow trends in using ChatGPT and learn additional skills 📚, enhancing our capabilities 💪.

What do you think of this kind of content? 😊 Share your thoughts in the comments 📝.

Written by 🐹

Compiled by 🐹 & 🤖

![4ee98dd3-e90a-41f6-9a49-79fa9f20ff73.jpg](4ee98dd3-e90a-41f6-9a49-79fa9f20ff73.jpg)
  </POST>
  
  <POST>
  ---
title: How to Adapt to LLM (Gen AI) as a Fresh Graduate
language-th-link: "[[จบใหม่มา-จะปรับตัวอย่างไรกับ-LLM-(Gen-AI)]]"
extracted: '{  "summarize": "The post discusses how fresh graduates can adapt to using Large Language Models (LLM) or Gen AI tools to aid in their learning and work. These tools can provide answers to technical questions, explain industry terms, and even write code. By leveraging Gen AI, fresh graduates can shift their focus from repetitive tasks to understanding and working effectively.",  "keywords": ["Gen AI", "LLM", "fresh graduates", "learning", "programming", "language tools", "ChatGPT"]}'
---

But it's not just for fresh graduates, everyone can read 📚

![How-to-Adapt-to-LLM-(Gen-AI)-as-a-Fresh-Graduate.jpg](How-to-Adapt-to-LLM-(Gen-AI)-as-a-Fresh-Graduate.jpg)

Today, I'm sharing some experiences, mainly aimed at those in programming, but useful for other fields too.

Currently, there are many AI language tools (LLM) like ChatGPT, Claude, Gemini, and LLaMa that can generate text responses to our questions 💬. We can ask them questions with text, images, or even videos. However, there's no guarantee that the answers will always be correct. So, how can these tools be beneficial for fresh graduates? 🤔

One interesting thing about these tools is that you don't need deep knowledge to use Gen AI effectively. You can simply ask direct questions about what you're learning or working on, such as:

If you're creating an e-commerce website and face issues like loading a large number of products without slowing down the site or crashing the server due to heavy data transfer, how do you solve that?

Traditionally, when learning something new, we would search Google and read through Stack Overflow, hoping the keywords we type will lead us to the right answers 🔍.

In the era of Gen AI, we should try using these tools to answer our questions. For example, try searching:

"I'm writing a website with React. How do you optimize your website when it needs to load and display a lot of data?"

It will spit out technical terms like Lazy Load, Code Splitting, Optimizing Renders, Performance Monitoring, and Profiling, along with explanations ⚡️. When asking, you'll notice that you can ask in a roundabout way, and it will lead you to the information or terms used in the industry. You can even ask it to provide examples and explain the code. This removes many obstacles in our learning process 😆.

Learning in the modern world has changed significantly. We no longer need to join communities to gather industry-specific knowledge or learn the jargon before searching for answers. The language barrier is also lower because we can ask questions in Thai. So, in this era, our focus should shift more towards understanding. Repetitive tasks are handled better by Gen AI, which can write code and design web pages for us, especially if we know how to ask correctly. Just like how we need to ask the right questions to search on Google, Gen AI helps us get our work done faster with fewer people writing code. Ultimately, we still need someone who truly understands to review and lead to the real goal 🎯. Will that person be us? This is where fresh graduates need to adapt, shifting from just being able to work to working effectively and correctly 👍. These tools will help us achieve that.

I hope today's post opens up a new perspective on learning 🌟. Next time, I'll share more about how Gen AI can do even more than you think. Stay tuned to see how 🔮.
  </POST>
  
  <POST>
  ---
title: LLM Gen AI and Security
language-th-link: "[[LLM-Gen-AI-กับ-ความปลอดภัย]]"
extracted: '{  "summarize": "When using Generative AI in the workplace, consider security measures such as protecting sensitive data, reviewing generated content, and evaluating data usage by AI services. Implementing guardrails and using alternative versions can help. Study thoroughly before implementing Gen AI.",  "keywords": ["Generative AI", "security", "data protection", "sensitive data", "guardrails", "AI services", "workplace"]}'
---

![img-PY66Wa99IDGn9sUOhW3sNgqT_upscayl_2x_realesrgan-x4plus-anime.jpg](img-PY66Wa99IDGn9sUOhW3sNgqT_upscayl_2x_realesrgan-x4plus-anime.jpg)

After previously sharing ideas about what Generative AI can do, today we will continue with considerations regarding security 🔒 when using Gen AI in the workplace. For those planning to incorporate Gen AI into their organization or use it with sensitive data, please read on 📝.

Gen AI tools are developed to enhance our work efficiency. However, besides considering how they can help us, we must also think about security 🔒, such as:

1️⃣ The data entered into Gen AI should consider user information security (PII), especially sensitive data 🔒. We should not directly send such data to Gen AI. Important data should be removed or replaced with other information first. For instance, if the user’s name is Alpha, we might change it to A before sending the data to Gen AI for processing 🔍. Additionally, we should be cautious of malicious users who may input data that could be misused. Therefore, a data screening process before inputting into the system is necessary.

2️⃣ The data generated by Gen AI may contain inappropriate or negative terms due to the initial training data. Sometimes, even with well-phrased questions, the answers received may include such terms. Thus, there must be methods to review and filter the content before passing it to users 🔍.

For more information on points 1️⃣ and 2️⃣, try searching with the term "Guardrail.”

3️⃣ Another aspect to consider when using Gen AI through various services is that the text we send may be used for further training or other purposes. Therefore, we should evaluate the importance of the data we send and thoroughly check whether the service we use further trains on our data. Generally, when we use Gen AI Chat from providers like OpenAI ([[chatgpt.com]]) or Google ([[gemini.google.com]]), the data is used for further training, which we may not desire 😕. Hence, we should consider using other versions that do not do this, such as using OpenAI's Playground instead. If still concerned, these services also offer options to run AI on our own devices, adding an extra layer of protection and controlling access to that device 💻 to ensure that no data is secretly sent elsewhere.

These are the examples prepared. All of these are just initial considerations. If planning to use Gen AI seriously in an organization, it’s advisable to study further and thoroughly before implementing it.

In this era where Generative AI plays a significant role, we should learn and understand it well to use it safely and efficiently. I hope this post provides new perspectives on using Generative AI and the precautions to be aware of 😊.
  </POST>
  
  <POST>
  ---
title: Short-term Memory of Gen AI
language-th-link: "[[ความจำระยะสั้น-ของ-Gen-AI]]"
extracted: '{  "summarize": "Improve Gen AI accuracy by attaching relevant documents and instructing it to use only that knowledge to answer. This method enhances accuracy but slows down response time. Try it for specialized questions and adjust your asking method for better results.",  "keywords": ["Gen AI", "accuracy", "documents", "knowledge", "Q&A", "response time", "specialized questions"]}'
---

![PreviewCard.png](PreviewCard.png)

TL;DR When asking specialized questions, instead of asking directly, try attaching relevant documents and instructing the Gen AI to use only the knowledge from those documents to answer. This method significantly improves the accuracy of the responses.

Many people use Generative AI, such as ChatGPT or Gemini, for Q&A, similar to a general Google search 🔍. This method pulls information from the long-term memory of the Gen AI, which is the knowledge learned during model training. It's like recalling what we read last week before taking an exam 📚. The advantage is convenience and quick access, but the downside is that the remembered knowledge might be inaccurate or outdated, leading to potential errors in the answers.

To make Gen AI work with controllable, whether it's newer or more reliable knowledge, the concept of short-term memory emerged. Compared to humans, it's like taking an exam with summaries or books open for reference. This method greatly enhances the accuracy of the answers but also has a drawback: it slows down the response time ⏱️ because it involves searching for the answers in the documents. For Gen AI, it's similar. If we feed a lot of information, it will slow down its responses. However, compared to humans, even the slow response of Gen AI is still faster than us 💨.

Try it out! If you have specialized questions that require in-depth answers, change the way you ask. Attach relevant documents, such as a 100-page PDF, and request the AI to use the information from that document to respond. You might get more precise answers.

Additionally, if the accuracy is still unsatisfactory, try adjusting the way you ask Gen AI. Instead of just asking directly, instruct the AI to specify the source of the information it uses to answer. If it's a book, ask for the page number, or if it's a long article, ask for the exact text block. From personal experience, this method helps Gen AI provide much more satisfying answers 👍.

How did it go? Share your experiences in the comments!
  </POST>
  
  <POST>
  ---
title: Since We've Talked a Lot About LLM, Here Are Some Free Ones
language-th-link: "[[ไหนๆก็พูดถึง-LLM-เยอะแล้ว-มารวมของฟรีให้]]"
extracted: "{  \"summarize\": \"Discover three free and powerful AI tools: OpenAI's ChatGPT 4o, Anthropic's Claude 3 Sonnet, and Google's Gemini. These tools offer a range of capabilities, including text, image, and audio input. They also provide easy-to-use free versions with additional features.\",  \"keywords\": [\"Generative AI\", \"ChatGPT\", \"Anthropic\", \"Google Gemini\", \"AI tools\", \"LLMs\", \"Artificial Intelligence\"]}"
---

Recently, I've been posting a lot about Generative AI 🧠. Today, I want to introduce some free and powerful AI tools that everyone should know about!

🌟 **OpenAI - ChatGPT 4o** 🔗 [https://chat.openai.com/](https://chat.openai.com/)

🌟 **Anthropic - Claude 3 Sonnet** 🔗 [https://claude.ai/](https://claude.ai/)

🌟 **Google - Gemini** 🔗 [https://gemini.google.com/](https://gemini.google.com/)

These three tools alone offer a wide range of capabilities. They can accept input in the form of text, images, or audio. If you use Gemini, it can even handle videos. With a $20 subscription, you can get even smarter functionalities. These links provide easy-to-use, free versions with additional features that are accessible to everyone. For example, they can solve complex equations by sending the equations to Python and returning the answers. This is something raw LLMs struggled with, but it's not an issue for these versions 💪.

On the other hand, if you're a developer or tech-savvy 💻 and enjoy exploring the limits of technology, I recommend trying the playground versions of each.

🔹 **OpenAI** 🔗 [https://platform.openai.com/playground/chat](https://platform.openai.com/playground/chat)

🔹 **Anthropic** 🔗 [https://console.anthropic.com/workbench/](https://console.anthropic.com/workbench/)

🔹 **Google** 🔗 [https://aistudio.google.com/app/prompts](https://aistudio.google.com/app/prompts)

When you use these web versions, you'll find that there are many configurable options that can enhance performance. Although they are not free (except for Google's, which is free but requires waiting in a queue), adding $5 can provide substantial usage. If you don't use it all, you can carry it over to the next month. Especially for those who like to ask about the nuances that LLMs handle smoothly, these versions might be much more worthwhile.

Recently, we've seen the launch of ChatGPT-4o 📣, which is impressive in its effort to be accessible to the general public with many convenience features. The next day, Gemini 1.5 Flash was released, offering a much better price point. With such easy access, give them a try and share your experiences in the comments below! ✨
  </POST>
  
  <POST>
  ---
title: Want to Use Gen AI but Don't Know How to Write a Prompt
language-th-link: "[[อยากใช้-Gen-AI-นะ-แต่เขียน-Prompt-ไม่เป็น]]"
extracted: '{  "summarize": "Get effective Generative AI responses with well-written prompts from developers. Check out examples and guidelines from OpenAI, Anthropic, and Google. Improve prompt engineering skills for accurate results.",  "keywords": ["Generative AI", "Prompts", "OpenAI", "Anthropic", "Google", "Prompt Engineering", "AI"]}'
---

![441580942_122116196402287989_7372035436482167927_n.jpg](441580942_122116196402287989_7372035436482167927_n.jpg)

Many people might face the issue of trying to use Generative AI but ending up with unsatisfactory responses. You want to use it effectively but don't know how. It feels like you might need to take a course 🤔.

But wait ✋, actually, you just need to see good examples of well-written prompts that work and get the desired responses 💡. With that in mind, today I’m sharing some great sources directly from the developers themselves 👨‍💻. Who knows better than the creators, right? Check out the links below.

🌟 OpenAI - ChatGPT

🔗 [OpenAI Examples](https://platform.openai.com/examples)

🌟 Anthropic - Claude

🔗 [Anthropic Prompt Library](https://docs.anthropic.com/en/prompt-library/library)

🌟 Google - Gemini

🔗 [Google Gemini Prompts](https://ai.google.dev/gemini-api/prompts)

For those who want to delve deeper, write prompts that can precisely direct the responses, and try their hand at Prompt Engineering, the developers 👨‍💻 have also compiled guidelines and excellent tips. Just a few tweaks can significantly increase the accuracy of the responses 🎯. We’ve included the links below as well.

🔹 OpenAI

🔗 [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

🔹 Anthropic

🔗 [Anthropic Prompt Engineering Docs](https://docs.anthropic.com/en/docs/prompt-engineering)

🔹 Google

🔗 [Google Prompting Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)

If you have any Use Cases you want to challenge Gen AI with but don't know how to write the prompts, feel free to share them. See you in the next post 👋.
  </POST>
  ` }
