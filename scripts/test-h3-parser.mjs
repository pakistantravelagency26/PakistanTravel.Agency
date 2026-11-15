import { parseStructuredDescription } from '../src/lib/structuredDescription.ts';

const sample = `8-Day Autumn Classic Hunza & Attabad Lake Tour
Experience stunning autumn colors in the Karakoram.

📍 Tour Journey & Sightseeing Route:
Islamabad ➔ Besham ➔ Chilas ➔ Karimabad ➔ Attabad Lake

🚐 Departure & Pickup Meeting Points:
1. Daewoo Express Terminal at 06:00 AM
2. Rawalpindi Saddar at 06:30 AM

📅 Day-by-Day Itinerary:
• Day 1: Islamabad to Besham via KKH
• Day 2: Besham to Karimabad past Rakaposhi Viewpoint

⚠️ Seasonal Mountain Route Notice:
Babusar Pass is closed in winter. All transit operates via KKH.

🛂 Identification & Permits:
Pakistani citizens must carry original valid CNIC.`;

const parsed = parseStructuredDescription(sample);
console.log(JSON.stringify(parsed, null, 2));
