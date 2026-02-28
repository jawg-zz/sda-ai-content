"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "./components/PDFDocument";

interface Heading {
  id: string;
  text: string;
  level: number;
}

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
  const [serviceTime, setServiceTime] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [scripture, setScripture] = useState("");
  const [targetAudience, setTargetAudience] = useState("General Church");
  const [output, setOutput] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sda-content-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!output?.content) {
      setHeadings([]);
      return;
    }

    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const extracted: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(output.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      extracted.push({ id, text, level });
    }

    setHeadings(extracted);
  }, [output]);

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

  const handleDownload = async (format: "md" | "txt" | "pdf") => {
    if (!output) return;
    
    if (format === "pdf") {
      const blob = await pdf(
        <PDFDocument 
          title={output.title} 
          content={output.content} 
          contentType={contentType}
          headings={headings}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${output.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    
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

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeading(id);
    }
  };

  const contentTypes = [
    { id: "sermon", label: "Sermon" },
    { id: "devotional", label: "Devotional" },
    { id: "bibleStudy", label: "Bible Study" },
    { id: "prayer", label: "Prayer" },
    { id: "announcement", label: "Announcement" },
    { id: "bulletin", label: "Bulletin" },
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
    bulletin: "📋",
  };

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    setSuggestions([]);
    try {
      console.log("Fetching suggestions for:", contentType, targetAudience);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          topic: "SUGGEST_TOPICS",
          targetAudience,
        }),
      });
      const data = await response.json();
      console.log("Suggestions response:", data);
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setSuggestionsLoading(false);
    }
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
          serviceTime,
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
            <span className="logo-icon">🐑</span>
            <div>
              <h1>SDA Content Generator</h1>
              <p className="logo-subtitle">Seventh-day Adventist Church</p>
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
                <div className="topic-input-wrapper">
                  <input
                    type="text"
                    placeholder="e.g., Faith, Prayer, Love, Stewardship"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <button
                    type="button"
                    className="suggestion-btn"
                    onClick={fetchSuggestions}
                    disabled={suggestionsLoading}
                    title="Get AI topic suggestions"
                  >
                    {suggestionsLoading ? "..." : "💡"}
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <div className="suggestions-list">
                    <span className="suggestions-label">Try these:</span>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        className="suggestion-chip"
                        onClick={() => { setTopic(s); setSuggestions([]); }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {contentType === "bulletin" && (
                <div className="form-group">
                  <label>Service Time</label>
                  <input
                    type="text"
                    placeholder="e.g., 9:00 AM, 11:00 AM"
                    value={serviceTime}
                    onChange={(e) => setServiceTime(e.target.value)}
                  />
                </div>
              )}

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
            <section className="output-section" ref={contentRef}>
              <div className="reading-progress">
                <div 
                  className="reading-progress-bar" 
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
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
                  <button 
                    className="action-btn pdf-btn"
                    onClick={() => handleDownload("pdf")}
                    title="Download as PDF"
                  >
                    📄 PDF
                  </button>
                </div>
              </div>
              <div className="output-layout">
                {headings.length > 2 && (
                  <aside className="toc-sidebar">
                    <div className="toc-container">
                      <h4 className="toc-title">Contents</h4>
                      <nav className="toc-nav">
                        {headings.map((heading) => (
                          <button
                            key={heading.id}
                            className={`toc-link toc-level-${heading.level} ${activeHeading === heading.id ? "active" : ""}`}
                            onClick={() => scrollToHeading(heading.id)}
                          >
                            {heading.text}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </aside>
                )}
                <div className="output-body">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                        return <h1 id={id}>{children}</h1>;
                      },
                      h2: ({ children }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                        return <h2 id={id}>{children}</h2>;
                      },
                      h3: ({ children }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                        return <h3 id={id}>{children}</h3>;
                      },
                    }}
                  >
                    {output.content}
                  </ReactMarkdown>
                </div>
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
