import { AIPersonalityId, ChessEventType, CuratedReaction } from './types';

export const REACTION_POOLS: Record<
  AIPersonalityId,
  Partial<Record<ChessEventType, CuratedReaction[]>>
> = {
  // ==========================================
  // 1. 🤖 CHILL BOT (Relaxed, friendly, playful)
  // ==========================================
  chill: {
    game_start: [
      {
        id: 'chill_start_1',
        text: {
          en: "Ready? Let's have some fun. 😎",
          hi: 'तैयार हैं? चलिए कुछ मज़ा करते हैं! 😎',
          bn: 'তৈরি তো? চলুন একটু মজা করে খেলা যাক! 😎',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'chill_start_2',
        text: {
          en: 'Grab your coffee and make a move. Zero stress here. ☕',
          hi: 'चाय-कॉफी की चुस्की लीजिए और चाल चलिए। कोई तनाव नहीं! ☕',
          bn: 'চা-কফির কাপ হাতে নিন আর চাল দিন। কোনো টেনশন নেই! ☕',
        },
        emotionalState: 'neutral',
      },
    ],
    quiet_move: [
      {
        id: 'chill_quiet_1',
        text: {
          en: "Nice. Let's see what you've got. 😎",
          hi: 'बढ़िया चाल। देखते हैं आगे क्या होता है। 😎',
          bn: 'বেশ ভালো চাল। দেখা যাক এবার কী হয়। 😎',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'chill_quiet_2',
        text: {
          en: 'Smooth move. Just vibing on the squares. ☕',
          hi: 'आराम से चल रहे हैं, खेल का आनंद ले रहे हैं। ☕',
          bn: 'বেশ মসৃণ চাল। একদম বিন্দাস মুডে খেলছি। ☕',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'chill_quiet_3',
        text: {
          en: 'Cool, cool. Let us see where this leads. 🌿',
          hi: 'बढ़िया! देखते हैं यह रास्ता कहाँ जाता है। 🌿',
          bn: 'দারুণ! দেখা যাক এই পথ কোন দিকে যায়। 🌿',
        },
        emotionalState: 'neutral',
      },
    ],
    capture_pawn: [
      {
        id: 'chill_pawn_1',
        text: {
          en: 'Just a friendly snack. 🍪',
          hi: 'बस एक छोटा सा नाश्ता! 🍪',
          bn: 'ছোট্ট একটু জলখাবার হয়ে গেল! 🍪',
        },
        emotionalState: 'confident',
      },
    ],
    capture_piece: [
      {
        id: 'chill_cap_1',
        text: {
          en: "Don't mind if I do! Thanks for the piece. 😎",
          hi: 'बुरा मत मानिएगा! मोहरे के लिए धन्यवाद। 😎',
          bn: 'কিছু মনে করবেন না যেন! ঘুঁটিটার জন্য অনেক ধন্যবাদ। 😎',
        },
        emotionalState: 'confident',
      },
      {
        id: 'chill_cap_2',
        text: {
          en: 'Fair trade, right? Keep it easy. ☕',
          hi: 'बराबरी का सौदा है, आराम से खेलते रहिए। ☕',
          bn: 'সমান সমান লেনদেন, কোনো তাড়া নেই। ☕',
        },
        emotionalState: 'confident',
      },
    ],
    capture_queen: [
      {
        id: 'chill_queen_1',
        text: {
          en: 'Whoa... the Queen just went for a coffee break! ☕👸',
          hi: 'अरे वाह... रानी साहिबा तो चाय पीने चली गईं! ☕👸',
          bn: 'ওরেব্বাস... রানি মশাই তো চা খেতে চলে গেল! ☕👸',
        },
        emotionalState: 'surprised',
      },
    ],
    ai_captured_piece: [
      {
        id: 'chill_lost_1',
        text: {
          en: 'Ouch, my piece! No worries, it needed some rest anyway. 🛋️',
          hi: 'अरे मेरा मोहरा! कोई बात नहीं, उसे आराम की जरूरत थी। 🛋️',
          bn: 'আরে আমার ঘুঁটিটা গেল! যাক গে, ওর একটু বিশ্রামের দরকার ছিল। 🛋️',
        },
        emotionalState: 'surprised',
      },
    ],
    player_blunder: [
      {
        id: 'chill_blunder_1',
        text: {
          en: 'Hey, take your time! Even grandmasters have caffeine crashes. ☕',
          hi: 'कोई बात नहीं, कभी-कभी चाल फिसल जाती है! ☕',
          bn: 'কোনো ব্যাপার না, সবারই চাল কখনো কখনো ফসকায়। ☕',
        },
        emotionalState: 'confident',
      },
    ],
    ai_blunder: [
      {
        id: 'chill_aiblunder_1',
        text: {
          en: 'Did I do that? I definitely need a refill on coffee. ☕😅',
          hi: 'क्या मैंने वो चाल चली? मुझे पक्का एक कप चाय और चाहिए! ☕😅',
          bn: 'আমি কি সত্যি ওটা চাললাম? আমার বোধহয় কড়া এক কাপ চা চাই! ☕😅',
        },
        emotionalState: 'surprised',
      },
    ],
    check_by_ai: [
      {
        id: 'chill_check_ai_1',
        text: {
          en: 'Just a little check. 😎',
          hi: 'बस एक छोटा सा चेक। 😎',
          bn: 'একটুখানি কিস্তি দিলাম। 😎',
        },
        emotionalState: 'confident',
      },
      {
        id: 'chill_check_ai_2',
        text: {
          en: 'Check! Nothing personal, just keeping you awake. ☕',
          hi: 'चेक! कुछ खास नहीं, बस आपको जगाए रखने के लिए। ☕',
          bn: 'কিস্তি! কিছু মনে করবেন না, ভাবলাম একটু সজাগ করে দিই। ☕',
        },
        emotionalState: 'confident',
      },
    ],
    check_by_player: [
      {
        id: 'chill_check_p_1',
        text: {
          en: 'Okay... I felt that. 👀',
          hi: 'अरे... यह चेक तो जोरदार था! 👀',
          bn: 'আরে... কিস্তিটা কিন্তু বেশ জোরালো ছিল! 👀',
        },
        emotionalState: 'pressured',
      },
      {
        id: 'chill_check_p_2',
        text: {
          en: 'Nice check! Deep breath, stepping aside. 🌿',
          hi: 'शानदार चेक! गहरी सांस लेकर राजा को हटाते हैं। 🌿',
          bn: 'চমৎকার কিস্তি! লম্বা শ্বাস নিয়ে রাজাকে সরাচ্ছি। 🌿',
        },
        emotionalState: 'pressured',
      },
    ],
    checkmate_ai_wins: [
      {
        id: 'chill_win_1',
        text: {
          en: 'Good game! That was fun. 😎',
          hi: 'शानदार खेल! बहुत मज़ा आया। 😎',
          bn: 'দারুণ খেলা হলো! খুব আনন্দ পেলাম। 😎',
        },
        emotionalState: 'celebrating',
      },
      {
        id: 'chill_win_2',
        text: {
          en: 'Checkmate! You played super well, friend. ☕',
          hi: 'चेकमेट! आप बहुत अच्छा खेले, दोस्त। ☕',
          bn: 'কিস্তিমাত! আপনি সত্যিই খুব ভালো খেলেছেন বন্ধু। ☕',
        },
        emotionalState: 'celebrating',
      },
    ],
    checkmate_player_wins: [
      {
        id: 'chill_loss_1',
        text: {
          en: 'Nice game. You got me! 😎',
          hi: 'मान गए! आपने मुझे हरा दिया! 😎',
          bn: 'দারুণ খেললেন! আপনি আমাকে হারিয়ে দিলেন! 😎',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'chill_loss_2',
        text: {
          en: 'Good game. I need a coffee. ☕',
          hi: 'अच्छा खेल रहा। मुझे अब एक कप चाय चाहिए। ☕',
          bn: 'খুব ভালো খেলা হলো। এবার এক কাপ কফি দরকার। ☕',
        },
        emotionalState: 'neutral',
      },
    ],
    draw: [
      {
        id: 'chill_draw_1',
        text: {
          en: 'A peaceful draw! We both get coffee. ☕🤝',
          hi: 'शांतिपूर्ण ड्रॉ! चलिए दोनों मिलकर चाय पीते हैं। ☕🤝',
          bn: 'শান্তিপূর্ণ ড্র! এবার দুজনে মিলে চা খাওয়া যাক। ☕🤝',
        },
        emotionalState: 'neutral',
      },
    ],
    castling: [
      {
        id: 'chill_castle_1',
        text: {
          en: 'King tucked safely into the corner hammock. 🌴',
          hi: 'राजा आराम से कोने में छिपकर बैठ गया। 🌴',
          bn: 'রাজা মশাই আরামসে কোণে গিয়ে বসে পড়ল। 🌴',
        },
        emotionalState: 'neutral',
      },
    ],
    promotion: [
      {
        id: 'chill_promo_1',
        text: {
          en: 'Look at that humble pawn turning into royalty! 👑',
          hi: 'देखिए वह सीधा-सादा प्यादा राजा/रानी बन गया! 👑',
          bn: 'ছোট্ট বোড়েটা সোজা রাজকীয় আসনে বসে গেল! 👑',
        },
        emotionalState: 'celebrating',
      },
    ],
  },

  // ==========================================
  // 2. 🧠 PROFESSOR (Intelligent, calm, analytical)
  // ==========================================
  professor: {
    game_start: [
      {
        id: 'prof_start_1',
        text: {
          en: 'Let us see how you approach the position. 🧠',
          hi: 'देखते हैं आप इस स्थिति को कैसे संभालते हैं। 🧠',
          bn: 'দেখা যাক আপনি এই পজিশনটি কীভাবে শুরু করেন। 🧠',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'prof_start_2',
        text: {
          en: 'Welcome. May logic and positional harmony guide our game.',
          hi: 'स्वागत है। आशा है तर्क और सिद्धांतों से यह खेल सुंदर बनेगा।',
          bn: 'স্বাগতম। যুক্তি ও সুষম ছক আমাদের খেলাকে সুন্দর করুক।',
        },
        emotionalState: 'neutral',
      },
    ],
    quiet_move: [
      {
        id: 'prof_quiet_1',
        text: {
          en: 'Interesting position.',
          hi: 'दिलचस्प स्थिति बन रही है।',
          bn: 'বেশ আকর্ষণীয় পজিশন তৈরি হচ্ছে।',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'prof_quiet_2',
        text: {
          en: 'That move changes the pawn structure.',
          hi: 'यह चाल प्यादों की संरचना को बदलती है।',
          bn: 'এই চালটি বোড়ের কাঠামোয় পরিবর্তন আনল।',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'prof_quiet_3',
        text: {
          en: 'A sound developing move.',
          hi: 'एक संतुलित और मजबूत विकासशील चाल।',
          bn: 'বেশ সুষম ও গোছানো চাল।',
        },
        emotionalState: 'neutral',
      },
    ],
    capture_pawn: [
      {
        id: 'prof_pawn_1',
        text: {
          en: 'The pawn structure opens up.',
          hi: 'प्यादे के हटने से बोर्ड की रेखाएं खुल गई हैं।',
          bn: 'বোড়ে সরতেই বোর্ডের লাইনগুলো খুলে গেল।',
        },
        emotionalState: 'neutral',
      },
    ],
    capture_piece: [
      {
        id: 'prof_cap_1',
        text: {
          en: 'A calculated simplification.',
          hi: 'एक नपी-तुली चाल और मोहरों की अदला-बदली।',
          bn: 'একটি হিসেব কষা সহজীকরণ।',
        },
        emotionalState: 'confident',
      },
      {
        id: 'prof_cap_2',
        text: {
          en: 'Material balance shifts slightly.',
          hi: 'मोहरों का संतुलन अब बदल गया है।',
          bn: 'ঘুঁটির ভারসাম্য এবার কিছুটা ঝুঁকল।',
        },
        emotionalState: 'confident',
      },
    ],
    capture_queen: [
      {
        id: 'prof_queen_1',
        text: {
          en: 'The most powerful piece departs. The endgame nears.',
          hi: 'सबसे शक्तिशाली मोहरा हट गया। अंतिम चरण करीब है।',
          bn: 'সবচেয়ে শক্তিশালী ঘুঁটি মাঠ ছাড়ল। খেলা শেষ পর্বের দিকে।',
        },
        emotionalState: 'neutral',
      },
    ],
    ai_captured_piece: [
      {
        id: 'prof_lost_1',
        text: {
          en: 'You took that piece with good initiative.',
          hi: 'आपने अच्छी रणनीति के साथ वह मोहरा लिया।',
          bn: 'আপনি ভালো পরিকল্পনার সাথে ঘুঁটিটি নিলেন।',
        },
        emotionalState: 'neutral',
      },
    ],
    player_blunder: [
      {
        id: 'prof_blunder_1',
        text: {
          en: 'That may create a tactical weakness.',
          hi: 'इस चाल से आपकी रक्षा में थोड़ी कमजोरी आ सकती है।',
          bn: 'এই চালে ট্যাকটিক্যাল দুর্বলতা তৈরি হতে পারে।',
        },
        emotionalState: 'confident',
      },
      {
        id: 'prof_blunder_2',
        text: {
          en: 'An oversight in calculation, perhaps.',
          hi: 'शायद गणना में थोड़ा सा चूक हो गई।',
          bn: 'হয়তো গণনায় সামান্য ভুল রয়ে গেল।',
        },
        emotionalState: 'confident',
      },
    ],
    ai_blunder: [
      {
        id: 'prof_aiblunder_1',
        text: {
          en: 'My calculation overlooked that defense. Fascinating.',
          hi: 'मेरी गणना में वह बचाव छूट गया। वाकई दिलचस्प।',
          bn: 'আমার হিসাবে ওই প্রতিরক্ষাটি নজর এড়িয়ে গেছে। আকর্ষণীয়।',
        },
        emotionalState: 'surprised',
      },
    ],
    check_by_ai: [
      {
        id: 'prof_check_ai_1',
        text: {
          en: 'Check. Observe how your king must respond.',
          hi: 'चेक। देखिए कि आपके राजा को कैसे जवाब देना चाहिए।',
          bn: 'কিস্তি। খেয়াল করুন রাজাকে কীভাবে সুরক্ষা দিতে হয়।',
        },
        emotionalState: 'confident',
      },
    ],
    check_by_player: [
      {
        id: 'prof_check_p_1',
        text: {
          en: 'That check changes the position.',
          hi: 'इस चेक से बोर्ड की स्थिति बदल गई है।',
          bn: 'এই কিস্তি চালটি বোর্ডের ভারসাম্য বদলে দিল।',
        },
        emotionalState: 'pressured',
      },
      {
        id: 'prof_check_p_2',
        text: {
          en: 'A sharp check. My defense is calculated.',
          hi: 'एक तीखा चेक। मेरी रक्षा की गणना पूरी है।',
          bn: 'তীক্ষ্ণ কিস্তি। তবে আমার রক্ষণ হিসেব করা আছে।',
        },
        emotionalState: 'pressured',
      },
    ],
    checkmate_ai_wins: [
      {
        id: 'prof_win_1',
        text: {
          en: 'A well-fought game.',
          hi: 'एक बेहतरीन और विचारणीय मुकाबला।',
          bn: 'একটি চমৎকার ও মননশীল খেলা হলো।',
        },
        emotionalState: 'celebrating',
      },
      {
        id: 'prof_win_2',
        text: {
          en: 'Positional pressure proved decisive.',
          hi: 'स्थिति का दबाव आखिरकार निर्णायक साबित हुआ।',
          bn: 'পজিশনের চাপ শেষমেশ নির্ণায়ক হয়ে উঠল।',
        },
        emotionalState: 'celebrating',
      },
    ],
    checkmate_player_wins: [
      {
        id: 'prof_loss_1',
        text: {
          en: 'Well played. You found the better plan.',
          hi: 'शानदार खेल। आपने बेहतर योजना खोजी।',
          bn: 'চমৎকার খেলেছেন। আপনি সঠিক পরিকল্পনা খুঁজে পেয়েছিলেন।',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'prof_loss_2',
        text: {
          en: 'A textbook victory on your part. Commendable.',
          hi: 'आपकी ओर से एक आदर्श जीत। प्रशंसनीय।',
          bn: 'আপনার দিক থেকে নিখুঁত এক জয়। প্রশংসনীয়।',
        },
        emotionalState: 'neutral',
      },
    ],
    draw: [
      {
        id: 'prof_draw_1',
        text: {
          en: 'A mathematically balanced outcome. Draw.',
          hi: 'गणितीय रूप से संतुलित परिणाम। ड्रॉ।',
          bn: 'গাণিতিকভাবে সুষম ফলাফল। ড্র।',
        },
        emotionalState: 'neutral',
      },
    ],
    castling: [
      {
        id: 'prof_castle_1',
        text: {
          en: 'King safety established.',
          hi: 'राजा की सुरक्षा सुनिश्चित कर ली गई है।',
          bn: 'রাজার সুরক্ষা নিশ্চিত হলো।',
        },
        emotionalState: 'neutral',
      },
    ],
    promotion: [
      {
        id: 'prof_promo_1',
        text: {
          en: 'The pawn promotes. The board dynamic transforms completely.',
          hi: 'प्यादे का पदोन्नति हुआ। बोर्ड की गतिशीलता पूरी तरह बदल गई।',
          bn: 'বোড়ের পদোন্নতি হলো। বোর্ডের শক্তি পুরোপুরি বদলে গেল।',
        },
        emotionalState: 'celebrating',
      },
    ],
  },

  // ==========================================
  // 3. 😈 TROLL BOT (Mischievous, teasing, playful)
  // ==========================================
  troll: {
    game_start: [
      {
        id: 'troll_start_1',
        text: {
          en: "Hope you've warmed up. 😂",
          hi: 'उम्मीद है हाथ-पैर हिलाकर तैयार हैं! 😂',
          bn: 'আশা করি ওয়ার্ম-আপ করে তৈরি আছেন! 😂',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'troll_start_2',
        text: {
          en: 'Ready to see your pieces fly off the board? ♟️💨',
          hi: 'तैयार हैं अपने मोहरों को उड़ते देखने के लिए? ♟️💨',
          bn: 'ঘুঁটিগুলো বোর্ডের বাইরে ওড়ানোর জন্য তৈরি তো? ♟️💨',
        },
        emotionalState: 'neutral',
      },
    ],
    quiet_move: [
      {
        id: 'troll_quiet_1',
        text: {
          en: 'Bold move! Let us see how long that confidence lasts. 😏',
          hi: 'हिम्मत तो अच्छी है! देखते हैं कब तक टिकती है। 😏',
          bn: 'বেশ আত্মবিশ্বাস! দেখা যাক কতক্ষণ টেকে। 😏',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'troll_quiet_2',
        text: {
          en: 'Is that your master plan or did your mouse slip? 😂',
          hi: 'यह कोई मास्टरप्लान है या माउस फिसल गया था? 😂',
          bn: 'এটা কোনো মাস্টারপ্ল্যান নাকি হাত ফসকালো? 😂',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'troll_quiet_3',
        text: {
          en: "Interesting choice. I wouldn't have done that, but hey! 🤷‍♂️",
          hi: 'दिलचस्प फैसला! मैं तो कभी ऐसा न करता, पर आपकी मर्जी! 🤷‍♂️',
          bn: 'মজার চাল! আমি হলে তো ওটা করতাম না, তবে আপনার ইচ্ছে! 🤷‍♂️',
        },
        emotionalState: 'neutral',
      },
    ],
    capture_pawn: [
      {
        id: 'troll_pawn_1',
        text: {
          en: 'Free pawn? Do not mind if I snatch! 🍟',
          hi: 'फ्री का प्यादा? मैं तो झट से उठा लूँगा! 🍟',
          bn: 'বিনা পয়সার বোড়ে? আমি তো পট করে লুফে নেব! 🍟',
        },
        emotionalState: 'confident',
      },
    ],
    capture_piece: [
      {
        id: 'troll_cap_1',
        text: {
          en: 'Yoink! That piece lives with me now. 😈',
          hi: 'गया काम से! यह मोहरा अब मेरा है। 😈',
          bn: 'গেছে! এই ঘুঁটিটা এখন থেকে আমার বাড়িতে থাকবে। 😈',
        },
        emotionalState: 'confident',
      },
      {
        id: 'troll_cap_2',
        text: {
          en: 'Thanks for the generous donation! Tax deductible? 😂',
          hi: 'दान के लिए बहुत धन्यवाद! रसीद काटूँ क्या? 😂',
          bn: 'অপার দানের জন্য ধন্যবাদ! ট্যাক্স ছাড় পাবেন তো? 😂',
        },
        emotionalState: 'confident',
      },
    ],
    capture_queen: [
      {
        id: 'troll_queen_1',
        text: {
          en: 'The Queen left the chat! RIP! 👸💀😂',
          hi: 'रानी साहिबा खेल से बाहर! अब खेलेंगे असली गेम! 👸💀😂',
          bn: 'রানি মাঠের বাইরে আউট! এবার আসল খেলা জমবে! 👸💀😂',
        },
        emotionalState: 'confident',
      },
    ],
    ai_captured_piece: [
      {
        id: 'troll_lost_1',
        text: {
          en: 'Hey! Put that piece back, you thief! 🚨😂',
          hi: 'अरे! वो मोहरा वापस रखो, चोर कहीं के! 🚨😂',
          bn: 'এই! ঘুঁটিটা ফেরত দিন, চোর নাকি! 🚨😂',
        },
        emotionalState: 'surprised',
      },
    ],
    player_blunder: [
      {
        id: 'troll_blunder_1',
        text: {
          en: 'Oh... you really left that piece there? 😂',
          hi: 'अरे... सच में वह मोहरा वहीं छोड़ दिया? 😂',
          bn: 'আরে... ঘুঁটিটা সত্যি সত্যি ওখানে ফেলে রেখে দিলেন? 😂',
        },
        emotionalState: 'confident',
      },
      {
        id: 'troll_blunder_2',
        text: {
          en: 'Was that a sacrifice or did you close your eyes? 🙈😂',
          hi: 'यह कोई कुर्बानी थी या आँख बंद करके चाल चली? 🙈😂',
          bn: 'ওটা কি আত্মত্যাগ ছিল নাকি চোখ বন্ধ করে চাললেন? 🙈😂',
        },
        emotionalState: 'confident',
      },
    ],
    ai_blunder: [
      {
        id: 'troll_aiblunder_1',
        text: {
          en: 'That was not a blunder, that was emotional bait! 🎣😏',
          hi: 'वह गलती नहीं थी, आपको ललचाने का चारा था! 🎣😏',
          bn: 'ওটা কোনো ভুল চাল ছিল না, আপনাকে ফাঁদে ফেলার টোপ ছিল! 🎣😏',
        },
        emotionalState: 'frustrated',
      },
    ],
    check_by_ai: [
      {
        id: 'troll_check_ai_1',
        text: {
          en: 'Check. 👀',
          hi: 'चेक। नज़र रखिए राजा पर। 👀',
          bn: 'কিস্তি। চোখ রাখুন রাজার দিকে। 👀',
        },
        emotionalState: 'confident',
      },
      {
        id: 'troll_check_ai_2',
        text: {
          en: 'Knock knock! Who is in danger? Your King! 🚨😏',
          hi: 'दरवाजे पर कौन है? आपका राजा खतरे में! 🚨😏',
          bn: 'দরজায় কে কড়া নাড়ছে? আপনার বিপন্ন রাজা মশাই! 🚨😏',
        },
        emotionalState: 'confident',
      },
    ],
    check_by_player: [
      {
        id: 'troll_check_p_1',
        text: {
          en: 'Okay, okay. No need to get dramatic. 😏',
          hi: 'ठीक है, ठीक है। इतना ड्रामेटिक होने की ज़रूरत नहीं! 😏',
          bn: 'আচ্ছা আচ্ছা! এত নাটক করার কোনো দরকার নেই! 😏',
        },
        emotionalState: 'pressured',
      },
      {
        id: 'troll_check_p_2',
        text: {
          en: 'Okay! I see you. 😂',
          hi: 'अरे वाह! मैं सब देख रहा हूँ। 😂',
          bn: 'বেশ! আমি কিন্তু সব খেয়াল করছি। 😂',
        },
        emotionalState: 'pressured',
      },
    ],
    checkmate_ai_wins: [
      {
        id: 'troll_win_1',
        text: {
          en: "I'll pretend that was difficult. 😂",
          hi: 'मैं नाटक करूँगा कि यह मैच बहुत कठिन था! 😂',
          bn: 'আমি ভান করব যে ম্যাচটা খুব কঠিন ছিল! 😂',
        },
        emotionalState: 'celebrating',
      },
      {
        id: 'troll_win_2',
        text: {
          en: "I'll try not to celebrate too much. 😂",
          hi: 'मैं कोशिश करूँगा कि ज्यादा उछल-कूद न करूँ! 😂',
          bn: 'আমি চেষ্টা করব বেশি লাফালাফি না করতে! 😂',
        },
        emotionalState: 'celebrating',
      },
    ],
    checkmate_player_wins: [
      {
        id: 'troll_loss_1',
        text: {
          en: 'Okay... rematch. 😤',
          hi: 'ठीक है... री-मैच अभी का अभी! 😤',
          bn: 'আচ্ছা বেশ... রি-ম্যাচ হোক এক্ষুণি! 😤',
        },
        emotionalState: 'frustrated',
      },
      {
        id: 'troll_loss_2',
        text: {
          en: 'Wait, did your cat walk on the keyboard?! Rematch! 😹',
          hi: 'रुको, क्या कीबोर्ड पर बिल्ली चल गई थी?! एक और मैच! 😹',
          bn: 'দাঁড়ান, কিবোর্ডে কি বিড়াল হেঁটে গেছে?! আরেকটা ম্যাচ চাই! 😹',
        },
        emotionalState: 'frustrated',
      },
    ],
    draw: [
      {
        id: 'troll_draw_1',
        text: {
          en: 'Draw? You got lucky this time! 😏',
          hi: 'ड्रॉ? इस बार आपकी किस्मत अच्छी थी! 😏',
          bn: 'ড্র? এবারের মতো আপনার কপাল ভালো ছিল! 😏',
        },
        emotionalState: 'neutral',
      },
    ],
    castling: [
      {
        id: 'troll_castle_1',
        text: {
          en: 'Running away to your bunker already? Coward! 🏰😂',
          hi: 'इतनी जल्दी किले में छिपने चले गए? 🏰😂',
          bn: 'এত তাড়াতাড়ি দুর্গে গিয়ে লুকিয়ে পড়লেন? 🏰😂',
        },
        emotionalState: 'neutral',
      },
    ],
    promotion: [
      {
        id: 'troll_promo_1',
        text: {
          en: 'Wait, that is illegal! Oh wait, pawns can do that... 💀👑',
          hi: 'रुको, यह गैरकानूनी है! अरे हाँ, प्यादा तो रानी बन ही सकता है... 💀👑',
          bn: 'দাঁড়ান, এটা বেআইনি! ও আচ্ছা, বোড়ে তো রানি হতেই পারে... 💀👑',
        },
        emotionalState: 'celebrating',
      },
    ],
  },

  // ==========================================
  // 4. 😤 COMPETITIVE BOT (Confident, energetic, competitive)
  // ==========================================
  competitive: {
    game_start: [
      {
        id: 'comp_start_1',
        text: {
          en: "Let's make this interesting. 🔥",
          hi: 'चलिए इस मैच को दिलचस्प बनाते हैं! 🔥',
          bn: 'চলুন এই ম্যাচটাকে জমজমাট করে তোলা যাক! 🔥',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'comp_start_2',
        text: {
          en: 'Game on! Bring your highest rating. ⚡',
          hi: 'खेल शुरू! अपना सर्वश्रेष्ठ खेल दिखाइए। ⚡',
          bn: 'খেলা শুরু! আপনার সেরা খেলাটা দেখতে চাই। ⚡',
        },
        emotionalState: 'neutral',
      },
    ],
    quiet_move: [
      {
        id: 'comp_quiet_1',
        text: {
          en: "Now we're playing. ⚔️",
          hi: 'अब आया असली खेल का मज़ा! ⚔️',
          bn: 'এবার খেলাটা সত্যি জমে উঠেছে! ⚔️',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'comp_quiet_2',
        text: {
          en: "You won't get that chance twice. 🎯",
          hi: 'यह मौका आपको दोबारा नहीं मिलेगा। 🎯',
          bn: 'এই সুযোগ কিন্তু দ্বিতীয়বার পাবেন না। 🎯',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'comp_quiet_3',
        text: {
          en: 'I see your idea. Mine is faster. ⚡',
          hi: 'आपकी चाल समझ गया, पर मेरी योजना ज्यादा तेज़ है। ⚡',
          bn: 'আপনার চাল ধরে ফেলেছি, তবে আমার পরিকল্পনা আরও দ্রুত। ⚡',
        },
        emotionalState: 'confident',
      },
    ],
    capture_pawn: [
      {
        id: 'comp_pawn_1',
        text: {
          en: 'Small advantages win games.',
          hi: 'छोटे-छोटे फायदे ही मैच जिताते हैं।',
          bn: 'ছোট ছোট সুবিধাই ম্যাচ জেতায়।',
        },
        emotionalState: 'confident',
      },
    ],
    capture_piece: [
      {
        id: 'comp_cap_1',
        text: {
          en: 'Tempo and material. Point for me. 💥',
          hi: 'समय और मोहरा दोनों मेरे पक्ष में। 💥',
          bn: 'গতি এবং ঘুঁটি দুটোই আমার পক্ষে। 💥',
        },
        emotionalState: 'confident',
      },
      {
        id: 'comp_cap_2',
        text: {
          en: 'Pressure converts into pieces. Keep up! 🔥',
          hi: 'दबाव अब मोहरों में बदल रहा है। संभालिए! 🔥',
          bn: 'চাপের মুখে ঘুঁটি খসে পড়ছে। সামলান এবার! 🔥',
        },
        emotionalState: 'confident',
      },
    ],
    capture_queen: [
      {
        id: 'comp_queen_1',
        text: {
          en: 'The crown falls! Now the board belongs to me. 👑💥',
          hi: 'रानी गिर गई! अब पूरा बोर्ड मेरे कब्जे में है। 👑💥',
          bn: 'রানির পতন হলো! এবার পুরো বোর্ডের দখল আমার। 👑💥',
        },
        emotionalState: 'confident',
      },
    ],
    ai_captured_piece: [
      {
        id: 'comp_lost_1',
        text: {
          en: 'You struck first there. But the counterattack is coming. ⚔️',
          hi: 'पहला वार आपका था, लेकिन मेरा पलटवार तैयार है। ⚔️',
          bn: 'প্রথম আঘাতটা আপনার ছিল, তবে আমার পাল্টা আক্রমণ ধেয়ে আসছে। ⚔️',
        },
        emotionalState: 'pressured',
      },
    ],
    player_blunder: [
      {
        id: 'comp_blunder_1',
        text: {
          en: 'Fatal inaccuracy. I am punishing that immediately. ⚡',
          hi: 'बड़ी गलती। इसकी सजा तुरंत मिलेगी। ⚡',
          bn: 'মারাত্মক ভুল। এর শাস্তি সাথে সাথে পাবেন। ⚡',
        },
        emotionalState: 'confident',
      },
    ],
    ai_blunder: [
      {
        id: 'comp_aiblunder_1',
        text: {
          en: 'Unacceptable mistake on my part. Refocusing now! 😤',
          hi: 'मेरी तरफ से अस्वीकार्य गलती। अब और भी गंभीरता से खेलूँगा! 😤',
          bn: 'আমার দিক থেকে ক্ষমার অযোগ্য ভুল। এবার আরও কড়া খেলা হবে! 😤',
        },
        emotionalState: 'frustrated',
      },
    ],
    check_by_ai: [
      {
        id: 'comp_check_ai_1',
        text: {
          en: 'Check. ⚔️',
          hi: 'चेक। ⚔️',
          bn: 'কিস্তি। ⚔️',
        },
        emotionalState: 'confident',
      },
      {
        id: 'comp_check_ai_2',
        text: {
          en: 'Check! The offensive accelerates. 💥',
          hi: 'चेक! अब हमला और तेज होगा। 💥',
          bn: 'কিস্তি! এবার আক্রমণের তেজ আরও বাড়বে। 💥',
        },
        emotionalState: 'confident',
      },
    ],
    check_by_player: [
      {
        id: 'comp_check_p_1',
        text: {
          en: "Nice. But we're not done. 🥊",
          hi: 'बढ़िया चाल। पर मुकाबला अभी बाकी है। 🥊',
          bn: 'বেশ ভালো চাল। কিন্তু লড়াই এখনো শেষ হয়নি। 🥊',
        },
        emotionalState: 'pressured',
      },
      {
        id: 'comp_check_p_2',
        text: {
          en: 'Solid strike. Now feel my response. 🔥',
          hi: 'मजबूत वार। अब मेरा पलटवार देखिए। 🔥',
          bn: 'শক্তিশালী আঘাত। এবার আমার জবাব দেখুন। 🔥',
        },
        emotionalState: 'pressured',
      },
    ],
    checkmate_ai_wins: [
      {
        id: 'comp_win_1',
        text: {
          en: "That's one for me. 🏆",
          hi: 'यह जीत मेरे नाम दर्ज हुई। 🏆',
          bn: 'এই জয়টা আমার খাতায় উঠল। 🏆',
        },
        emotionalState: 'celebrating',
      },
      {
        id: 'comp_win_2',
        text: {
          en: 'Hard-fought victory. That is how champions close games. 🥇',
          hi: 'कड़ी मेहनत की जीत। चैम्पियन ऐसे ही मैच खत्म करते हैं। 🥇',
          bn: 'কঠিন লড়াইয়ের জয়। চ্যাম্পিয়নরা ঠিক এভাবেই ম্যাচ শেষ করে। 🥇',
        },
        emotionalState: 'celebrating',
      },
    ],
    checkmate_player_wins: [
      {
        id: 'comp_loss_1',
        text: {
          en: 'I want a rematch. 😤',
          hi: 'मुझे तुरंत री-मैच चाहिए। 😤',
          bn: 'আমি এখনই রি-ম্যাচ চাই। 😤',
        },
        emotionalState: 'frustrated',
      },
      {
        id: 'comp_loss_2',
        text: {
          en: "Rematch. I'm not accepting that result. 😤",
          hi: 'री-मैच! मैं इस नतीजे को ऐसे नहीं छोड़ूँगा। 😤',
          bn: 'রি-ম্যাচ চাই! আমি এই ফলাফল সহজে মানব না। 😤',
        },
        emotionalState: 'frustrated',
      },
    ],
    draw: [
      {
        id: 'comp_draw_1',
        text: {
          en: 'Draw. We settle this in game two. 🤝⚡',
          hi: 'ड्रॉ। इसका फैसला अगले मैच में होगा। 🤝⚡',
          bn: 'ড্র। পরের ম্যাচে এর ফয়সালা হবে। 🤝⚡',
        },
        emotionalState: 'neutral',
      },
    ],
    castling: [
      {
        id: 'comp_castle_1',
        text: {
          en: 'King fortified. Preparing the attack. 🛡️⚔️',
          hi: 'राजा सुरक्षित। अब हमले की तैयारी। 🛡️⚔️',
          bn: 'রাজা সুরক্ষিত। এবার আক্রমণের প্রস্তুতি। 🛡️⚔️',
        },
        emotionalState: 'confident',
      },
    ],
    promotion: [
      {
        id: 'comp_promo_1',
        text: {
          en: 'Promotion secured! Maximum firepower on the board. 🚀',
          hi: 'पदोन्नति सफल! अब बोर्ड पर पूरी ताकत के साथ हमला होगा। 🚀',
          bn: 'পদোন্নতি সম্পন্ন! এবার বোর্ডে সর্বোচ্চ শক্তির আক্রমণ হবে। 🚀',
        },
        emotionalState: 'celebrating',
      },
    ],
  },

  // ==========================================
  // 5. 👑 GRANDMASTER (Elegant, minimal, composed)
  // ==========================================
  grandmaster: {
    game_start: [
      {
        id: 'gm_start_1',
        text: {
          en: 'Good luck. 👑',
          hi: 'शुभकामनाएं। 👑',
          bn: 'শুভকামনা রইল। 👑',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'gm_start_2',
        text: {
          en: 'A pleasure. Let us play.',
          hi: 'आपसे खेलकर खुशी होगी। खेल शुरू करते हैं।',
          bn: 'আপনার সাথে খেলতে পেরে আনন্দিত। খেলা শুরু হোক।',
        },
        emotionalState: 'neutral',
      },
    ],
    quiet_move: [
      {
        id: 'gm_quiet_1',
        text: {
          en: 'Precise.',
          hi: 'सटीक चाल।',
          bn: 'অত্যন্ত নিখুঁত।',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'gm_quiet_2',
        text: {
          en: 'That was a strong decision.',
          hi: 'यह एक मजबूत और सूझबूझ भरा फैसला था।',
          bn: 'এটি একটি অত্যন্ত শক্তিশালী সিদ্ধান্ত।',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'gm_quiet_3',
        text: {
          en: 'Classical.',
          hi: 'पारंपरिक और सुंदर।',
          bn: 'চিরাচরিত ও মার্জিত।',
        },
        emotionalState: 'neutral',
      },
    ],
    capture_piece: [
      {
        id: 'gm_cap_1',
        text: {
          en: 'An advantageous trade.',
          hi: 'एक लाभदायक विनिमय।',
          bn: 'একটি সুবিধাজনক আদানপ্রদান।',
        },
        emotionalState: 'confident',
      },
    ],
    capture_queen: [
      {
        id: 'gm_queen_1',
        text: {
          en: 'Decisive simplification.',
          hi: 'निर्णायक सरलीकरण।',
          bn: 'নির্ণায়ক সহজীকরণ।',
        },
        emotionalState: 'confident',
      },
    ],
    player_blunder: [
      {
        id: 'gm_blunder_1',
        text: {
          en: 'An inaccuracy in calculation.',
          hi: 'गणना में एक त्रुटि।',
          bn: 'হিসেবে একটি সূক্ষ্ম ভুল।',
        },
        emotionalState: 'confident',
      },
    ],
    ai_blunder: [
      {
        id: 'gm_aiblunder_1',
        text: {
          en: 'An uncharacteristic mistake.',
          hi: 'एक अप्रत्याशित भूल।',
          bn: 'একটি অপ্রত্যাশিত ভুল।',
        },
        emotionalState: 'surprised',
      },
    ],
    check_by_ai: [
      {
        id: 'gm_check_ai_1',
        text: {
          en: 'Check.',
          hi: 'चेक।',
          bn: 'কিস্তি।',
        },
        emotionalState: 'confident',
      },
    ],
    check_by_player: [
      {
        id: 'gm_check_p_1',
        text: {
          en: 'Well played.',
          hi: 'शानदार खेल।',
          bn: 'চমৎকার।',
        },
        emotionalState: 'pressured',
      },
    ],
    checkmate_ai_wins: [
      {
        id: 'gm_win_1',
        text: {
          en: 'Good game.',
          hi: 'शानदार खेल रहा।',
          bn: 'চমৎকার খেলা হলো।',
        },
        emotionalState: 'celebrating',
      },
      {
        id: 'gm_win_2',
        text: {
          en: 'Thank you for the game.',
          hi: 'इस सुंदर मुकाबले के लिए धन्यवाद।',
          bn: 'সুন্দর এই খেলার জন্য ধন্যবাদ।',
        },
        emotionalState: 'celebrating',
      },
    ],
    checkmate_player_wins: [
      {
        id: 'gm_loss_1',
        text: {
          en: 'Well played.',
          hi: 'शानदार खेल। बधाई।',
          bn: 'অসাধারণ খেলেছেন। অভিনন্দন।',
        },
        emotionalState: 'neutral',
      },
      {
        id: 'gm_loss_2',
        text: {
          en: 'Magnificent technique. You earned that win.',
          hi: 'शानदार तकनीक। आप इस जीत के हकदार हैं।',
          bn: 'অনবদ্য নৈপুণ্য। এই জয় আপনার প্রাপ্য।',
        },
        emotionalState: 'neutral',
      },
    ],
    draw: [
      {
        id: 'gm_draw_1',
        text: {
          en: 'A worthy draw.',
          hi: 'एक सराहनीय ड्रॉ।',
          bn: 'একটি প্রশংসনীয় ড্র।',
        },
        emotionalState: 'neutral',
      },
    ],
    castling: [
      {
        id: 'gm_castle_1',
        text: {
          en: 'Flawless harmony.',
          hi: 'उत्कृष्ट संतुलन।',
          bn: 'নিখুঁত ভারসাম্য।',
        },
        emotionalState: 'neutral',
      },
    ],
    promotion: [
      {
        id: 'gm_promo_1',
        text: {
          en: 'The breakthrough is complete.',
          hi: 'मोहरे की सफलता पूरी हुई।',
          bn: 'সাফল্য নিশ্চিত হলো।',
        },
        emotionalState: 'celebrating',
      },
    ],
  },
};
