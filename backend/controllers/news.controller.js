import { errorThrower } from "../utils/errorThrower.js";

export const getNews = async (req, res) => {
  try {
    const url =
      "https://football-news11.p.rapidapi.com/api/news-content?id=134024";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "4729c0725cmsh526501d3cad494ep1701aejsna2a2725e82c4",
        "x-rapidapi-host": "football-news11.p.rapidapi.com",
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json(errorThrower("Failed to get news."));
  }
};
