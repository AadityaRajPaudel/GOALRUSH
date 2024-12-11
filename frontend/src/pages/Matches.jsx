import React from "react";
import Navbar from "../components/Navbar";
import LiveScoreWidget from "../components/LiveScore";

export default function Matches() {
  return (
    <div>
      <Navbar />
      <LiveScoreWidget />
    </div>
  );
}
