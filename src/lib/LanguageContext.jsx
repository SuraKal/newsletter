import React from "react";

const STORAGE_KEY = "newsletter-language";
const languageConfig = {
  en: {
    lang: "en",
    locale: "en-US",
  },
  ti: {
    lang: "ti",
    locale: "ti-ER",
  },
};

const translations = {
  en: {
    today: "Today",
    edition: "Edition: International",
    subscribe: "Subscribe",
    signIn: "Sign In",
    search: "Search",
    menu: "Menu",
    categories: "Categories",
    quickAccess: "Quick Access",
    searchHint: "Search opens as a quick browse panel",
    language: "EN",
    languageName: "English",
    switchTo: "Tigrigna",
  },
  ti: {
    today: "ሎሚ",
    edition: "ሕታም፡ ዓለምለኻዊ",
    subscribe: "ተመዝገብ",
    signIn: "እቶ",
    search: "ምድላይ",
    menu: "ምንዋሕ",
    categories: "ምድባት",
    quickAccess: "ቅልጡፍ መዳረሻ",
    searchHint: "ምድላይ ከም ቅልጡፍ መፈለጊ ፓነል ይኽፈት",
    language: "ትግ",
    languageName: "ትግርኛ",
    switchTo: "English",
  },
};

const contentTranslations = {
  ti: {
    Home: "መበገሲ",
    News: "ዜና",
    Categories: "ምድባት",
    Subscriptions: "ምዝገባታት",
    Business: "ንግዲ",
    About: "ብዛዕባና",
    Contact: "ርኸቡና",
    "Latest News": "ሓድሽ ዜና",
    Featured: "ፍሉይ ጽሑፍ",
    "Opinion & Analysis": "ሓሳብን ትንተናን",
    "Subscription Plans": "ውጥናት ምዝገባ",
    "View All >": "ኩሉ ርአ >",
    "Read story": "ጽሑፍ ኣንብብ",
    Explore: "ዳህስስ",
    Browse: "ርአ",
    "Subscribe Now": "ሕጂ ተመዝገብ",
    "Read Today's Edition": "ናይ ሎሚ ሕታም ኣንብብ",
    "For Organizations": "ንትካላት",
    "ንቐደም for Business": "ንቐደም ንንግዲ",
    "Equip your team with premium journalism. Our business subscriptions offer volume pricing, consolidated billing, and a dedicated account manager.":
      "ጉጅለኻ ብልዑል ደረጃ ጋዜጠኝነት ኣበርትዕ። ናይ ንግዲ ምዝገባታትና ናይ ብዝሒ ዋጋ፣ ዝተዋሃደ ክፍሊትን ውፉይ ኣካውንት ማናጀርን ይህቡ።",
    "Team Access": "መእተዊ ጉጅለ",
    "Bulk Orders": "ብዝሒ ትእዛዛት",
    "Company Dashboard": "ዳሽቦርድ ትካል",
    "Consolidated Delivery": "ዝተዋሃደ መብጽሒ",
    "Learn More": "ተወሳኺ ፍለጥ",
    "User Guide": "መምርሒ ተጠቃሚ",
    "A polished walkthrough for new readers": "ንሓደስቲ ኣንበብቲ ዝተሰናዳ መምርሒ",
    "Trusted Partners": "ዝተኣምኑ መሻርኽቲ",
    "Organizations that move with us": "ምሳና ዝሰርሑ ትካላት",
    "Dedicated Business Contact": "ፍሉይ ናይ ንግዲ ርክብ",
    "Business Email": "ናይ ንግዲ ኢመይል",
    "Business Phone": "ናይ ንግዲ ቴሌፎን",
    "Business Request": "ናይ ንግዲ ሕቶ",
    "Email the team": "ንጉጅለ ኢመይል ስደድ",
    "Call now": "ሕጂ ደውል",
    "Open contact form": "ቅጥዒ ርክብ ክፈት",
    "Newsletter": "ዜና መጽሔት",
    "Sign up for the morning briefing": "ንናይ ንግሆ ሓበሬታ ተመዝገብ",
    "Subscribe": "ተመዝገብ",
    "Contact Sales": "ናይ ሽያጭ ጉጅለ ርኸብ",
    "View Plans": "ውጥናት ርአ",
    "Built for Organizations": "ንትካላት ዝተሰርሐ",
    "Volume Pricing": "ናይ ብዝሒ ዋጋ",
    "Business Inquiry": "ናይ ንግዲ ሕቶ",
    "Send a business request": "ናይ ንግዲ ሕቶ ስደድ",
    "Business Contact Form": "ናይ ንግዲ ቅጥዒ ርክብ",
    "Send Business Request": "ናይ ንግዲ ሕቶ ስደድ",
    Name: "ስም",
    Email: "ኢመይል",
    "Work Email": "ናይ ስራሕ ኢመይል",
    Company: "ትካል",
    "Request Type": "ዓይነት ሕቶ",
    "Company Size": "ዓቐን ትካል",
    "Preferred Contact": "ዝምረጽ መራኸቢ",
    Message: "መልእኽቲ",
    "Send Message": "መልእኽቲ ስደድ",
    "All Categories": "ኩሎም ምድባት",
    Community: "ማሕበረሰብ",
    "Jobs & Marketplace": "ስራሕን ዕዳጋን",
    Events: "ፍጻመታት",
    "Culture & Lifestyle": "ባህልን ኣነባብራን",
    Technology: "ቴክኖሎጂ",
    "Advice Corner": "መኽሪ",
    "Serial Novels": "ተኸታታሊ ልብወለድ",
    Other: "ካልእ",
    Politics: "ፖለቲካ",
    Economy: "ቁጠባ",
    Sports: "ስፖርት",
    Culture: "ባህሊ",
    Support: "ደገፍ",
    "Digital Access": "ዲጂታላዊ መእተዊ",
    "Print + Digital": "ሕትመት + ዲጂታል",
    "Business Plans": "ናይ ንግዲ ውጥናት",
    "Gift Subscription": "ናይ ህያብ ምዝገባ",
    "Student Discount": "ቅናሽ ተማሃሮ",
    "Our Team": "ጉጅለና",
    Careers: "ስራሕ",
    "Press Room": "ክፍሊ ፕሬስ",
    "Help Center": "ማእከል ሓገዝ",
    "Manage Account": "ኣካውንት ኣመሓድር",
    "Privacy Policy": "ፖሊሲ ምስጢር",
    "Terms of Service": "ውዕላት ኣገልግሎት",
    "All rights reserved.": "ኩሉ መሰል ዝተሓለወ እዩ።",
    "Independent Journalism Since 2024": "ናጻ ጋዜጠኝነት ካብ 2024",
    "Expanded category guide": "ዝተስፋሕፍሐ መምርሒ ምድባት",
    "More From The Paper": "ተወሳኺ ካብ ጋዜጣ",
    "Reader Comments": "ርእይቶታት ኣንበብቲ",
    "Leave a Comment": "ርእይቶ ግደፍ",
    "Post Comment": "ርእይቶ ልኣኽ",
    "Related Stories": "ተዛመድቲ ዜናታት",
    "Back to Newsroom": "ናብ ክፍሊ ዜና ተመለስ",
    "In Brief": "ብሓጺሩ",
    Section: "ክፍሊ",
    Published: "ዝተሓትመ",
    Reporter: "ጸሓፊ",
    "Reading Time": "ግዜ ንባብ",
    "We'd love to hear from you. Reach out to our editorial or business team.":
      "ካባኹም ክንሰምዕ ንፈቱ። ንኤዲቶርያል ወይ ናይ ንግዲ ጉጅለና ርኸቡ።",
    Address: "ኣድራሻ",
    Phone: "ቴሌፎን",
    "Find Us": "ኣበይ ከም እንርከብ",
    "Business Contact": "ናይ ንግዲ ርክብ",
    "About ንቐደም": "ብዛዕባ ንቐደም",
    "Our Story": "ታሪኽና",
    "Our Values": "ክብርታትና",
    Leadership: "መሪሕነት",
    "Delivery Tracking": "ክትትል መብጽሒ",
    "Monitor your newspaper deliveries in real time.": "መብጽሒ ጋዜጣኻ ብቀጥታ ተኸታተል።",
    "Current Delivery": "ናይ ሕጂ መብጽሒ",
    Delivered: "ተበጺሑ",
    "Delivery History": "ታሪኽ መብጽሒ",
    "Next Delivery": "ዝቕጽል መብጽሒ",
    "The Newspaper of Record": "ናይ ታሪኽ መዝገብ ጋዜጣ",
    "Founded in 2024, ንቐደም was established with a singular mission: to deliver journalism of uncompromising quality in an era that demands it more than ever.":
      "ኣብ 2024 ዝተመስረተ ንቐደም፣ ኣብዚ ልዕሊ ቀደም ዝያዳ ዝፈልጥ ዘመን ዘይተዋሃደ ጽሬት ዘለዎ ጋዜጠኝነት ንምቕራብ ብሓደ ተልእኾ ተመስሪቱ።",
    Independence: "ናጽነት",
    Accuracy: "ትኽክለኛነት",
    Depth: "ዕምቆት",
    Accessibility: "ተበጻሕነት",
    "We answer to our readers, not to advertisers or political interests. Editorial independence is the foundation of everything we publish.":
      "ንኣንበብትና ኢና እንምልስ፣ ንመወዓውዕቲ ወይ ፖለቲካዊ ረብሓታት ኣይኮንናን። ኤዲቶርያላዊ ናጽነት መሰረት ኩሉ እንሓትሞ እዩ።",
    "Every fact is verified. Every source is vetted. We hold ourselves to the highest standards of journalistic rigor.":
      "ኩሉ ሓቂ ይረጋገጽ። ኩሉ ምንጪ ይምርመር። ንርእስና ኣብ ዝለዓለ መዐቀኒ ጋዜጠኝነታዊ ጥንቃቐ ንሕዝ።",
    "In an age of headlines, we invest in long-form reporting that reveals the full complexity of the stories that matter.":
      "ኣብ ዘመን ርእሰ-ዜና፣ ሙሉእ ውስብስብነት ኣገደስቲ ዛንታታት ዘብርህ ነዊሕ ሪፖርታዥ ንሰርሕ።",
    "Premium journalism should be available to everyone. We keep our pricing fair and our language clear.":
      "ልዑል ደረጃ ጋዜጠኝነት ንኹሉ ክበጽሕ ይግባእ። ዋጋና ፍትሓዊ፣ ቋንቋና ድማ ንጹር ንገብሮ።",
    "Premium Journalism for Your Enterprise": "ልዑል ጋዜጠኝነት ንትካልኩም",
    "Keep your team informed with ንቐደም's business subscription. Volume pricing, consolidated billing, and enterprise-grade management tools.":
      "ጉጅለኹም ብናይ ንቐደም ንግዲ ምዝገባ ሓበሬታ ይርከብ። ናይ ብዝሒ ዋጋ፣ ዝተዋሃደ ክፍሊትን ናይ ትካል ደረጃ መሳርሒታት ምምሕዳርን።",
    "Team Management": "ምምሕዳር ጉጅለ",
    "Bulk Newspaper Orders": "ብዝሒ ትእዛዝ ጋዜጣ",
    "Analytics Dashboard": "ዳሽቦርድ ትንታነ",
    "Enterprise Security": "ድሕነት ትካል",
    "Dedicated Support": "ፍሉይ ደገፍ",
    "Discounted rates for organizations of all sizes.": "ንኹሉ ዓቐን ትካላት ዝተቐነሰ ዋጋ።",
    "Response Time": "ግዜ መልሲ",
    "Best For": "ዝበለጸ ዝሰማማዕ",
    "Most business inquiries receive a reply within 1 business day.": "መብዛሕትኡ ናይ ንግዲ ሕቶታት ኣብ ውሽጢ 1 ናይ ስራሕ መዓልቲ መልሲ ይረኽቡ።",
    "Advertising, partnerships, sponsorships, and enterprise access.": "መወዓውዒ፣ ሽርክነት፣ ስፖንሰርነትን መእተዊ ትካልን።",
    "Subscribe to ንቐደም": "ናብ ንቐደም ተመዝገብ",
    Membership: "ኣባልነት",
    "Join a community of discerning readers who demand journalism of the highest caliber. Choose your plan and gain unlimited access to award-winning reporting.":
      "ልዑል ደረጃ ጋዜጠኝነት ዝደልዩ ኣንበብቲ ማሕበረሰብ ተጸንበር። ውጥንካ ምረጽ እሞ ናብ ተሸላሚ ሪፖርታዥ ዘይተወሰነ መእተዊ ርከብ።",
    Monthly: "ወርሓዊ",
    Yearly: "ዓመታዊ",
    "Save 20%": "20% ቆጥብ",
    Recommended: "ዝምከር",
    "Get Started": "ጀምር",
    "Frequently Asked Questions": "ብተደጋጋሚ ዝሕተቱ ሕቶታት",
    "Can I switch between plans?": "ኣብ መንጎ ውጥናት ክቕይር እኽእልዶ?",
    "How does print delivery work?": "ናይ ሕትመት መብጽሒ ከመይ ይሰርሕ?",
    "Is there a free trial?": "ነጻ ፈተነ ኣሎዶ?",
    "What payment methods do you accept?": "እንታይ ናይ ክፍሊት መንገዲታት ትቕበሉ?",
    "Local News": "ናይ ከባቢ ዜና",
    International: "ዓለምለኻዊ",
    "Community Updates": "ሓደስቲ ሓበሬታታት ማሕበረሰብ",
    "Weddings & Love Stories": "መርዓን ዛንታታት ፍቕርን",
    "Birth Announcements": "ምልክታታት ልደት",
    Graduations: "ምረቓታት",
    Memorials: "መዘከርታታት",
    "Success Stories": "ዛንታታት ዓወት",
    "Community Announcements": "ምልክታታት ማሕበረሰብ",
    "Volunteer Opportunities": "ዕድላት ወለንተኝነት",
    "Business News": "ናይ ንግዲ ዜና",
    "Featured Businesses": "ፍሉያት ንግድታት",
    "Entrepreneur Stories": "ዛንታታት ሰራሕተኛታት ንግዲ",
    Investment: "ኢንቨስትመንት",
    "Sponsored Businesses": "ዝተሓገዙ ንግድታት",
    "Job Vacancies": "ክፉታት ስራሕ",
    "Businesses Hiring": "ሰራሕተኛ ዝቖጽሩ ንግድታት",
    "Buy & Sell": "ግዛእን ሽጥን",
    Cars: "መካይን",
    "Houses & Apartments": "ኣባይትን ኣፓርታማታትን",
    Services: "ኣገልግሎታት",
    "Community Events": "ፍጻመታት ማሕበረሰብ",
    "Church Events": "ፍጻመታት ቤተክርስቲያን",
    Festivals: "ፌስቲቫላት",
    Concerts: "ኮንሰርታት",
    "Sports Events": "ፍጻመታት ስፖርት",
    Food: "ምግቢ",
    Health: "ጥዕና",
    Travel: "ጉዕዞ",
    Fashion: "ፋሽን",
    Entertainment: "መዘናግዒ",
    AI: "ኤኣይ",
    Apps: "ኣፕስ",
    Mobile: "ሞባይል",
    "Business Technology": "ቴክኖሎጂ ንግዲ",
    "Digital Tips": "ዲጂታላዊ ምኽርታት",
    "Anonymous Stories": "ስም ዘይብሎም ዛንታታት",
    Relationships: "ዝምድናታት",
    Family: "ስድራቤት",
    "Career Advice": "ምኽሪ ሞያ",
    "Immigration & Legal Tips": "ምኽሪ ስደትን ሕግን",
    Education: "ትምህርቲ",
    Romance: "ፍቕሪ",
    Mystery: "ምስጢር",
    "Historical Fiction": "ታሪኻዊ ልብወለድ",
    "Children's Stories": "ዛንታታት ቆልዑ",
    Announcements: "ምልክታታት",
    "General Interest": "ሓፈሻዊ ተገዳስነት",
    "Archive Picks": "ምርጫታት ማህደር",
    "items": "ነገራት",
    Subject: "ርእሲ",
    "General Inquiry": "ሓፈሻዊ ሕቶ",
    "Subscription Support": "ደገፍ ምዝገባ",
    "Business Partnership": "ናይ ንግዲ ሽርክነት",
    "Editorial Feedback": "ኤዲቶርያላዊ ርእይቶ",
    "Delivery Issue": "ጸገም መብጽሒ",
    "Press & Media": "ፕሬስን ሚድያን",
    "Thank You": "የቐንየልና",
    "We've received your message and will respond within 24 hours.": "መልእኽትኻ ተቐቢልና ኣብ ውሽጢ 24 ሰዓታት ክንምልስ ኢና።",
    "Open the embedded map for directions and nearby landmarks.": "ንመንገድን ቀረባ ምልክታትን ዝተተከለ ካርታ ክፈት።",
    "Contact Business Team": "ናይ ንግዲ ጉጅለ ርኸብ",
    "For Print Subscribers": "ንሕትመት ተመዝገብቲ",
    "Track Your Newspaper Delivery in Real Time": "መብጽሒ ጋዜጣኻ ብቀጥታ ተኸታተል",
    "Track Delivery": "መብጽሒ ተኸታተል",
    "Press Time": "ግዜ ሕትመት",
    Distribution: "ምክፍፋል",
    "In Transit": "ኣብ መንገዲ",
    "Articles finalized and sent to print": "ጽሑፋት ተወዲኦም ናብ ሕትመት ተላኢኾም",
    "Newspapers packaged and dispatched": "ጋዜጣታት ተሸፊኖም ተላኢኾም",
    "Your edition is on its way": "ሕታምካ ኣብ መንገዲ ኣሎ",
    "Newspaper arrives at your door": "ጋዜጣ ናብ ደገኻ ይበጽሕ",
    Share: "ኣካፍል",
    Bookmark: "ምልክት ግበር",
    Photo: "ስእሊ",
    Staff: "ሰራሕተኛታት",
    Voices: "ድምጽታት",
    "Please keep comments respectful and relevant.": "በጃኻ ርእይቶታት ኣኽብሮታዊን ተዛማድን ይኹኑ።",
    "Share your thoughts on this story...": "ሓሳብካ ብዛዕባ እዚ ዛንታ ኣካፍል...",
    World: "ዓለም",
    Opinion: "ርእይቶ",
    Feature: "ፍሉይ",
    Editorial: "ኤዲቶርያል",
    Analysis: "ትንታነ",
    "July 4, 2026": "4 ሓምለ 2026",
    "July 3, 2026": "3 ሓምለ 2026",
    "July 2, 2026": "2 ሓምለ 2026",
    "July 1, 2026": "1 ሓምለ 2026",
    "8 min read": "8 ደቒቕ ንባብ",
    "4 min read": "4 ደቒቕ ንባብ",
    "5 min read": "5 ደቒቕ ንባብ",
    "6 min read": "6 ደቒቕ ንባብ",
    "12 min read": "12 ደቒቕ ንባብ",
    "Global leaders reach a climate accord": "መራሕቲ ዓለም ኣብ ስምምዕ ክሊማ በጺሖም",
    "A compact view of today's lead story.": "ሓጺር ምርኣይ ናይ ቀንዲ ዛንታ ሎሚ።",
    "Business and policy in focus": "ንግድን ፖሊሲን ኣብ ትኹረት",
    "Quick access to the latest business coverage.": "ቅልጡፍ መእተዊ ናብ ሓድሽ ናይ ንግዲ ሽፋን።",
    "Latest Update": "ሓድሽ ሓበሬታ",
    "Breaking updates throughout the day": "ሓደስቲ ሓበሬታታት ሙሉእ መዓልቲ",
    "Fresh headlines without covering the image.": "ሓደስቲ ርእሰ-ዜናታት ምስሊ ከይሸፈኑ።",
    "Global Leaders Convene for Historic Climate Accord as Nations Pledge Carbon Neutrality by 2040":
      "መራሕቲ ዓለም ንታሪኻዊ ስምምዕ ክሊማ ተኣኪቦም፣ ሃገራት ክሳብ 2040 ካርቦን ኒውትራሊቲ ቃል ኣትየን",
    "In a landmark summit that drew representatives from over 140 nations, world leaders signed an unprecedented agreement committing to aggressive carbon reduction targets. The accord, negotiated over four intense days in Geneva, represents the most ambitious climate framework since the Paris Agreement.":
      "ኣብ ካብ 140 በላዕሊ ሃገራት ወከልቲ ዝሰሓበ ታሪኻዊ ጉባኤ፣ መራሕቲ ዓለም ናብ ብርቱዕ ምንካይ ካርቦን ዝተቐረበ ዘይተራእየ ስምምዕ ፈሪሞም። እቲ ኣብ ጄነቫ ኣርባዕተ ብርቱዓት መዓልታት ዝተዘራረበ ስምምዕ፣ ካብ ስምምዕ ፓሪስ ዝዓበየ ውጥን ክሊማ ይውክል።",
    "Senate Approves Sweeping Infrastructure Bill After Months of Bipartisan Negotiations":
      "ሰነት ድሕሪ ኣዋርሕ ናይ ክልተ ፓርቲ ዘተ ሰፊሕ ሕጊ መሰረተ-ልምዓት ኣጽዲቑ",
    "The $2.3 trillion package includes funding for roads, bridges, broadband, and clean energy initiatives.":
      "እቲ 2.3 ትሪልዮን ዶላር ዝኽፈል ጥቕሊ፣ ንመንገድታት፣ ድልድላት፣ ብሮድባንድን ንጹህ ሓይልን ፋይናንስ የጠቓልል።",
    "Major Tech Firms Report Record Quarterly Earnings Amid AI Investment Surge":
      "ዓበይቲ ናይ ቴክ ትካላት ኣብ ማእከል ዕቤት ኢንቨስትመንት AI ሪከርድ ርብዒ ኣታዊ ገሊጸን",
    "Silicon Valley's largest companies exceeded analyst expectations.":
      "ዓበይቲ ኩባንያታት ሲሊኮን ቫሊ ትጽቢት ተንተንቲ ሓሊፈን።",
    "Central Banks Signal Coordinated Interest Rate Strategy for Second Half":
      "ማእከላይ ባንክታት ንካልኣይ ፍርቂ ዓመት ዝተዋሃደ ስትራተጂ ረብሓ ይሕብሩ",
    "Historic Peace Agreement Reached in East African Territorial Dispute":
      "ኣብ ምብራቕ ኣፍሪቃ ዶባዊ ግጭት ታሪኻዊ ስምምዕ ሰላም ተበጺሑ",
    "The Future of Global Trade Demands a New Kind of Diplomacy":
      "መጻኢ ዓለምለኻዊ ንግዲ ሓዲሽ ዓይነት ዲፕሎማሲ ይደሊ",
    "Our veteran correspondent examines how shifting alliances are reshaping the economic landscape.":
      "ተመኩሮ ዘለዎ ተላኣኺና ተቐያየርቲ ሽርክነታት ከመይ ንቁጠባዊ ምድሪ ይቕይሩ ይመርምር።",
    "Electoral Reform Commission Publishes Final Recommendations After Year-Long Study":
      "ኮሚሽን ምምሕያሽ ምርጫ ድሕሪ ዓመት ዝወሰደ መጽናዕቲ መወዳእታ ምኽርታት ኣውጺኡ",
    "The independent body calls for modernized voting systems, expanded early voting, and enhanced transparency measures across federal elections.":
      "እቲ ናጻ ኣካል ዘመናዊ ስርዓተ ምርጫ፣ ዝተስፋሕፍሐ ቀዳማይ ምርጫን ኣብ ፌደራላዊ ምርጫታት ዝተሓየለ ግልጽነትን ይጽውዕ።",
    "Olympic Committee Unveils Host City Selection for 2036 Summer Games":
      "ኮሚቴ ኦሎምፒክ ን2036 ናይ ክረምቲ ጸወታታት ከተማ መአንገዲት ምርጫ ገሊጹ",
    "After a competitive bidding process, the committee announced that five finalist cities will present their final proposals next month.":
      "ድሕሪ ተወዳዳሪ መስርሕ ጨረታ፣ እቲ ኮሚቴ ሓሙሽተ መወዳእታ ከተማታት ኣብ ዝመጽእ ወርሒ መወዳእታ ሓሳባተን ከቕርባ ከምዝኾና ኣፍሊጡ።",
    "Global Supply Chain Transformation Accelerates Under New Trade Agreements":
      "ዓለምለኻዊ ሰንሰለት ቀረብ ብሓደስቲ ናይ ንግዲ ስምምዓት ይቀላጠፍ",
    "Manufacturing hubs shift as companies restructure operations to meet sustainability requirements and reduce geopolitical risk.":
      "ኩባንያታት ንድሌታት ቀጻልነት ንምምላእን ጂኦፖለቲካዊ ሓደጋ ንምንካይን ስራሕታተን እንተዳግመን ምስረዓ፣ ማእከላት ፋብሪካ ይቕየሩ።",
    "Quantum Computing Breakthrough Promises Revolution in Drug Discovery Timeline":
      "ሓዲሽ ዕድል ኮምፒዩቲንግ ኳንተም ኣብ ግዜ ምርካብ መድሃኒት ለውጢ ከምጽእ ይተስፋ",
    "Researchers demonstrate a quantum advantage in molecular simulation, potentially reducing pharmaceutical development cycles by years.":
      "ተመራመርቲ ኣብ ሞለኪዩላዊ ስሚዩለሽን ፍሉይ ብልጫ ኳንተም ኣርእዮም፣ ዑደት ምምዕባል መድሃኒት ብዓመታት ክንኪ ይኽእል።",
    "City Council Approves New Waterline and Road Repair Program":
      "ቤት ምኽሪ ከተማ ሓዲሽ መስመር ማይን መደብ ጽገና መንገድን ኣጽዲቑ",
    "The $18 million package targets aging mains, flood-prone intersections, and long-delayed neighborhood resurfacing work.":
      "እቲ 18 ሚልዮን ዶላር ጥቕሊ ንዝኣረጉ መስመራት፣ ብውሕጅ ዝጥቅዑ መራኸቢታትን ንዝተደናጎየ ጽገና መንገዲ ከባቢታትን ይቐንዕ።",
    "Local Couple Celebrates 50 Years of Marriage Surrounded by Family":
      "ናይ ከባቢ ጽምዲ 50 ዓመት መርዓ ብስድራቤት ተኸቢቦም የብዕሉ",
    "What began at a neighborhood church picnic in the late 1970s has grown into a family story spanning four generations.":
      "ኣብ መወዳእታ 1970ታት ኣብ ናይ ከባቢ ቤተክርስቲያን ፒክኒክ ዝጀመረ፣ ንኣርባዕተ ወለዶ ዝሓቘፈ ዛንታ ስድራቤት ኮይኑ።",
    "Sustainable Finance Reaches Record Volumes as ESG Standards Mature":
      "ቀጻሊ ፋይናንስ መዐቀኒታት ESG እናበሰሉ ሪከርድ ብዝሒ በጺሑ",
    "Green bonds and sustainability-linked loans surpass $5 trillion globally.":
      "ሓምላይ ቦንድታትን ናይ ቀጻልነት ልቓሕታትን ኣብ ዓለም 5 ትሪልዮን ዶላር ሓሊፎም።",
    "The Vanishing Art of the Morning Paper: How a New Generation Is Rediscovering Print Journalism":
      "ዝጠፍእ ዘሎ ጥበብ ናይ ንግሆ ጋዜጣ፦ ሓዲሽ ወለዶ ንሕትመት ጋዜጠኝነት ከመይ ይመልሶ ኣሎ",
    "Why the Future of Democracy Depends on Independent Press":
      "ስለምንታይ መጻኢ ዲሞክራሲ ኣብ ናጻ ፕሬስ ይምርኮስ",
    "Our editor-in-chief reflects on the role of journalism in protecting democratic institutions.":
      "ዋና ኤዲተርና ኣብ ምክልኻል ዲሞክራሲያዊ ትካላት ተራ ጋዜጠኝነት ይሓስብ።",
    "Artificial Intelligence in the Newsroom: Promise, Peril, and the Path Forward":
      "ሰብ ሰርሖ ምስትውዓል ኣብ ክፍሊ ዜና፦ ተስፋ፣ ሓደጋን መንገዲ ቅድሚትን",
    "How emerging technology is transforming — but not replacing — the craft of journalism.":
      "ዝወጽእ ዘሎ ቴክኖሎጂ ንሞያ ጋዜጠኝነት ከመይ ይቕይሮ — ግን ኣይትክኦን — እዩ።",
    Digital: "ዲጂታል",
    "Unlimited digital access": "ዘይተወሰነ ዲጂታላዊ መእተዊ",
    "Unlimited article access": "ዘይተወሰነ መእተዊ ጽሑፋት",
    "Daily digital edition": "መዓልታዊ ዲጂታላዊ ሕታም",
    "Breaking news alerts": "ምልክታታት ሓደስቲ ዜና",
    "Archive access (10 years)": "መእተዊ ማህደር (10 ዓመት)",
    "Mobile & tablet apps": "ሞባይልን ታብሌትን ኣፕስ",
    "Newsletter selection": "ምርጫ ዜና መጽሔት",
    "The complete ንቐደም experience": "ሙሉእ ተመኩሮ ንቐደም",
    "Everything in Digital": "ኩሉ ኣብ ዲጂታል",
    "Physical newspaper every two weeks": "ኣብ ክልተ ሰሙን ሓንሳብ ኣካላዊ ጋዜጣ",
    "Premium long-form content": "ልዑል ነዊሕ ትሕዝቶ",
    "Member-only articles": "ንኣባላት ጥራይ ጽሑፋት",
    "Exclusive subscriber events": "ፍሉያት ፍጻመታት ተመዝገብቲ",
    "Real-time delivery tracking": "ብቀጥታ ክትትል መብጽሒ",
    "Full archive access": "ሙሉእ መእተዊ ማህደር",
    "For teams and organizations": "ንጉጅለታትን ትካላትን",
    "Up to 25 team members": "ክሳብ 25 ኣባላት ጉጅለ",
    "Company dashboard": "ዳሽቦርድ ትካል",
    "Consolidated billing": "ዝተዋሃደ ክፍሊት",
    "Volume pricing": "ናይ ብዝሒ ዋጋ",
    "Dedicated account manager": "ፍሉይ ኣካውንት ማናጀር",
    "API access": "መእተዊ API",
    By: "ብ",
    "/month": "/ወርሒ",
    "Most Popular": "ዝበዝሑ ዝመረጽዎ",
    "Join thousands of discerning readers who trust ንቐደም for their daily news. Choose the plan that suits your reading habits.":
      "ንመዓልታዊ ዜናኦም ንንቐደም ዝኣምኑ ሽሕታት ብልሒ ዘለዎም ኣንበብቲ ተጸንበር። ንኣነባብራ ንባብካ ዝሰማማዕ ውጥን ምረጽ።",
    "This section is for organizations that need advertising, bulk subscriptions, sponsorships, or partnership support. It sits alongside the main contact area so business inquiries have a clear dedicated path.":
      "እዚ ክፍሊ ንመወዓውዒ፣ ብዝሒ ምዝገባ፣ ስፖንሰርነት ወይ ደገፍ ሽርክነት ዝደልያ ትካላት እዩ። ናይ ንግዲ ሕቶታት ግልጺ ፍሉይ መንገዲ ክረኽባ ምስ ቀንዲ ክፍሊ ርክብ ጎኒ ጎኒ ይቕመጥ።",
    "Best for partnerships, sponsorships, and media kits.":
      "ንሽርክነት፣ ስፖንሰርነትን ናይ ሚድያ ኪታትን ዝበለጸ።",
    "For urgent commercial requests and enterprise support.":
      "ንቅልጡፍ ናይ ንግዲ ሕቶታትን ናይ ትካል ደገፍን።",
    "Tell us about your organization and goals.":
      "ብዛዕባ ትካልኩምን ዕላማታትኩምን ንገሩና።",
    "We’ll route your request to the right commercial contact.":
      "ሕቶኹም ናብ ትኽክለኛ ናይ ንግዲ መራኸቢ ክንመርሖ ኢና።",
    "Weâ€™ll route your request to the right commercial contact.":
      "ሕቶኹም ናብ ትኽክለኛ ናይ ንግዲ መራኸቢ ክንመርሖ ኢና።",
    "In an era dominated by digital feeds and algorithmic news delivery, a surprising counter-movement is emerging among younger readers. From artisanal newsprint cafés in Brooklyn to subscription clubs in London's Shoreditch, millennials and Gen Z readers are embracing the tactile experience of holding a newspaper. This long-form investigation explores what draws them to ink and paper — and what it means for the future of journalism.":
      "ኣብ ዲጂታላዊ ፊድን ኣልጎሪዝማዊ ምብጻሕ ዜናን ዝተዓብለለ ዘመን፣ ኣብ መንእሰያት ኣንበብቲ ዘገርም ተቓዋሚ ንቕናቐ ይቕልቀል ኣሎ። ካብ ናይ ጥበበኛታት ጋዜጣ ካፌታት ብሩክሊን ክሳብ ናይ ምዝገባ ክለባት ሾርዲች ለንደን፣ ሚሌንያልስን Gen Zን ጋዜጣ ብኢድ ምሓዝ ዘለዎ ተሞክሮ ይቕበሉ ኣለዉ። እዚ ነዊሕ መርመራ እንታይ ናብ ቀለምን ወረቐትን ከምዝስሕቦም፣ እዚ ድማ ንመጻኢ ጋዜጠኝነት እንታይ ማለት ከምዝኾነ ይምርምር።",
    "Last updated: July 1, 2026": "መወዳእታ ዝተመሓየሸ፦ 1 ሓምለ 2026",
    "Information We Collect": "እንእክቦ ሓበሬታ",
    "How We Use Your Information": "ሓበሬታኻ ከመይ ንጥቀመሉ",
    "ንቐደም Publishing (\"we,\" \"us,\" or \"our\") is committed to protecting the privacy and security of our subscribers and readers. This Privacy Policy explains how we collect, use, and safeguard your personal information.":
      "ንቐደም ፓብሊሺንግ ምስጢርን ድሕነትን ተመዝገብትናን ኣንበብትናን ንምክልኻል ተገዲሱ ይሰርሕ። እዚ ፖሊሲ ምስጢር ከመይ ሓበሬታ እንእክብ፣ እንጥቀመሉን እንዕቅቦን ይገልጽ።",
    "We collect information you provide directly, including your name, email address, delivery address, and payment information when you subscribe to our services. We also collect usage data to improve our editorial offerings and personalize your reading experience.":
      "ኣብ ኣገልግሎታትና ክትምዝገብ ከለኻ ብቐጥታ እትህበና ሓበሬታ፣ ስም፣ ኢመይል፣ ኣድራሻ መብጽሒን ሓበሬታ ክፍሊትን ንእክብ። ኤዲቶርያላዊ ትሕዝቶና ንምምሕያሽን ተመኩሮ ንባብካ ንምስትኽኻልን ሓበሬታ ኣጠቓቕማ እውን ንእክብ።",
    "Your information is used to deliver our newspaper and digital content, process payments, manage your subscription, and communicate important updates about our services. We never sell your personal data to third parties.":
      "ሓበሬታኻ ጋዜጣናን ዲጂታላዊ ትሕዝቶናን ንምብጻሕ፣ ክፍሊት ንምስራሕ፣ ምዝገባኻ ንምምሕዳርን ኣገደስቲ ሓደስቲ ሓበሬታታት ንምሕባርን ይጥቀመሉ። ውልቃዊ ሓበሬታኻ ናብ ሳልሳይ ወገን ፈጺምና ኣይንሸጦን።",
    "For privacy-related inquiries, please contact our Data Protection Officer at privacy@ንቐደም.com.":
      "ንምስጢር ዝተዛመዱ ሕቶታት፣ በጃኻ ናብ privacy@ንቐደም.com ንሓላፊ ድሕነት ሓበሬታና ርኸብ።",
    "Subscription Terms": "ውዕላት ምዝገባ",
    "Content Usage": "ኣጠቓቕማ ትሕዝቶ",
    "By accessing and using the ንቐደም website and services, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.":
      "ናብ መርበብን ኣገልግሎታትን ንቐደም ብምእታውን ብምጥቃምን፣ ብእዞም ውዕላት ኣገልግሎት ክትእሰር ትሰማማዕ። ቅድሚ መድረኽና ምጥቃምካ ብጥንቃቐ ኣንብቦም።",
    "Subscriptions are billed according to the plan selected. Monthly subscriptions renew automatically unless cancelled at least 48 hours before the renewal date. Annual subscriptions may be cancelled for a prorated refund within the first 30 days.":
      "ምዝገባታት ብመሰረት ዝተመርጸ ውጥን ይኽፈሉ። ወርሓዊ ምዝገባ ቅድሚ መዓልቲ ምሕዳስ ብውሑዱ 48 ሰዓታት እንተዘይተሰሪዙ ብኣውቶማቲክ ይሕደስ። ዓመታዊ ምዝገባ ኣብ መጀመርታ 30 መዓልታት ብተመጣጣኒ መመለሲ ክስረዝ ይኽእል።",
    "All content published by ንቐደም is protected by copyright. Subscribers may read and share articles for personal use. Reproduction, redistribution, or commercial use of our content without written permission is strictly prohibited.":
      "ብንቐደም ዝተሓትመ ኩሉ ትሕዝቶ ብመሰል ቅዳሕ ይሕለው። ተመዝገብቲ ጽሑፋት ንውልቃዊ ኣጠቓቕማ ከንብቡን ከካፍሉን ይኽእሉ። ብዘይ ጽሑፋዊ ፍቓድ ምድጋም፣ ዳግማይ ምክፍፋል ወይ ንንግዲ ምጥቃም ብጥብቂ ዝተኸልከለ እዩ።",
    "Print subscribers will receive their newspaper edition according to the delivery schedule of their subscription plan. Delivery times may vary by region. We will make reasonable efforts to ensure timely delivery and provide tracking information.":
      "ተመዝገብቲ ሕትመት ጋዜጣኦም ብመሰረት መደብ መብጽሒ ውጥን ምዝገባኦም ይረኽቡ። ግዜ መብጽሒ ብከባቢ ክፈላለ ይኽእል። ብግዜኡ መብጽሒ ንምርግጋጽን ሓበሬታ ክትትል ንምሃብን ምኽንያታዊ ጻዕሪ ክንገብር ኢና።",
    "July 4, 2026 Edition": "ሕታም 4 ሓምለ 2026",
    "June 20, 2026 Edition": "ሕታም 20 ሰነ 2026",
    "June 6, 2026 Edition": "ሕታም 6 ሰነ 2026",
    "July 18, 2026 Edition": "ሕታም 18 ሓምለ 2026",
    "Tracking ID: NQ-20260704": "መለለዪ ክትትል፦ NQ-20260704",
    Packaged: "ተዓሺጉ",
    "Out for Delivery": "ንመብጽሒ ወጺኡ",
    "Content finalized and sent to print": "ትሕዝቶ ተወዲኡ ናብ ሕትመት ተላኢኹ",
    "Edition printed and packaged for delivery": "ሕታም ተሓቲሙ ንመብጽሒ ተዓሺጉ",
    "Your newspaper is on its way": "ጋዜጣኻ ኣብ መንገዲ ኣሎ",
    "Driver is in your area": "ሓደ መራሒ ኣብ ከባቢኻ ኣሎ",
    "Left at front door": "ኣብ ቅድሚ ደገ ተገዲፉ",
    "Estimated delivery: 8:00–9:00 AM": "ተገሚቱ መብጽሒ፦ 8:00–9:00 ቅ.ቀ",
    "Delivery illustration": "ስእሊ መብጽሒ",
  },
};

const reverseTranslations = Object.fromEntries(
  Object.entries(contentTranslations.ti).map(([english, tigrigna]) => [
    tigrigna,
    english,
  ]),
);

const LanguageContext = React.createContext(null);

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function replaceTextNodeValue(node, translated) {
  const original = node.nodeValue || "";
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";

  node.nodeValue = `${leading}${translated}${trailing}`;
}

function translateDomAttributes(language) {
  const source = language === "ti" ? contentTranslations.ti : reverseTranslations;
  const attributes = ["placeholder", "title", "aria-label", "alt"];

  document.querySelectorAll("*").forEach((element) => {
    attributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      const translated = value ? source[normalizeText(value)] : null;

      if (translated) {
        element.setAttribute(attribute, translated);
      }
    });
  });
}

function translateDomText(language) {
  if (typeof document === "undefined") {
    return;
  }

  const source = language === "ti" ? contentTranslations.ti : reverseTranslations;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const parentName = node.parentElement?.tagName;

    if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "OPTION"].includes(parentName)) {
      return;
    }

    const normalized = normalizeText(node.nodeValue || "");
    const translated = source[normalized];

    if (translated) {
      replaceTextNodeValue(node, translated);
    }
  });

  translateDomAttributes(language);
}

function formatLocalizedDate(language, value, options = {}) {
  const config = languageConfig[language] || languageConfig.en;
  const nextValue = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(nextValue.getTime())) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(config.locale, options).format(nextValue);
  } catch {
    return new Intl.DateTimeFormat(languageConfig.en.locale, options).format(nextValue);
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = React.useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    return window.localStorage.getItem(STORAGE_KEY) || "en";
  });

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);

    if (typeof document !== "undefined") {
      const config = languageConfig[language] || languageConfig.en;
      document.documentElement.lang = config.lang;
      document.documentElement.dir = "ltr";
      document.documentElement.dataset.language = language;
    }

    window.setTimeout(() => translateDomText(language), 0);
  }, [language]);

  React.useEffect(() => {
    if (typeof MutationObserver === "undefined") {
      return undefined;
    }

    const observer = new MutationObserver(() => {
      translateDomText(language);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [language]);

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      isTigrigna: language === "ti",
      strings: translations[language],
      locale: (languageConfig[language] || languageConfig.en).locale,
      t: (text) => contentTranslations[language]?.[text] || text,
      formatDate: (value, options) => formatLocalizedDate(language, value, options),
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "ti" : "en")),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
