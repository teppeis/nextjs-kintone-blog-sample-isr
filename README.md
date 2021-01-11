# A blog example using Next.js and Kintone with ISR (Incremental Static Regeneration)

This example showcases Next.js's [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) feature using [Kintone](https://www.kintone.com/) as CMS and the data source. This is based on [blog-starter-typescript](https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript).

The blog posts are stored in Kintone. If you add a new blog post or edit an existing post in Kintone, they will be available almost immediately, without having to re-build your app or make a new deployment. Next.js will attempt to fetch latest data from Kintone and re-generate the page in the background when a request comes in at most once every 10 seconds in this example.

Incremental Static Regeneration (ISR) ensures you retain the benefits of static:
- No spikes in latency. Pages are served consistently fast
- Pages never go offline. If the background page re-generation fails, the old page remains unaltered
- Low database and backend load. Pages are re-computed at most once concurrently

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/teppeis/nextjs-kintone-blog-sample-isr&project-name=nextjs-kintone-blog-sample-isr&repository-name=nextjs-kintone-blog-sample-isr)

Required Environment variables:
- `KINTONE_BASE_URL`: Like `https://<your-domain>.cybozu.com`
- `KINTONE_APP_ID`: Your Kintone app for the blog. Like `123`
- `KINTONE_API_TOKEN`: API token with read permission for your app

Required Kintone app schema:
- `slug`: `SINGLE_LINE_TEXT`
- `title`: `SINGLE_LINE_TEXT`
- `date`: `DATETIME`
- `coverImage`: `SINGLE_LINE_TEXT`
- `excerpt`: `SINGLE_LINE_TEXT`
- `authorName`: `SINGLE_LINE_TEXT`
- `authorPicture`: `SINGLE_LINE_TEXT`
- `ogImage`: `SINGLE_LINE_TEXT`
- `content`: `MULTI_LINE_TEXT`
