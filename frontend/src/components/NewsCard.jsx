import React from "react";
import "../styles/newscard.css";

const NewsCard = ({ news }) => {
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
