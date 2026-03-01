"use client";

import { useState, useEffect } from "react";

interface BibleVerse {
  reference: string;
  text: string;
  version?: string;
}

interface BibleBrowserProps {
  onVerseSelect?: (verse: BibleVerse) => void;
  onClose?: () => void;
}

const books = [
  { name: "Genesis", chapters: 50 },
  { name: "Exodus", chapters: 40 },
  { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 },
  { name: "Deuteronomy", chapters: 34 },
  { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 },
  { name: "Ruth", chapters: 4 },
  { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 },
  { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 },
  { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 },
  { name: "Esther", chapters: 10 },
  { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 },
  { name: "Isaiah", chapters: 66 },
  { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 },
  { name: "Ezekiel", chapters: 48 },
  { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 },
  { name: "Joel", chapters: 3 },
  { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 },
  { name: "Jonah", chapters: 4 },
  { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 },
  { name: "Habakkuk", chapters: 3 },
  { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 },
  { name: "Zechariah", chapters: 14 },
  { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 },
  { name: "Mark", chapters: 16 },
  { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 },
  { name: "Acts", chapters: 28 },
  { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 },
  { name: "2 Corinthians", chapters: 13 },
  { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 },
  { name: "Philippians", chapters: 4 },
  { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 },
  { name: "2 Thessalonians", chapters: 3 },
  { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 },
  { name: "Titus", chapters: 3 },
  { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 },
  { name: "James", chapters: 5 },
  { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 },
  { name: "1 John", chapters: 5 },
  { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 },
  { name: "Jude", chapters: 1 },
  { name: "Revelation", chapters: 22 },
];

const popularVerses = [
  { book: "John", chapter: 3, verse: 16, reference: "John 3:16" },
  { book: "Psalm", chapter: 23, verse: 1, reference: "Psalm 23:1" },
  { book: "Proverbs", chapter: 3, verse: 5, reference: "Proverbs 3:5" },
  { book: "Romans", chapter: 8, verse: 28, reference: "Romans 8:28" },
  { book: "Philippians", chapter: 4, verse: 13, reference: "Philippians 4:13" },
  { book: "Psalm", chapter: 119, verse: 105, reference: "Psalm 119:105" },
  { book: "Isaiah", chapter: 40, verse: 31, reference: "Isaiah 40:31" },
  { book: "Matthew", chapter: 6, verse: 33, reference: "Matthew 6:33" },
  { book: "1 Corinthians", chapter: 13, verse: 13, reference: "1 Corinthians 13:13" },
  { book: "Genesis", chapter: 1, verse: 1, reference: "Genesis 1:1" },
  { book: "1 Peter", chapter: 2, verse: 9, reference: "1 Peter 2:9" },
  { book: "2 Timothy", chapter: 3, verse: 16, reference: "2 Timothy 3:16" },
];

export default function BibleBrowser({ onVerseSelect, onClose }: BibleBrowserProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "search" | "popular" | "favorites" | "recent">("browse");
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedVerse, setSelectedVerse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentVerses, setRecentVerses] = useState<BibleVerse[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bible-favorites");
    if (saved) setFavorites(JSON.parse(saved));
    
    const savedRecent = localStorage.getItem("bible-recent");
    if (savedRecent) setRecentVerses(JSON.parse(savedRecent));
  }, []);

  const saveFavorite = (reference: string) => {
    const newFavs = favorites.includes(reference) 
      ? favorites.filter(f => f !== reference)
      : [...favorites, reference];
    setFavorites(newFavs);
    localStorage.setItem("bible-favorites", JSON.stringify(newFavs));
  };

  const addToRecent = (verse: BibleVerse) => {
    const newRecent = [verse, ...recentVerses.filter(r => r.reference !== verse.reference)].slice(0, 20);
    setRecentVerses(newRecent);
    localStorage.setItem("bible-recent", JSON.stringify(newRecent));
  };

  const fetchVerse = async (book: string, chapter: string, verse?: string) => {
    setLoading(true);
    try {
      const url = verse 
        ? `/api/bible?action=verse&book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}`
        : `/api/bible?action=verse&book=${encodeURIComponent(book)}&chapter=${chapter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.reference) {
        setCurrentVerse(data);
        addToRecent(data);
        if (onVerseSelect) onVerseSelect(data);
      }
    } catch (err) {
      console.error("Error fetching verse:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bible?action=search&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularVerse = async (item: typeof popularVerses[0]) => {
    await fetchVerse(item.book, String(item.chapter), String(item.verse));
  };

  const handleBookSelect = (bookName: string) => {
    setSelectedBook(bookName);
    setSelectedChapter("");
    setSelectedVerse("");
    setCurrentVerse(null);
  };

  const handleChapterSelect = (chapter: string) => {
    setSelectedChapter(chapter);
    setSelectedVerse("");
    fetchVerse(selectedBook, chapter);
  };

  const selectedBookData = books.find(b => b.name === selectedBook);
  const chapterNumbers = selectedBookData ? Array.from({ length: selectedBookData.chapters }, (_, i) => i + 1) : [];

  return (
    <div className="bible-browser">
      <div className="bible-browser-header">
        <h3>📖 Bible</h3>
        <button className="clear-btn" onClick={onClose}>✕</button>
      </div>

      {/* Tabs */}
      <div className="bible-tabs">
        <button 
          className={`bible-tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          📑 Browse
        </button>
        <button 
          className={`bible-tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search
        </button>
        <button 
          className={`bible-tab ${activeTab === 'popular' ? 'active' : ''}`}
          onClick={() => setActiveTab('popular')}
        >
          ⭐ Popular
        </button>
        <button 
          className={`bible-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ♥ Favorites
        </button>
        <button 
          className={`bible-tab ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          🕐 Recent
        </button>
      </div>

      <div className="bible-content">
        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="bible-browse">
            <div className="bible-selector">
              <select 
                value={selectedBook} 
                onChange={(e) => handleBookSelect(e.target.value)}
                className="bible-select"
              >
                <option value="">Select Book</option>
                {books.map(book => (
                  <option key={book.name} value={book.name}>{book.name}</option>
                ))}
              </select>

              {selectedBook && (
                <select 
                  value={selectedChapter} 
                  onChange={(e) => handleChapterSelect(e.target.value)}
                  className="bible-select"
                >
                  <option value="">Select Chapter</option>
                  {chapterNumbers.map(num => (
                    <option key={num} value={num}>Chapter {num}</option>
                  ))}
                </select>
              )}

              {selectedBook && selectedChapter && (
                <div className="verse-quick-nav">
                  <span className="verse-nav-label">Quick Verse:</span>
                  <input 
                    type="number" 
                    min="1" 
                    max={selectedBookData?.chapters}
                    placeholder="#"
                    value={selectedVerse}
                    onChange={(e) => setSelectedVerse(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && selectedVerse) {
                        fetchVerse(selectedBook, selectedChapter, selectedVerse);
                      }
                    }}
                    className="verse-input"
                  />
                  <button 
                    className="verse-go-btn"
                    onClick={() => selectedVerse && fetchVerse(selectedBook, selectedChapter, selectedVerse)}
                    disabled={!selectedVerse}
                  >
                    Go
                  </button>
                </div>
              )}
            </div>

            {/* Current Verse Display */}
            {(currentVerse || loading) && (
              <div className="verse-display">
                {loading ? (
                  <div className="verse-loading">Loading...</div>
                ) : currentVerse && (
                  <>
                    <div className="verse-header">
                      <span className="verse-ref">{currentVerse.reference}</span>
                      <button 
                        className={`favorite-btn ${favorites.includes(currentVerse.reference) ? 'active' : ''}`}
                        onClick={() => saveFavorite(currentVerse.reference)}
                      >
                        {favorites.includes(currentVerse.reference) ? '♥' : '♡'}
                      </button>
                    </div>
                    <p className="verse-text">"{currentVerse.text}"</p>
                    <span className="verse-version">{currentVerse.version || 'KJV'}</span>
                  </>
                )}
              </div>
            )}

            {/* Recent Verses */}
            {recentVerses.length > 0 && !currentVerse && (
              <div className="recent-verses">
                <h4>Recent</h4>
                <div className="recent-list">
                  {recentVerses.slice(0, 5).map((verse, i) => (
                    <button 
                      key={i} 
                      className="recent-item"
                      onClick={() => {
                        const [book, rest] = verse.reference.split(' ');
                        const [chap, v] = rest.split(':');
                        fetchVerse(book, chap, v);
                      }}
                    >
                      {verse.reference}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="bible-search">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search verses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-btn">Search</button>
            </div>
            
            {loading ? (
              <div className="verse-loading">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="search-results">
                {searchResults.map((result, i) => (
                  <button 
                    key={i} 
                    className="search-result-item"
                    onClick={() => {
                      const [book, rest] = result.reference.split(' ');
                      const [chap, v] = rest.split(':');
                      fetchVerse(book, chap, v);
                    }}
                  >
                    <span className="result-ref">{result.reference}</span>
                    <span className="result-text">{result.text.substring(0, 100)}...</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="search-hint">Enter a keyword to search the Bible</p>
            )}
          </div>
        )}

        {/* Popular Tab */}
        {activeTab === 'popular' && (
          <div className="bible-popular">
            <h4>Popular Verses</h4>
            <div className="popular-grid">
              {popularVerses.map((item, i) => (
                <button 
                  key={i} 
                  className="popular-item"
                  onClick={() => loadPopularVerse(item)}
                >
                  <span className="popular-ref">{item.reference}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="bible-favorites">
            <h4>Your Favorites</h4>
            {favorites.length > 0 ? (
              <div className="favorites-list">
                {favorites.map((ref, i) => (
                  <button 
                    key={i} 
                    className="favorite-item"
                    onClick={() => {
                      const [book, rest] = ref.split(' ');
                      const [chap, v] = rest.split(':');
                      fetchVerse(book, chap, v);
                    }}
                  >
                    <span className="fav-ref">{ref}</span>
                    <button 
                      className="remove-fav"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveFavorite(ref);
                      }}
                    >
                      ✕
                    </button>
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-favorites">No favorites yet. Click ♥ on any verse to save it.</p>
            )}
          </div>
        )}

        {/* Recent Tab */}
        {activeTab === 'recent' && (
          <div className="bible-recent">
            <h4>Recently Viewed</h4>
            {recentVerses.length > 0 ? (
              <div className="recent-list-full">
                {recentVerses.map((verse, i) => (
                  <button 
                    key={i} 
                    className="recent-item-full"
                    onClick={() => {
                      const [book, rest] = verse.reference.split(' ');
                      const [chap, v] = rest.split(':');
                      fetchVerse(book, chap, v);
                    }}
                  >
                    <span className="recent-ref">{verse.reference}</span>
                    <span className="recent-text-preview">{verse.text.substring(0, 60)}...</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-recent">No recent verses. Browse the Bible to see your history.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
