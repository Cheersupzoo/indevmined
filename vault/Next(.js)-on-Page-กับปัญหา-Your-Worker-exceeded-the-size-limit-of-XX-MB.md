---
title: Next(.js) on Page กับปัญหา Your Worker exceeded the size limit of XX MB
language: th
language-en-link: '[[en/Next(.js)-on-Page-and-the-"Your-Worker-exceeded-the-size-limit-of-XX-MB"-Issue|Next(.js)-on-Page-and-the-"Your-Worker-exceeded-the-size-limit-of-XX-MB"-Issue]]'
published: 2024-12-20
categories: Problem Solving
keywords:
  - GenAI
  - Next.js
  - Cloudflare
  - Cloudflare Page
  - Cloudflare Worker
extracted: ""
reading-time: 4
draft: false
description: วิธีแก้ปัญหาเมื่อ Next.js app ที่ deploy บน Cloudflare Pages มีขนาดไฟล์เกิน 1MB โดยใช้ next/dynamic แทน React.lazy เพื่อหลีกเลี่ยง SSR ของ component ที่มีขนาดใหญ่
---
![](Screenshot%202567-12-19%20at%2017.58.36.png)

ไม่ว่าจะด้วยเหตุผลใดก็ตาม ที่อยากจะนำ [Next.JS](https://nextjs.org) มา deploy ลง Cloudflare Page และอยากใช้ [Server-side Rendering (SSR)](https://nextjs.org/docs/app/building-your-application/rendering) ทำให้ลงเอยไปใช้ [next-on-pages](https://github.com/cloudflare/next-on-pages) ที่รันบน [Cloudflare Page Function](https://developers.cloudflare.com/pages/) (wrapper Cloudflare Worker)

> หากสนใจเฉพาะทางออก คลิกเพื่อ[กระโดดไปตอนท้าย](#ทางออก)ได้เลย

## ปัญหา

เมื่อเราเพิ่มฟีเจอร์ให้เว็ปเราไปถึงจุดหนึ่ง ก็ไม่ใช่เรื่องแปลกที่จะเจอข้อจำกัด หรือ Error อย่างในวันนี้ หากเราตีความตาม Log ที่เห็น คือไฟล์ `Function` ที่เรา build ออกมา เวลารันคำสั่ง _bash`pnpm next-on-pages && wrangler pages deploy`_ แล้วมีขนาดใหญ่เกิน 1 MiB (ปัจจุบัน Free Tier ให้ 3 MiB)

พอรู้ปัญหาแล้ว ทีนี้ เราจะแก้ยังดีต่อละ ??

## กระบวนการไปหาทางออก

### หาจุดเทียบเคียง
เวลาเราเจอปัญหาใหม่ๆ ก็เหมือนมืดแปดด้าน จะเริ่มยังไงดี

ส่วนตัว แนะนำให้หาจุดเทียบเคียงก่อน เทียบกับก่อนหน้าที่มีปัญหา

อย่างในกรณีนี้ เราก็ไปดูว่า ครั้งล่าสุดที่เรา build แล้วไม่พังคือตอนไหน

![](Screenshot%202567-12-19%20at%2022.29.02.png)

### มองหาสิ่งที่เปลี่ยนไป
พอเรารู้แล้วว่าจุดเปลี่ยนจุดไหนที่เริ่มทำให้ build failed เราก็มาหาต้นตอกันต่อว่า อะไรคือที่มาของ error

อย่างแรกที่ควรลอง คือลอง checkout ไปทั้งสอง commit นั้น แล้ว build ออกมาดู เอา build output มาเทียบกัน แล้วเวลาเราทำงานกับ Next.JS เราก็นิยมดูผลลัพธ์จาก `vercel build`

```bash before.log
...
▲  ✓ Generating static pages (5/5)
▲  Finalizing page optimization ...
▲  Collecting build traces ...
▲  
▲  Route (app)                              Size     First Load JS
▲  ┌ ƒ /                                    36.8 kB         138 kB
...
▲  ├ ƒ /error                               1.08 kB         102 kB
▲  ├ ○ /icon.svg                            0 B                0 B
▲  ├ ○ /privacy-policy                      1.07 kB        88.2 kB
▲  ├ ƒ /signin                              1.08 kB         102 kB
▲  ├ ○ /terms-of-service                    1.07 kB        88.2 kB
# !mark gold
▲  └ ƒ /workbench                           7.93 kB         109 kB
▲  + First Load JS shared by all            87.2 kB
▲  ├ chunks/376-ae8867d1f8dbbcbb.js       31.5 kB
▲  ├ chunks/f14ca715-3ecd66d7a69888bb.js  53.6 kB
▲  └ other shared chunks (total)          1.98 kB
▲  
▲  
▲  ƒ Middleware                             103 kB
▲  ○  (Static)   prerendered as static content
▲  ƒ  (Dynamic)  server-rendered on demand
...
```

```bash after.log
...
▲  ✓ Generating static pages (5/5)
▲  Finalizing page optimization ...
▲  Collecting build traces ...
▲  
▲  Route (app)                              Size     First Load JS
▲  ┌ ƒ /                                    36.8 kB         138 kB
...
▲  ├ ƒ /error                               1.09 kB         102 kB
▲  ├ ○ /icon.svg                            0 B                0 B
▲  ├ ƒ /payment-success                     1.09 kB         102 kB
▲  ├ ○ /privacy-policy                      1.07 kB        88.5 kB
▲  ├ ƒ /signin                              1.09 kB         102 kB
▲  ├ ○ /terms-of-service                    1.07 kB        88.5 kB
# !mark gold
▲  └ ƒ /workbench                           95.4 kB         196 kB
▲  + First Load JS shared by all            87.4 kB
▲  ├ chunks/376-8534b4cf2341312a.js       31.7 kB
▲  ├ chunks/f14ca715-5320c06222168bec.js  53.6 kB
▲  └ other shared chunks (total)          2.04 kB
▲  
▲  
▲  ƒ Middleware                             103 kB
▲  ○  (Static)   prerendered as static content
▲  ƒ  (Dynamic)  server-rendered on demand
...
```

จากการเทียบเคียง และสังเกต เราจะเห็นได้ว่า route `/workbench` มีขนาดใหญ่ขึ้น 7.93 kB -> 95.4 kB อย่างเห็นได้ชัด แต่ตัวเลขนี้ก็ยังดูห่างไกลจาก 1 MiB ไปอย่างมาก

หากเรามาลองคิดดูดีๆ อีกที จะพบว่า ตัวเลขที่ได้จาก `vercel build` เป็นขนาดที่ฝั่ง client จะได้รับ ไม่ใช่ขนาดของ Script ที่จะรันบน CF Page Function เพราะฉะนั้น เราควรมองหาขนาดที่แท้จริง ที่ Cloudflare ใช้ในการวัด

หลังจากลองไปอ่าน document และลองปะติดปะต่อ การทำงานของ `next-on-page` ได้พักหนึ่ง ก็ตกตะกอนว่า เราควรดูขนาดที่ได้จาก _bash`wrangler pages functions build --build-output-directory .vercel/output/static`_ เพราะมันเป็นขนาดของ ไฟล์ที่ผ่าน build process ของ Cloudflare อีกที และจะถูกใช้อัพขึ้น CF Page Worker

```bash @noWrap before.log
⚡️ Generated '.vercel/output/static/_worker.js/index.js'.
⚡️ Build completed in 1.73s
Attaching additional modules:
┌─────────────────────────────────────────────────────────────────────┬──────┬─────────────┐
│ Name                                                                │ Type │ Size        │
├─────────────────────────────────────────────────────────────────────┼──────┼─────────────┤
...
│ __next-on-pages-dist__/functions/src/middleware.func.js             │ esm  │ 345.49 KiB  │
├─────────────────────────────────────────────────────────────────────┼──────┼─────────────┤
# !mark gold
│ __next-on-pages-dist__/functions/workbench.func.js                  │ esm  │ 453.30 KiB  │
├─────────────────────────────────────────────────────────────────────┼──────┼─────────────┤
...
│ __next-on-pages-dist__/webpack/f7f1f910724912e1fde53d8f6775020d.js  │ esm  │ 259.86 KiB  │
├─────────────────────────────────────────────────────────────────────┼──────┼─────────────┤
│ Total (36 modules)                                                  │      │ 2363.35 KiB │
└─────────────────────────────────────────────────────────────────────┴──────┴─────────────┘
```

```bash @noWrap after.log
⚡️ Generated '.vercel/output/static/_worker.js/index.js'.
⚡️ Build completed in 2.38s
Attaching additional modules:
┌─────────────────────────────────────────────────────────────────────┬──────┬─────────────┐
│ Name                                                                │ Type │ Size        │
├─────────────────────────────────────────────────────────────────────┼──────┼─────────────┤
...
│ __next-on-pages-dist__/functions/src/middleware.func.js             │ esm  │ 345.49 KiB  │
├─────────────────────────────────────────────────────────────────────┼──────┼─────────────┤
# !mark gold
│ __next-on-pages-dist__/functions/workbench.func.js                  │ esm  │ 2449.81 KiB │
├─────────────────────────────────────────────────────────────────────┼──────┼─────────────┤
...
│ __next-on-pages-dist__/webpack/f7f1f910724912e1fde53d8f6775020d.js  │ esm  │ 259.86 KiB  │
├─────────────────────────────────────────────────────────────────────┼──────┼─────────────┤
│ Total (36 modules)                                                  │      │ 4450.53 KiB │
└─────────────────────────────────────────────────────────────────────┴──────┴─────────────┘
```

พอเห็นตัวเลขของไฟล์ ที่กระโดดมา 453.30 KiB -> 2449.81 KiB (~2.4 MiB) ก็จะเริ่มเห็นภาพชัดแล้วว่า ต้นตอของปัญหาจริงๆ อยู่ที่ไหน ซึ่งก็หนี้ไม่พ้น ไฟล์ `__next-on-pages-dist__/functions/workbench.func.js` ที่มีขนาดเกิน 1 MB

> ข้อสังเกตุที่น่าสนใจคือ Worker Size Limit เขาวางกฏยังไง เขาดูที่ไฟล์ทั้งหมดรวมกัน หรือแยกกัน เพราะเวลาเราไปดูการ [Routing](https://developers.cloudflare.com/pages/functions/routing) หรือ [Limit](https://developers.cloudflare.com/workers/platform/limits/#account-plan-limits) ก็ไม่มีตรงไหนบอกว่า เอาขนาดส่วนไหนมาคิด แต่พอเราดูตัวเลขจากข้างบน ไม่ว่าจะก่อน หรือหลังการแก้ไข 2363.35 KiB vs 4450.53 KiB ก็ล้วน เกิน 1 MB (Current 3 MB) ทั้งนั้น แสดงว่า เอาขนาดแต่ละไฟล์ย่อยมาคิด
> ![](Screenshot%202567-12-19%20at%2023.34.16.png)

พอเรารู้ว่าไฟล์ไหนมีขนาดเกิน เราก็ไล่ดูต่อว่า บรรทัดไหนที่เพิ่มเข้ามา โดยเริ่มที่จากการ ไล่ Diff (Difference) ระหว่าง 2 commit นี้ `1b6bf08` กับ `cde7e3a`

<p><img src="/Screenshot%202567-12-19%20at%2022.47.04.png" alt="compare commit" width="450" style={{margin: "0 auto"}} /></p>

> นี้เป็นตัวอย่างที่ดีว่า ทำไมเราถึงควรเรียนรู้วิธีใช้ Git และเรียนรู้ว่า commit ที่ดีควรหน้าตายังไง ควรตั้งชื่อ commit ยังไง ใน commit ควรใหญ่แค่ไหน หรือเมื่อไหร่ควรแยก commit เมื่อไหร่ควร squash and merge หรือ merge commit เพราะถ้าเราเลือกถูกวิธี ผลลัพธ์ที่ควรได้คือ เรามี history ที่ชัดเจน สื่อสารเข้าใจว่ามีอะไรเกิดขึ้นกับโค๊ดบ้าง

เราก็จะกลับมาไล่ดูว่า ไฟล์ไหน ที่เกี่ยวข้องกับ `src/app/workbench/page.tsx` โดยดูว่ามี import หรือ import ของ import ไหนบ้างที่มีไฟล์ใน Diff 2 commit นี้

ในกรณีนี้คือ ไฟล์ `AIBlock.tsx` ที่เพิ่ม Markdown Parser แล้วตัว Parser นี้ก็มีขนาดใหญ่เกิน 1 MB เลยทำให้ `workbench.func.js` ขนาดเกิน

> วิธีเช็คไวๆ ว่าฟีเจอร์ไหน ทำให้ขนาดเพิ่มมาเท่าไหร่ ให้ลอง Build เทียบระหว่างปิดฟีเจอร์ กับเวลาเปิดฟีเจอร์ ว่าขนาดเพิ่มขึ้นมาเท่าไหร่ หากนึกวิธีปิดฟีเจอร์ไม่ออก ก็ใช้วิธีการ Comment บรรทัดที่ใช้ฟีเจอร์นั้นๆ เอา

## รับมือกับปัญหา

พอรู้แล้วว่าต้นตอของปัญหาคืออะไร เราก็ต้องเลือกวิธีจัดการกับปัญหานี้ ซึ่งก็ต้องลงมาดูว่าฟีเจอร์นี้ มีความสำคัญกับ SSR ไหม มีจังหวะไหน ที่เราต้องการ Render Markdown ก่อนถึงมือ Client ไหม

ในกรณีนี้ เราไม่ได้ใช้ Render Markdown ในฝั่ง SSR ดังนั้น เราสามารถเลือกที่จะ lazy-loaded React Component นี้ได้

```ts page.tsx
// !diff -
import { AIBlock } from "./AIBlock.tsx";
// !diff(1:4) +
import { lazy } from "react";
const AIBlock = lazy(() =>
  import("./AIBlock.tsx").then((m) => ({ default: m.AIBlock }))
);
// ...Function Render Component...
```

แก้เสร็จ เรามาลองเทสดู

ผลลัพธ์จาก _bash`vercel build`_ มีขนาดเล็กลง แต่  _bash`wrangler pages functions build --build-output-directory .vercel/output/static`_ กลับให้ขนาดที่แทบเท่าเดิม

```bash @noWrap before.log
├───────────────────────────────────────────────────────┼──────┼─────────────┤
│ __next-on-pages-dist__/functions/workbench.func.js    │ esm  │ 2449.81 KiB │
├───────────────────────────────────────────────────────┼──────┼─────────────┤
```

```bash @noWrap after.log
├───────────────────────────────────────────────────────┼──────┼─────────────┤
│ __next-on-pages-dist__/functions/workbench.func.js    │ esm  │ 2450.28 KiB │
├───────────────────────────────────────────────────────┼──────┼─────────────┤
```

Before vs After -> 2449.81 KiB vs 2450.28 KiB ไม่ค่อยเป็นที่น่าพึงพอใจเท่าไหร่ พอเราเห็นว่าผลลัพธ์ไม่ได้ดังที่คิด ก็เป็นเวลาที่ดีที่เราควรเปิดเช็ค [Next.js Lazy Loading Documentations](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#skipping-ssr)

![](Screenshot%202567-12-20%20at%2012.22.58.png)

หากเราอ่านเพียงเท่านี้ ก็อาจจะตีความได้ว่า `React.lazy()` ให้ผลลัพธ์เหมือนกันกับ `next/dynamic` แต่ถ้าเราเลื่อนลงไปดูตัวอย่าง **Skipping SSR**

![](Screenshot%202567-12-20%20at%2012.25.25.png)

จะพบว่า ถึงแม้ `React.lazy()` จะ lazy load จริงบน Client แต่บน Server ก็ยังทำการ pre-rendering ให้ด้วย เลยทำให้ `workbench.func.js` ต้องแนบฟีเจอร์ Render Markdown มาด้วย ส่งผลให้ขนาดไม่ได้ลดลง

## ทางออก
ในที่สุดก็มาถึงทางออกจริงๆ แล้ว เพียงเราเปลี่ยนจาก `React.lazy()` ไปใช้ `next/dynamic` แทน รวมกับใส่ options _js`{ ssr: false }`_

```ts page.tsx
// !diff(1:4) -
import { lazy } from "react";
const AIBlock = lazy(() =>
  import("./AIBlock").then((m) => ({ default: m.AIBlock }))
);
// !diff(1:5) +
import dynamic from "next/dynamic"
const AIBlock = dynamic(() =>
  import("./AIBlock").then((m) => ({ default: m.AIBlock })),
  { ssr: false }
);
// ...Function Render Component...
```

แล้วเมื่อ build ออกมา

```bash @noWrap before.log
├───────────────────────────────────────────────────────┼──────┼─────────────┤
│ __next-on-pages-dist__/functions/workbench.func.js    │ esm  │ 2449.81 KiB │
├───────────────────────────────────────────────────────┼──────┼─────────────┤
```

```bash @noWrap after.log
├───────────────────────────────────────────────────────┼──────┼─────────────┤
│ __next-on-pages-dist__/functions/workbench.func.js    │ esm  │ 455.59 KiB  │
├───────────────────────────────────────────────────────┼──────┼─────────────┤
```

ขนาดเหลือไม่ 1 MB แล้ว Deploy Success! Yay!

![](yay-disney-zootopia.webp)
Happy Very Funny GIF by Disney Zootopia

> ข้อควรระวัง เวลาเราใช้ `React.lazy()` หรือ `next/dynamic` อย่าลืมคิดถึงจังหวะที่ Component ต้อง lazy-load ด้วย เพราะเมื่อเราใช้วิธีเหล่านี้ จะทำให้เห็นจังหวะที่ UI กระตุก ซึ่งอาจทำให้ดูน่าหงุดหงิดสำหรับผู้ใช้
> 
> ทางออกที่มีคือ อาจเลือกที่จะใส่ Suspense หรือ options loading เพื่อแสดง fallback ระหว่างรอ Component กำลังโหลด
## สรุป
เมื่อเราปัญหาที่ ต่อให้เสริช Stackoverflow แล้วไม่เจอ ก็ใช่ว่าจะไม่มีทางออกซะทีเดียว หากเพียงค่อยๆ มองหาทางออกอย่างเป็นระบบ เริ่มจากตีกรอบให้แคบลงมาจนหาต้นตอของปัญหาได้ แล้วมองหาวิธีแก้ ถ้าเสริชตรงๆไม่มี เราก็ต้องศึกษาเครื่องมือที่เราใช้เอาเอง เริ่มจากอ่าน docs เป็นสิ่งที่แนะนำอันดับแรก แต่หากไม่เพียงพอ เราก็ลองเช็ค Source Code ของเครื่องมือที่ใช้หากเป็น Open Source ถ้าไม่ใช่ ก็คงหนีไม่พ้น ต้องลอง Reverse engineer ไม่ก็เปลี่ยนไปใช้เครื่องมืออื่นแทน สุดท้ายเราจะลงเอยกับทางออกที่ลงตัวเอง

ไว้มีปัญหาอะไรแปลกๆ น่าสนใจ จะมาแชร์กันอีก เจอกันใหม่โพสหน้า~