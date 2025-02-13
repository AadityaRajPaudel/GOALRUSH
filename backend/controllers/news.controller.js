// import { errorThrower } from "../utils/errorThrower.js";

// export const getNews = async (req, res) => {
//   try {
//     const url =
//       "https://football-news11.p.rapidapi.com/api/news-content?id=134024";
//     const options = {
//       method: "GET",
//       headers: {
//         "x-rapidapi-key": "4729c0725cmsh526501d3cad494ep1701aejsna2a2725e82c4",
//         "x-rapidapi-host": "football-news11.p.rapidapi.com",
//       },
//     };
//     const response = await fetch(url, options);
//     const result = await response.json();
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(404).json(errorThrower("Failed to get news."));
//   }
// };

import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { errorThrower } from "../utils/errorThrower.js";

export const getNews = async (req, res) => {
  try {
    const html = await fetch(
      "https://www.dailymail.co.uk/sport/football/index.html"
    );
    const htmlString = await html.text();
    const $ = cheerio.load(htmlString);
    const articles = [];

    // get all the articles
    $(".article").each((i, el) => {
      const header = $(el).find("h2 a").text().trim();
      let link = $(el).find("h2 a").attr("href");
      link = "http://dailymail.co.uk" + link;
      const description = $(el).find("p").text().trim();
      const imageUrl =
        $(el).find("img").attr("src") ||
        "https://euaa.europa.eu/sites/default/files/styles/width_600px/public/default_images/news-default-big.png?itok=NNXAZZTc";

      articles.push({
        id: i,
        header,
        link,
        description,
        imageUrl,
      });
    });
    res.status(400).json({
      success: true,
      message: articles,
    });
  } catch (error) {
    res
      .status(404)
      .json(errorThrower("Failed to scrape the DailyMail website."));
  }
};
