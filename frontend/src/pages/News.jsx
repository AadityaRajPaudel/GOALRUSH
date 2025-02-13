import React from "react";
import NewsCard from "../components/NewsCard.jsx";
import "../styles/newslist.css";
import { newsData } from "../assets/data.js";
import Navbar from "../components/Navbar.jsx";

export default function News() {
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // code to fetch news, else fetch the data presaved
  React.useEffect(() => {
    setLoading(true);
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
    setLoading(false);
  }, []);
  return (
    <div>
      <Navbar />
      <div
        style={{
          backgroundColor: "#567081",
          color: "white",
          padding: "4px",
        }}
      >
        News are scraped from:{" "}
        <a href="https://www.dailymail.co.uk" style={{ color: "pink" }}>
          dailymail.co.uk
        </a>{" "}
        website.
      </div>
      <div className="news-list">
        {loading
          ? "Loading..."
          : news.map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
      </div>
    </div>
  );
}
