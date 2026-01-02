import { FileText, DollarSign, Shield, Plane, Wifi, Scale, Briefcase, GraduationCap } from 'lucide-react';
import type { Destination, Purpose, ChecklistCategory, RiskScore, BudgetBreakdown } from './types';
import { knowledgeBase } from './constants';

export const generateEnhancedChecklist = (
  destination: Destination,
  purpose: Purpose = 'tourism'
): ChecklistCategory[] => {
  const kb = knowledgeBase[destination];
  if (!kb) return [];

  const baseChecklist: ChecklistCategory[] = [
    {
      id: 1,
      category: "Travel Documents",
      icon: FileText,
      confidence: "high",
      priority: "critical",
      items: [
        {
          id: "doc-1",
          title: "Valid Passport (6+ months validity)",
          checked: false,
          priority: "critical",
          deadline: "Before booking flights",
          source: kb.visa_requirements.source,
          detail: "Your passport must be valid for at least 6 months beyond your intended stay. Check expiry date now and renew if needed - this process can take 4-6 weeks in Nigeria.",
          risk: "Entry denial at airport. Airlines may refuse boarding.",
          estimatedTime: "30 mins to check, 4-6 weeks if renewal needed",
          cost: purpose === 'work' ? 'NGN 35,000 (64-page)' : 'NGN 25,000 (32-page)'
        },
        {
          id: "doc-2",
          title: destination === "UAE" ? "Visa on Arrival eligibility confirmed" : "US Visa application completed",
          checked: false,
          priority: "critical",
          deadline: destination === "USA" ? "8 weeks before travel" : "Verify before booking",
          source: kb.visa_requirements.source,
          detail: kb.visa_requirements.content,
          risk: destination === "UAE" ? "Unable to enter UAE without meeting requirements" : "Cannot travel without approved visa",
          estimatedTime: destination === "USA" ? "3-8 weeks processing" : "On arrival",
          cost: destination === "USA" ? "$185 visa fee" : "AED 100"
        },
        {
          id: "doc-3",
          title: "Confirmed return/onward ticket",
          checked: false,
          priority: "critical",
          deadline: "Before departure",
          source: kb.visa_requirements.source,
          detail: "Immigration requires proof of departure. Book refundable ticket if uncertain of return date.",
          risk: "Entry denial, deportation risk",
          estimatedTime: "1 hour to book",
          cost: destination === "UAE" ? "$500-1200" : "$800-2000"
        },
        {
          id: "doc-4",
          title: "Travel insurance with medical coverage",
          checked: false,
          priority: "high",
          deadline: "Before departure",
          source: "International Travel Standards",
          detail: "Cover medical emergencies, trip cancellation, lost baggage. Minimum $50,000 medical coverage recommended.",
          risk: "Massive out-of-pocket costs if medical emergency occurs",
          estimatedTime: "30 mins to purchase",
          cost: "$50-150 depending on coverage"
        },
        {
          id: "doc-5",
          title: "Digital copies of all documents",
          checked: false,
          priority: "medium",
          deadline: "1 week before travel",
          source: "Best Practices",
          detail: "Scan passport, visa, tickets, insurance. Store in cloud (Google Drive, Dropbox) and email to yourself.",
          risk: "Difficulty if documents lost or stolen",
          estimatedTime: "20 mins",
          cost: "Free"
        }
      ]
    },
    {
      id: 2,
      category: "Financial Preparation",
      icon: DollarSign,
      confidence: "high",
      priority: "critical",
      items: [
        {
          id: "fin-1",
          title: destination === "UAE" ? "Minimum AED 3,000 or equivalent" : "Proof of sufficient funds ($3,000+ recommended)",
          checked: false,
          priority: "critical",
          deadline: "Before departure",
          source: kb.visa_requirements.source,
          detail: destination === "UAE" 
            ? "Required for visa on arrival. Carry cash, credit card, or bank statement as proof."
            : "Immigration may ask for proof of financial means. Carry bank statements or credit cards.",
          risk: "Entry denial if unable to prove financial capacity",
          estimatedTime: "1 week to arrange if needed",
          cost: "N/A"
        },
        {
          id: "fin-2",
          title: "Notify bank of travel dates",
          checked: false,
          priority: "high",
          deadline: "1 week before travel",
          source: "Banking Best Practices",
          detail: "Prevent card blocks. Note international transaction fees (typically 3-5%). Carry backup payment method.",
          risk: "Card blocked abroad, unable to access funds",
          estimatedTime: "15 mins (phone call or app)",
          cost: "Free"
        },
        {
          id: "fin-3",
          title: "Currency exchange arranged",
          checked: false,
          priority: "high",
          deadline: "3 days before travel",
          source: "Travel Advisory",
          detail: destination === "UAE"
            ? "Get USD or AED. Airport rates poor. Exchange at reputable banks in Nigeria or use ATMs on arrival."
            : "Get USD before travel. Bring $200-300 cash for immediate needs. ATMs widely available.",
          risk: "Exploitation by unofficial money changers",
          estimatedTime: "30 mins at bank",
          cost: "Bank exchange fees 1-3%"
        },
        {
          id: "fin-4",
          title: "Budget breakdown created",
          checked: false,
          priority: "medium",
          deadline: "2 weeks before travel",
          source: "Financial Planning",
          detail: `Average costs in ${destination}: Accommodation ${kb.costs.accommodation.mid}, Food ${kb.costs.food.mid}, Transport ${kb.costs.transport.monthly_pass}`,
          risk: "Running out of money abroad",
          estimatedTime: "1 hour planning",
          cost: "Free"
        }
      ]
    },
    {
      id: 3,
      category: "Health & Safety",
      icon: Shield,
      confidence: "high",
      priority: "critical",
      items: [
        {
          id: "health-1",
          title: "Yellow Fever vaccination certificate",
          checked: false,
          priority: "critical",
          deadline: "At least 10 days before travel",
          source: "WHO & Nigerian Port Health",
          detail: "Required for travelers from Nigeria. Get vaccinated at approved center minimum 10 days before travel. Certificate valid for life.",
          risk: "Entry denial, quarantine, or vaccination at port (if available)",
          estimatedTime: "1 day for appointment + vaccination",
          cost: "NGN 15,000 - 25,000"
        },
        {
          id: "health-2",
          title: "Prescription medications in original packaging",
          checked: false,
          priority: "high",
          deadline: "1 week before travel",
          source: "Customs Regulations",
          detail: "Carry doctor's prescription. Declare all medications. Some drugs legal in Nigeria are banned in " + destination + ". Check restrictions.",
          risk: "Confiscation, legal trouble, health crisis if meds seized",
          estimatedTime: "30 mins to organize",
          cost: "Doctor's letter: NGN 5,000-10,000"
        },
        {
          id: "health-3",
          title: "Travel health kit prepared",
          checked: false,
          priority: "medium",
          deadline: "3 days before travel",
          source: "CDC Travel Health",
          detail: "Include: basic first aid, pain relievers, anti-diarrheal, band-aids, hand sanitizer, face masks, any prescription meds.",
          risk: "Discomfort, difficulty finding familiar medications",
          estimatedTime: "30 mins shopping",
          cost: "NGN 10,000 - 20,000"
        },
        {
          id: "health-4",
          title: "Emergency contacts list",
          checked: false,
          priority: "high",
          deadline: "1 week before travel",
          source: "Safety Best Practice",
          detail: `Nigerian Embassy in ${destination}, local emergency numbers (${destination === "UAE" ? "999 police, 998 ambulance" : "911"}), family contacts, insurance hotline.`,
          risk: "Delayed assistance in emergency",
          estimatedTime: "15 mins",
          cost: "Free"
        }
      ]
    },
    {
      id: 4,
      category: "Airport & Arrival",
      icon: Plane,
      confidence: "high",
      priority: "critical",
      items: [
        {
          id: "airport-1",
          title: "Airport scam awareness training",
          checked: false,
          priority: "critical",
          deadline: "Review before travel day",
          source: kb.airport_procedures.source,
          detail: kb.airport_procedures.scam_warning || "Be vigilant for common airport scams. Use only official services.",
          risk: "Financial loss, missed connections, legal issues",
          estimatedTime: "15 mins reading",
          cost: "Free"
        },
        {
          id: "airport-2",
          title: "Ground transport pre-arranged or researched",
          checked: false,
          priority: "high",
          deadline: "Before departure",
          source: kb.transport.source,
          detail: kb.transport.content,
          risk: "Overcharging, unsafe vehicles, getting lost",
          estimatedTime: "30 mins research or booking",
          cost: "Varies by option"
        },
        {
          id: "airport-3",
          title: "Accommodation address ready to present",
          checked: false,
          priority: "critical",
          deadline: "Before departure",
          source: "Immigration Requirements",
          detail: "Immigration may ask where you're staying. Have hotel booking confirmation or host address ready.",
          risk: "Entry delays, additional questioning",
          estimatedTime: "5 mins to print/save",
          cost: "Free"
        },
        {
          id: "airport-4",
          title: "Arrival card information prepared",
          checked: false,
          priority: "medium",
          deadline: "On flight",
          source: "Immigration Procedures",
          detail: "Know your accommodation address, purpose of visit, intended length of stay, contact details. Fill out arrival card on flight.",
          risk: "Delays at immigration",
          estimatedTime: "10 mins on flight",
          cost: "Free"
        }
      ]
    },
    {
      id: 5,
      category: "Connectivity & Communication",
      icon: Wifi,
      confidence: "high",
      priority: "high",
      items: [
        {
          id: "comm-1",
          title: "Local SIM card researched or international roaming activated",
          checked: false,
          priority: "high",
          deadline: "Before departure or on arrival",
          source: destination === "UAE" ? "Etisalat/Du" : "US Mobile Carriers",
          detail: destination === "UAE" 
            ? "Etisalat or Du SIM at airport. Tourist SIM: AED 50-100 for 7-30 days with data. Bring passport."
            : "T-Mobile, AT&T, or Verizon prepaid SIM. Or activate international roaming with Nigerian carrier.",
          risk: "No communication, unable to contact accommodation/family",
          estimatedTime: "30 mins at airport shop",
          cost: destination === "UAE" ? "AED 50-150" : "$30-50"
        },
        {
          id: "comm-2",
          title: "Important apps downloaded",
          checked: false,
          priority: "medium",
          deadline: "Before departure",
          source: "Travel Technology",
          detail: destination === "UAE"
            ? "Download: Google Maps, Careem/Uber, Dubai Metro app, Currency converter, WhatsApp"
            : "Download: Google Maps, Uber/Lyft, Venmo/CashApp, Transit apps, WhatsApp",
          risk: "Navigation difficulties, payment issues",
          estimatedTime: "20 mins",
          cost: "Free"
        },
        {
          id: "comm-3",
          title: "Offline maps downloaded",
          checked: false,
          priority: "medium",
          deadline: "Before departure",
          source: "Tech Best Practice",
          detail: "Download Google Maps offline for destination city. Works without internet.",
          risk: "Getting lost without data",
          estimatedTime: "10 mins",
          cost: "Free"
        }
      ]
    },
    {
      id: 6,
      category: "Legal & Cultural Awareness",
      icon: Scale,
      confidence: "high",
      priority: "high",
      items: [
        {
          id: "legal-1",
          title: "Local laws and customs reviewed",
          checked: false,
          priority: "high",
          deadline: "1 week before travel",
          source: kb.legal_cultural.source,
          detail: kb.legal_cultural.content,
          risk: "Arrest, fines, deportation for cultural violations",
          estimatedTime: "1 hour reading",
          cost: "Free"
        },
        {
          id: "legal-2",
          title: "Prohibited items checked",
          checked: false,
          priority: "critical",
          deadline: "Before packing",
          source: "Customs Authority",
          detail: destination === "UAE"
            ? "Strictly forbidden: Drugs, pork products, religious materials for distribution, e-cigarettes (banned), certain medications. Check full list."
            : "Prohibited: Fresh food, plants, certain animal products. Declare amounts over $10,000. Check CBP website.",
          risk: "Confiscation, fines, prosecution, deportation",
          estimatedTime: "30 mins review",
          cost: "Free"
        },
        {
          id: "legal-3",
          title: "Dress code understood",
          checked: false,
          priority: destination === "UAE" ? "high" : "low",
          deadline: "Before packing",
          source: "Cultural Guidelines",
          detail: destination === "UAE"
            ? "Modest dress in public. Cover shoulders and knees. Beach attire only at beach/pool. Pack conservative clothing."
            : "Casual dress acceptable. Business casual for professional settings. Comfortable for walking.",
          risk: destination === "UAE" ? "Legal issues, cultural offense" : "Social discomfort",
          estimatedTime: "Considered during packing",
          cost: "Free"
        }
      ]
    }
  ];

  // Add purpose-specific items
  if (purpose === 'work') {
    baseChecklist.push({
      id: 7,
      category: "Work-Specific Requirements",
      icon: Briefcase,
      confidence: "high",
      priority: "critical",
      items: [
        {
          id: "work-1",
          title: "Work visa/permit obtained",
          checked: false,
          priority: "critical",
          deadline: "Before departure",
          source: destination === "UAE" ? "UAE Ministry of Human Resources" : "USCIS",
          detail: destination === "UAE"
            ? "Employment visa sponsored by UAE employer. Medical fitness test required. Processing: 2-4 weeks."
            : "H-1B or relevant work visa. Must be employer-sponsored. Processing varies by visa type.",
          risk: "Illegal to work on tourist visa - deportation risk",
          estimatedTime: "2-8 weeks",
          cost: destination === "UAE" ? "AED 3,000-5,000" : "$460-$1,440"
        },
        {
          id: "work-2",
          title: "Employment contract reviewed",
          checked: false,
          priority: "high",
          deadline: "Before accepting",
          source: "Employment Law",
          detail: "Understand salary, benefits, working hours, termination clauses, relocation assistance.",
          risk: "Exploitation, unclear terms",
          estimatedTime: "2 hours review",
          cost: "Free (or legal review: $200-500)"
        }
      ]
    });
  }

  if (purpose === 'education') {
    baseChecklist.push({
      id: 8,
      category: "Study-Specific Requirements",
      icon: GraduationCap,
      confidence: "high",
      priority: "critical",
      items: [
        {
          id: "study-1",
          title: "Student visa obtained",
          checked: false,
          priority: "critical",
          deadline: "2 months before program start",
          source: destination === "UAE" ? "UAE Ministry of Education" : "Student and Exchange Visitor Program",
          detail: destination === "UAE"
            ? "Student visa sponsored by university. Requires acceptance letter, passport copy, photos."
            : "F-1 visa required. Need I-20 from university, SEVIS fee paid, visa interview.",
          risk: "Cannot attend classes legally",
          estimatedTime: "4-8 weeks",
          cost: destination === "UAE" ? "AED 2,000-3,000" : "$510 (I-20 + visa)"
        },
        {
          id: "study-2",
          title: "Academic transcripts certified",
          checked: false,
          priority: "high",
          deadline: "Before departure",
          source: "University Requirements",
          detail: "Get official transcripts, degree certificates certified. May need apostille for international recognition.",
          risk: "Enrollment delays",
          estimatedTime: "2-4 weeks",
          cost: "NGN 20,000-50,000"
        }
      ]
    });
  }

  return baseChecklist;
};

export const calculateRiskScore = (destination: Destination): RiskScore | null => {
  const risks = knowledgeBase[destination]?.risk_factors;
  if (!risks) return null;

  const scoreMap: Record<string, number> = { "Low": 1, "Low-Medium": 2, "Medium": 3, "Medium-High": 4, "High": 5 };
  const scores = [
    scoreMap[risks.scam_risk] || 3,
    scoreMap[risks.legal_risk] || 3,
    scoreMap[risks.health_risk] || 3,
    scoreMap[risks.transport_risk] || 3
  ];
  
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const overallScore = Math.round(avg * 20); // Scale to 100

  return {
    overall: overallScore,
    breakdown: {
      scam: risks.scam_risk,
      legal: risks.legal_risk,
      health: risks.health_risk,
      transport: risks.transport_risk
    },
    level: overallScore < 40 ? "Low" : overallScore < 70 ? "Medium" : "High",
    color: overallScore < 40 ? "green" : overallScore < 70 ? "yellow" : "red"
  };
};

export const generateBudgetBreakdown = (
  destination: Destination,
  purpose: Purpose,
  duration: string = '30'
): BudgetBreakdown | null => {
  const kb = knowledgeBase[destination];
  if (!kb) return null;

  const days = parseInt(duration) || 30;
  const costs = kb.costs;

  return {
    accommodation: {
      daily: costs.accommodation.mid.match(/\d+-\d+/) ? costs.accommodation.mid : "$100",
      total: `$${(100 * days).toFixed(0)}`
    },
    food: {
      daily: costs.food.mid,
      total: `$${(50 * days).toFixed(0)}`
    },
    transport: {
      description: costs.transport.monthly_pass,
      total: costs.transport.monthly_pass
    },
    miscellaneous: {
      description: "Activities, shopping, emergencies",
      total: `$${(30 * days).toFixed(0)}`
    },
    total: costs.total_estimate.mid
  };
};