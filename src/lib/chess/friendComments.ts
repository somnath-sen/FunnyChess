export type FriendGameEvent =
  | 'game_start'
  | 'you_give_check'
  | 'friend_gives_check'
  | 'you_capture_piece'
  | 'friend_captures_piece'
  | 'you_capture_queen'
  | 'friend_captures_queen'
  | 'checkmate_you_win'
  | 'checkmate_friend_wins'
  | 'draw'
  | 'resigned';

interface CommentDictionary {
  en: string[];
  hi: string[];
  bn: string[];
}

const FRIEND_COMMENTS: Record<FriendGameEvent, CommentDictionary> = {
  game_start: {
    en: [
      'Game on! May the best chess brain win! ♟️',
      'Two friends enter, only one king stands! 👑',
      'Remember: no kicking each other under the virtual table! 😂',
    ],
    hi: [
      'खेल शुरू! देखते हैं आज किसकी चाल भारी पड़ती है! ♟️',
      'दोस्ती अपनी जगह, शतरंज अपनी जगह! चलिए शुरू करते हैं! 👑',
    ],
    bn: [
      'খেলা শুরু! দেখা যাক কার বুদ্ধি বেশি ক্ষুরধার! ♟️',
      'বন্ধুত্ব তো থাকবেই, কিন্তু দাবার বোর্ডে কোনো ছাড় নয়! 👑',
    ],
  },
  you_give_check: {
    en: [
      '🔥 CHECK! Your friend has some serious explaining to do.',
      'Check! Put your friend in the hot seat! 🚨',
      'Check! Watch your friend sweat through the screen! 😏',
    ],
    hi: [
      '🔥 चेक! आपके दोस्त का राजा अब भारी संकट में है!',
      'चेक! अब आपके दोस्त को संभलकर सोचना पड़ेगा! 😏',
    ],
    bn: [
      '🔥 কিস্তি! এবার আপনার বন্ধু বিপদে পড়েছে, ভেবে চাল দিতে হবে!',
      'কিস্তি! বন্ধু মশাইয়ের কপালে এবার চিন্তার ভাঁজ! 😏',
    ],
  },
  friend_gives_check: {
    en: [
      '😳 Uh oh... your friend is attacking! Get your king to safety!',
      'Check! Your friend is not holding back! 🛡️',
      'Danger! Your friend’s pieces are knocking on your door! 🚪',
    ],
    hi: [
      '😳 अरे! आपके दोस्त ने चेक दे दिया! राजा को तुरंत बचाइए!',
      'खतरा! आपके दोस्त की चाल काफी आक्रामक है! 🛡️',
    ],
    bn: [
      '😳 ওরেব্বাস! আপনার বন্ধু কিস্তি দিয়েছে! রাজাকে সুরক্ষিত স্থানে নিয়ে যান!',
      'বিপদ! আপনার বন্ধু বেশ আক্রমণাত্মক খেলছে! 🛡️',
    ],
  },
  you_capture_piece: {
    en: [
      '😈 Nice! Your friend probably wasn’t expecting that!',
      'Boom! Free piece snatched from your friend! 💥',
      'Chomp! One less piece for your buddy! 😋',
    ],
    hi: [
      '😈 बहुत खूब! आपके दोस्त को इस झटके की उम्मीद नहीं थी! 💥',
      'एक और मोहरा साफ! आपकी स्थिति मजबूत हो रही है! 😋',
    ],
    bn: [
      '😈 দারুণ! আপনার বন্ধু বোধহয় এই চালটা আন্দাজ করতে পারেনি! 💥',
      'আরেকটা ঘুঁটি গায়েব! আপনার পাল্লা এখন ভারী! 😋',
    ],
  },
  friend_captures_piece: {
    en: [
      '😂 Ouch. Your friend just stole that piece from you.',
      'Hey! Tell your friend that piece had a family! 😭',
      'Oof! That piece had to hurt! Stay focused! 🥊',
    ],
    hi: [
      '😂 अरे रे! आपके दोस्त ने आपका मोहरा हथिया लिया!',
      'सावधानी! आपके दोस्त की नजर आपके मोहरों पर है! 🥊',
    ],
    bn: [
      '😂 ওফ! আপনার বন্ধু আপনার ঘুঁটিটা তুলে নিল!',
      'সাবধান! আপনার বন্ধু কিন্তু সুযোগ পেলেই ঘুঁটি কাটছে! 🥊',
    ],
  },
  you_capture_queen: {
    en: [
      '👑 MASSIVE! You took down your friend’s Queen! 👸💥',
      'The Queen has left the board! Your friend is crying inside! 😂',
    ],
    hi: [
      '👑 जबरदस्त! आपने अपने दोस्त की रानी मार गिराई! 👸💥',
      'रानी चली गई! अब आपके दोस्त की हार लगभग तय है! 😂',
    ],
    bn: [
      '👑 বিশাল কান্ড! আপনি আপনার বন্ধুর রানি কেটে দিলেন! 👸💥',
      'রানি খতম! আপনার বন্ধুর মাথায় এবার হাত! 😂',
    ],
  },
  friend_captures_queen: {
    en: [
      '💀 NOOO! Your Queen got captured by your friend! Time for a heroic comeback!',
      'Ouch! Losing your Queen to your friend is painful! Don’t give up!',
    ],
    hi: [
      '💀 नहीं! आपकी रानी चली गई! अब चमत्कार ही बचा सकता है!',
      'भारी नुकसान! हिम्मत मत हारिए, वापसी की कोशिश कीजिए!',
    ],
    bn: [
      '💀 ওরে না! আপনার রানি চলে গেল! এবার ঘুরে দাঁড়ানোর লড়াই!',
      'বড় ক্ষতি হয়ে গেল! তবে হাল ছাড়বেন না!',
    ],
  },
  checkmate_you_win: {
    en: [
      '👑 CHECKMATE! You won! Friendship temporarily suspended! 😂🏆',
      'Victory is yours! Time to brag to your friend for a whole week! 🎉',
      'Checkmate! Brilliant tactical victory over your buddy! 🔥',
    ],
    hi: [
      '👑 चेकमेट! आप जीत गए! अब अपने दोस्त को चिढ़ाने का पूरा हक है! 😂🏆',
      'शानदार जीत! क्या कमाल का मुकाबला जीता आपने! 🎉',
    ],
    bn: [
      '👑 কিস্তিমাত! আপনি জিতে গেছেন! এবার বন্ধুকে খোঁচা দেওয়ার পালা! 😂🏆',
      'অসাধারণ জয়! বন্ধুকে ৬৪ খোপের খেলায় মাত করে দিলেন! 🎉',
    ],
  },
  checkmate_friend_wins: {
    en: [
      '😭 The friend delivered checkmate! Good game! Ready for revenge? 🔁',
      'Your friend took the crown this time! Demand an immediate rematch! ⚔️',
    ],
    hi: [
      '😭 आपके दोस्त ने चेकमेट कर दिया! कोई बात नहीं, तुरंत बदला लीजिए! 🔁',
      'इस बार आपका दोस्त बाजी मार ले गया! एक और मैच तो बनता है! ⚔️',
    ],
    bn: [
      '😭 বন্ধু মশাই কিস্তিমাত করে দিল! দারুণ খেলা হয়েছে, এবার রি-ম্যাচ চাই! 🔁',
      'এ যাত্রায় বন্ধু জিতে গেল! একটা বদলার ম্যাচ হয়ে যাক! ⚔️',
    ],
  },
  draw: {
    en: [
      '🤝 Nobody wins, nobody loses. True friendship prevails! ♟️',
      'Draw game! Perfectly balanced, as all friendly matches should be.',
    ],
    hi: [
      '🤝 बराबरी पर मुकाबला खत्म! सच्ची दोस्ती की जीत! ♟️',
    ],
    bn: [
      '🤝 খেলা ড্র! কারও হার নেই, কারও জিত নেই! খাঁটি বন্ধুত্ব! ♟️',
    ],
  },
  resigned: {
    en: [
      '🏳️ White flag waved! The battle has concluded.',
    ],
    hi: [
      '🏳️ आत्मसमर्पण! मुकाबला समाप्त हुआ।',
    ],
    bn: [
      '🏳️ হার স্বীকার করা হলো! খেলা সমাপ্ত।',
    ],
  },
};

export function getFriendComment(
  event: FriendGameEvent,
  lang: 'en' | 'hi' | 'bn' = 'en'
): string {
  const eventPool = FRIEND_COMMENTS[event] || FRIEND_COMMENTS.game_start;
  const langPool = eventPool[lang] || eventPool.en || [];

  if (langPool.length === 0) return '♟️';
  const randomIndex = Math.floor(Math.random() * langPool.length);
  return langPool[randomIndex];
}
