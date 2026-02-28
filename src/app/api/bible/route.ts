import { NextRequest, NextResponse } from "next/server";

// KJV Bible verses (subset for offline fallback)
const kjvVerseMap: Record<string, string> = {
  "genesis 1:1": "In the beginning God created the heaven and the earth.",
  "genesis 1:27": "So God created man in his own image, in the image of God created he him; male and female created he them.",
  "exodus 20:3": "Thou shalt have no other gods before me.",
  "psalms 23:1": "The LORD is my shepherd; I shall not want.",
  "psalms 23:4": "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
  "proverbs 3:5": "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
  "proverbs 3:6": "In all thy ways acknowledge him, and he shall direct thy paths.",
  "isaiah 40:31": "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
  "matthew 5:9": "Blessed are the peacemakers: for they shall be called the children of God.",
  "matthew 5:16": "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
  "matthew 6:33": "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
  "matthew 7:7": "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.",
  "matthew 11:28": "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
  "matthew 22:37": "Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind.",
  "matthew 28:19": "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.",
  "matthew 28:20": "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.",
  "john 1:1": "In the beginning was the Word, and the Word was with God, and the Word was God.",
  "john 1:14": "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
  "john 3:16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  "john 3:17": "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
  "john 10:10": "The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.",
  "john 14:6": "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
  "john 14:27": "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
  "john 15:5": "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing.",
  "john 15:12": "This is my commandment, That ye love one another, as I have loved you.",
  "acts 1:8": "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.",
  "acts 2:38": "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.",
  "romans 3:23": "For all have sinned, and come short of the glory of God;",
  "romans 5:8": "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.",
  "romans 6:23": "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",
  "romans 8:28": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
  "romans 10:9": "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.",
  "romans 12:1": "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.",
  "romans 12:2": "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.",
  "1 corinthians 13:4": "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,",
  "1 corinthians 13:13": "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
  "2 corinthians 5:17": "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.",
  "galatians 5:22": "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,",
  "galatians 6:9": "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
  "ephesians 2:8": "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:",
  "ephesians 4:32": "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.",
  "ephesians 6:10": "Finally, my brethren, be strong in the Lord, and in the power of his might.",
  "philippians 4:4": "Rejoice in the Lord alway: and again I say, Rejoice.",
  "philippians 4:6": "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
  "philippians 4:8": "Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.",
  "philippians 4:13": "I can do all things through Christ which strengtheneth me.",
  "colossians 3:12": "Put on therefore, as the elect of God, holy and beloved, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering;",
  "colossians 3:23": "And whatsoever ye do, do it heartily, as to the Lord, and not unto men;",
  "1 thessalonians 5:17": "Pray without ceasing.",
  "1 thessalonians 5:18": "In every thing give thanks: for this is the will of God in Christ Jesus concerning you.",
  "2 timothy 1:7": "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
  "2 timothy 3:16": "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:",
  "hebrews 11:1": "Now faith is the substance of things hoped for, the evidence of things not seen.",
  "hebrews 12:1": "Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us,",
  "hebrews 12:2": "Looking unto Jesus the author and finisher of our faith; who for the joy that was set before him endured the cross, despising the shame, and is set down at the right hand of the throne of God.",
  "hebrews 13:8": "Jesus Christ the same yesterday, and to day, and for ever.",
  "james 1:5": "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
  "james 1:17": "Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.",
  "james 2:17": "Even so faith, if it hath not works, is dead, being alone.",
  "james 4:8": "Draw nigh to God, and he will draw nigh to you. Cleanse your hands, ye sinners; and purify your hearts, ye double minded.",
  "james 5:16": "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.",
  "1 peter 2:9": "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light;",
  "1 peter 5:7": "Casting all your care upon him; for he careth for you.",
  "1 john 1:9": "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
  "1 john 3:16": "Hereby perceive we the love of God, because he laid down his life for us: and we ought to lay down our lives for the brethren.",
  "1 john 4:7": "Beloved, let us love one another: for love is of God; and every one that loveth is born of God, and knoweth God.",
  "1 john 4:8": "He that loveth not knoweth not God; for God is love.",
  "1 john 4:19": "We love him, because he first loved us.",
  "revelation 1:8": "I am Alpha and Omega, the beginning and the ending, saith the Lord, which is, and which was, and which is to come, the Almighty.",
  "revelation 3:20": "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.",
  "revelation 21:4": "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
  "revelation 22:13": "I am Alpha and Omega, the beginning and the end, the first and the last.",
  "revelation 22:21": "The grace of our Lord Jesus Christ be with you all. Amen.",
};

// Books of the Bible with chapter counts
const booksWithChapters: Record<string, number> = {
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34,
  Joshua: 24, Judges: 21, Ruth: 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, Ezra: 10,
  Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150, Proverbs: 31,
  Ecclesiastes: 12, "Song of Solomon": 8, Isaiah: 66, Jeremiah: 52, Lamentations: 5,
  Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3, Amos: 9,
  Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3,
  Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4,
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28,
  Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6,
  Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6,
  "2 Timothy": 4, Titus: 3, Philemon: 1, Hebrews: 13, James: 5,
  "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1,
  Revelation: 22
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");
  const verse = searchParams.get("verse");
  const query = searchParams.get("q");

  // Return list of books
  if (action === "books") {
    return NextResponse.json({ books: Object.keys(booksWithChapters) });
  }

  // Return chapters for a book
  if (action === "chapters" && book) {
    const chapters = booksWithChapters[book] || 0;
    return NextResponse.json({ chapters: Array.from({ length: chapters }, (_, i) => i + 1) });
  }

  // Get specific verse
  if (action === "verse" && book && chapter) {
    const verseNum = verse || "1";
    const key = `${book.toLowerCase()} ${chapter}:${verseNum}`;
    const text = kjvVerseMap[key];
    
    if (text) {
      return NextResponse.json({ reference: `${book} ${chapter}:${verseNum}`, text, version: "KJV" });
    }
    
    // Try to fetch from API if not in local cache
    try {
      const apiUrl = `https://bible-api.com/${book}%20${chapter}:${verseNum}?translation=kjv`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          reference: data.reference,
          text: data.text,
          version: data.version || "KJV"
        });
      }
    } catch (e) {
      console.error("Bible API error:", e);
    }
    
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });
  }

  // Search verses
  if (action === "search" && query) {
    const searchResults: { reference: string; text: string }[] = [];
    const q = query.toLowerCase();
    
    for (const [key, text] of Object.entries(kjvVerseMap)) {
      if (text.toLowerCase().includes(q)) {
        // Convert key to title case reference
        const parts = key.split(" ");
        const bookName = parts.slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const chapterVerse = parts[parts.length - 1];
        searchResults.push({ reference: `${bookName} ${chapterVerse}`, text });
        if (searchResults.length >= 10) break;
      }
    }
    
    return NextResponse.json({ results: searchResults });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
