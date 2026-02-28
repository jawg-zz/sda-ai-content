"use client";

import { useState, useEffect } from "react";

interface HistoryItem {
  id: number;
  title: string;
  content: string;
  contentType: string;
  topic: string;
  timestamp: string;
}

export default function Home() {
  const [contentType, setContentType] = useState("sermon");
  const [topic, setTopic] = useState("");
  const [scripture, setScripture] = useState("");
  const [targetAudience, setTargetAudience] = useState("General Church");
  const [output, setOutput] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sda-content-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (data: { title: string; content: string }) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      title: data.title,
      content: data.content,
      contentType,
      topic,
      timestamp: new Date().toLocaleString(),
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("sda-content-history", JSON.stringify(updated));
  };

  const handleCopy = async () => {
    if (output?.content) {
      await navigator.clipboard.writeText(output.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (format: "md" | "txt") => {
    if (!output) return;
    const blob = new Blob([output.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setContentType(item.contentType);
    setTopic(item.topic);
    setOutput({ title: item.title, content: item.content });
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("sda-content-history");
  };

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

  const contentTypeIcons: Record<string, string> = {
    sermon: "📖",
    devotional: "☀️",
    bibleStudy: "📚",
    prayer: "🙏",
    announcement: "📢",
  };

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
      saveToHistory(data);
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
    <div className="app-wrapper">
      <header>
        <div className="container header-content">
          <div className="logo">
            <span className="logo-icon">⛪</span>
            <div>
              <h1>SDA Content Generator</h1>
              <p>AI-powered content for Seventh-day Adventist Churches</p>
            </div>
          </div>
          <button 
            className="history-toggle"
            onClick={() => setShowHistory(!showHistory)}
          >
            📋 History {history.length > 0 && <span className="badge">{history.length}</span>}
          </button>
        </div>
      </header>

      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Recent Content</h3>
            {history.length > 0 && (
              <button className="clear-btn" onClick={clearHistory}>Clear</button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="history-empty">No history yet</p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <button
                  key={item.id}
                  className="history-item"
                  onClick={() => loadFromHistory(item)}
                >
                  <span className="history-icon">{contentTypeIcons[item.contentType]}</span>
                  <div className="history-info">
                    <span className="history-title">{item.topic}</span>
                    <span className="history-meta">{item.timestamp}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <main className="container">
        <div className="main-layout">
          <section className="form-section">
            <h2>What would you like to create?</h2>

            <div className="content-types">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  className={`type-btn ${contentType === type.id ? "active" : ""}`}
                  onClick={() => setContentType(type.id)}
                >
                  <span className="type-icon">{contentTypeIcons[type.id]}</span>
                  {type.label}
                </button>
              ))}
            </div>

            <div className="form-row">
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

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                <>✨ Generate Content</>
              )}
            </button>
          </section>

          {loading && (
            <div className="loading">
              <div className="loading-animation">
                <div className="pulse-ring"></div>
                <span>✝️</span>
              </div>
              <p>Creating your content...</p>
            </div>
          )}

          {output && !loading && (
            <section className="output-section">
              <div className="output-header">
                <h3>{output.title}</h3>
                <div className="output-actions">
                  <button 
                    className="action-btn" 
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    {copied ? "✓ Copied" : "📋 Copy"}
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handleDownload("md")}
                    title="Download as Markdown"
                  >
                    📥 MD
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => handleDownload("txt")}
                    title="Download as Text"
                  >
                    📥 TXT
                  </button>
                </div>
              </div>
              <div className="output-body">
                {output.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('# ')) {
                    return <h2 key={idx} className="ob-h2">{paragraph.replace(/^# /, '')}</h2>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h3 key={idx} className="ob-h3">{paragraph.replace(/^## /, '')}</h3>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h4 key={idx} className="ob-h4">{paragraph.replace(/^### /, '')}</h4>;
                  }
                  if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(l => l.startsWith('* ') || l.startsWith('- '));
                    return (
                      <ul key={idx} className="ob-list">
                        {items.map((item, i) => (
                          <li key={i}>{item.replace(/^[-*] /, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (/^\d+\. /.test(paragraph)) {
                    const items = paragraph.split('\n').filter(l => /^\d+\. /.test(l));
                    return (
                      <ol key={idx} className="ob-list ordered">
                        {items.map((item, i) => (
                          <li key={i}>{item.replace(/^\d+\. /, '')}</li>
                        ))}
                      </ol>
                    );
                  }
                  return <p key={idx} className="ob-p">{paragraph}</p>;
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer>
        <p>© 2026 SDA Content Generator | Built for the Church 🌿</p>
      </footer>
    </div>
  );
}
