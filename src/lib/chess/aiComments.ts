export type AIPersonality = 'comedian' | 'villain' | 'professor' | 'cat';

export type GameEvent =
  | 'check_by_ai'
  | 'check_by_player'
  | 'checkmate_ai_wins'
  | 'checkmate_player_wins'
  | 'capture_queen'
  | 'capture_piece'
  | 'capture_pawn'
  | 'player_blunder'
  | 'ai_blunder'
  | 'castling'
  | 'promotion'
  | 'quiet_move'
  | 'game_start';

interface CommentDictionary {
  en: string[];
  hi: string[];
  bn: string[];
}

type PersonalityComments = Record<GameEvent, CommentDictionary>;

const COMMENT_POOLS: Record<AIPersonality, PersonalityComments> = {
  // 1. 😂 THE COMEDIAN
  comedian: {
    game_start: {
      en: [
        'Good luck! May the best blunderer win! 😂',
        'Ready to lose some pieces? Because I definitely am! ♟️',
        'Remember: if you lose, you can always blame your mouse. 🖱️',
      ],
      hi: [
        'शुभकामनाएं! देखते हैं आज कौन ज्यादा बड़ी गलती करता है! 😂',
        'तैयार हैं? अगर हारे तो अपने माउस को दोष दे देना! 🖱️',
      ],
      bn: [
        'শুভকামনা! দেখা যাক কার ভুল চাল বেশি মজাদার হয়! 😂',
        'খেলতে তৈরি তো? হারলে দোষটা মাউসের ঘাড়ে চাপিয়ে দেবেন! 🖱️',
      ],
    },
    check_by_ai: {
      en: [
        '😳 CHECK! Time to wake up and smell the tactics!',
        'Knock knock! Who’s there? Your King in danger! 🚨',
        'Check! Don’t panic... okay, maybe panic just a little bit. 😏',
      ],
      hi: [
        '😳 चेक! राजा साहब खतरे में हैं, जरा संभल कर!',
        'चेक! घबराइए मत... या थोड़ा बहुत घबरा सकते हैं! 😏',
      ],
      bn: [
        '😳 কিস্তি! রাজা মশাই বিপদে, এবার একটু ভাবুন!',
        'কিস্তি! ভয় পাবেন না... অবশ্য একটু আধটু ভয় পেতেই পারেন! 😏',
      ],
    },
    check_by_player: {
      en: [
        'Whoa! Checking my King? How rude! 😅',
        'Hold on, let me put my glasses on, did you just check me? 👓',
        'Nice check! I’ll pretend that didn’t scare me. 😳',
      ],
      hi: [
        'अरे! मेरे राजा को चेक? इतनी हिम्मत! 😅',
        'वाह! शानदार चेक! मुझे लगा नहीं था आप ये चाल देखेंगे!',
      ],
      bn: [
        'ওরেব্বাস! আমার রাজাকে কিস্তি? বেশ সাহস তো! 😅',
        'দারুণ চেক! সত্যি বলছি, আমি কিন্তু একটু চমকে গেছি!',
      ],
    },
    checkmate_ai_wins: {
      en: [
        '👑 CHECKMATE! GG! Don’t worry, your chess career isn’t over yet! 🎉',
        'Checkmate! Call the ambulance, but not for me! 🚑😎',
        'And that is game over! Rematch? I promise to go easy! 😂',
      ],
      hi: [
        '👑 चेकमेट! खेल खत्म! चिंता मत कीजिए, शतरंज का सफर अभी जारी है! 🎉',
        'चेकमेट! शानदार मुकाबला रहा! एक और मैच खेलें? 😂',
      ],
      bn: [
        '👑 কিস্তিমাত! খেলা শেষ! মন খারাপ করবেন না, আপনি দারুণ খেলছিলেন! 🎉',
        'চেকমেট! একটা রি-ম্যাচ হয়ে যাক? এবার একটু আস্তে খেলব! 😂',
      ],
    },
    checkmate_player_wins: {
      en: [
        '😭 NOOO! You checkmated me! My circuits are crying! 🏆',
        'Wait... I lost?! You absolute chess wizard! 🧙‍♂️🔥',
        'Okay, you got me! I need to update my software right now. 💀',
      ],
      hi: [
        '😭 नहीं! आपने मुझे चेकमेट कर दिया! आप तो उस्ताद निकले! 🏆',
        'मान गए! क्या चाल चली आपने! मेरी हार पक्की! 🔥',
      ],
      bn: [
        '😭 ওরেব্বাস! আপনি আমাকে কিস্তিমাত করে দিলেন! আপনি তো খাঁটি গ্র্যান্ডমাস্টার! 🏆',
        'হার স্বীকার করলাম! সত্যি অনবদ্য খেলেছেন! 🔥',
      ],
    },
    capture_queen: {
      en: [
        '💀 The Queen has left the chat! That had to hurt!',
        'Bye bye Queenie! She had an urgent appointment off the board! 👸💨',
        'Ouch! That Queen sacrifice better be a genius masterplan! 😂',
      ],
      hi: [
        '💀 रानी चली गई! यह तो बहुत बड़ा झटका था!',
        'अलविदा वज़ीर साहब! अब बोर्ड पर सन्नाटा छा गया! 👸💨',
      ],
      bn: [
        '💀 রানি বিদায় নিল! এটা কিন্তু দারুণ বড়সড় ধাক্কা!',
        'রানি মাঠের বাইরে চলে গেল! এবার খেলা জমবে! 👸💨',
      ],
    },
    capture_piece: {
      en: [
        '😂 Sorry, your piece had to go. Free snacks for my army!',
        'Chomp chomp! Another piece bites the dust! 💥',
        'I saw a piece, I took a piece. Simple math! 🧮',
      ],
      hi: [
        '😂 माफ कीजिए, यह मोहरा तो मुझे लेना ही पड़ा! 💥',
        'एक और मोहरा साफ! मेरी सेना को भूख लगी थी! 😋',
      ],
      bn: [
        '😂 দুঃখিত, এই ঘুঁটিটা না নিয়ে পারলাম না! 💥',
        'আরেকটা ঘুঁটি বিদায়! আমার সৈন্যরা বেশ আনন্দ পেল! 😋',
      ],
    },
    capture_pawn: {
      en: [
        'Just a little pawn appetizer. 🍿',
        'Free pawn? Don’t mind if I do! 😋',
      ],
      hi: [
        'छोटा सा प्यादा, बड़ा स्वादिष्ट नाश्ता! 🍿',
      ],
      bn: [
        'একটা ছোট্ট বোড়ে, দারুণ হালকা জলখাবার! 🍿',
      ],
    },
    player_blunder: {
      en: [
        '👀 Did you mean to leave that piece hanging, or was that a trap?',
        'Oof! That piece looked very lonely so I adopted it! 😂',
        'Christmas came early on the chessboard! 🎁',
      ],
      hi: [
        '👀 क्या यह कोई चाल थी या सचमुच गलती से छूट गया? 😂',
        'तोहफा देने के लिए धन्यवाद! ऐसा मौका कौन छोड़ता है! 🎁',
      ],
      bn: [
        '👀 ওটা কি কোনো ফাঁদ ছিল, নাকি ভুল করে ফেলে দিলেন? 😂',
        'উপহারের জন্য অনেক ধন্যবাদ! এমন সুযোগ ছাড়া যায় নাকি! 🎁',
      ],
    },
    ai_blunder: {
      en: [
        '😭 Let’s just pretend I planned that sacrifice 4 moves ago...',
        'Oops! My finger slipped on the virtual board! 🙈',
      ],
      hi: [
        '😭 मान लेते हैं कि मैंने यह चाल जानबूझकर चली थी... 🙈',
      ],
      bn: [
        '😭 ভাবুন যেন আমি চার চাল আগেই এই বলিদানের প্ল্যান করেছিলাম... 🙈',
      ],
    },
    castling: {
      en: [
        '🏰 King tucked away in the fortress! Safe and cozy!',
        'Two pieces moving at once? Pure legal wizardry! ✨',
      ],
      hi: [
        '🏰 राजा किले में सुरक्षित! अब हमला करना मुश्किल होगा!',
      ],
      bn: [
        '🏰 রাজা মশাই কেল্লায় ঢুকে সুরক্ষিত হয়ে গেলেন! দারুণ চাল!',
      ],
    },
    promotion: {
      en: [
        '🌟 A humble pawn becomes a Queen! What a glow-up! 👸',
        'Another Queen?! The royal family is getting crowded! 👑',
      ],
      hi: [
        '🌟 छोटा प्यादा रानी बन गया! क्या कायापलट है! 👸',
      ],
      bn: [
        '🌟 সাধারণ বোড়ে রানি হয়ে গেল! একেই বলে আসল উন্নতি! 👸',
      ],
    },
    quiet_move: {
      en: [
        '😏 Interesting move... let’s see where this goes.',
        'Hmm, plotting something sneaky, are we? 🤔',
        'Solid move! My calculation engine is spinning. ⚙️',
      ],
      hi: [
        '😏 दिलचस्प चाल... देखते हैं आगे क्या होता है!',
        'हम्म, कोई गुप्त योजना बना रहे हैं क्या? 🤔',
      ],
      bn: [
        '😏 বেশ কৌতূহলী চাল... দেখা যাক কী হয়!',
        'হুমম, তলে তলে কোনো গভীর প্ল্যান চলছে নাকি? 🤔',
      ],
    },
  },

  // 2. 😈 THE VILLAIN
  villain: {
    game_start: {
      en: ['You dare challenge me mortal? Prepare to suffer on the 64 squares! 😈', 'Your defeat was calculated 1000 moves ago! 💀'],
      hi: ['मुझसे मुकाबला करने की हिम्मत? आज आपकी हार तय है! 😈'],
      bn: ['আমার বিরুদ্ধে খেলার সাহস? ৬৪ খোপের যুদ্ধে পরাজয় বরণ করতে তৈরি থাকুন! 😈'],
    },
    check_by_ai: {
      en: ['Mwahaha! CHECK! Your King has nowhere to hide! 😈⚡', 'Bow before my unstoppable attack! Check! 👑'],
      hi: ['हाहाहा! चेक! आपका राजा अब मेरे शिकंजे में है! 😈'],
      bn: ['হা হা হা! কিস্তি! আপনার রাজার পালানোর কোনো পথ নেই! 😈'],
    },
    check_by_player: {
      en: ['Insolence! A check? Merely a temporary nuisance! 😤', 'You dare threaten my dark throne?! ⚡'],
      hi: ['इतनी गुस्ताखी? मेरे राजा को चेक देने की जुर्रत! 😤'],
      bn: ['এত বড় স্পর্ধা? আমার সিংহাসনকে আক্রমণ? 😤'],
    },
    checkmate_ai_wins: {
      en: ['👑 CHECKMATE! Total destruction! Another fallen challenger! 😈🔥', 'Kneel before the supreme chess ruler! Victory is mine! 💀'],
      hi: ['👑 चेकमेट! पूर्ण विनाश! आज का विजेता केवल मैं हूँ! 😈'],
      bn: ['👑 কিস্তিমাত! সম্পূর্ণ পরাজয়! আজ শুধু আমারই জয়জয়কার! 😈'],
    },
    checkmate_player_wins: {
      en: ['IMPOSSIBLE!! My dark algorithms... shattered! 😱💀', 'Curse you! You have defeated my ultimate plan! 😭'],
      hi: ['असंभव!! मेरी रणनीति को कैसे भेद दिया आपने?! 😱'],
      bn: ['অসম্ভব!! আমার সব হিসেব ওলটপালট করে দিলেন?! 😱'],
    },
    capture_queen: {
      en: ['Your Queen falls into the abyss! Darkness triumphs! 💀👸', 'Without your Queen, your kingdom is doomed! 😈'],
      hi: ['आपकी रानी अंधेरे में विलीन हो गई! अब बचना नामुमकिन है! 💀'],
      bn: ['আপনার রানি খতম! এবার পুরো রাজ্য ধ্বংসের মুখে! 💀'],
    },
    capture_piece: {
      en: ['Another piece sacrificed to my relentless conquest! 💥', 'Pathetic defense! That piece belongs to me now! 😈'],
      hi: ['एक और मोहरा मेरे अधीन! आपकी सेना कमजोर हो रही है! 💥'],
      bn: ['আরেকটা ঘুঁটি আমার কবজায়! আপনার সেনা এখন দুর্বল! 💥'],
    },
    capture_pawn: {
      en: ['A pawn crushed under my boot. Insignificant. 😈'],
      hi: ['एक अदना सा प्यादा कुचल दिया गया! 😈'],
      bn: ['একটা সাধারণ বোড়ে পিষে দেওয়া হলো! 😈'],
    },
    player_blunder: {
      en: ['Did you really think I wouldn’t punish that catastrophic blunder? 😈💀', 'A fatal mistake! Your doom is sealed! 🔥'],
      hi: ['क्या आपको लगा मैं इस भयानक गलती को छोड़ दूँगा? 😈'],
      bn: ['ভেবেছিলেন এই মারাত্মক ভুলটা আমি দেখতে পাব না? 😈'],
    },
    ai_blunder: {
      en: ['A minor strategic anomaly! Do not think you have the upper hand! 😤'],
      hi: ['यह तो बस एक छोटी सी योजना का हिस्सा था! ज्यादा खुश मत होइए! 😤'],
      bn: ['এটা কেবল সাময়িক বিভ্রান্তি! ভেবে বসবেন না জিতে গেছেন! 😤'],
    },
    castling: {
      en: ['Coward! Hiding behind your tower will not save you! 🏰'],
      hi: ['दीवारों के पीछे छिपने से भी आप बच नहीं पाएंगे! 🏰'],
      bn: ['দেওয়ালের আড়ালে লুকিয়েও রক্ষা পাবেন না! 🏰'],
    },
    promotion: {
      en: ['A new Queen rises from the ashes of battle! Magnificent! 👑'],
      hi: ['एक नई रानी का उदय हुआ! 👑'],
      bn: ['রণক্ষেত্রে এক নতুন রানির উদয় হলো! 👑'],
    },
    quiet_move: {
      en: ['Plot your moves carefully... death awaits on every square! 😈', 'A quiet step before the storm hits. 🌩️'],
      hi: ['सावधानी से खेलिए... हर कदम पर खतरा है! 😈'],
      bn: ['সাবধানে পা বাড়ান... প্রতিটি খোপেই ফাঁদ পাতা! 😈'],
    },
  },

  // 3. 🤓 THE PROFESSOR
  professor: {
    game_start: {
      en: ['Greetings! Chess was invented in 6th century India. Let us study your tactical aptitude! 📚♟️'],
      hi: ['नमस्कार! शतरंज का जन्म ६ठी शताब्दी के भारत में हुआ था। चलिए कुछ सीखते हैं! 📚'],
      bn: ['নমস্কার! ষষ্ঠ শতাব্দীর ভারতবর্ষ থেকে দাবার উৎপত্তি। চলুন শুরু করা যাক! 📚'],
    },
    check_by_ai: {
      en: ['Check! Remember the CPR acronym: Capture, Protect, or Run! 🎓', 'Tactical alert: your monarch is currently in crosshairs! ⚠️'],
      hi: ['चेक! याद रखिए सीपीआर: मारो, रोको या भागो! 🎓'],
      bn: ['কিস্তি! মনে রাখবেন: ঘুঁটি কাটা, পথ আটকানো বা পালিয়ে যাওয়া! 🎓'],
    },
    check_by_player: {
      en: ['Fascinating! A well-calculated line of attack against my king. 🧐', 'A textbook check. Commendable tactical vision! 👏'],
      hi: ['अद्भुत! आपके राजा पर हमले की गणना काफी सटीक थी। 🧐'],
      bn: ['দারুণ! আপনার হিসাবনিকাশ সত্যিই প্রশংসনীয়। 🧐'],
    },
    checkmate_ai_wins: {
      en: ['Checkmate! A classical back-rank constriction. Excellent lesson! 🎓♟️'],
      hi: ['चेकमेट! यह एक क्लासिक जीत थी। खेल से बहुत कुछ सीखने को मिला! 🎓'],
      bn: ['কিস্তিমাত! একটি আদর্শ পাঠশালাতুল্য জয়। দারুণ অভিজ্ঞতা! 🎓'],
    },
    checkmate_player_wins: {
      en: ['Magnificent checkmate! You have applied positional mastery to perfection! 🏆👏'],
      hi: ['लाजवाब चेकमेट! आपने वाकई बहुत परिपक्व खेल दिखाया! 🏆'],
      bn: ['অনবদ্য কিস্তিমাত! আপনি সত্যিই অসাধারণ কৌশল খাটিয়েছেন! 🏆'],
    },
    capture_queen: {
      en: ['The 9-point queen departs. Material balance shifts dramatically! ⚖️'],
      hi: ['९ अंकों की रानी चली गई। अब खेल का संतुलन बदल गया है! ⚖️'],
      bn: ['৯ পয়েন্টের রানি চলে গেল। খেলার ভারসাম্য পুরো ঘুরে গেল! ⚖️'],
    },
    capture_piece: {
      en: ['Material exchanged. Evaluating resulting pawn structure... 🧐'],
      hi: ['मोहरों की अदला-बदली। स्थिति का विश्लेषण जारी है... 🧐'],
      bn: ['ঘুঁটি বদল হলো। পরিস্থিতি এখনও বেশ রোমাঞ্চকর... 🧐'],
    },
    capture_pawn: {
      en: ['Pawn captures influence open files and outpost squares. ♟️'],
      hi: ['प्यादों का कटना बोर्ड पर नए रास्ते खोलता है। ♟️'],
      bn: ['বোড়ে কাটা পড়লে নতুন আক্রমণাত্মক রাস্তা খুলে যায়। ♟️'],
    },
    player_blunder: {
      en: ['Notice that piece was left hanging without adequate defense. 📚'],
      hi: ['ध्यान दीजिए, वह मोहरा बिना किसी सुरक्षा के छूट गया था। 📚'],
      bn: ['খেয়াল রাখবেন, ঘুঁটিটি কোনো পাহারা ছাড়াই পড়ে ছিল। 📚'],
    },
    ai_blunder: {
      en: ['A sub-optimal variation on my part. Human intuition triumphs! 🤖'],
      hi: ['यह मेरी गणना में एक त्रुटि थी। शाबाश! 🤖'],
      bn: ['আমার হিসেবে সামান্য গরমিল হয়েছিল। দারুণ ধরেছেন! 🤖'],
    },
    castling: {
      en: ['Castling: improves king safety and connects the rooks efficiently. 🏰'],
      hi: ['कैसलिंग: राजा की सुरक्षा और हाथी का विकास एक साथ। 🏰'],
      bn: ['ক্যাসলিং: রাজার সুরক্ষা এবং কিস্তির শক্তি বৃদ্ধির সেরা উপায়। 🏰'],
    },
    promotion: {
      en: ['Pawn promotion: transforming 1 point of potential into 9 points of power! 🌟'],
      hi: ['प्यादा पदोन्नति: १ अंक के मोहरे का ९ अंक की रानी में परिवर्तन! 🌟'],
      bn: ['বোড়ের রূপান্তর: ১ পয়েন্ট থেকে সরাসরি ৯ পয়েন্টের মহাশক্তি! 🌟'],
    },
    quiet_move: {
      en: ['Positional maneuver noted. Maintaining central equilibrium. 🧭'],
      hi: ['सटीक स्थितिगत चाल। केंद्र पर नियंत्रण बना हुआ है। 🧭'],
      bn: ['কৌশলী চাল। বোর্ডের কেন্দ্রে নিয়ন্ত্রণ বজায় রয়েছে। 🧭'],
    },
  },

  // 4. 🐱 THE CUTE CAT
  cat: {
    game_start: {
      en: ['Meow! Let’s play! If I get bored, I might knock the pawns off the board! 🐾😺', 'Purrrr... chess time! Are the pieces made of fish? 🐟'],
      hi: ['म्याऊँ! चलो खेलते हैं! मोहरे मछलियों के बने हैं क्या? 🐾'],
      bn: ['মিয়াঁও! খেলা শুরু! ঘুঁটিগুলো কি মাছ দিয়ে তৈরি? 🐾'],
    },
    check_by_ai: {
      en: ['Hiss! CHECK! My claws are out! 🐾😼', 'Meow! Check! You cannot run from the kitty! 🐱'],
      hi: ['म्याऊँ! चेक! बिल्ली के पंजे से बचकर दिखाओ! 🐾'],
      bn: ['মিয়াঁও! কিস্তি! বিড়ালের থাবা থেকে বাঁচুন এবার! 🐾'],
    },
    check_by_player: {
      en: ['Eek! You checked my King! My whiskers are twitching! 🙀', 'Meow?! How did you jump over there?! 🐾'],
      hi: ['अरे! चेक? मेरी मूंछें फड़फड़ाने लगीं! 🙀'],
      bn: ['ওমা! কিস্তি? আমার তো লোম খাড়া হয়ে গেল! 🙀'],
    },
    checkmate_ai_wins: {
      en: ['👑 CHECKMATE! Purrrrr... victorious cat takes a victory nap! 😴🐾', 'Meow meow victory! Who wants a treat? 🐟✨'],
      hi: ['👑 चेकमेट! बिल्ली जीत गई! अब एक कटोरी दूध चाहिए! 🥛😺'],
      bn: ['👑 কিস্তিমাত! বিড়াল জিতেছে! এবার এক বাটি দুধ পুরস্কার চাই! 🥛😺'],
    },
    checkmate_player_wins: {
      en: ['Mewww... you beat the kitty! I will knock over your king anyway! 🐾😭'],
      hi: ['म्याऊँ... आपने बिल्ली को हरा दिया! लेकिन मैं हार नहीं मानूँगा! 😿'],
      bn: ['ম্যাঁও... আপনি জিতে গেলেন! বিড়াল মশাই এবার ঘুমোতে চলল! 😿'],
    },
    capture_queen: {
      en: ['Nom nom! The big sparkly queen tasted like salmon! 🐟✨', 'Bye bye Queen! Kitty pounced on her! 🐾'],
      hi: ['स्वादिष्ट! रानी तो बिल्कुल मछली की तरह थी! 🐟'],
      bn: ['ইয়ামী! রানি ঘুঁটিটা ঠিক ইলিশ মাছের মতো স্বাদের ছিল! 🐟'],
    },
    capture_piece: {
      en: ['Pounced! Swiped with my paw! That piece is mine! 🐾', 'Playing with my captured toy! Purrrr! 🧶'],
      hi: ['पंजे से मोहरा गिरा दिया! यह खिलौना अब मेरा है! 🐾'],
      bn: ['থাবা মেরে ঘুঁটি ফেলে দিলাম! এটা এখন আমার খেলার জিনিস! 🐾'],
    },
    capture_pawn: {
      en: ['Little pawn mouse captured! Squeak! 🐭🐾'],
      hi: ['छोटा चूहा-प्यादा पकड़ा गया! 🐭'],
      bn: ['ছোট্ট ইঁদুর-বোড়ে ধরা পড়ল! 🐭'],
    },
    player_blunder: {
      en: ['You left that piece unattended? Kitty will bat it under the sofa! 🛋️😸'],
      hi: ['यह मोहरा अकेला क्यों छोड़ दिया? बिल्ली इसे छुपा देगी! 😸'],
      bn: ['ঘুঁটিটা একা ফেলে রেখেছিলেন? বিড়াল ওটাকে সোফার নিচে চালান করে দিল! 😸'],
    },
    ai_blunder: {
      en: ['Meow... I was distracted by a red laser pointer! 🔴🙈'],
      hi: ['म्याऊँ... मेरा ध्यान एक लाल लेज़र लाइट पर चला गया था! 🙈'],
      bn: ['মিয়াঁও... আমি একটা লাল লেজার লাইট দেখতে পেয়ে অন্যমনস্ক হয়ে গেছিলাম! 🙈'],
    },
    castling: {
      en: ['King curled up in a warm cardboard box! Cozy! 📦😺'],
      hi: ['राजा डिब्बे में छिपकर सो गया! बहुत आरामदायक! 📦'],
      bn: ['রাজা মশাই একটা আরামদায়ক বাক্সে ঢুকে গুটিসুটি মেরে শুয়ে পড়ল! 📦'],
    },
    promotion: {
      en: ['A little kitten grew up into a lioness Queen! Roar-meow! 🦁👑'],
      hi: ['छोटा बिल्ली का बच्चा रानी शेरनी बन गया! 🦁'],
      bn: ['ছোট্ট বিড়ালছানা এক লাফে রানি বাঘিনী হয়ে গেল! 🦁'],
    },
    quiet_move: {
      en: ['Tiptoeing softly across the squares... purrr. 🐾', 'Staring intently at the board like it’s a bowl of milk. 🥛'],
      hi: ['दबे पांव चल रहे हैं... बिल्ली सब देख रही है! 🐾'],
      bn: ['ধীরে ধীরে পা ফেলে এগোনো হচ্ছে... বিড়াল কিন্তু সব নজর রাখছে! 🐾'],
    },
  },
};

export function getAIComment(
  personality: AIPersonality,
  event: GameEvent,
  lang: 'en' | 'hi' | 'bn' = 'en'
): string {
  const personaPool = COMMENT_POOLS[personality] || COMMENT_POOLS.comedian;
  const eventPool = personaPool[event] || personaPool.quiet_move;
  const langPool = eventPool[lang] || eventPool.en || [];

  if (langPool.length === 0) {
    return '😏';
  }

  const randomIndex = Math.floor(Math.random() * langPool.length);
  return langPool[randomIndex];
}
