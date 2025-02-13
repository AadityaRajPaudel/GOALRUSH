import React from "react";
import "../styles/newscard.css";

const NewsCard = ({ news }) => {
  return (
    <div className="news-card">
      <a href={news.link}>
        <h2 className="news-title">{news.header}</h2>
        <div className="image-container">
          <img src={news.imageUrl} alt={news.header} />
        </div>

        <p className="news-description">{news.description}</p>
      </a>
    </div>
  );
};

export default NewsCard;
