# In Dev Mined

View the site at https://www.indevmined.com

A post/blog site of Facebook Page [In Dev Mined](https://www.facebook.com/profile.php?id=61558639690052).

This is site is made with `Next.js` app router. It is built as static site. The post/blog is with in markdown and render using `next-mdx-remote`.


## Getting Started

### Prepare env
```bash
cp .env.example .env
```
Make sure to update the api key with your personal key or the AI won't work.

### Run dev server

```bash
npm run dev
# For LLM endpoints to work will need to run
npm run dev:function
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Cloudflare

The site is optimize to run on cloudflare page.