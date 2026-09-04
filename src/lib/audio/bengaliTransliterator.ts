// Bengali phonetic transliterator for speech synthesis when no native Bengali TTS is installed on the OS
// Translates Bengali Unicode to phonetically readable English/Indian phonemes for Microsoft Ravi, Heera, Google Hindi or English TTS

const PHRASE_MAP: Record<string, string> = {
  // Common & Test
  'নমস্কার': 'Nomoshkar',
  'নমস্কার! খেলা শুরু!': 'Nomoshkar! Khela shuru!',
  'নমস্কার গ্র্যান্ডমাস্টার! ফানিচেস ভয়েস তৈরি, চলুন খেলা শুরু করা যাক!': 'Nomoshkar Grandmaster! FunnyChess voice toiri, cholun khela shuru kora jak!',

  // Comedian
  'শুভকামনা! দেখা যাক কার ভুল চাল বেশি মজাদার হয়!': 'Shubhokamona! Dekha jak kar bhul chal beshi mojadar hoy!',
  'খেলতে তৈরি তো? হারলে দোষটা মাউসের ঘাড়ে চাপিয়ে দেবেন!': 'Khelte toiri to? Haarle doshta mouser ghare chapiye deben!',
  'কিস্তি! রাজা মশাই বিপদে, এবার একটু ভাবুন!': 'Kisti! Raja moshai bipode, ebar ektu bhabun!',
  'কিস্তি! ভয় পাবেন না... অবশ্য একটু আধটু ভয় পেতেই পারেন!': 'Kisti! Bhoy paben na... Oboshyo ektu aadhtu bhoy petei paren!',
  'ওরেব্বাস! আমার রাজাকে কিস্তি? বেশ সাহস তো!': 'Oreybbash! Amar rajake kisti? Besh shahosh to!',
  'দারুণ চেক! সত্যি বলছি, আমি কিন্তু একটু চমকে গেছি!': 'Darun check! Sotti bolchhi, ami kintu ektu chomke gechhi!',
  'কিস্তিমাত! খেলা শেষ! মন খারাপ করবেন না, আপনি দারুণ খেলছিলেন!': 'Kistimat! Khela shesh! Mon kharap korben na, aapni darun khelchhilen!',
  'চেকমেট! একটা রি-ম্যাচ হয়ে যাক? এবার একটু আস্তে খেলব!': 'Checkmate! Ekta rematch hoye jak? Ebar ektu aaste khelbo!',
  'ওরেব্বাস! আপনি আমাকে কিস্তিমাত করে দিলেন! আপনি তো খাঁটি গ্র্যান্ডমাস্টার!': 'Oreybbash! Aapni aamake kistimat kore dilen! Aapni to khaati grandmaster!',
  'হার স্বীকার করলাম! সত্যি অনবদ্য খেলেছেন!': 'Haar shikar korlam! Sotti onobodyo khelchhen!',
  'রানি বিদায় নিল! এটা কিন্তু দারুণ বড়সড় ধাক্কা!': 'Rani biday nilo! Eta kintu darun bhorshor dhakka!',
  'রানি মাঠের বাইরে চলে গেল! এবার খেলা জমবে!': 'Rani maather baire chole gelo! Ebar khela jombe!',
  'দুঃখিত, এই ঘুঁটিটা না নিয়ে পারলাম না!': 'Dukkhito, ei ghutita na niye parlam na!',
  'আরেকটা ঘুঁটি বিদায়! আমার সৈন্যরা বেশ আনন্দ পেল!': 'Arekta ghuti biday! Amar shoingyora besh anondo pelo!',
  'একটা ছোট্ট বোড়ে, দারুণ হালকা জলখাবার!': 'Ekta chhotto bore, darun halka jolkhabar!',
  'ওটা কি কোনো ফাঁদ ছিল, নাকি ভুল করে ফেলে দিলেন?': 'Ota ki kono faad chhilo, naki bhul kore fele dilen?',
  'উপহারের জন্য অনেক ধন্যবাদ! এমন সুযোগ ছাড়া যায় নাকি!': 'Upoharer jonno onek dhonnobad! Emon shujog chara jay naki!',
  'ভাবুন যেন আমি চার চাল আগেই এই বলিদানের প্ল্যান করেছিলাম...': 'Bhabun jeno ami chaar chaal agei ei bolidaaner plan korechhilam...',
  'রাজা মশাই কেল্লায় ঢুকে সুরক্ষিত হয়ে গেলেন! দারুণ চাল!': 'Raja moshai kellay dhuke shurokkhito hoye gelen! Darun chaal!',
  'সাধারণ বোড়ে রানি হয়ে গেল! একেই বলে আসল উন্নতি!': 'Sadharon bore rani hoye gelo! Ekei bole ashol unnoti!',
  'বেশ কৌতূহলী চাল... দেখা যাক কী হয়!': 'Besh koutuholi chaal... dekha jak ki hoy!',
  'হুমম, তলে তলে কোনো গভীর প্ল্যান চলছে নাকি?': 'Hmm, tole tole kono gobhir plan cholchhe naki?',

  // Villain
  'আমার বিরুদ্ধে খেলার সাহস? ৬৪ খোপের যুদ্ধে পরাজয় বরণ করতে তৈরি থাকুন!': 'Amar biruddhe khelar shahosh? Choushotthi khoper juddhe porajoy boron korte toiri thakun!',
  'হা হা হা! কিস্তি! আপনার রাজার পালানোর কোনো পথ নেই!': 'Hahaha! Kisti! Aapnar rajar palanor kono poth nei!',
  'এত বড় স্পর্ধা? আমার সিংহাসনকে আক্রমণ?': 'Eto boro spordha? Amar shinghashonke aakromon?',
  'কিস্তিমাত! সম্পূর্ণ পরাজয়! আজ শুধু আমারই জয়জয়কার!': 'Kistimat! Shompurno porajoy! Aaj shudhu aamari joyjoykar!',
  'অসম্ভব!! আমার সব হিসেব ওলটপালট করে দিলেন?!': 'Oshombhob!! Amar shob hisheb olotpalot kore dilen?!',
  'আপনার রানি খতম! এবার পুরো রাজ্য ধ্বংসের মুখে!': 'Aapnar rani khotom! Ebar puro rajyo dhongsho mukhe!',
  'আরেকটা ঘুঁটি আমার কবজায়! আপনার সেনা এখন দুর্বল!': 'Arekta ghuti amar kobzay! Aapnar shena ekhon durbol!',
  'একটা সাধারণ বোড়ে পিষে দেওয়া হলো!': 'Ekta sadharon bore pishe deowa holo!',
  'ভেবেছিলেন এই মারাত্মক ভুলটা আমি দেখতে পাব না?': 'Bhebechhhilen ei marattok bhulta ami dekhte pabo na?',
  'এটা কেবল সাময়িক বিভ্রান্তি! ভেবে বসবেন না জিতে গেছেন!': 'Eta kebol shamoyik bibhranti! Bhebe boshben na jite gechhen!',
  'দেওয়ালের আড়ালে লুকিয়েও রক্ষা পাবেন না!': 'Deyaler aarale lukiyeo rokkha paben na!',
  'রণক্ষেত্রে এক নতুন রানির উদয় হলো!': 'Rono-kkhetre ek notun ranir udoy holo!',
  'সাবধানে পা বাড়ান... প্রতিটি খোপেই ফাঁদ পাতা!': 'Shabdhaane paa baaran... protiti khopei faad pata!',

  // Professor
  'নমস্কার! ষষ্ঠ শতাব্দীর ভারতবর্ষ থেকে দাবার উৎপত্তি। চলুন শুরু করা যাক!': 'Nomoshkar! Shoshto shotabdir bharotborsho theke dabar utpotti. Cholun shuru kora jak!',
  'কিস্তি! মনে রাখবেন: ঘুঁটি কাটা, পথ আটকানো বা পালিয়ে যাওয়া!': 'Kisti! Mone rakhben: ghuti kata, poth aatkano ba paliye jaowa!',
  'দারুণ! আপনার হিসাবনিকাশ সত্যিই প্রশংসনীয়।': 'Darun! Aapnar hishab-nikash sotti proshongshonio.',
  'কিস্তিমাত! একটি আদর্শ পাঠশালাতুল্য জয়। দারুণ অভিজ্ঞতা!': 'Kistimat! Ekti aadorsho pathshala-tullo joy. Darun obhiggota!',
  'অনবদ্য কিস্তিমাত! আপনি সত্যিই অসাধারণ কৌশল খাটিয়েছেন!': 'Onobodyo kistimat! Aapni sotti oshadharon koushol khatiyechhen!',
  '৯ পয়েন্টের রানি চলে গেল। খেলার ভারসাম্য পুরো ঘুরে গেল!': 'Noy point-er rani chole gelo. Khelar bharshammo puro ghure gelo!',
  'ঘুঁটি বদল হলো। পরিস্থিতি এখনও বেশ রোমাঞ্চকর...': 'Ghuti bodol holo. Poristhiti ekhon-o besh romanchokor...',
  'বোড়ে কাটা পড়লে নতুন আক্রমণাত্মক রাস্তা খুলে যায়।': 'Bore kata porle notun akromonattok rasta khule jay.',
  'খেয়াল রাখবেন, ঘুঁটিটি কোনো পাহারা ছাড়াই পড়ে ছিল।': 'Kheyal rakhben, ghutiti kono pahara charai pore chhilo.',
  'আমার হিসেবে সামান্য গরমিল হয়েছিল। দারুণ ধরেছেন!': 'Amar hishebe shamanno gormil hoyechhilo. Darun dhorechhen!',
  'ক্যাসলিং: রাজার সুরক্ষা এবং কিস্তির শক্তি বৃদ্ধির সেরা উপায়।': 'Castling: Rajar shurokkha ebong kistir shokti briddhir shera upay.',
  'বোড়ের রূপান্তর: ১ পয়েন্ট থেকে সরাসরি ৯ পয়েন্টের মহাশক্তি!': 'Borer rupantor: ek point theke shorasori noy pointer mohashokti!',
  'কৌশলী চাল। বোর্ডের কেন্দ্রে নিয়ন্ত্রণ বজায় রয়েছে।': 'Kousholi chaal. Board-er kendre niyontron bojay royechhe.',

  // Cute Cat
  'মিয়াঁও! খেলা শুরু! ঘুঁটিগুলো কি মাছ দিয়ে তৈরি?': 'Meow! Khela shuru! Ghutigulo ki machh diye toiri?',
  'মিয়াঁও! কিস্তি! বিড়ালের থাবা থেকে বাঁচুন এবার!': 'Meow! Kisti! Biraler thaba theke bachun ebar!',
  'ওমা! কিস্তি? আমার তো লোম খাড়া হয়ে গেল!': 'Oma! Kisti? Amar to lom khara hoye gelo!',
  'কিস্তিমাত! বিড়াল জিতেছে! এবার এক বাটি দুধ পুরস্কার চাই!': 'Kistimat! Biral jitechhe! Ebar ek bati dudh puroshkar chai!',
  'ম্যাঁও... আপনি জিতে গেলেন! বিড়াল মশাই এবার ঘুমোতে চলল!': 'Meow... Aapni jite gelen! Biral moshai ebar ghumote cholllo!',
  'ইয়ামী! রানি ঘুঁটিটা ঠিক ইলিশ মাছের মতো স্বাদের ছিল!': 'Yummy! Rani ghutita thik Ilish machher moto shader chhilo!',
  'থাবা মেরে ঘুঁটি ফেলে দিলাম! এটা এখন আমার খেলার জিনিস!': 'Thaba mere ghuti fele dilam! Eta ekhon amar khelar jinish!',
  'ছোট্ট ইঁদুর-বোড়ে ধরা পড়ল!': 'Chhotto idur-bore dhora porlo!',
  'ঘুঁটিটা একা ফেলে রেখেছিলেন? বিড়াল ওটাকে সোফার নিচে চালান করে দিল!': 'Ghutita eka fele rekhechhilen? Biral otake sofar niche chalan kore dilo!',
  'মিয়াঁও... আমি একটা লাল লেজার লাইট দেখতে পেয়ে অন্যমনস্ক হয়ে গেছিলাম!': 'Meow... Ami ekta laal laser light dekhte peye onnomonoshko hoye gechhilam!',
  'রাজা মশাই একটা আরামদায়ক বাক্সে ঢুকে গুটিসুটি মেরে শুয়ে পড়ল!': 'Raja moshai ekta aaramdayok bakshe dhuke gutishuti mere shuye porlo!',
  'ছোট্ট বিড়ালছানা এক লাফে রানি বাঘিনী হয়ে গেল!': 'Chhotto biralchhana ek laafe rani baghini hoye gelo!',
  'ধীরে ধীরে পা ফেলে এগোনো হচ্ছে... বিড়াল কিন্তু সব নজর রাখছে!': 'Dhire dhire paa fele egono hochhe... Biral kintu shob nojor rakhchhe!',
};

// Algorithmic Bengali Unicode to Roman phonetic character map
const CHAR_MAP: Record<string, string> = {
  'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'ee', 'উ': 'u', 'ঊ': 'oo', 'ঋ': 'ri',
  'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
  'া': 'a', 'ি': 'i', 'ী': 'ee', 'ু': 'u', 'ূ': 'oo', 'ৃ': 'ri',
  'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
  'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
  'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
  'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
  'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n',
  '্': '', // virama
};

export function transliterateBengali(text: string): string {
  const clean = text.trim();
  
  // 1. Check exact phrase dictionary first
  if (PHRASE_MAP[clean]) {
    return PHRASE_MAP[clean];
  }

  // Check if any substring key matches
  for (const [key, val] of Object.entries(PHRASE_MAP)) {
    if (clean.includes(key)) {
      return clean.replaceAll(key, val);
    }
  }

  // 2. Fallback to character-by-character mapping
  let result = '';
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    result += CHAR_MAP[char] !== undefined ? CHAR_MAP[char] : char;
  }

  return result || clean;
}
