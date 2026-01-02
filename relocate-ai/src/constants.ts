import { Camera, Briefcase, GraduationCap, Heart, Home } from 'lucide-react';
import type { KnowledgeBase, PurposeIcons } from './types';

export const knowledgeBase: KnowledgeBase = {
  UAE: {
    visa_requirements: {
      source: "UAE Federal Authority for Identity and Citizenship",
      content: `Visa on Arrival available for Nigerian passport holders. Valid for 14 days, extendable once for 14 days. Requirements: Passport valid 6+ months, confirmed return ticket, proof of accommodation, minimum AED 3,000 or equivalent. Cost: AED 100 service charge.`,
      confidence: "high",
      url: "https://icp.gov.ae",
      lastUpdated: "Dec 2024"
    },
    airport_procedures: {
      source: "Dubai Airports Authority",
      content: `Dubai International Airport (DXB) Terminal 3 serves most international flights. Immigration process: Biometric scan required. Average wait time 30-60 minutes. AVOID unofficial visa assistants - only use official counters. Free WiFi available.`,
      confidence: "high",
      scam_warning: "COMMON SCAM: Unofficial 'helpers' offering visa assistance for cash. Use only official immigration counters."
    },
    transport: {
      source: "Dubai RTA",
      content: `From DXB Airport: Dubai Metro Red Line (AED 5-15), Dubai Taxi (AED 50-100 to city center), Uber/Careem available. AVOID: Unlicensed taxis outside terminal. Use only RTA-licensed vehicles with visible meters.`,
      confidence: "high"
    },
    costs: {
      accommodation: { budget: "$30-50/night", mid: "$80-150/night", luxury: "$200+/night" },
      food: { budget: "$15-25/day", mid: "$40-60/day", luxury: "$100+/day" },
      transport: { monthly_pass: "$55", taxi_avg: "$10-15/trip" },
      total_estimate: { budget: "$1500-2000/month", mid: "$3000-4000/month", luxury: "$6000+/month" }
    },
    first_72_hours: {
      source: "UAE Government Portal",
      content: `Register address with local police within 30 days (for residents). Get local SIM (Etisalat/Du) - bring passport. Open bank account requires residence visa. Emergency: 999 police, 998 ambulance, 997 fire.`,
      confidence: "high"
    },
    legal_cultural: {
      source: "UAE Ministry of Justice",
      content: `Zero tolerance for drugs. Public displays of affection restricted. Dress modestly in public. Alcohol only in licensed venues. Ramadan observance required (no eating/drinking in public during fasting hours). Photography of government buildings prohibited.`,
      confidence: "high"
    },
    risk_factors: {
      scam_risk: "Medium",
      legal_risk: "Medium-High",
      health_risk: "Low",
      transport_risk: "Low",
      overall: "Medium"
    }
  },
  USA: {
    visa_requirements: {
      source: "US Department of State",
      content: `B1/B2 tourist visa required for Nigerian passport holders. Apply at US Embassy Lagos. Processing: 3-8 weeks. Requirements: DS-160 form, valid passport 6+ months, interview appointment, visa fee $185, proof of ties to Nigeria, financial evidence.`,
      confidence: "high",
      url: "https://travel.state.gov",
      lastUpdated: "Dec 2024"
    },
    airport_procedures: {
      source: "US Customs and Border Protection",
      content: `Major entry airports: JFK (New York), LAX (Los Angeles), ORD (Chicago). Biometric collection mandatory. ESTA not available for Nigerian passports. Complete customs declaration form. Average immigration wait: 45-90 minutes.`,
      confidence: "high"
    },
    transport: {
      source: "Official Airport Websites",
      content: `Ground transportation varies by city. NYC: Yellow Taxi (flat $52 to Manhattan from JFK), Subway/AirTrain. LA: LAX FlyAway Bus, Uber/Lyft, Taxi. Chicago: Blue Line CTA train, shared ride vans. Pre-book reliable transport.`,
      confidence: "high"
    },
    costs: {
      accommodation: { budget: "$40-70/night", mid: "$100-200/night", luxury: "$300+/night" },
      food: { budget: "$25-40/day", mid: "$60-100/day", luxury: "$150+/day" },
      transport: { monthly_pass: "$80-120", uber_avg: "$15-30/trip" },
      total_estimate: { budget: "$2000-3000/month", mid: "$4000-6000/month", luxury: "$8000+/month" }
    },
    first_72_hours: {
      source: "US Visitor Information",
      content: `Activate US SIM or international roaming. Notify bank of travel. Keep I-94 arrival record. Note authorized stay duration (usually 6 months for tourists). Health insurance recommended - medical costs high. Emergency: 911.`,
      confidence: "high"
    },
    legal_cultural: {
      source: "US Travel Advisory",
      content: `Tipping culture: 15-20% restaurants, $1-2 per bag porters. Jaywalking illegal. Drinking age 21. Open container laws vary by state. Sales tax added at checkout (not in price). Healthcare expensive - insurance essential.`,
      confidence: "high"
    },
    risk_factors: {
      scam_risk: "Low-Medium",
      legal_risk: "Medium",
      health_risk: "Medium (High healthcare costs)",
      transport_risk: "Low",
      overall: "Medium"
    }
  }
};

export const purposeIcons: PurposeIcons = {
  tourism: { icon: Camera, label: "Tourism & Leisure", color: "blue" },
  work: { icon: Briefcase, label: "Work & Employment", color: "purple" },
  education: { icon: GraduationCap, label: "Education & Study", color: "green" },
  health: { icon: Heart, label: "Medical Treatment", color: "red" },
  relocation: { icon: Home, label: "Permanent Relocation", color: "orange" }
};