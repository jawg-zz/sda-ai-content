import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { contentType, topic, scripture, targetAudience, serviceTime } = await request.json();

  // Handle topic suggestions
  if (topic === "SUGGEST_TOPICS") {
    return handleTopicSuggestions(contentType, targetAudience);
  }

  // Build the prompt
  let userPrompt = "";
  
  switch (contentType) {
    case "sermon":
      userPrompt = `Generate a sermon outline/preaching points on the topic: "${topic}". ${scripture ? `Focus on this scripture: ${scripture}.` : ""} Target audience: ${targetAudience}. Include introduction, main points (at least 3), and conclusion. Make it biblically grounded and practical for ${targetAudience}.`;
      break;
    case "devotional":
      userPrompt = `Generate a daily devotional for ${targetAudience}. Topic: "${topic}". ${scripture ? `Base it on: ${scripture}.` : ""} Include title, Bible verse, main message (2-3 paragraphs), reflection question, and short prayer.`;
      break;
    case "bibleStudy":
      userPrompt = `Generate a Bible study outline for ${targetAudience}. Topic: "${topic}". ${scripture ? `Use this scripture: ${scripture}.` : ""} Include introduction, key verse, 5 discussion questions, and application points.`;
      break;
    case "prayer":
      userPrompt = `Generate prayer points and a prayer for ${targetAudience}. Topic: "${topic}". Include prayers for the church, community, and personal needs. End with a closing prayer.`;
      break;
    case "announcement":
      userPrompt = `Generate church announcement text for ${targetAudience}. Topic: "${topic}". Make it welcoming, clear, and professional.`;
      break;
    case "bulletin":
      userPrompt = `Generate a weekly church bulletin for ${targetAudience}. Topic: "${topic}". ${serviceTime ? `Service time: ${serviceTime}.` : ""} Include: welcome message, service times, upcoming events, announcements, and prayer requests. Make it welcoming, well-organized, and ready to print.`;
      break;
    default:
      userPrompt = `Generate content for ${targetAudience}. Topic: "${topic}". Type: ${contentType}.`;
  }

  const systemPrompt = `You are a helpful assistant that generates content for Seventh-day Adventist (SDA) churches. Generate biblically sound, uplifting content that aligns with SDA beliefs and values.`;

  // Check for API key
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1";

  if (!apiKey || !apiKey.trim()) {
    // Return demo content
    return NextResponse.json(
      generateDemoContent(contentType, topic, scripture, targetAudience)
    );
  }

  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      // Handle different response formats (array or string)
      let content = data.choices[0].message.content;
      if (Array.isArray(content)) {
        // Handle array format with text objects
        content = content.map((c: any) => c.text || c.content || "").join("");
      }
      
      return NextResponse.json({
        title: `${contentType}: ${topic}`,
        content: content,
        status: "success",
      });
    } else {
      return NextResponse.json(
        generateDemoContent(contentType, topic, scripture, targetAudience)
      );
    }
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      generateDemoContent(contentType, topic, scripture, targetAudience)
    );
  }
}

function generateDemoContent(
  type: string,
  topic: string,
  scripture: string,
  audience: string
) {
  const templates: Record<string, string> = {
    sermon: `# Sermon: ${topic}

*Prepared for ${audience}*

---

## Introduction

Dear brothers and sisters, today we come together to study "${topic}" - a topic that is close to God's heart and vital for our spiritual growth.

${scripture ? `As we look at ${scripture}, we see...` : "Let us open our hearts to what God wants to teach us today."}

---

## Point 1: The Biblical Foundation

The Bible teaches us that ${topic} is essential to our walk with Christ. Throughout Scripture, we see examples of those who embraced this truth and those who strayed from it.

---

## Point 2: Practical Application

How do we apply ${topic} to our daily lives? 

1. Daily prayer and reflection
2. Study of God's Word
3. Fellowship with other believers
4. Service to others

---

## Point 3: The Call to Action

As ${audience}, we are called to:

- Embrace this truth wholeheartedly
- Share it with others
- Live it out daily

---

## Conclusion

Let us pray that God will help us to understand and apply "${topic}" to our lives. May we grow in grace and knowledge of our Lord Jesus Christ.

**Prayer:** Dear Lord, help us to embrace ${topic} and live it out in our daily lives. In Jesus' name, Amen.

---

*Demo content - Add your OpenAI API key to get AI-generated content*`,

    devotional: `# Daily Devotional: ${topic}

*For ${audience}*

---

## Scripture
${scripture || "Psalm 23:1 - The LORD is my shepherd; I shall not want."}

## Message

Today's message focuses on "${topic}" - a theme that resonates throughout the Bible and speaks to our daily walk with God.

When we think about ${topic}, we are reminded that God is always with us. He desires for us to grow in our faith and understanding of His love.

## Reflection

Take a moment to consider:

- How has ${topic} impacted your life this week?
- What steps can you take to grow deeper in this area?
- Who can you share this with?

## Prayer

Dear Heavenly Father, thank You for Your love and guidance. Help us to focus on ${topic} and apply it to our daily lives. Give us the strength to walk in Your ways.

We pray this in Jesus' name, Amen.

---

*Demo content - Add your OpenAI API key to get AI-generated content*`,

    bibleStudy: `# Bible Study: ${topic}

*For ${audience}*

---

## Opening Prayer

Let us pray: Lord, open our hearts and minds as we study Your Word. Teach us Your truth. In Jesus' name, Amen.

---

## Introduction

Tonight, we dive into the important topic of "${topic}" and what the Bible teaches us about it.

## Key Verse

${scripture || "Psalm 119:105 - Your word is a lamp to my feet and a light to my path."}

## Discussion Questions

1. What does the Bible say about ${topic}?
2. How did Jesus demonstrate this in His ministry?
3. What can we learn from the early church?
4. How should ${audience} apply this today?
5. What changes do we need to make?

## Application

This week, consider:

- Reading verses about ${topic} daily
- Sharing what you learn with a friend
- Practicing this in your daily life

## Closing Prayer

Father, thank You for Your Word. Help us to apply these truths to our lives. Use us to share Your love with others.

In Jesus' name, Amen.

---

*Demo content - Add your OpenAI API key to get AI-generated content*`,

    prayer: `# Prayer Points: ${topic}

---

## Prayer for the Church

Lord, we pray for our SDA family worldwide. Help us to grow in ${topic}. Unite us in love and purpose.

## Prayer for Our Community

We lift up our local communities. May ${topic} be demonstrated through our actions and witness.

## Prayer for Personal Growth

Lord, help each of us to embrace ${topic} in our personal lives. Give us the strength to live according to Your will.

## Closing Prayer

Dear God, we thank You for hearing our prayers. May Your will be done in all things.

In Jesus' name, Amen.

---

*Demo content - Add your OpenAI API key to get AI-generated content*`,

    announcement: `# Church Announcement: ${topic}

---

Dear Church Family,

We are excited to share about "${topic}" with you this week.

**Details:**
- Join us as we explore this important topic together
- All ${audience} are welcome to participate

For more information, please contact the church office.

God bless you!

---

*Demo content - Add your OpenAI API key to get AI-generated content*`,

    bulletin: `# Weekly Church Bulletin
*${topic}*

---

## Welcome & Announcements

Welcome to our church family! We are glad to have you join us for worship today.

---

## Service Times

**Sabbath School:** 9:30 AM
**Main Service:** 11:00 AM
**Youth Fellowship:** 3:00 PM

---

## Upcoming Events

- **Prayer Meeting:** Wednesday, 6:00 PM
- **Bible Study:** Thursday, 7:00 PM
- **Community Outreach:** Saturday, 9:00 AM

---

## Announcements

${scripture ? `**Scripture Reading:** ${scripture}` : "**Scripture Reading:** To be announced"}

- Welcome to all visitors!
- Please join us for fellowship lunch after service
- Children's storytime during sermon

---

## Prayer Requests

*Lift up these requests in your prayers:*

- Church growth and unity
- Community needs
- Health and healing
- Missionary work

---

## Church Contact

**Address:** [Your Church Address]
**Phone:** [Phone Number]
**Email:** [Email]

*We exist to glorify God and share His love with our community.*

---

*Demo content - Add your OpenAI API key to get AI-generated content*`,
  };

  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${topic}`,
    content: templates[type] || templates.sermon,
    status: "demo",
  };
}

// Handle AI-powered topic suggestions
async function handleTopicSuggestions(contentType: string, targetAudience: string) {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1";

  // If no valid API key, return default suggestions
  if (!apiKey || !apiKey.trim()) {
    return NextResponse.json({
      suggestions: getDefaultSuggestions(contentType)
    });
  }

  const systemPrompt = `You are a helpful assistant for Seventh-day Adventist (SDA) churches. Suggest relevant, engaging topics for church content.`;
  const userPrompt = `Suggest 5-6 relevant topics for a ${contentType} targeting ${targetAudience}. Return ONLY a JSON array of strings, nothing else. Example: ["Topic 1", "Topic 2", "Topic 3"]`;

  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        suggestions: getDefaultSuggestions(contentType)
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    // Parse the JSON array from response
    try {
      // Try to extract JSON array from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ suggestions });
      }
    } catch (parseError) {
      console.error("Error parsing suggestions:", parseError);
    }

    return NextResponse.json({
      suggestions: getDefaultSuggestions(contentType)
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json({
      suggestions: getDefaultSuggestions(contentType)
    });
  }
}

function getDefaultSuggestions(contentType: string): string[] {
  const suggestions: Record<string, string[]> = {
    sermon: [
      "Faith in Difficult Times",
      "The Power of Prayer",
      "Living for Christ",
      "God's Unconditional Love",
      "Walking by Faith",
      "Trusting God's Plan"
    ],
    devotional: [
      "Morning Blessings",
      "Trusting God's Plan",
      "Daily Guidance",
      "Peace in Chaos",
      "God's Presence"
    ],
    bibleStudy: [
      "Exodus: Liberation",
      "Psalms of Praise",
      "Life of Christ",
      "Epistles: Living Faith",
      "Prophecy Today"
    ],
    prayer: [
      "Church Unity",
      "Community Needs",
      "Missionaries",
      "Personal Growth",
      "Global Revival"
    ],
    announcement: [
      "Special Events",
      "Youth Program",
      "Outreach Initiative",
      "Fellowship Gathering",
      "Worship Schedule"
    ],
    bulletin: [
      "Weekly Highlights",
      "Sabbath Service",
      "Midweek Meeting",
      "Community Outreach",
      "Youth Fellowship"
    ],
  };
  return suggestions[contentType] || suggestions.sermon;
}
