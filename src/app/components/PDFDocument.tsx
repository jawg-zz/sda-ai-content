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

// SDA Colors
const colors = {
  primary: '#1D3D7C',
  gold: '#D4A84B',
  white: '#FFFFFF',
  cream: '#FDF8F0',
  dark: '#1E3A0F',
  text: '#2D3436',
  textLight: '#636E72',
  border: '#DFE6E9',
};

const styles = StyleSheet.create({
  page: { backgroundColor: colors.white, fontFamily: 'Helvetica' },
  
  // Cover
  coverPage: { flex: 1, backgroundColor: colors.primary, padding: 45, justifyContent: 'center', alignItems: 'center' },
  coverInnerBorder: { position: 'absolute', top: 25, left: 25, right: 25, bottom: 25, borderWidth: 1, borderColor: 'rgba(212,168,75,0.4)', borderRadius: 4 },
  coverOuterBorder: { position: 'absolute', top: 20, left: 20, right: 20, bottom: 20, borderWidth: 2, borderColor: colors.gold, borderRadius: 6 },
  coverLogoSection: { alignItems: 'center', marginBottom: 35 },
  coverLamb: { fontSize: 72, marginBottom: 15 },
  coverChurchName: { fontSize: 11, color: colors.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 },
  coverTagline: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 },
  coverTitle: { fontSize: 32, color: colors.white, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.25, marginBottom: 20 },
  coverTitleUnderline: { width: 60, height: 2, backgroundColor: colors.gold, marginBottom: 20 },
  coverType: { fontSize: 14, color: colors.gold, fontWeight: 'bold', marginBottom: 8 },
  coverDate: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 30 },
  coverFooter: { position: 'absolute', bottom: 35 },
  coverCross: { fontSize: 20, opacity: 0.4, textAlign: 'center', marginBottom: 8 },
  coverTagline2: { fontSize: 9, color: 'rgba(255,255,255,0.4)' },
  
  // Header
  header: { backgroundColor: colors.primary, padding: 28, paddingBottom: 22 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLamb: { fontSize: 28 },
  headerChurchText: { flexDirection: 'column' },
  headerChurchName: { fontSize: 8, color: colors.gold, letterSpacing: 1.5, textTransform: 'uppercase' },
  headerChurchMotto: { fontSize: 7, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  headerDate: { fontSize: 9, color: 'rgba(255,255,255,0.7)' },
  headerDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  headerBottom: { paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: 22, color: colors.white, fontWeight: 'bold', maxWidth: '70%' },
  headerBadge: { backgroundColor: colors.gold, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 3 },
  headerBadgeText: { fontSize: 9, color: colors.primary, fontWeight: 'bold', textTransform: 'uppercase' },
  
  // Body
  body: { padding: 35 },
  
  // TOC
  toc: { backgroundColor: colors.cream, padding: 20, marginBottom: 28, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: colors.gold },
  tocTitle: { fontSize: 12, fontWeight: 'bold', color: colors.primary, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  tocItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  tocDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.gold, marginRight: 8 },
  tocText: { fontSize: 10, color: colors.textLight, flex: 1 },
  
  // Section
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 10, paddingBottom: 6, borderBottomWidth: 2, borderBottomColor: colors.gold },
  sectionTitleSmall: { fontSize: 13, fontWeight: 'bold', color: colors.dark, marginBottom: 8, marginTop: 16, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  
  // Content
  paragraph: { fontSize: 10.5, lineHeight: 1.75, color: colors.text, marginBottom: 10, textAlign: 'justify' },
  
  // Lists
  list: { marginBottom: 12, marginLeft: 5 },
  listItem: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  listBullet: { width: 16, fontSize: 10, color: colors.gold, fontWeight: 'bold' },
  listText: { fontSize: 10.5, lineHeight: 1.7, color: colors.text, flex: 1 },
  
  numberedList: { marginBottom: 12, marginLeft: 5 },
  numberedItem: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  number: { width: 18, fontSize: 10, color: colors.primary, fontWeight: 'bold' },
  numberText: { fontSize: 10.5, lineHeight: 1.7, color: colors.text, flex: 1 },
  
  // Scripture
  scriptureBox: { backgroundColor: colors.cream, padding: 14, marginVertical: 12, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: colors.gold },
  scriptureRef: { fontSize: 9, fontWeight: 'bold', color: '#8B4513', marginBottom: 4 },
  scriptureText: { fontSize: 10, fontStyle: 'italic', color: colors.textLight, lineHeight: 1.6 },
  
  // Prayer
  prayerBox: { backgroundColor: colors.cream, padding: 20, marginVertical: 16, borderRadius: 4, borderWidth: 1, borderColor: colors.gold, alignItems: 'center' },
  prayerTitle: { fontSize: 12, fontWeight: 'bold', color: colors.primary, marginBottom: 10 },
  prayerText: { fontSize: 10, lineHeight: 1.8, color: colors.text, fontStyle: 'italic', textAlign: 'center' },
  
  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.primary, padding: 12, paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLogo: { fontSize: 12 },
  footerText: { fontSize: 8, color: 'rgba(255,255,255,0.6)' },
  footerRight: { fontSize: 8, color: 'rgba(255,255,255,0.5)' },
  pageNumber: { position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#B2BEC3' },
});

interface Heading { id: string; text: string; level: number; }
interface ContentItem { type: string; content: string; }
interface PDFDocumentProps { title: string; content: string; contentType: string; headings?: Heading[]; }

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
      headings.push({ id: 'h'+headingCounter, text: trimmed.substring(2), level: 1 });
      items.push({ type: 'heading', content: trimmed.substring(2) });
    } else if (trimmed.startsWith('## ')) {
      headingCounter++;
      headings.push({ id: 'h'+headingCounter, text: trimmed.substring(3), level: 2 });
      items.push({ type: 'subheading', content: trimmed.substring(3) });
    } else if (trimmed.match(/^\d+\.\s/)) {
      items.push({ type: 'numbered', content: trimmed.replace(/^\d+\.\s/, '') });
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      items.push({ type: 'list', content: trimmed.substring(2) });
    } else if (trimmed.match(/^[A-Z][a-z]+\s+\d+:\d+/)) {
      items.push({ type: 'scripture', content: trimmed });
    } else if (trimmed.toLowerCase().includes('prayer') && trimmed.length < 60) {
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

  return (
    <Document>
      {/* Cover */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverOuterBorder} /><View style={styles.coverInnerBorder} />
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

      {/* Content */}
      <Page size="A4" style={styles.page}>
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
            <View style={styles.headerBadge}><Text style={styles.headerBadgeText}>{getContentTypeLabel(contentType)}</Text></View>
          </View>
        </View>

        <View style={styles.body}>
          {headings.length > 0 && (
            <View style={styles.toc}><Text style={styles.tocTitle}>📑 Contents</Text>
              {headings.map((h,i) => <View key={i} style={styles.tocItem}><View style={styles.tocDot} /><Text style={styles.tocText}>{h.text}</Text></View>)}
            </View>
          )}
          {grouped.map((item, index) => {
            switch(item.type) {
              case 'heading': return <View key={index} style={styles.section}><Text style={styles.sectionTitle}>{item.content}</Text></View>;
              case 'subheading': return <View key={index} style={styles.section}><Text style={styles.sectionTitleSmall}>{item.content}</Text></View>;
              case 'bulleted': return null;
              case 'list': return <View key={index} style={styles.listItem}><Text style={styles.listBullet}>•</Text><Text style={styles.listText}>{item.content}</Text></View>;
              case 'numberedGroup': return null;
              case 'numbered': return <View key={index} style={styles.numberedItem}><Text style={styles.number}>{item.content.match(/^(\d+)/)?.[1]||''}</Text><Text style={styles.numberText}>{item.content.replace(/^\d+\.\s*/, '')}</Text></View>;
              case 'scripture': return <View key={index} style={styles.scriptureBox}><Text style={styles.scriptureRef}>{item.content}</Text></View>;
              case 'prayer': return <View key={index} style={styles.prayerBox}><Text style={styles.prayerTitle}>🙏 Prayer</Text><Text style={styles.prayerText}>{item.content}</Text></View>;
              default: return <Text key={index} style={styles.paragraph}>{item.content}</Text>;
            }
          })}
        </View>

        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}><Text style={styles.footerLogo}>🐑</Text><Text style={styles.footerText}>Seventh-day Adventist Church</Text></View>
          <Text style={styles.footerRight}>Generated by SDA Content Generator</Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
