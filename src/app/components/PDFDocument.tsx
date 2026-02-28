import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.ttf'
});

Font.register({
  family: 'Source Sans 3',
  src: 'https://fonts.gstatic.com/s/sourcesans3/v15/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Kw47FEN_io6npfB.woff2'
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Source Sans 3',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#D4A84B',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Playfair Display',
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
    fontFamily: 'Playfair Display',
    color: '#2D5016',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D8',
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontFamily: 'Playfair Display',
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
  contentWrapper: {
    flexDirection: 'row',
  },
});

interface ContentItem {
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'scripture';
  content: string;
}

interface PDFDocumentProps {
  title: string;
  content: string;
  contentType: string;
}

// Parse markdown content to structured format
const parseContent = (content: string): ContentItem[] => {
  const lines = content.split('\n');
  const items: ContentItem[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('# ')) {
      items.push({ type: 'heading', content: trimmed.substring(2) });
    } else if (trimmed.startsWith('## ')) {
      items.push({ type: 'subheading', content: trimmed.substring(3) });
    } else if (trimmed.startsWith('### ')) {
      items.push({ type: 'subheading', content: trimmed.substring(4) });
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      items.push({ type: 'list', content: trimmed.substring(2) });
    } else if (/^[A-Z][a-z]+\s+\d+:\d+/.test(trimmed)) {
      items.push({ type: 'scripture', content: trimmed });
    } else {
      items.push({ type: 'paragraph', content: trimmed });
    }
  }
  
  return items;
};

export const PDFDocument: React.FC<PDFDocumentProps> = ({ title, content, contentType }) => {
  const parsedContent = parseContent(content);
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
