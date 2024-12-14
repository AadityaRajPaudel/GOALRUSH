import React from "react";
import "../styles/newscard.css";

const NewsCard = ({ news }) => {
  const getNews = async () => {
    const result = await fetch("/api/news", {
      method: "GET",
    });

    if (!result) {
      console.log("Couldnt fetch news, using predefined news.");
    }
    const res = await result.json();
    const newsCards = res.message.map((news) => {
      return <NewsCard someProp />;
    });
  };

  return (
    <div className="news-card">
      <h2 className="news-title">{news.title}</h2>
      <p className="news-source">Source: {news.source}</p>
      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="news-link"
      >
        Read more
      </a>
    </div>
  );
};

export default NewsCard;
