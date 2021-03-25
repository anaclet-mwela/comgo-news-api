/*jshint esversion: 9*/

const express = require("express");
const app = express();
const cheerio = require("cheerio");
const extractDomain = require("extract-domain");
let Parser =require('rss-parser');
let parser = new Parser();

const feed_sources = [
  "https://footrdc.com/feed"
];

let newsFeeds = {};
const getNews = async (source)=>{
    let feed = await parser.parseURL(source);
    console.log(feed.title);
    feed.items.forEach(item=>{
        newsFeeds = {
            ...newsFeeds,
            title: item.title,
            link: item.link,
            pubDate: item.isoDate,
            description: item.content,
            categories: item.categories
        };
    });
};

(()=>{
    feed_sources.forEach(source => {
        getNews(source);
    });
})();



app.get("/", (req, res) => {
//   let output = newsFeeds.sort((a, b) => {
//     return (new Date(b.pubDate) - new Date(a.pubDate));
// });
  res.send(JSON.stringify(newsFeeds));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on Port ${3000}...`));
