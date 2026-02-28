import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.woff2', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  // Page layout
  page: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  
  // Cover page
  coverPage: {
    flex: 1,
    backgroundColor: '#1D3D7C',
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverLogoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  coverLamb: {
    fontSize: 60,
    marginBottom: 15,
  },
  coverChurchName: {
    fontSize: 14,
    color: '#D4A84B',
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  coverTitle: {
    fontSize: 36,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#D4A84B',
    textAlign: 'center',
    marginBottom: 30,
  },
  coverMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  coverDivider: {
    width: 100,
    height: 3,
    backgroundColor: '#D4A84B',
    marginVertical: 30,
  },
  coverCross: {
    position: 'absolute',
    top: 30,
    right: 30,
    fontSize: 30,
    color: '#D4A84B',
    opacity: 0.6,
  },
  
  // Content page
  contentPage: {
    padding: 50,
  },
  
  // Header
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#D4A84B',
    paddingBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerLamb: {
    fontSize: 28,
    marginBottom: 5,
  },
  headerChurchName: {
    fontSize: 8,
    color: '#1D3D7C',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    color: '#1D3D7C',
    fontWeight: 'bold',
    flex: 1,
  },
  subtitle: {
    fontSize: 11,
    color: '#666666',
    marginTop: 5,
  },
  date: {
    fontSize: 10,
    color: '#999999',
  },
  
  // Table of Contents
  toc: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#FDF8F0',
    borderRadius: 8,
  },
  tocTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D3D7C',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D4A84B',
  },
  tocItem: {
    fontSize: 11,
    color: '#444444',
    marginBottom: 8,
    paddingLeft: 10,
  },
  tocItemMain: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D3D7C',
    marginBottom: 6,
  },
  tocPageNum: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    color: '#888888',
  },
  
  // Sections
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3D7C',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#D4A84B',
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1D3D7C',
    marginBottom: 10,
    marginTop: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D8',
  },
  
  // Content
  paragraph: {
    fontSize: 11,
    lineHeight: 1.7,
    color: '#2C2C2C',
    marginBottom: 12,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 11,
    lineHeight: 1.7,
    color: '#2C2C2C',
    marginBottom: 6,
    paddingLeft: 5,
    flexDirection: 'row',
  },
  bullet: {
    width: 15,
    color: '#D4A84B',
    fontWeight: 'bold',
  },
  listItemText: {
    flex: 1,
  },
  
  // Special formatting
  bold: {
    fontWeight: 'bold',
    color: '#1E3A0F',
  },
  italic: {
    fontStyle: 'italic',
    color: '#8B4513',
  },
  scripture: {
    fontStyle: 'italic',
    color: '#8B4513',
    backgroundColor: '#FDF8F0',
    padding: 10,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D4A84B',
  },
  verse: {
    fontSize: 10,
    color: '#8B4513',
    marginBottom: 8,
  },
  
  // Callout boxes
  callout: {
    backgroundColor: '#F0F7F0',
    padding: 15,
    marginVertical: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4A7C23',
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8,
  },
  calloutText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#444444',
  },
  
  // Prayer box
  prayer: {
    backgroundColor: '#FDF8F0',
    padding: 20,
    marginVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4A84B',
  },
  prayerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
    textAlign: 'center',
  },
  prayerText: {
    fontSize: 11,
    lineHeight: 1.8,
    color: '#2C2C2C',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E0D8',
  },
  footerText: {
    fontSize: 9,
    color: '#888888',
  },
  footerPage: {
    fontSize: 9,
    color: '#888888',
  },
  
  // Page numbers
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    color: '#AAAAAA',
  },
});

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ContentItem {
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'scripture' | 'callout' | 'prayer';
  content: string;
}

interface PDFDocumentProps {
  title: string;
  content: string;
  contentType: string;
  headings?: Heading[];
}

// Parse markdown content to structured format
const parseContent = (content: string): { items: ContentItem[], headings: Heading[] } => {
  const lines = content.split('\n');
  const items: ContentItem[] = [];
  const headings: Heading[] = [];
  let headingCounter = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed) continue;
    
    if (trimmed.startsWith('# ') && !trimmed.startsWith('##')) {
      headingCounter++;
      const text = trimmed.substring(2);
      const id = `heading-${headingCounter}`;
      headings.push({ id, text, level: 1 });
      items.push({ type: 'heading', content: text });
    } else if (trimmed.startsWith('## ')) {
      headingCounter++;
      const text = trimmed.substring(3);
      const id = `heading-${headingCounter}`;
      headings.push({ id, text, level: 2 });
      items.push({ type: 'subheading', content: text });
    } else if (trimmed.startsWith('### ')) {
      headingCounter++;
      const text = trimmed.substring(4);
      const id = `heading-${headingCounter}`;
      headings.push({ id, text, level: 3 });
      items.push({ type: 'subheading', content: text });
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      items.push({ type: 'list', content: trimmed.substring(2) });
    } else if (trimmed.toLowerCase().includes('prayer') && trimmed.length < 50) {
      // Check if next few lines are prayer content
      items.push({ type: 'prayer', content: trimmed });
    } else if (/^[*_]{1,3}[A-Z][a-z]+\s+\d+:\d+/.test(trimmed)) {
      items.push({ type: 'scripture', content: trimmed.replace(/^[*_]{1,3}/, '').replace(/[*_]{1,3}$/, '') });
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 40) {
      items.push({ type: 'callout', content: trimmed.replace(/\*\*/g, '') });
    } else {
      items.push({ type: 'paragraph', content: trimmed });
    }
  }
  
  return { items, headings };
};

export const PDFDocument: React.FC<PDFDocumentProps> = ({ title, content, contentType, headings: providedHeadings }) => {
  const { items: parsedContent, headings: extractedHeadings } = parseContent(content);
  const headings = providedHeadings || extractedHeadings;
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatTitle = (title: string) => {
    // Remove content type prefix if present
    return title.replace(/^(sermon|devotional|bibleStudy|prayer|announcement|bulletin):\s*/i, '');
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverLogoContainer}>
          <Text style={styles.coverLamb}>🐑</Text>
          <Text style={styles.coverChurchName}>Seventh-day Adventist Church</Text>
        </View>
        <Text style={styles.coverTitle}>{formatTitle(title)}</Text>
        <View style={styles.coverDivider} />
        <Text style={styles.coverSubtitle}>
          {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content
        </Text>
        <Text style={styles.coverMeta}>
          Generated for Church Use
        </Text>
        <Text style={styles.coverMeta}>
          {currentDate}
        </Text>
        <Text style={{ ...styles.pageNumber, color: 'rgba(255,255,255,0.5)' }}>
          SDA Content Generator
        </Text>
      </Page>

      {/* Content Page */}
      <Page size="A4" style={styles.contentPage}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerLamb}>🐑</Text>
              <Text style={styles.headerChurchName}>Seventh-day Adventist Church</Text>
            </View>
          </View>
          <View style={{ marginTop: 15 }}>
            <Text style={styles.title}>{formatTitle(title)}</Text>
            <Text style={styles.subtitle}>
              {contentType.charAt(0).toUpperCase() + contentType.slice(1)} • {currentDate}
            </Text>
          </View>
        </View>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <View style={styles.toc}>
            <Text style={styles.tocTitle}>📑 Table of Contents</Text>
            {headings.map((heading, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>{heading.level === 1 ? '●' : '○'}</Text>
                <Text style={heading.level === 1 ? styles.tocItemMain : styles.tocItem}>
                  {heading.text}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Main Content */}
        <View>
          {parsedContent.map((item, index) => {
            switch (item.type) {
              case 'heading':
                return (
                  <View key={index} style={styles.section}>
                    <Text style={styles.sectionTitle}>{item.content}</Text>
                  </View>
                );
              case 'subheading':
                return (
                  <View key={index} style={styles.section}>
                    <Text style={styles.sectionTitleSmall}>{item.content}</Text>
                  </View>
                );
              case 'list':
                return (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listItemText}>{item.content}</Text>
                  </View>
                );
              case 'scripture':
                return (
                  <View key={index} style={styles.scripture}>
                    <Text style={styles.verse}>{item.content}</Text>
                  </View>
                );
              case 'prayer':
                return (
                  <View key={index} style={styles.prayer}>
                    <Text style={styles.prayerTitle}>🙏 Prayer</Text>
                    <Text style={styles.prayerText}>{item.content}</Text>
                  </View>
                );
              case 'callout':
                return (
                  <View key={index} style={styles.callout}>
                    <Text style={styles.calloutTitle}>{item.content}</Text>
                  </View>
                );
              default:
                // Check for bold text
                const boldMatch = item.content.match(/\*\*(.+?)\*\*/g);
                if (boldMatch) {
                  return (
                    <Text key={index} style={styles.paragraph}>
                      {item.content.split('**').map((part, i) => 
                        i % 2 === 1 ? <Text style={styles.bold}>{part}</Text> : part
                      )}
                    </Text>
                  );
                }
                return (
                  <Text key={index} style={styles.paragraph}>{item.content}</Text>
                );
            }
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by SDA Content Generator</Text>
          <Text style={styles.footerText}>For Church Use</Text>
          <Text 
            style={styles.footerPage} 
            render={({ pageNumber, totalPages }) => (
              `${pageNumber} / ${totalPages}`
            )} 
          />
        </View>
      </Page>
    </Document>
  );
};
