// ref: https://qiita.com/access3151fq/items/c99f92c380372cfecdae#1%E8%A1%8C%E3%81%9A%E3%81%A4%E3%81%AE%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF

import { TextLineStream } from "https://deno.land/std@0.136.0/streams/mod.ts";
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

export async function loadFeedList() {
  const filename = "./feeds.txt";
  const data = await Deno.open(filename);

  const lineStream = data.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  const rssList = [];

  for await (const line of lineStream) {
    rssList.push(line);
  }

  return rssList;
}

const tmp = await loadFeedList();
const rssList = tmp.filter(Boolean);
rssList.forEach(async (rss) => {
  const res = await fetch(rss);
  const xml = await res.text();
  const { entries } = await parseFeed(xml);
  console.log(entries);
});
