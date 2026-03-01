import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts - use system fonts for better rendering
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.woff2', fontWeight: 'bold' },
  ]
});

// Professional color palette
const colors = {
  primary: '#1D3D7C',
  primaryDark: '#153A63',
  gold: '#D4A84B',
  goldLight: '#E8C97A',
  white: '#FFFFFF',
  cream: '#FAF7F2',
  creamDark: '#F0EBE3',
  dark: '#1E3A0F',
  text: '#2D3436',
  textLight: '#636E72',
  textMuted: '#95A5A6',
  border: '#E0DCD4',
  borderLight: '#F0EDE8',
};

const styles = StyleSheet.create({
  // Base page
  page: { backgroundColor: colors.white, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.6, color: colors.text },
  pageLandscape: { backgroundColor: colors.white, fontFamily: 'Helvetica' },
  
  // Cover Page - Elegant & Professional
  coverPage: { flex: 1, backgroundColor: colors.primary, padding: 50, justifyContent: 'center', alignItems: 'center' },
  coverInnerBorder: { position: 'absolute', top: 30, left: 30, right: 30, bottom: 30, borderWidth: 1, borderColor: 'rgba(212,168,75,0.3)', borderRadius: 2 },
  coverOuterBorder: { position: 'absolute', top: 24, left: 24, right: 24, bottom: 24, borderWidth: 2, borderColor: colors.gold, borderRadius: 4 },
  coverLogoSection: { alignItems: 'center', marginBottom: 40 },
  coverLamb: { fontSize: 64, marginBottom: 20 },
  coverChurchName: { fontSize: 12, color: colors.gold, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 },
  coverTagline: { fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, fontStyle: 'italic' },
  coverTitle: { fontSize: 34, color: colors.white, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.3, marginBottom: 25, paddingHorizontal: 20 },
  coverTitleUnderline: { width: 80, height: 3, backgroundColor: colors.gold, marginBottom: 25 },
  coverType: { fontSize: 13, color: colors.gold, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 2 },
  coverDate: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 40 },
  coverFooter: { position: 'absolute', bottom: 40 },
  coverCross: { fontSize: 18, opacity: 0.3, textAlign: 'center', marginBottom: 10 },
  coverTagline2: { fontSize: 9, color: 'rgba(255,255,255,0.35)' },
  
  // Header - Clean & Modern
  header: { backgroundColor: colors.primary, padding: 24, paddingBottom: 18 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLamb: { fontSize: 24 },
  headerChurchText: { flexDirection: 'column' },
  headerChurchName: { fontSize: 8, color: colors.gold, letterSpacing: 1.5, textTransform: 'uppercase' },
  headerChurchMotto: { fontSize: 7, color: 'rgba(255,255,255,0.5)', marginTop: 1, fontStyle: 'italic' },
  headerDate: { fontSize: 9, color: 'rgba(255,255,255,0.7)' },
  headerDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  headerBottom: { paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: 20, color: colors.white, fontWeight: 'bold', maxWidth: '75%', lineHeight: 1.3 },
  headerBadge: { backgroundColor: colors.gold, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 2 },
  headerBadgeText: { fontSize: 8, color: colors.primaryDark, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  
  // Body
  body: { padding: 32, paddingBottom: 50 },
  
  // TOC - Table of Contents
  toc: { backgroundColor: colors.cream, padding: 18, marginBottom: 24, borderRadius: 3, borderLeftWidth: 4, borderLeftColor: colors.gold },
  tocTitle: { fontSize: 13, fontWeight: 'bold', color: colors.primary, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  tocItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingVertical: 2 },
  tocDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.gold, marginRight: 10 },
  tocText: { fontSize: 10, color: colors.text, flex: 1 },
  tocPage: { fontSize: 9, color: colors.textMuted, marginLeft: 10 },
  
  // Sections
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: colors.gold },
  sectionTitleSmall: { fontSize: 14, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 10, marginTop: 20, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  
  // Content
  paragraph: { fontSize: 11, lineHeight: 1.75, color: colors.text, marginBottom: 12, textAlign: 'justify' },
  
  // Bulleted Lists - Better spacing and alignment
  listContainer: { marginBottom: 16, marginLeft: 4 },
  listItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  listBullet: { width: 20, fontSize: 11, color: colors.gold, fontWeight: 'bold', lineHeight: 1.6 },
  listText: { fontSize: 11, lineHeight: 1.7, color: colors.text, flex: 1, paddingRight: 20 },
  
  // Numbered Lists
  numberedContainer: { marginBottom: 16, marginLeft: 4 },
  numberedItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  number: { width: 22, fontSize: 11, color: colors.primary, fontWeight: 'bold', lineHeight: 1.6 },
  numberText: { fontSize: 11, lineHeight: 1.7, color: colors.text, flex: 1, paddingRight: 20 },
  
  // Scripture Box - Enhanced design
  scriptureBox: { backgroundColor: colors.cream, padding: 16, marginVertical: 14, borderRadius: 3, borderLeftWidth: 4, borderLeftColor: colors.gold, borderRightWidth: 1, borderRightColor: colors.borderLight, borderTopWidth: 1, borderTopColor: colors.borderLight, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  scriptureRef: { fontSize: 10, fontWeight: 'bold', color: '#8B6914', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  scriptureText: { fontSize: 10.5, fontStyle: 'italic', color: colors.textLight, lineHeight: 1.7 },
  
  // Key Points Box
  keyPointsBox: { backgroundColor: colors.primary, padding: 16, marginVertical: 14, borderRadius: 3 },
  keyPointsTitle: { fontSize: 11, fontWeight: 'bold', color: colors.gold, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  keyPointItem: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  keyPointBullet: { width: 16, fontSize: 10, color: colors.white, lineHeight: 1.6 },
  keyPointText: { fontSize: 10, lineHeight: 1.6, color: colors.white, flex: 1 },
  
  // Prayer Box - More elegant
  prayerBox: { backgroundColor: colors.cream, padding: 20, marginVertical: 16, borderRadius: 3, borderWidth: 1, borderColor: colors.gold, alignItems: 'center' },
  prayerTitle: { fontSize: 12, fontWeight: 'bold', color: colors.primary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  prayerText: { fontSize: 11, lineHeight: 1.9, color: colors.text, fontStyle: 'italic', textAlign: 'center' },
  
  // Callout/Highlight Box
  calloutBox: { backgroundColor: colors.creamDark, padding: 14, marginVertical: 12, borderRadius: 3, borderLeftWidth: 4, borderLeftColor: colors.primary },
  calloutText: { fontSize: 11, lineHeight: 1.7, color: colors.text, fontStyle: 'italic' },
  
  // Footer - Cleaner design
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.primaryDark, padding: 10, paddingHorizontal: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerLogo: { fontSize: 10 },
  footerText: { fontSize: 8, color: 'rgba(255,255,255,0.6)' },
  footerRight: { fontSize: 8, color: 'rgba(255,255,255,0.4)' },
  pageNumber: { position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: colors.textMuted },
  
  // Spacer
  spacer: { height: 16 },
  spacerSmall: { height: 8 },
  
  // Bold Label Style - for "**Label:** content" format
  boldLabelContainer: { marginBottom: 10, paddingLeft: 0 },
  boldLabel: { fontSize: 11, fontWeight: 'bold', color: colors.primary, marginBottom: 4 },
  boldLabelText: { fontSize: 11, lineHeight: 1.7, color: colors.text },
  
  // Bold Bullet - for "• **Label:** content" format
  boldBulletContainer: { marginBottom: 12, paddingLeft: 0 },
  boldBulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  boldBulletLabel: { fontSize: 11, fontWeight: 'bold', color: colors.primary },
  boldBulletText: { fontSize: 11, lineHeight: 1.7, color: colors.text, flex: 1, paddingLeft: 4 },
  
  // Nested List
  nestedListItem: { flexDirection: 'row', marginBottom: 4, paddingLeft: 16 },
  nestedBullet: { width: 12, fontSize: 10, color: colors.textMuted },
  nestedText: { fontSize: 10, lineHeight: 1.6, color: colors.textLight, flex: 1 },
});

interface Heading { id: string; text: string; level: number; }
interface ContentItem { type: string; content: string; verseText?: string; label?: string; indent?: number; }
interface PDFDocumentProps { title: string; content: string; contentType: string; headings?: Heading[]; scriptureVerses?: Record<string, string>; }

const parseContent = (content: string): { items: ContentItem[], headings: Heading[] } => {
  const lines = content.split('\n');
  const items: ContentItem[] = [];
  const headings: Heading[] = [];
  let headingCounter = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Handle markdown headers
    if (trimmed.startsWith('# ') && !trimmed.startsWith('##')) {
      headingCounter++;
      headings.push({ id: 'h'+headingCounter, text: trimmed.substring(2), level: 1 });
      items.push({ type: 'heading', content: trimmed.substring(2) });
    } else if (trimmed.startsWith('## ')) {
      headingCounter++;
      headings.push({ id: 'h'+headingCounter, text: trimmed.substring(3), level: 2 });
      items.push({ type: 'subheading', content: trimmed.substring(3) });
    } else if (trimmed.startsWith('### ')) {
      headingCounter++;
      headings.push({ id: 'h'+headingCounter, text: trimmed.substring(4), level: 3 });
      items.push({ type: 'subheading3', content: trimmed.substring(4) });
    } 
    // Handle nested bullet points (indented with spaces) - detect sub-items
    else if (trimmed.match(/^(\s{2,})[-*•]\s/)) {
      const indentLevel = (trimmed.match(/^(\s*)/)?.[1]?.length || 0);
      const content = trimmed.replace(/^\s*[-*•]\s*/, '');
      items.push({ type: 'listNested', content, indent: indentLevel });
    }
    // Handle bullet points with bold content (e.g., • **The Doctrine:**)
    else if (trimmed.match(/^[-*•]\s+\*\*(.+?)\*\*[:：]/)) {
      const match = trimmed.match(/^[-*•]\s+\*\*(.+?)\*\*[:：]\s*(.*)$/);
      if (match) {
        items.push({ type: 'boldBullet', label: match[1], content: match[2] });
      }
    }
    // Handle numbered items
    else if (trimmed.match(/^\d+\.\s/)) {
      items.push({ type: 'numbered', content: trimmed.replace(/^\d+\.\s/, '') });
    }
    // Handle simple bullet points
    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      items.push({ type: 'list', content: trimmed.replace(/^[-*•]\s/, '') });
    }
    // Handle blockquotes
    else if (trimmed.startsWith('> ')) {
      items.push({ type: 'callout', content: trimmed.substring(2) });
    }
    // Handle scripture references like "Exodus 20:8-11" or "Rev. 14:7, 12"
    else if (trimmed.match(/^([A-Z][a-z]*\.?\s*\d+:\d+(?:-\d+)?(?:,\s*\d+)?)/)) {
      const match = trimmed.match(/^([A-Z][a-z]*\.?\s*\d+:\d+(?:-\d+)?(?:,\s*\d+)?)\s*[-–—:,]?\s*(.*)$/);
      if (match) {
        items.push({ type: 'scripture', content: match[1], verseText: match[2] });
      } else {
        items.push({ type: 'scripture', content: trimmed });
      }
    }
    // Handle lines starting with bold text (like **The Thesis Today:**)
    else if (trimmed.match(/^\*\*(.+?)\*\*[:：]/)) {
      const match = trimmed.match(/^\*\*(.+?)\*\*[:：]\s*(.*)$/);
      if (match) {
        items.push({ type: 'boldLabel', label: match[1], content: match[2] });
      }
    }
    // Handle prayer lines
    else if (trimmed.toLowerCase().includes('prayer') && trimmed.length < 80 && !trimmed.includes(':')) {
      items.push({ type: 'prayer', content: trimmed });
    }
    // Default to paragraph
    else {
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
    const labels: Record<string,string> = { sermon: 'Sermon Outline', devotional: 'Daily Devotional', bibleStudy: 'Bible Study Guide', prayer: 'Prayer Points', announcement: 'Church Announcement', bulletin: 'Weekly Bulletin' };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Group consecutive lists
  const grouped: ContentItem[] = [];
  let listBuffer: ContentItem[] = [];
  let numberedBuffer: ContentItem[] = [];
  
  const flushLists = () => {
    if (listBuffer.length) { grouped.push({ type: 'bulleted', content: '' }); grouped.push(...listBuffer); listBuffer = []; }
    if (numberedBuffer.length) { grouped.push({ type: 'numberedGroup', content: '' }); grouped.push(...numberedBuffer); numberedBuffer = []; }
  };
  
  for (const item of parsedContent) {
    if (item.type === 'list') { flushLists(); listBuffer.push(item); }
    else if (item.type === 'numbered') { flushLists(); numberedBuffer.push(item); }
    else { flushLists(); grouped.push(item); }
  }
  flushLists();

  // Group consecutive items for better rendering
  const renderContent = () => {
    const elements: React.ReactNode[] = [];
    let currentList: ContentItem[] = [];
    let currentNumberedList: ContentItem[] = [];
    
    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <View key={`list-${elements.length}`} style={styles.listContainer}>
            {currentList.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{item.content}</Text>
              </View>
            ))}
          </View>
        );
        currentList = [];
      }
      if (currentNumberedList.length > 0) {
        elements.push(
          <View key={`num-${elements.length}`} style={styles.numberedContainer}>
            {currentNumberedList.map((item, i) => {
              const numMatch = item.content.match(/^(\d+)/);
              return (
                <View key={i} style={styles.numberedItem}>
                  <Text style={styles.number}>{numMatch?.[1] || (i + 1)}</Text>
                  <Text style={styles.numberText}>{item.content.replace(/^\d+[\.\)]\s*/, '')}</Text>
                </View>
              );
            })}
          </View>
        );
        currentNumberedList = [];
      }
    };
    
    for (const item of grouped) {
      if (item.type === 'list' || item.type === 'listNested') {
        currentList.push(item);
      } else if (item.type === 'numbered') {
        flushList();
        currentNumberedList.push(item);
      } else {
        flushList();
        
        switch(item.type) {
          case 'heading':
            elements.push(<View key={elements.length} style={styles.section}><Text style={styles.sectionTitle}>{item.content}</Text></View>);
            break;
          case 'subheading':
            elements.push(<View key={elements.length} style={styles.section}><Text style={styles.sectionTitleSmall}>{item.content}</Text></View>);
            break;
          case 'subheading3':
            elements.push(<View key={elements.length} style={styles.spacerSmall}><Text style={{...styles.sectionTitleSmall, fontSize: 12, marginTop: 12}}>{item.content}</Text></View>);
            break;
          case 'scripture':
            elements.push(
              <View key={elements.length} style={styles.scriptureBox}>
                <Text style={styles.scriptureRef}>{item.content}</Text>
                {item.verseText && <Text style={styles.scriptureText}>{item.verseText}</Text>}
              </View>
            );
            break;
          case 'prayer':
            elements.push(
              <View key={elements.length} style={styles.prayerBox}>
                <Text style={styles.prayerTitle}>Prayer</Text>
                <Text style={styles.prayerText}>{item.content.replace(/^prayer:?\s*/i, '')}</Text>
              </View>
            );
            break;
          case 'keypoint':
            elements.push(
              <View key={elements.length} style={styles.keyPointsBox}>
                <View style={styles.keyPointItem}>
                  <Text style={styles.keyPointBullet}>◆</Text>
                  <Text style={styles.keyPointText}>{item.content}</Text>
                </View>
              </View>
            );
            break;
          case 'boldLabel':
            elements.push(
              <View key={elements.length} style={styles.boldLabelContainer}>
                <Text style={styles.boldLabel}>{item.label}:</Text>
                {item.content && <Text style={styles.boldLabelText}>{item.content}</Text>}
              </View>
            );
            break;
          case 'boldBullet':
            elements.push(
              <View key={elements.length} style={styles.boldBulletContainer}>
                <View style={styles.boldBulletRow}>
                  <Text style={styles.boldBulletLabel}>{item.label}:</Text>
                  {item.content && <Text style={styles.boldBulletText}>{item.content}</Text>}
                </View>
              </View>
            );
            break;
          case 'callout':
            elements.push(
              <View key={elements.length} style={styles.calloutBox}>
                <Text style={styles.calloutText}>{item.content}</Text>
              </View>
            );
            break;
          case 'paragraph':
          default:
            if (item.content.trim()) {
              elements.push(<Text key={elements.length} style={styles.paragraph}>{item.content}</Text>);
            }
            break;
        }
      }
    }
    flushList();
    return elements;
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverOuterBorder} />
        <View style={styles.coverInnerBorder} />
        <View style={styles.coverLogoSection}>
          <Text style={styles.coverLamb}>🐑</Text>
          <Text style={styles.coverChurchName}>Seventh-day Adventist Church</Text>
          <Text style={styles.coverTagline}>"The Church That Loves"</Text>
        </View>
        <Text style={styles.coverTitle}>{formatTitle(title)}</Text>
        <View style={styles.coverTitleUnderline} />
        <Text style={styles.coverType}>{getContentTypeLabel(contentType)}</Text>
        <Text style={styles.coverDate}>{currentDate}</Text>
        <View style={styles.coverFooter}>
          <Text style={styles.coverCross}>✝</Text>
          <Text style={styles.coverTagline2}>Generated by SDA Content Generator</Text>
        </View>
      </Page>

      {/* Content Pages */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerLamb}>🐑</Text>
              <View style={styles.headerChurchText}>
                <Text style={styles.headerChurchName}>Seventh-day Adventist Church</Text>
                <Text style={styles.headerChurchMotto}>"The Church That Loves"</Text>
              </View>
            </View>
            <Text style={styles.headerDate}>{currentDate}</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerBottom}>
            <Text style={styles.headerTitle}>{formatTitle(title)}</Text>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{getContentTypeLabel(contentType)}</Text>
            </View>
          </View>
        </View>

        {/* Body Content */}
        <View style={styles.body}>
          {/* Table of Contents */}
          {headings.length > 0 && (
            <View style={styles.toc}>
              <Text style={styles.tocTitle}>Contents</Text>
              {headings.map((h, i) => (
                <View key={i} style={styles.tocItem}>
                  <View style={styles.tocDot} />
                  <Text style={styles.tocText}>{h.text}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Main Content */}
          {renderContent()}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLogo}>🐑</Text>
            <Text style={styles.footerText}>Seventh-day Adventist Church</Text>
          </View>
          <Text style={styles.footerRight}>Generated by SDA Content Generator</Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
