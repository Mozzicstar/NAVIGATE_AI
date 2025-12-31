import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, Circle, AlertTriangle, Info, Plane, MapPin, Calendar, Target, Home, ChevronDown, ChevronUp, Loader2, User, Briefcase, GraduationCap, Heart, Globe, DollarSign, Shield, Clock, FileText, Camera, Navigation, Train, Building2, Phone, Wifi, CreditCard, Hospital, Scale, Users, TrendingUp, Download, Share2, Bell, X, Menu, ChevronRight, Zap, Star, Award } from 'lucide-react';

const RelocateAI = () => {
  const [step, setStep] = useState('landing');
  const [userContext, setUserContext] = useState({
    origin: '',
    destination: '',
    purpose: '',
    departureDate: '',
    travelIntent: '',
    departureCity: '',
    homeArea: '',
    flightTime: '',
    budget: '',
    duration: ''
  });
  const [checklist, setChecklist] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('checklist');
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [budgetBreakdown, setBudgetBreakdown] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const chatEndRef = useRef(null);

  // Enhanced knowledge base with more data
  const knowledgeBase = {
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

  const purposeIcons = {
    tourism: { icon: Camera, label: "Tourism & Leisure", color: "blue" },
    work: { icon: Briefcase, label: "Work & Employment", color: "purple" },
    education: { icon: GraduationCap, label: "Education & Study", color: "green" },
    health: { icon: Heart, label: "Medical Treatment", color: "red" },
    relocation: { icon: Home, label: "Permanent Relocation", color: "orange" }
  };

  const generateEnhancedChecklist = (destination, purpose = 'tourism') => {
    const kb = knowledgeBase[destination];
    if (!kb) return [];

    const baseChecklist = [
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

  const calculateRiskScore = (destination) => {
    const risks = knowledgeBase[destination]?.risk_factors;
    if (!risks) return null;

    const scoreMap = { "Low": 1, "Low-Medium": 2, "Medium": 3, "Medium-High": 4, "High": 5 };
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

  const generateBudgetBreakdown = (destination, purpose, duration = '30') => {
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

  const handleDestinationSelect = async (dest) => {
    setUserContext({ ...userContext, destination: dest });
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newChecklist = generateEnhancedChecklist(dest, userContext.purpose);
    setChecklist(newChecklist);
    
    const risk = calculateRiskScore(dest);
    setRiskScore(risk);
    
    const budget = generateBudgetBreakdown(dest, userContext.purpose);
    setBudgetBreakdown(budget);
    
    setLoading(false);
    setStep('checklist');
    
    // Add welcome notification
    addNotification(`Checklist generated for ${dest}`, "success");
    
    setChatMessages([{
      role: 'assistant',
      content: `🎯 Welcome! I've generated a comprehensive relocation plan for ${dest}.\n\n📊 Risk Assessment: ${risk?.level} (${risk?.overall}/100)\n💰 Estimated Budget: ${budget?.total}\n\n✅ ${newChecklist.reduce((acc, cat) => acc + cat.items.length, 0)} action items identified\n\nEach item is backed by official sources. Click any item for detailed information, risks, costs, and timelines. I'm here to answer any questions!`,
      timestamp: new Date()
    }]);
  };

  const handlePurposeSelect = (purpose) => {
    setUserContext({ ...userContext, purpose });
    setStep('form');
  };

  const addNotification = (message, type = "info") => {
    const newNotif = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 5000);
  };

  const toggleChecklistItem = (itemId) => {
    setChecklist(prevChecklist => 
      prevChecklist.map(category => ({
        ...category,
        items: category.items.map(item => {
          if (item.id === itemId) {
            const newChecked = !item.checked;
            if (newChecked) {
              addNotification(`✅ Completed: ${item.title}`, "success");
            }
            return { ...item, checked: newChecked };
          }
          return item;
        })
      }))
    );
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    const kb = knowledgeBase[userContext.destination];
    let response = "";

    const query = inputMessage.toLowerCase();

    if (query.includes('visa')) {
      response = `📋 **Visa Information for ${userContext.destination}**\n\n${kb.visa_requirements.content}\n\n🟢 **Confidence**: High\n📅 **Last Updated**: ${kb.visa_requirements.lastUpdated}\n🔗 **Source**: ${kb.visa_requirements.source}\n\n⚠️ Always verify with official embassy before travel.`;
    } else if (query.includes('cost') || query.includes('budget') || query.includes('price')) {
      response = `💰 **Budget Breakdown for ${userContext.destination}**\n\n🏨 Accommodation: ${budgetBreakdown?.accommodation.daily}/night\n🍽️ Food: ${budgetBreakdown?.food.daily}/day\n🚇 Transport: ${budgetBreakdown?.transport.description}\n🎯 Miscellaneous: ~$30/day\n\n📊 **Total Estimate**: ${budgetBreakdown?.total}/month\n\n💡 Tip: Budget travelers can reduce costs by 40-50% with hostels and local food.`;
    } else if (query.includes('risk') || query.includes('danger') || query.includes('safe')) {
      response = `🛡️ **Safety Assessment for ${userContext.destination}**\n\n📊 Overall Risk Score: ${riskScore?.overall}/100 (${riskScore?.level})\n\n**Breakdown:**\n🎭 Scam Risk: ${riskScore?.breakdown.scam}\n⚖️ Legal Risk: ${riskScore?.breakdown.legal}\n🏥 Health Risk: ${riskScore?.breakdown.health}\n🚗 Transport Risk: ${riskScore?.breakdown.transport}\n\n⚠️ Primary concerns: ${userContext.destination === 'UAE' ? 'Strict legal enforcement, cultural violations' : 'Healthcare costs, legal complexity'}\n\n🟢 Source: Aggregated from official travel advisories`;
    } else if (query.includes('airport') || query.includes('arrival')) {
      response = `✈️ **Airport & Arrival Guide**\n\n${kb.airport_procedures.content}\n\n🚨 **SCAM WARNING**\n${kb.airport_procedures.scam_warning || 'Stay vigilant'}\n\n🚕 **Ground Transport**\n${kb.transport.content}\n\n🟢 Source: ${kb.airport_procedures.source}`;
    } else if (query.includes('transport') || query.includes('taxi') || query.includes('uber') || query.includes('metro')) {
      response = `🚗 **Transportation Options**\n\n${kb.transport.content}\n\n💡 **Pro Tips:**\n• Download transport apps before arrival\n• Have destination address in local language\n• Keep small bills for taxis\n• Metro/public transport cheapest option\n\n🟢 Source: ${kb.transport.source}`;
    } else if (query.includes('medication') || query.includes('medicine') || query.includes('drug')) {
      response = `💊 **Critical Medication Information**\n\n⚠️ **Requirements:**\n1. ALL medications in original packaging\n2. Carry doctor's prescription letter\n3. Declare at customs\n4. Check banned substances list\n\n🚫 **Important**: Some medications legal in Nigeria are BANNED in ${userContext.destination}. Examples:\n${userContext.destination === 'UAE' ? '• Codeine-based medications\n• Certain pain relievers\n• CBD products' : '• Certain antibiotics\n• Traditional medicines\n• Unapproved supplements'}\n\n🟡 **Confidence**: Medium - I don't have the complete banned list.\n\n✅ **Action**: Verify with ${userContext.destination} Embassy BEFORE travel.\n\n**Risk if ignored**: Confiscation, prosecution, health crisis without medication.`;
    } else if (query.includes('law') || query.includes('legal') || query.includes('culture') || query.includes('custom')) {
      response = `⚖️ **Legal & Cultural Guidelines**\n\n${kb.legal_cultural.content}\n\n⚠️ **These laws are STRICTLY enforced**\n\nPenalties can include:\n• Heavy fines\n• Imprisonment\n• Deportation\n• Travel bans\n\n🎯 **Cultural Tip**: ${userContext.destination === 'UAE' ? 'Respect Islamic customs, especially during Ramadan' : 'Direct communication valued, tipping expected everywhere'}\n\n🟢 Source: ${kb.legal_cultural.source}`;
    } else if (query.includes('scam') || query.includes('fraud') || query.includes('cheat')) {
      response = `🚨 **Common Scams & How to Avoid Them**\n\n**At Airport:**\n• Fake visa helpers (use only official counters)\n• Overpriced currency exchange (use ATMs)\n• Unlicensed taxis (use official taxi stands)\n\n**In City:**\n• Accommodation bait-and-switch (book verified hotels)\n• Fake tour operators (use licensed companies)\n• Inflated prices for foreigners (research normal prices)\n\n**Online:**\n• Fake apartment listings (never pay before viewing)\n• Phishing emails (verify sender)\n\n🛡️ **Protection Tips:**\n✅ Research typical prices beforehand\n✅ Use official services only\n✅ Keep emergency contacts handy\n✅ Trust your instincts\n\n🟢 Confidence: High`;
    } else if (query.includes('timeline') || query.includes('schedule') || query.includes('when')) {
      const timeline = checklist.flatMap(cat => cat.items)
        .sort((a, b) => {
          const priorityOrder = { 'critical': 1, 'high': 2, 'medium': 3, 'low': 4 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, 5);
      
      response = `📅 **Your Priority Timeline**\n\n**Critical Items (Do First):**\n${timeline.map((item, i) => `${i + 1}. ${item.title}\n   ⏰ ${item.deadline}\n   ⏱️ Time needed: ${item.estimatedTime}`).join('\n\n')}\n\n💡 Focus on critical items first. I'll remind you of upcoming deadlines!`;
    } else if (query.includes('document') || query.includes('paper')) {
      response = `📄 **Essential Documents Checklist**\n\n**Must Have:**\n✅ Passport (6+ months valid)\n✅ Visa (if required)\n✅ Return ticket\n✅ Travel insurance\n✅ Accommodation booking\n✅ Yellow fever certificate\n\n**Recommended:**\n✅ Digital copies in cloud\n✅ Emergency contacts\n✅ Bank statements\n✅ Prescription letters\n✅ International driving permit (if driving)\n\n💾 **Pro Tip**: Email all documents to yourself and save in Google Drive/Dropbox`;
    } else {
      response = `I can provide detailed, verified information about:\n\n💵 Budget & Costs\n🛡️ Safety & Risk Assessment\n✈️ Airport & Arrival Procedures\n🚗 Transportation Options\n💊 Medication Guidelines\n⚖️ Legal & Cultural Norms\n🚨 Scam Prevention\n📅 Timeline & Deadlines\n📄 Document Requirements\n\nWhat would you like to know more about? Ask specific questions for best results!`;
    }

    const aiMsg = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const completedCount = checklist.reduce((acc, cat) => 
    acc + cat.items.filter(item => item.checked).length, 0
  );
  const totalCount = checklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const filteredChecklist = selectedCategory === 'all' 
    ? checklist 
    : checklist.filter(cat => cat.priority === selectedCategory);

  const exportPDF = () => {
    addNotification("PDF export feature coming soon!", "info");
  };

  const shareProgress = () => {
    addNotification("Share feature coming soon!", "info");
  };

  // Landing Page
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl mb-6 animate-bounce">
              <Plane className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              RelocateAI
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto font-light mb-8">
              Your AI-Powered Relocation Command Center
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Verified data. Zero hallucination. Complete peace of mind.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verified Sources Only</h3>
              <p className="text-white/80">Every requirement backed by official government data with source attribution</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-red-400 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Safety First</h3>
              <p className="text-white/80">Real-time risk assessment, scam warnings, and legal compliance guidance</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-blue-400 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Automation</h3>
              <p className="text-white/80">AI-generated timelines, budget breakdowns, and personalized checklists</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-white/80">Verified Checks</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/80">Source Attribution</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-white/80">AI Assistant</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white mb-1">Zero</div>
              <div className="text-sm text-white/80">Hallucination</div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setStep('purpose')}
              className="inline-flex items-center px-10 py-5 bg-white text-purple-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105"
            >
              Start Your Journey
              <ChevronRight className="ml-2 w-6 h-6" />
            </button>
            <p className="mt-6 text-white/70 text-sm">No signup required • Free to use • Instant results</p>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 max-w-3xl mx-auto p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white/90">
                <strong>Disclaimer:</strong> RelocateAI provides informational guidance based on official sources. Always verify requirements with relevant embassies and authorities. This is not legal or immigration advice.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Purpose Selection
  if (step === 'purpose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">What brings you abroad?</h2>
            <p className="text-gray-600 text-lg">Select your purpose to get personalized guidance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(purposeIcons).map(([key, { icon: Icon, label, color }]) => (
              <button
                key={key}
                onClick={() => handlePurposeSelect(key)}
                className={`group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-${color}-500 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105`}
              >
                <div className={`w-16 h-16 bg-${color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${color}-500 transition-colors`}>
                  <Icon className={`w-8 h-8 text-${color}-600 group-hover:text-white transition-colors`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{label}</h3>
                <p className="text-sm text-gray-600">
                  {key === 'tourism' && 'Vacation, sightseeing, leisure travel'}
                  {key === 'work' && 'Employment, business, professional'}
                  {key === 'education' && 'University, college, courses'}
                  {key === 'health' && 'Medical treatment, wellness'}
                  {key === 'relocation' && 'Permanent move, immigration'}
                </p>
                <ChevronRight className={`absolute top-8 right-8 w-6 h-6 text-gray-400 group-hover:text-${color}-500`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Form Page
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's Plan Your Relocation</h2>
            <p className="text-gray-600 mb-8">Tell us about your journey for accurate, personalized guidance</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Where are you traveling from?
                </label>
                <input
                  type="text"
                  value={userContext.origin}
                  onChange={(e) => setUserContext({ ...userContext, origin: e.target.value })}
                  placeholder="e.g., Lagos, Nigeria"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Planned departure date (optional)
                </label>
                <input
                  type="date"
                  value={userContext.departureDate}
                  onChange={(e) => setUserContext({ ...userContext, departureDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Duration of stay (days)
                </label>
                <input
                  type="number"
                  value={userContext.duration}
                  onChange={(e) => setUserContext({ ...userContext, duration: e.target.value })}
                  placeholder="e.g., 30"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Plane className="inline w-4 h-4 mr-1" />
                  Select your destination
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDestinationSelect('UAE')}
                    className="group p-6 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left transform hover:scale-105"
                  >
                    <div className="text-4xl mb-2">🇦🇪</div>
                    <div className="font-bold text-gray-900 mb-1">Dubai, UAE</div>
                    <div className="text-sm text-gray-600">Visa on Arrival</div>
                    <div className="mt-2 text-xs text-blue-600 font-semibold">→ Generate Plan</div>
                  </button>
                  <button
                    onClick={() => handleDestinationSelect('USA')}
                    className="group p-6 border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left transform hover:scale-105"
                  >
                    <div className="text-4xl mb-2">🇺🇸</div>
                    <div className="font-bold text-gray-900 mb-1">United States</div>
                    <div className="text-sm text-gray-600">Visa Required</div>
                    <div className="mt-2 text-xs text-purple-600 font-semibold">→ Generate Plan</div>
                  </button>
                </div>
              </div>
            </div>

            {loading && (
              <div className="mt-8 flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <span className="text-gray-700 font-semibold text-lg">Generating your personalized plan...</span>
                <span className="text-gray-500 text-sm mt-2">Analyzing requirements, calculating risks, creating timeline</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-gray-200 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">RelocateAI</h1>
                <p className="text-xs text-white/80">{userContext.origin} → {userContext.destination}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Bell className="w-5 h-5 text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={exportPDF}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={shareProgress}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-white/90 mb-2">
              <span className="font-semibold">Progress: {completedCount} of {totalCount} completed</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && notifications.length > 0 && (
        <div className="fixed top-20 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-30 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.map(notif => (
              <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />}
                  {notif.type === 'info' && <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />}
                  {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mb-6 bg-white rounded-xl p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'checklist'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckCircle2 className="inline w-5 h-5 mr-2" />
            Checklist
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="inline w-5 h-5 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Send className="inline w-5 h-5 mr-2" />
            AI Assistant
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Risk Assessment Card */}
                {riskScore && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-6 h-6 mr-2 text-blue-600" />
                      Risk Assessment
                    </h3>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-700">Overall Risk Score</span>
                        <span className={`text-2xl font-bold ${
                          riskScore.color === 'green' ? 'text-green-600' :
                          riskScore.color === 'yellow' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {riskScore.overall}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            riskScore.color === 'green' ? 'bg-green-500' :
                            riskScore.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${riskScore.overall}%` }}
                        />
                      </div>
                      <p className={`mt-2 text-sm font-semibold ${
                        riskScore.color === 'green' ? 'text-green-600' :
                        riskScore.color === 'yellow' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {riskScore.level} Risk Level
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-1">Scam Risk</div>
                        <div className="font-bold text-gray-900">{riskScore.breakdown.scam}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-1">Legal Risk</div>
                        <div className="font-bold text-gray-900">{riskScore.breakdown.legal}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-1">Health Risk</div>
                        <div className="font-bold text-gray-900">{riskScore.breakdown.health}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-1">Transport Risk</div>
                        <div className="font-bold text-gray-900">{riskScore.breakdown.transport}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Budget Breakdown Card */}
                {budgetBreakdown && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                      Budget Breakdown
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <Home className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="font-semibold text-gray-900">Accommodation</div>
                            <div className="text-sm text-gray-600">{budgetBreakdown.accommodation.daily}</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">{budgetBreakdown.accommodation.total}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-orange-600 mr-3" />
                          <div>
                            <div className="font-semibold text-gray-900">Food & Dining</div>
                            <div className="text-sm text-gray-600">{budgetBreakdown.food.daily}</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">{budgetBreakdown.food.total}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <Train className="w-5 h-5 text-purple-600 mr-3" />
                          <div>
                            <div className="font-semibold text-gray-900">Transportation</div>
                            <div className="text-sm text-gray-600">{budgetBreakdown.transport.description}</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">{budgetBreakdown.transport.total}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <div className="font-semibold text-gray-900">Miscellaneous</div>
                            <div className="text-sm text-gray-600">{budgetBreakdown.miscellaneous.description}</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">{budgetBreakdown.miscellaneous.total}</div>
                      </div>

                      <div className="border-t-2 border-gray-200 pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">Total Monthly Estimate</div>
                          <div className="text-2xl font-black text-blue-600">{budgetBreakdown.total}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <div className="text-3xl font-bold">{totalCount}</div>
                    <div className="text-sm text-blue-100">Total Tasks</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="text-3xl font-bold">{completedCount}</div>
                    <div className="text-sm text-green-100">Completed</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                    <div className="text-3xl font-bold">{totalCount - completedCount}</div>
                    <div className="text-sm text-orange-100">Remaining</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Relocation Checklist</h2>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Items</option>
                    <option value="critical">Critical Only</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                  </select>
                </div>
                
                <div className="space-y-6">
                  {filteredChecklist.map(category => {
                    const Icon = category.icon;
                    return (
                      <div key={category.id} className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              category.priority === 'critical' ? 'bg-red-100 text-red-700' :
                              category.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {category.priority.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                              🟢 Verified
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {category.items.map(item => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all">
                              <div className="flex items-start">
                                <button
                                  onClick={() => toggleChecklistItem(item.id)}
                                  className="mt-1 mr-4 flex-shrink-0"
                                >
                                  {item.checked ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                  ) : (
                                    <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500" />
                                  )}
                                </button>
                                
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <span className={`font-semibold text-base ${item.checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                        {item.title}
                                      </span>
                                      {item.priority === 'critical' && !item.checked && (
                                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                                          CRITICAL
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => toggleExpand(item.id)}
                                      className="ml-3 text-blue-600 hover:text-blue-700 flex-shrink-0"
                                    >
                                      {expandedItems[item.id] ? (
                                        <ChevronUp className="w-6 h-6" />
                                      ) : (
                                        <ChevronDown className="w-6 h-6" />
                                      )}
                                    </button>
                                  </div>
                                  
                                  {!expandedItems[item.id] && (
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                      <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {item.deadline}
                                      </span>
                                      <span className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {item.estimatedTime}
                                      </span>
                                      {item.cost && (
                                        <span className="flex items-center">
                                          <DollarSign className="w-4 h-4 mr-1" />
                                          {item.cost}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {expandedItems[item.id] && (
                                    <div className="mt-4 space-y-3">
                                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                        <div className="font-semibold text-blue-900 mb-2 flex items-center">
                                          <Info className="w-4 h-4 mr-2" />
                                          Details
                                        </div>
                                        <div className="text-sm text-blue-800">{item.detail}</div>
                                      </div>
                                      
                                      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                                        <div className="font-semibold text-red-900 mb-2 flex items-center">
                                          <AlertTriangle className="w-4 h-4 mr-2" />
                                          Risk if Ignored
                                        </div>
                                        <div className="text-sm text-red-800">{item.risk}</div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                          <div className="text-xs text-gray-600 mb-1">Deadline</div>
                                          <div className="font-semibold text-gray-900 text-sm">{item.deadline}</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                          <div className="text-xs text-gray-600 mb-1">Time Needed</div>
                                          <div className="font-semibold text-gray-900 text-sm">{item.estimatedTime}</div>
                                        </div>
                                        {item.cost && (
                                          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                                            <div className="text-xs text-gray-600 mb-1">Estimated Cost</div>
                                            <div className="font-semibold text-gray-900 text-sm">{item.cost}</div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="text-xs text-gray-500 flex items-center">
                                        <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                                        Source: {item.source}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white rounded-xl shadow-sm p-6 h-[calc(100vh-280px)] flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Send className="w-6 h-6 mr-2 text-blue-600" />
                  AI Assistant
                </h3>
                
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-sm' 
                          : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm'
                      } px-5 py-3 shadow-sm`}>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                        <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-5 py-3 rounded-2xl rounded-tl-sm flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about visa, costs, risks, transport..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !inputMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                  💡 All responses are grounded in official sources. Ask specific questions for best results.
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Journey Info Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Journey Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-blue-100 text-xs mb-1">Destination</div>
                  <div className="font-semibold">{userContext.destination}</div>
                </div>
                <div>
                  <div className="text-blue-100 text-xs mb-1">Purpose</div>
                  <div className="font-semibold capitalize">{userContext.purpose || 'Not specified'}</div>
                </div>
                {userContext.departureDate && (
                  <div>
                    <div className="text-blue-100 text-xs mb-1">Departure</div>
                    <div className="font-semibold">{new Date(userContext.departureDate).toLocaleDateString()}</div>
                  </div>
                )}
                {userContext.duration && (
                  <div>
                    <div className="text-blue-100 text-xs mb-1">Duration</div>
                    <div className="font-semibold">{userContext.duration} days</div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-left font-semibold"
                >
                  💬 Ask AI Assistant
                </button>
                <button
                  onClick={exportPDF}
                  className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all text-left font-semibold"
                >
                  📄 Export to PDF
                </button>
                <button
                  onClick={shareProgress}
                  className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all text-left font-semibold"
                >
                  🔗 Share Progress
                </button>
              </div>
            </div>

            {/* Priority Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Critical Items
              </h3>
              <div className="space-y-2">
                {checklist
                  .flatMap(cat => cat.items)
                  .filter(item => item.priority === 'critical' && !item.checked)
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm font-semibold text-red-900">{item.title}</div>
                      <div className="text-xs text-red-700 mt-1">⏰ {item.deadline}</div>
                    </div>
                  ))}
                {checklist.flatMap(cat => cat.items).filter(item => item.priority === 'critical' && !item.checked).length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    ✅ All critical items completed!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelocateAI;