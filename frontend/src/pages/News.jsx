import React from "react";
import NewsCard from "../components/NewsCard.jsx";
import "../styles/newslist.css";
import { newsData } from "../assets/data.js";
import Navbar from "../components/Navbar.jsx";

export default function News() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="news-list">
        {newsData.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} />
        ))}
      </div>
    </div>
  );
}
