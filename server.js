/*jshint esversion: 9*/

const express = require("express");
const app = express();
const cheerio = require("cheerio");
const RssFeedEmitter = require("rss-feed-emitter");
const feeder = new RssFeedEmitter();
const extractDomain = require("extract-domain");

const feed_sources = [
  "https://radiookapi.net/feed",
  "https://footrdc.com/feed",
  "https://voila.cd/feed"
];

let feeds = [];
feeder.add({
  url: feed_sources,
  refresh: 1800000
});

feeder.on("new-item", function(item) {
  // console.log(item);
  let feed = {};
  let source = extractDomain(item.link);
  const $ = cheerio.load(item.description);
  let image = $("img:first").attr("src");
  // console.log(image.attr('src'));
  let desc = $.text();
  feed = {
    ...feed,
    title: item.title,
    image,
    link: item.link,
    categories: item.categories,
    description: desc,
    pubDate: item.pubDate,
    source
  };
  feeds.push(feed);
});

app.get("/", (req, res) => {
  // console.log(feeds.length);
  let output = feeds.sort((a, b) => {
    return (new Date(b.pubDate) - new Date(a.pubDate));
  });
  let data = {
    name: "congo-net API",
    items: feeds
  };
  let time = 1;
  res.send(JSON.stringify(data));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on Port ${3000}...`));
