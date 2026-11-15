import fs from 'fs';

let content = fs.readFileSync('src/data/destinationData.ts', 'utf8');

// 1. Soften Hunza claims
content = content.replace(
  `With exceptionally high literacy rates and exemplary mountain hospitality, Hunza consistently ranks as one of Pakistan's safest and most rewarding travel destinations for families, couples, and solo travelers alike.`,
  `Known for strong community traditions, high educational value, and welcoming mountain hospitality, Hunza is widely regarded by travelers as an exceptionally hospitable and rewarding valley destination for families, couples, and solo travelers alike.`
);

content = content.replace(
  `a: "Yes. Hunza is widely recognized as one of the safest regions in South Asia, characterized by high literacy, progressive community culture, and welcoming hospitality."`,
  `a: "Yes. Hunza has a well-established reputation for community hospitality, low crime, and welcoming attitudes toward travelers, making it popular for family and solo travelers. Standard travel vigilance and mountain road precautions are always advised."`
);

// 2. Soften Skardu claims
content = content.replace(
  `direct commercial flights operate from Islamabad, Lahore, and Karachi.`,
  `direct commercial flights operate from Islamabad, with seasonal flights occasionally scheduled from Lahore and Karachi during peak summer months.`
);

content = content.replace(
  `Direct commercial flights operate from Islamabad, and seasonally from Lahore and Karachi, to Skardu International Airport. All flights operate strictly under Visual Flight Rules (VFR) and are weather-dependent.`,
  `Commercial flights operate between Islamabad and Skardu International Airport (with occasional seasonal summer flights from Lahore or Karachi). All flights operate strictly under Visual Flight Rules (VFR) and are weather-dependent.`
);

// 3. Ensure Khaplu Palace historical accuracy
content = content.replace(
  `The 400-year-old Shigar Fort (Fong-Khar) and 19th-century Khaplu Palace have been restored into heritage accommodations`,
  `The historic Shigar Fort (Fong-Khar, dating back to the 17th century) and Khaplu Palace (Yabgo Khar, constructed in 1840) have been carefully restored into heritage accommodations`
);

fs.writeFileSync('src/data/destinationData.ts', content);
console.log('Successfully updated destinationData.ts claims');
