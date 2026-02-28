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

// SDA Official Colors
const colors = {
  sdaBlue: '#1D3D7C',
  sdaGold: '#D4A84B',
  sdaWhite: '#FFFFFF',
  sdaCream: '#FDF8F0',
  sdaDark: '#1E3A0F',
  sdaGray: '#666666',
  sdaLightGray: '#E5E0D8',
};

const styles = StyleSheet.create({
  // Page layout
  page: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  
  // COVER PAGE
  coverPage: {
    flex: 1,
    backgroundColor: colors.sdaBlue,
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 2,
    borderColor: colors.sdaGold,
    borderRadius: 8,
  },
  coverLogoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  coverLamb: {
    fontSize: 80,
    marginBottom: 20,
  },
  coverChurchName: {
    fontSize: 12,
    color: colors.sdaGold,
    textAlign: 'center',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  coverTagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 40,
  },
  coverTitle: {
    fontSize: 38,
    color: colors.sdaWhite,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
    lineHeight: 1.2,
  },
  coverDivider: {
    width: 80,
    height: 3,
    backgroundColor: colors.sdaGold,
    marginVertical: 25,
  },
  coverSubtitle: {
    fontSize: 16,
    color: colors.sdaGold,
    textAlign: 'center',
    marginBottom: 10,
  },
  coverMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  coverFooter: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  coverCross: {
    fontSize: 24,
    marginBottom: 10,
    opacity: 0.5,
  },
  
  // CONTENT PAGE
  contentPage: {
    padding: 0,
  },
  
  // Header
  contentHeader: {
    backgroundColor: colors.sdaBlue,
    padding: 30,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLamb: {
    fontSize: 32,
  },
  headerChurchName: {
    fontSize: 9,
    color: colors.sdaGold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerDate: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  headerTitleSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 15,
  },
  title: {
    fontSize: 24,
    color: colors.sdaWhite,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: colors.sdaGold,
  },
  
  // Content body
  contentBody: {
    padding: 40,
  },
  
  // Table of Contents
  toc: {
    marginBottom: 35,
    padding: 25,
    backgroundColor: colors.sdaCream,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.sdaGold,
  },
  tocTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.sdaBlue,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.sdaLightGray,
  },
  tocItem: {
    fontSize: 10,
    color: colors.sdaGray,
    marginBottom: 8,
    paddingLeft: 10,
  },
  tocItemMain: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.sdaDark,
    marginBottom: 5,
  },
  
  // Sections
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.sdaBlue,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.sdaGold,
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.sdaDark,
    marginBottom: 12,
    marginTop: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.sdaLightGray,
  },
  
  // Content elements
  paragraph: {
    fontSize: 11,
    lineHeight: 1.8,
    color: '#333333',
    marginBottom: 14,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 11,
    lineHeight: 1.8,
    color: '#333333',
    marginBottom: 8,
    flexDirection: 'row',
  },
  bullet: {
    width: 18,
    color: colors.sdaGold,
    fontWeight: 'bold',
    fontSize: 12,
  },
  listItemText: {
    flex: 1,
  },
  
  // Scripture box
  scripture: {
    backgroundColor: colors.sdaCream,
    padding: 15,
    marginVertical: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: colors.sdaGold,
  },
  scriptureVerse: {
    fontSize: 10,
    color: '#8B4513',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scriptureText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#555555',
    lineHeight: 1.6,
  },
  
  // Prayer box
  prayer: {
    backgroundColor: colors.sdaCream,
    padding: 25,
    marginVertical: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.sdaGold,
    alignItems: 'center',
  },
  prayerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.sdaBlue,
    marginBottom: 15,
  },
  prayerText: {
    fontSize: 11,
    lineHeight: 1.9,
    color: '#444444',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  // Callout
  callout: {
    backgroundColor: '#F0F7F0',
    padding: 18,
    marginVertical: 15,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4A7C23',
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.sdaDark,
    marginBottom: 8,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.sdaBlue,
    padding: 15,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
  },
  
  pageNumber: {
    position: 'absolute',
    bottom: 18,
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

const parseContent = (content: string): { items: ContentItem[], headings: Heading[] } => {
  const lines = content.split('\n');
  const items: ContentItem[] = [];
  const headings: Heading[] = [];
  let headingCounter = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('# ') && !trimmed.startsWith('##')) {
      headingCounter++;
      headings.push({ id: `h${headingCounter}`, text: trimmed.substring(2), level: 1 });
      items.push({ type: 'heading', content: trimmed.substring(2) });
    } else if (trimmed.startsWith('## ')) {
      headingCounter++;
      headings.push({ id: `h${headingCounter}`, text: trimmed.substring(3), level: 2 });
      items.push({ type: 'subheading', content: trimmed.substring(3) });
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      items.push({ type: 'list', content: trimmed.substring(2) });
    } else if (/^[A-Z][a-z]+\s+\d+:\d+/.test(trimmed)) {
      items.push({ type: 'scripture', content: trimmed });
    } else if (trimmed.toLowerCase().includes('prayer')) {
      items.push({ type: 'prayer', content: trimmed });
    } else {
      items.push({ type: 'paragraph', content: trimmed });
    }
  }
  
  return { items, headings };
};

export const PDFDocument: React.FC<PDFDocumentProps> = ({ title, content, contentType, headings: providedHeadings }) => {
  const { items: parsedContent, headings: extractedHeadings } = parseContent(content);
  const headings = providedHeadings || extractedHeadings;
  
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatTitle = (t: string) => t.replace(/^(sermon|devotional|bibleStudy|prayer|announcement|bulletin):\s*/i, '');
  
  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sermon: 'Sermon', devotional: 'Daily Devotional', bibleStudy: 'Bible Study',
      prayer: 'Prayer', announcement: 'Announcement', bulletin: 'Weekly Bulletin',
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Document>
      {/* COVER PAGE */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverBorder} />
        <View style={styles.coverLogoContainer}>
          <Text style={styles.coverLamb}>🐑</Text>
          <Text style={styles.coverChurchName}>Seventh-day Adventist Church</Text>
          <Text style={styles.coverTagline}>"The Church That Loves"</Text>
        </View>
        <Text style={styles.coverTitle}>{formatTitle(title)}</Text>
        <View style={styles.coverDivider} />
        <Text style={styles.coverSubtitle}>{getContentTypeLabel(contentType)}</Text>
        <Text style={styles.coverMeta}>{currentDate}</Text>
        <View style={styles.coverFooter}>
          <Text style={styles.coverCross}>✝️</Text>
          <Text style={styles.coverMeta}>Generated by SDA Content Generator</Text>
        </View>
      </Page>

      {/* CONTENT PAGE */}
      <Page size="A4" style={styles.contentPage}>
        {/* Header */}
        <View style={styles.contentHeader}>
          <View style={styles.headerTop}>
            <View style={styles.headerLogoSection}>
              <Text style={styles.headerLamb}>🐑</Text>
              <Text style={styles.headerChurchName}>Seventh-day Adventist Church</Text>
            </View>
            <Text style={styles.headerDate}>{currentDate}</Text>
          </View>
          <View style={styles.headerTitleSection}>
            <Text style={styles.title}>{formatTitle(title)}</Text>
            <Text style={styles.subtitle}>{getContentTypeLabel(contentType)}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.contentBody}>
          {headings.length > 0 && (
            <View style={styles.toc}>
              <Text style={styles.tocTitle}>📑 Table of Contents</Text>
              {headings.map((h, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>{h.level === 1 ? '●' : '○'}</Text>
                  <Text style={h.level === 1 ? styles.tocItemMain : styles.tocItem}>{h.text}</Text>
                </View>
              ))}
            </View>
          )}

          {parsedContent.map((item, index) => {
            switch (item.type) {
              case 'heading':
                return <View key={index} style={styles.section}><Text style={styles.sectionTitle}>{item.content}</Text></View>;
              case 'subheading':
                return <View key={index} style={styles.section}><Text style={styles.sectionTitleSmall}>{item.content}</Text></View>;
              case 'list':
                return <View key={index} style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listItemText}>{item.content}</Text></View>;
              case 'scripture':
                return <View key={index} style={styles.scripture}><Text style={styles.scriptureVerse}>{item.content}</Text></View>;
              case 'prayer':
                return <View key={index} style={styles.prayer}><Text style={styles.prayerTitle}>🙏 Prayer</Text><Text style={styles.prayerText}>{item.content}</Text></View>;
              default:
                return <Text key={index} style={styles.paragraph}>{item.content}</Text>;
            }
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>🐑 Seventh-day Adventist Church</Text>
          <Text style={styles.footerText}>Generated by SDA Content Generator</Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
