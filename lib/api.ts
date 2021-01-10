import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID, Record } from "@kintone/rest-api-client/lib/client/types";
import PostType from "../types/post";

export async function getPostBySlug(slug: string): Promise<PostType> {
  const query = `slug = "${esc(slug)}"`;
  const records = await getRecords(query);
  if (records.length !== 1) {
    throw new TypeError(
      `records.length should be 1, but actually ${records.length}`
    );
  }
  return convertRecordToPost(records[0]);
}

export async function getAllPosts(): Promise<PostType[]> {
  const query = "order by date desc limit 10";
  const records = await getRecords(query);
  const posts: PostType[] = records.map(convertRecordToPost);
  return posts;
}

async function getRecords(query: string): Promise<Record[]> {
  const kintone = createClient();
  const app = getTargetAppId();
  const { records } = await kintone.record.getRecords({
    app,
    fields: [
      "slug",
      "title",
      "date",
      "coverImage",
      "excerpt",
      "authorName",
      "authorPicture",
      "ogImage",
      "content",
    ],
    query,
  });
  return records;
}

function esc(str: string): string {
  return str.replace(/"/g, '\\"');
}

function convertRecordToPost(record: Record): PostType {
  if (
    !(
      record.slug?.type === "SINGLE_LINE_TEXT" &&
      record.title?.type === "SINGLE_LINE_TEXT" &&
      record.date?.type === "DATETIME" &&
      record.coverImage?.type === "SINGLE_LINE_TEXT" &&
      record.excerpt?.type === "SINGLE_LINE_TEXT" &&
      record.authorName?.type === "SINGLE_LINE_TEXT" &&
      record.authorPicture?.type === "SINGLE_LINE_TEXT" &&
      record.ogImage?.type === "SINGLE_LINE_TEXT" &&
      record.content?.type === "MULTI_LINE_TEXT"
    )
  ) {
    console.error("Invalid record", { record });
    throw new TypeError(`Invalid record ${JSON.stringify(record)}`);
  }
  return {
    slug: record.slug.value,
    title: record.title.value,
    date: record.date.value,
    coverImage: record.coverImage.value,
    author: {
      name: record.authorName.value,
      picture: record.authorPicture.value,
    },
    excerpt: record.excerpt.value,
    ogImage: {
      url: record.ogImage.value,
    },
    content: record.content.value,
  };
}

function getTargetAppId(): AppID {
  const appId = process.env.KINTONE_APP_ID;
  if (typeof appId !== "string") {
    throw new TypeError("Specify KINTONE_APP_ID in env");
  }
  if (!/^[1-9][0-9]*$/.test(appId)) {
    throw new TypeError(`Invalid KINTONE_APP_ID: ${appId}`);
  }
  return appId;
}

function createClient(): KintoneRestAPIClient {
  const baseUrl = process.env.KINTONE_BASE_URL;
  const apiToken = process.env.KINTONE_API_TOKEN;
  if (!(typeof baseUrl === "string" && typeof apiToken === "string")) {
    throw new TypeError(
      "Specify KINTONE_BASE_URL and KINTONE_API_TOKEN in env"
    );
  }
  return new KintoneRestAPIClient({
    baseUrl,
    auth: {
      apiToken,
    },
  });
}
