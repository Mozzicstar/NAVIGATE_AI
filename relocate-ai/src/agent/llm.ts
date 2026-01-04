// Rule-based "LLM" for the prototype.
// - No real inference, just rich pre-canned responses based on keywords.
// - Simulates an intelligent agent for demo purposes.

export type Provider = 'mock' | 'groq'; // Keeping types for compatibility, but effectively only 'mock' is used.

const RULES: Array<{ keywords: string[], response: string }> = [
  {
    keywords: ['visa', 'immigration', 'permit'],
    response: `Based on current regulations for US immigration:
1. **B-1/B-2 Visitor Visa**: Best for short business or tourism trips. Requires interview at US Embassy.
2. **H-1B Specialty Occupation**: Requires an employer sponsor. Cap-subject lottery happens in March.
3. **O-1 Extraordinary Ability**: For individuals with sustained national or international acclaim.
4. **L-1 Intracompany Transferee**: For transferring from a foreign branch to a US branch of the same company.

*Recommendation*: For a relocation prototype, focus on the **O-1** or **L-1** pathways if you have existing employer support, as they avoid the H-1B lottery uncertainty.`
  },
  {
    keywords: ['flight', 'ticket', 'airline', 'fly'],
    response: `I found several flight options for your route:

- **Option A (Fastest)**: Delta Airlines, Direct. 14h 30m. Price: $1,200.
- **Option B (Cheapest)**: Turkish Airlines, 1 stop in IST. 22h 15m. Price: $850.
- **Option C (Business)**: Emirates, 1 stop in DXB. 26h 00m. Price: $3,400.

*Advice*: Booking 3+ weeks in advance typically saves ~15%. Option B is the best value if you don't mind the layover.`
  },
  {
    keywords: ['hotel', 'accommodation', 'stay', 'housing', 'apartment'],
    response: `Here are housing options near your destination:

1. **Downtown Luxury Apt**: 1BR, fully furnished. $2,800/mo. Walk to office.
2. **Suburban House**: 3BR, requires car. $2,200/mo. Good for families.
3. **Co-living Space**: Private room, shared amenities. $1,200/mo. Great for networking.
4. **Extended Stay Hotel**: Marriott Residence Inn. $140/night. Includes breakfast.

*Tip*: For the first month, I recommend the **Extended Stay Hotel** while you tour physical apartments.`
  },
  {
    keywords: ['weather', 'climate', 'temperature', 'rain'],
    response: `Current weather forecast for the destination:

- **Today**: Sunny, High 72°F (22°C), Low 58°F (14°C).
- **Tomorrow**: Partly Cloudy, High 70°F (21°C).
- **Weekend**: Chance of rain on Saturday.

*Packing Tip*: Bring layers. It gets chilly in the evenings, but days are pleasant.`
  },
  {
    keywords: ['cost', 'budget', 'expensive', 'price', 'money'],
    response: `Estimated Cost of Living Analysis (Monthly):

- **Housing**: $2,000 - $3,500
- **Food/Groceries**: $600 - $900
- **Transportation**: $150 (Public) or $500+ (Car)
- **Utilities/Internet**: $200
- **Health Insurance**: $300 - $600

*Total Estimated*: **$3,500 - $6,000 per month** for a comfortable lifestyle. Ensure your salary offer covers at least $80k/year pre-tax.`
  },
  {
    keywords: ['school', 'education', 'university', 'college'],
    response: `Top educational institutions in the area:

1. **Public Schools**: Rated 8/10 on GreatSchools. Zoning depends on your exact address.
2. **International School**: IB Curriculum. $25k/year tuition.
3. **Local University**: Offers excellent evening MBA programs and continuing education.

*Action*: If you have children, we should prioritize housing in the "Northwood" school district.`
  },
  {
    keywords: ['job', 'work', 'salary', 'employment'],
    response: `Job Market Overview:

- **Tech**: High demand. Senior engineers avg $140k+.
- **Finance**: Moderate growth. Analysts avg $90k.
- **Healthcare**: Critical shortage. Nurses and admin staff in high demand.

*Strategy*: Update your LinkedIn profile to "Open to Work" and set your location to the destination city 2 weeks before arrival.`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greeting'],
    response: `Hello! I am your Relocation AI Assistant. I can help you with:
- Visa & Immigration requirements
- Flight & Hotel bookings
- Cost of living estimates
- Housing searches
- Local weather and schools

What would you like to plan today?`
  }
];

const FALLBACK_RESPONSE = `I can help with that relocation task. 

I've analyzed your request and here is a general plan:
1. **Research**: Verify the specific requirements for this location.
2. **Budget**: Allocate approximately $2,000 for initial expenses.
3. **Timeline**: This process typically takes 2-4 weeks.

Could you be more specific? Try asking about "visas", "flights", "housing", or "cost of living".`;

export async function callLLM(prompt: string, provider: Provider = 'mock'): Promise<string> {
  // Simulate network delay for realism
  await new Promise(r => setTimeout(r, 800));

  const lowerPrompt = prompt.toLowerCase();

  // Find the first rule that matches any keyword
  const match = RULES.find(rule => 
    rule.keywords.some(keyword => lowerPrompt.includes(keyword))
  );

  if (match) {
    return match.response;
  }

  return FALLBACK_RESPONSE;
}
