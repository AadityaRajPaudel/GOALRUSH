import React from "react";
import NewsCard from "../components/NewsCard.jsx";
import "../styles/newslist.css";
import { newsData } from "../assets/data.js";
import Navbar from "../components/Navbar.jsx";

export default function News() {
  const [news, setNews] = React.useState([]);

  // code to fetch news, else fetch the data presaved
  React.useEffect(() => {
    const getNews = async () => {
      const res = await fetch("/api/news", {
        method: "GET",
      });
      const result = await res.json();
      if (result.success === false) {
        setNews(newsData);
        return;
      }
      setNews(result.message);
      return;
    };
    getNews();
  }, []);
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
