import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Use standard PDF fonts
const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#D4A84B',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#2D5016',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#2D5016',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D8',
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A0F',
    marginBottom: 8,
    marginTop: 15,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#2C2C2C',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#2C2C2C',
    marginBottom: 4,
    paddingLeft: 10,
  },
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
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#888888',
    borderTopWidth: 1,
    borderTopColor: '#E5E0D8',
    paddingTop: 10,
  },
  // Table of Contents styles
  toc: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#FDF8F0',
    borderRadius: 4,
  },
  tocTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#2D5016',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D4A84B',
  },
  tocItem: {
    fontSize: 10,
    color: '#2C2C2C',
    marginBottom: 4,
    paddingLeft: 10,
  },
  tocItemMain: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A0F',
    marginBottom: 4,
  },
});

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ContentItem {
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'scripture';
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
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('# ')) {
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
    } else if (/^[A-Z][a-z]+\s+\d+:\d+/.test(trimmed)) {
      items.push({ type: 'scripture', content: trimmed });
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {contentType.charAt(0).toUpperCase() + contentType.slice(1)} • {currentDate}
          </Text>
        </View>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <View style={styles.toc}>
            <Text style={styles.tocTitle}>Table of Contents</Text>
            {headings.map((heading, index) => (
              <Text 
                key={index} 
                style={heading.level === 1 ? styles.tocItemMain : styles.tocItem}
              >
                {heading.level > 1 ? '• ' : ''}{heading.text}
              </Text>
            ))}
          </View>
        )}

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
                  <View key={index} style={{ flexDirection: 'row', marginBottom: 3 }}>
                    <Text style={{ width: 15 }}>• </Text>
                    <Text style={styles.listItem}>{item.content}</Text>
                  </View>
                );
              case 'scripture':
                return (
                  <View key={index} style={{ marginBottom: 8 }}>
                    <Text style={styles.scripture}>{item.content}</Text>
                  </View>
                );
              default:
                return (
                  <Text key={index} style={styles.paragraph}>{item.content}</Text>
                );
            }
          })}
        </View>

        <View style={styles.footer}>
          <Text>Generated by SDA Content Generator • For church use</Text>
        </View>
      </Page>
    </Document>
  );
};
