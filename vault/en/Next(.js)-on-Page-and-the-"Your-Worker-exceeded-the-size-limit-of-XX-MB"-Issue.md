---
title: Next(.js) on Page and the "Your Worker exceeded the size limit of XX MB" Issue
language-th-link: "[[Next(.js)-on-Page-กับปัญหา-Your-Worker-exceeded-the-size-limit-of-XX-MB]]"
extracted: ""
description: Explore how to solve Next.js deployment size limits on Cloudflare Pages using next-on-pages. Learn systematic debugging approaches and implement dynamic imports to reduce function size below 1MB limit.
---
![](Screenshot%202567-12-19%20at%2017.58.36.png)

For whatever reason, wanting to deploy [Next.JS](https://nextjs.org) to Cloudflare Pages and use [Server-side Rendering (SSR)](https://nextjs.org/docs/app/building-your-application/rendering) led me to use [next-on-pages](https://github.com/cloudflare/next-on-pages) which runs on [Cloudflare Page Function](https://developers.cloudflare.com/pages/) (wrapper Cloudflare Worker)

> If you're only interested in the solution, [jump to the end](#solution)

## Problem

When we add features to our website up to a certain point, it's not unusual to hit limitations or errors like today. If we interpret the log we see, the `Function` file we built when running _bash`pnpm next-on-pages && wrangler pages deploy`_ exceeds 1 MiB in size (currently 3 MiB for Free Tier)

Now that we know the problem, what's the best way to fix it??

## Process to Find Solution

### Finding Reference Points

When we encounter new problems, it's like being in the dark. Where do we start?

Personally, I recommend finding reference points first, comparing with the state before the problem occurred.

In this case, we look at when was the last successful build.

![](Screenshot%202567-12-19%20at%2022.29.02.png)

### Looking for Changes

Once we know the turning point that started causing build failures, let's find the root cause of the error.

The first thing to try is to checkout both commits and build them, comparing the build outputs. When working with Next.JS, we typically look at results from `vercel build`

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


When we see the file size jump from 453.30 KiB -> 2449.81 KiB (~2.4 MiB), it becomes clear where the real problem lies. It's definitely the `__next-on-pages-dist__/functions/workbench.func.js` file exceeding 1 MB.

> An interesting observation about how Worker Size Limit rules are set - whether they look at total file size or individual files. When we check [Routing](https://developers.cloudflare.com/pages/functions/routing) or [Limit](https://developers.cloudflare.com/workers/platform/limits/#account-plan-limits) documentation, nothing specifies which size to count. But looking at the numbers above, whether before or after the fix 2363.35 KiB vs 4450.53 KiB, both exceed 1 MB (Current 3 MB), suggesting they count individual file sizes.
> ![](Screenshot%202567-12-19%20at%2023.34.16.png)

Once we know which file is oversized, we trace back to see which lines were added by looking at the Diff (Difference) between these 2 commits `1b6bf08` and `cde7e3a`

<p><img src="/Screenshot%202567-12-19%20at%2022.47.04.png" alt="compare commit" width="450" style={{margin: "0 auto"}} /></p>

> This is a good example of why we should learn how to use Git and understand what makes a good commit, how to name commits, how big a commit should be, when to separate commits, when to squash and merge, or when to use merge commits. If we choose the right method, the result should be a clear history that communicates what happened to the code.

We then look at which files are related to `src/app/workbench/page.tsx` by checking imports or nested imports that have files in these 2 commit diffs.

In this case, it's the `AIBlock.tsx` file that added a Markdown Parser, and this parser is larger than 1 MB, causing `workbench.func.js` to exceed the size limit.

> A quick way to check how much size a feature adds is to build and compare between feature-off and feature-on states. If you can't think of how to turn off a feature, you can simply comment out the lines using that feature.

## Handling the Problem

Now that we know the root cause, we need to choose how to handle this problem. We need to consider if this feature is important for SSR, and if there are any cases where we need to render Markdown before it reaches the client.

In this case, we don't use Markdown rendering on the SSR side, so we can choose to lazy-load this React Component.

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

Let's test after the fix.

The result from _bash`vercel build`_ shows smaller size, but _bash`wrangler pages functions build --build-output-directory .vercel/output/static`_ gives almost the same size.

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

Before vs After -> 2449.81 KiB vs 2450.28 KiB isn't very satisfying. When we see that the result isn't what we expected, it's a good time to check the [Next.js Lazy Loading Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#skipping-ssr)

![](Screenshot%202567-12-20%20at%2012.22.58.png)

If we only read this far, we might interpret that `React.lazy()` gives the same result as `next/dynamic`. But if we scroll down to the **Skipping SSR** example:

![](Screenshot%202567-12-20%20at%2012.25.25.png)

We'll find that although `React.lazy()` does lazy load on the client, it still pre-renders on the server, which is why `workbench.func.js` still needs to include the Markdown render feature, resulting in no size reduction.

## Solution

Finally, we reach the real solution. Simply change from `React.lazy()` to `next/dynamic` with the _js`{ ssr: false }`_ option.

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

And when built:

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

Size is now under 1 MB and Deploy Success! Yay!

![](yay-disney-zootopia.webp)
Happy Very Funny GIF by Disney Zootopia

> Caution: When using `React.lazy()` or `next/dynamic`, don't forget to consider the timing of when the Component needs to lazy-load. These methods will cause UI jank, which might be frustrating for users.
>
> The solution is to use Suspense or loading options to show a fallback while the Component is loading.

## Summary

When we face problems that even Stackoverflow can't solve, it doesn't mean there's no solution. By systematically looking for solutions, starting with narrowing down the scope until finding the root cause, then looking for fixes. If direct searches don't help, we need to study our tools ourselves, starting with reading docs as the first recommendation. If that's not enough, we can check the Source Code if it's Open Source. If not, we might need to reverse engineer or switch to different tools. Eventually, we'll find a suitable solution.

Will share more interesting problems next time, see you in the next post~