"use client";

import { useState } from "react";

export default function Home() {
  const [contentType, setContentType] = useState("sermon");
  const [topic, setTopic] = useState("");
  const [scripture, setScripture] = useState("");
  const [targetAudience, setTargetAudience] = useState("General Church");
  const [output, setOutput] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const contentTypes = [
    { id: "sermon", label: "Sermon" },
    { id: "devotional", label: "Devotional" },
    { id: "bibleStudy", label: "Bible Study" },
    { id: "prayer", label: "Prayer" },
    { id: "announcement", label: "Announcement" },
  ];

  const audiences = [
    "General Church",
    "Adults",
    "Youth",
    "Children",
    "Sabbath School",
    "Small Group",
  ];

  const handleGenerate = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    setLoading(true);
    setOutput(null);

    try {
      // Simulate API call - in production, use Convex
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          topic,
          scripture,
          targetAudience,
        }),
      });

      const data = await response.json();
      setOutput(data);
    } catch (error) {
      console.error("Error:", error);
      setOutput({
        title: "Error",
        content: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>⛪ SDA Content Generator</h1>
          <p>AI-powered content for Seventh-day Adventist Churches</p>
        </div>
      </header>

      <main className="container">
        <section className="form-section">
          <h2 style={{ marginBottom: "1.5rem", color: "#2D5016" }}>
            What would you like to create?
          </h2>

          <div className="content-types">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                className={`type-btn ${contentType === type.id ? "active" : ""}`}
                onClick={() => setContentType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Topic *</label>
            <input
              type="text"
              placeholder="e.g., Faith, Prayer, Love, Stewardship"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Scripture (optional)</label>
            <input
              type="text"
              placeholder="e.g., John 3:16, Romans 12:1-2"
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            >
              {audiences.map((aud) => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Content ✨"}
          </button>
        </section>

        {loading && (
          <div className="loading">
            <p>Creating your content... this may take a moment.</p>
          </div>
        )}

        {output && !loading && (
          <section className="output-section">
            <h3>{output.title}</h3>
            <div className="output-content">{output.content}</div>
          </section>
        )}
      </main>

      <footer>
        <p>© 2026 SDA Content Generator | Built for the Church 🌿</p>
      </footer>
    </div>
  );
}
