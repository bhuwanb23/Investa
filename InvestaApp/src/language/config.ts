export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

export const translations = {
  en: {
    // Profile Screen
    profile: 'Profile',
    loadingProfile: 'Loading profile...',
    pleaseLogin: 'Please log in to view your profile',
    goToLogin: 'Go to Login',
    retry: 'Retry',
    
    // Profile Header
    level: 'Level',
    xp: 'XP',
    
    // Personal Details
    personalDetails: 'Personal Details',
    edit: 'Edit',
    email: 'Email',
    phone: 'Phone',
    language: 'Language',
    learningGoal: 'Learning Goal',
    notSet: 'Not set',
    
    // Learning Progress
    learningProgress: 'Learning Progress',
    modulesCompleted: 'Modules Completed',
    hoursLearned: 'Hours Learned',
    certificates: 'Certificates',
    modulesCompletedText: 'modules completed',
    
    // Quiz Performance
    quizPerformance: 'Quiz Performance',
    averageScore: 'Average Score',
    quizzesTaken: 'Quizzes Taken',
    passed: 'Passed',
    badgesEarned: 'Badges Earned',
    
    // Trading Performance
    tradingPerformance: 'Trading Performance',
    portfolioGrowth: 'Portfolio Growth',
    tradesExecuted: 'Trades Executed',
    successRate: 'Success Rate',
    
    // Settings
    settings: 'Settings',
    notifications: 'Notifications',
    privacy: 'Privacy',
    security: 'Security',
    twoFactorAuth: 'Two-Factor Auth',
    
    // Actions
    updateProfile: 'Update Profile',
    resetPassword: 'Reset Password',
    logout: 'Logout',
    
    // Language Selector
    selectLanguage: 'Select Language',
  },
  hi: {
    // Profile Screen
    profile: 'प्रोफ़ाइल',
    loadingProfile: 'प्रोफ़ाइल लोड हो रहा है...',
    pleaseLogin: 'अपनी प्रोफ़ाइल देखने के लिए कृपया लॉग इन करें',
    goToLogin: 'लॉग इन पर जाएं',
    retry: 'पुनः प्रयास करें',
    
    // Profile Header
    level: 'स्तर',
    xp: 'एक्सपी',
    
    // Personal Details
    personalDetails: 'व्यक्तिगत विवरण',
    edit: 'संपादित करें',
    email: 'ईमेल',
    phone: 'फोन',
    language: 'भाषा',
    learningGoal: 'सीखने का लक्ष्य',
    notSet: 'सेट नहीं',
    
    // Learning Progress
    learningProgress: 'सीखने की प्रगति',
    modulesCompleted: 'मॉड्यूल पूरे',
    hoursLearned: 'घंटे सीखे',
    certificates: 'प्रमाणपत्र',
    modulesCompletedText: 'मॉड्यूल पूरे',
    
    // Quiz Performance
    quizPerformance: 'क्विज़ प्रदर्शन',
    averageScore: 'औसत स्कोर',
    quizzesTaken: 'क्विज़ लिए गए',
    passed: 'पास',
    badgesEarned: 'बैज अर्जित',
    
    // Trading Performance
    tradingPerformance: 'ट्रेडिंग प्रदर्शन',
    portfolioGrowth: 'पोर्टफोलियो वृद्धि',
    tradesExecuted: 'ट्रेड निष्पादित',
    successRate: 'सफलता दर',
    
    // Settings
    settings: 'सेटिंग्स',
    notifications: 'सूचनाएं',
    privacy: 'गोपनीयता',
    security: 'सुरक्षा',
    twoFactorAuth: 'दो-कारक प्रमाणीकरण',
    
    // Actions
    updateProfile: 'प्रोफ़ाइल अपडेट करें',
    resetPassword: 'पासवर्ड रीसेट करें',
    logout: 'लॉग आउट',
    
    // Language Selector
    selectLanguage: 'भाषा चुनें',
  },
  ta: {
    // Profile Screen
    profile: 'சுயவிவரம்',
    loadingProfile: 'சுயவிவரம் ஏற்றப்படுகிறது...',
    pleaseLogin: 'உங்கள் சுயவிவரத்தைப் பார்க்க தயவுசெய்து உள்நுழையவும்',
    goToLogin: 'உள்நுழைவுக்குச் செல்லவும்',
    retry: 'மீண்டும் முயற்சிக்கவும்',
    
    // Profile Header
    level: 'நிலை',
    xp: 'எக்ஸ்பி',
    
    // Personal Details
    personalDetails: 'தனிப்பட்ட விவரங்கள்',
    edit: 'திருத்தவும்',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி',
    language: 'மொழி',
    learningGoal: 'கற்றல் இலக்கு',
    notSet: 'அமைக்கப்படவில்லை',
    
    // Learning Progress
    learningProgress: 'கற்றல் முன்னேற்றம்',
    modulesCompleted: 'முடிக்கப்பட்ட தொகுதிகள்',
    hoursLearned: 'கற்ற மணிநேரங்கள்',
    certificates: 'சான்றிதழ்கள்',
    modulesCompletedText: 'தொகுதிகள் முடிக்கப்பட்டன',
    
    // Quiz Performance
    quizPerformance: 'வினாடி வினா செயல்திறன்',
    averageScore: 'சராசரி மதிப்பெண்',
    quizzesTaken: 'எடுக்கப்பட்ட வினாடி வினாக்கள்',
    passed: 'தேர்ச்சி',
    badgesEarned: 'பெறப்பட்ட பேட்ஜ்கள்',
    
    // Trading Performance
    tradingPerformance: 'வர்த்தக செயல்திறன்',
    portfolioGrowth: 'போர்ட்ஃபோலியோ வளர்ச்சி',
    tradesExecuted: 'நிறைவேற்றப்பட்ட வர்த்தகங்கள்',
    successRate: 'வெற்றி விகிதம்',
    
    // Settings
    settings: 'அமைப்புகள்',
    notifications: 'அறிவிப்புகள்',
    privacy: 'தனியுரிமை',
    security: 'பாதுகாப்பு',
    twoFactorAuth: 'இரண்டு காரணி அங்கீகாரம்',
    
    // Actions
    updateProfile: 'சுயவிவரத்தை புதுப்பிக்கவும்',
    resetPassword: 'கடவுச்சொல்லை மீட்டமைக்கவும்',
    logout: 'வெளியேறவும்',
    
    // Language Selector
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
  },
  te: {
    // Profile Screen
    profile: 'ప్రొఫైల్',
    loadingProfile: 'ప్రొఫైల్ లోడ్ అవుతోంది...',
    pleaseLogin: 'మీ ప్రొఫైల్‌ను చూడటానికి దయచేసి లాగిన్ చేయండి',
    goToLogin: 'లాగిన్‌కు వెళ్ళండి',
    retry: 'మళ్లీ ప్రయత్నించండి',
    
    // Profile Header
    level: 'స్థాయి',
    xp: 'ఎక్స్‌పి',
    
    // Personal Details
    personalDetails: 'వ్యక్తిగత వివరాలు',
    edit: 'సవరించండి',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్',
    language: 'భాష',
    learningGoal: 'నేర్చుకునే లక్ష్యం',
    notSet: 'సెట్ చేయబడలేదు',
    
    // Learning Progress
    learningProgress: 'నేర్చుకునే పురోగతి',
    modulesCompleted: 'పూర్తయిన మాడ్యూల్‌లు',
    hoursLearned: 'నేర్చుకున్న గంటలు',
    certificates: 'సర్టిఫికేట్‌లు',
    modulesCompletedText: 'మాడ్యూల్‌లు పూర్తయ్యాయి',
    
    // Quiz Performance
    quizPerformance: 'క్విజ్ పనితీరు',
    averageScore: 'సగటు స్కోర్',
    quizzesTaken: 'తీసుకున్న క్విజ్‌లు',
    passed: 'పాస్',
    badgesEarned: 'సంపాదించిన బ్యాడ్జ్‌లు',
    
    // Trading Performance
    tradingPerformance: 'ట్రేడింగ్ పనితీరు',
    portfolioGrowth: 'పోర్ట్‌ఫోలియో వృద్ధి',
    tradesExecuted: 'అమలు చేయబడిన ట్రేడ్‌లు',
    successRate: 'విజయ రేటు',
    
    // Settings
    settings: 'సెట్టింగ్‌లు',
    notifications: 'నోటిఫికేషన్‌లు',
    privacy: 'గోప్యత',
    security: 'భద్రత',
    twoFactorAuth: 'రెండు కారక ప్రమాణీకరణ',
    
    // Actions
    updateProfile: 'ప్రొఫైల్‌ను నవీకరించండి',
    resetPassword: 'పాస్‌వర్డ్‌ను రీసెట్ చేయండి',
    logout: 'లాగ్ అవుట్',
    
    // Language Selector
    selectLanguage: 'భాషను ఎంచుకోండి',
  },
};

export type TranslationKey = keyof typeof translations.en;
