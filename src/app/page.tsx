"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "./components/PDFDocument";
import BibleBrowser from "./components/BibleBrowser";

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

interface Template {
  id: string;
  name: string;
  contentType: string;
  targetAudience: string;
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
  const [showBibleBrowser, setShowBibleBrowser] = useState(false);
  const [clickedScripture, setClickedScripture] = useState<{ reference: string; text: string } | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [refining, setRefining] = useState(false);
  const [versions, setVersions] = useState<{ title: string; content: string }[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const DRAFT_KEY = "sda-content-draft";
  const TEMPLATES_KEY = "sda-content-templates";
  const DARK_MODE_KEY = "sda-content-darkMode";

  useEffect(() => {
    const saved = localStorage.getItem("sda-content-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const savedTemplates = localStorage.getItem(TEMPLATES_KEY);
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setContentType(draft.contentType || "sermon");
        setTopic(draft.topic || "");
        setServiceTime(draft.serviceTime || "");
        setScripture(draft.scripture || "");
        setTargetAudience(draft.targetAudience || "General Church");
        setHasDraft(true);
      } catch (e) {
        console.error("Error restoring draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    const draft = { contentType, topic, serviceTime, scripture, targetAudience };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setHasDraft(true);
  }, [contentType, topic, serviceTime, scripture, targetAudience]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setContentType("sermon");
    setTopic("");
    setServiceTime("");
    setScripture("");
    setTargetAudience("General Church");
  };

  // Load Verse of the Day on mount
  useEffect(() => {
    const loadVOTD = async () => {
      try {
        // Use date-based index for consistent daily verse
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const popularVerses = [
          { ref: "john 3:16", reference: "John 3:16" },
          { ref: "psalms 23:1", reference: "Psalm 23:1" },
          { ref: "proverbs 3:5", reference: "Proverbs 3:5" },
          { ref: "romans 8:28", reference: "Romans 8:28" },
          { ref: "philippians 4:13", reference: "Philippians 4:13" },
          { ref: "psalms 119:105", reference: "Psalm 119:105" },
          { ref: "genesis 1:1", reference: "Genesis 1:1" },
          { ref: "hebrews 11:1", reference: "Hebrews 11:1" },
          { ref: "1 corinthians 13:13", reference: "1 Corinthians 13:13" },
          { ref: "matthew 6:33", reference: "Matthew 6:33" },
          { ref: "isaiah 40:31", reference: "Isaiah 40:31" },
          { ref: "john 14:6", reference: "John 14:6" },
        ];
        const verseOfDay = popularVerses[dayOfYear % popularVerses.length];
        
        const res = await fetch(`/api/bible?action=verse&book=${encodeURIComponent(verseOfDay.ref.split(' ')[0])}&chapter=${verseOfDay.ref.split(' ')[1].split(':')[0]}&verse=${verseOfDay.ref.split(':')[1]}`);
        const data = await res.json();
        
        if (data.reference) {
          const container = document.getElementById('votd-container');
          if (container) {
            container.innerHTML = '<p class="votd-ref">' + data.reference + '</p><p class="votd-text">"' + data.text + '"</p>';
          }
        }
      } catch (e) {
        console.error("Error loading VOTD:", e);
      }
    };
    loadVOTD();
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!loading && topic) {
          handleGenerate();
        }
      }
      if (e.key === "Escape") {
        if (clickedScripture) {
          setClickedScripture(null);
        } else if (showBibleBrowser) {
          setShowBibleBrowser(false);
        } else if (showHistory) {
          setShowHistory(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, topic, clickedScripture, showBibleBrowser, showHistory]);

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

  const saveAsTemplate = () => {
    const name = prompt("Enter template name:");
    if (!name || name.trim() === "") return;
    
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: name.trim(),
      contentType,
      targetAudience,
    };
    
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
    alert("Template saved!");
  };

  const loadTemplate = (template: Template) => {
    setContentType(template.contentType);
    setTargetAudience(template.targetAudience);
    setShowTemplateManager(false);
  };

  const deleteTemplate = (id: string) => {
    if (!confirm("Delete this template?")) return;
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeading(id);
    }
  };

  const contentTypeIcons: Record<string, string> = {
    sermon: "📖",
    devotional: "☀️",
    bibleStudy: "📚",
    prayer: "🙏",
    announcement: "📢",
    bulletin: "📋",
    bible: "✝️",
  };

  // Word count and reading time
  const wordCount = output?.content 
    ? output.content.trim().split(/\s+/).filter(w => w.length > 0).length 
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const contentTypes = [
    { id: "sermon", label: "Sermon" },
    { id: "devotional", label: "Devotional" },
    { id: "bibleStudy", label: "Bible Study" },
    { id: "bible", label: "Bible" },
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

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    setSuggestions([]);
    try {
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
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Handle scripture click - fetch verse from Bible API
  const handleScriptureClick = async (reference: string) => {
    // Parse reference - handle verse ranges like "John 3:16-18", "1 John 3:16-20"
    const match = reference.trim().match(/^(\d+?\s+)?([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+):(\d+)(?:-(\d+))?$/i);
    if (!match) {
      console.log("Could not parse reference:", reference);
      return;
    }
    
    const [, prefix, book, chapter, verseStart, verseEnd] = match;
    const bookName = prefix ? prefix.trim() + " " + book : book;
    const startVerse = parseInt(verseStart);
    const endVerse = verseEnd ? parseInt(verseEnd) : startVerse;
    
    try {
      // If it's a range, fetch each verse and combine
      if (verseEnd && endVerse > startVerse) {
        let allVerses = [];
        for (let v = startVerse; v <= endVerse; v++) {
          const res = await fetch(`/api/bible?action=verse&book=${encodeURIComponent(bookName)}&chapter=${chapter}&verse=${v}`);
          const data = await res.json();
          if (data.text) {
            allVerses.push({ verse: v, text: data.text });
          }
        }
        
        if (allVerses.length > 0) {
          const combinedText = allVerses.map(v => `v${v.verse} ${v.text}`).join('\n\n');
          setClickedScripture({ 
            reference: `${bookName} ${chapter}:${verseStart}-${verseEnd}`, 
            text: combinedText 
          });
        }
      } else {
        // Single verse
        const response = await fetch(`/api/bible?action=verse&book=${encodeURIComponent(bookName)}&chapter=${chapter}&verse=${verseStart}`);
        const data = await response.json();
        if (data.text) {
          setClickedScripture({ reference: data.reference, text: data.text });
        } else {
          // Try alternative format
          const altBook = bookName.replace(/\s+/g, '%20');
          const altRes = await fetch(`/api/bible?action=verse&book=${altBook}&chapter=${chapter}&verse=${verseStart}`);
          const altData = await altRes.json();
          if (altData.text) {
            setClickedScripture({ reference: altData.reference, text: altData.text });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching scripture:", error);
    }
  };

  // Close scripture modal
  const closeScriptureModal = () => {
    setClickedScripture(null);
  };

  const handleGenerate = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    setLoading(true);
    setOutput(null);
    setVersions([]);

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

  const refinementOptions = [
    { id: "shorter", label: "Make Shorter" },
    { id: "longer", label: "Make Longer" },
    { id: "simplify", label: "Simplify Language" },
    { id: "scripture", label: "Add More Scripture" },
  ];

  const handleRefine = async (refinement: string) => {
    if (!topic || !output) return;

    setVersions((prev) => [...prev, output]);

    const refinementMap: Record<string, string> = {
      shorter: "Make this content shorter",
      longer: "Make this content longer with more details",
      simplify: "Simplify the language for easier understanding",
      scripture: "Add more Bible scripture references throughout",
    };

    setRefining(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          topic: `${topic}. ${refinementMap[refinement]}`,
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
    } finally {
      setRefining(false);
    }
  };

  const handleUndo = () => {
    if (versions.length === 0) return;
    const previousVersion = versions[versions.length - 1];
    setVersions((prev) => prev.slice(0, -1));
    setOutput(previousVersion);
  };

  const currentVersion = versions.length + 1;

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
          <button 
            className="history-toggle"
            onClick={() => setShowTemplateManager(!showTemplateManager)}
          >
            📑 Templates {templates.length > 0 && <span className="badge">{templates.length}</span>}
          </button>
          <button 
            className="history-toggle bible-toggle"
            onClick={() => setShowBibleBrowser(!showBibleBrowser)}
          >
            📖 Bible
          </button>
          <button 
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {showBibleBrowser && (
        <BibleBrowser 
          onVerseSelect={(verse) => setClickedScripture(verse)}
          onClose={() => setShowBibleBrowser(false)}
        />
      )}

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

      {showTemplateManager && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Saved Templates</h3>
            <button className="save-template-btn" onClick={saveAsTemplate}>
              + Save Current
            </button>
          </div>
          {templates.length === 0 ? (
            <p className="history-empty">No templates saved yet</p>
          ) : (
            <div className="history-list">
              {templates.map((template) => (
                <div key={template.id} className="template-item">
                  <button
                    className="template-load-btn"
                    onClick={() => loadTemplate(template)}
                  >
                    <span className="template-icon">{contentTypeIcons[template.contentType]}</span>
                    <div className="history-info">
                      <span className="history-title">{template.name}</span>
                      <span className="history-meta">{template.contentType} • {template.targetAudience}</span>
                    </div>
                  </button>
                  <button
                    className="template-delete-btn"
                    onClick={() => deleteTemplate(template.id)}
                    title="Delete template"
                  >
                    🗑️
                  </button>
                </div>
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
            {hasDraft && (
              <button
                className="clear-draft-btn"
                onClick={clearDraft}
              >
                🗑️ Clear Draft
              </button>
            )}
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
                <div className="output-title-wrap">
                  <h3>{output.title} {currentVersion > 1 && <span className="version-indicator">v{currentVersion}</span>}</h3>
                  <span className="output-stats">📄 {wordCount.toLocaleString()} words • ⏱️ ~{readingTime} min read</span>
                </div>
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
                  <div className="refine-dropdown">
                    <button 
                      className="action-btn refine-btn"
                      disabled={refining}
                    >
                      {refining ? "⏳ Refining..." : "✨ Refine"}
                    </button>
                    <div className="refine-menu">
                      {refinementOptions.map((option) => (
                        <button
                          key={option.id}
                          className="refine-option"
                          onClick={() => handleRefine(option.id)}
                          disabled={refining}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {versions.length > 0 && (
                    <button 
                      className="action-btn undo-btn"
                      onClick={handleUndo}
                      title="Undo last refinement"
                    >
                      ↩️ Undo
                    </button>
                  )}
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
                      p: ({ children }) => {
                        // Make ALL scripture references clickable - comprehensive regex
                        let text = String(children);
                        
                        // Replace all scripture patterns with clickable buttons
                        // Matches: John 3:16, Psalm 23:1-4, Romans 12:1, 1 Corinthians 13:4-6, etc.
                        const scripturePattern = /(\d+?\s*[A-Z][a-z]+(?:\s+\d+)?\s+\d+:\d+(?:-\d+)?)/g;
                        
                        const parts = text.split(scripturePattern);
                        
                        if (parts.length === 1) {
                          return <p>{children}</p>;
                        }
                        
                        return (
                          <p>
                            {parts.map((part, i) => {
                              const match = part.match(/^(\d+?\s*[A-Z][a-z]+(?:\s+\d+)?\s+\d+:\d+(?:-\d+)?)$/);
                              if (match) {
                                return (
                                  <button
                                    key={i}
                                    className="scripture-link"
                                    onClick={() => handleScriptureClick(match[1])}
                                    title="Click to read full verse"
                                  >
                                    {match[1]}
                                  </button>
                                );
                              }
                              return part;
                            })}
                          </p>
                        );
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

      {/* Scripture Modal */}
      {clickedScripture && (
        <div className="scripture-modal-overlay" onClick={closeScriptureModal}>
          <div className="scripture-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeScriptureModal}>×</button>
            <h3>{clickedScripture.reference}</h3>
            <p className="scripture-version">King James Version (KJV)</p>
            <div className="scripture-text">{clickedScripture.text}</div>
          </div>
        </div>
      )}

      <footer>
        <p>© 2026 SDA Content Generator | Built for the Church 🌿</p>
      </footer>
    </div>
  );
}
