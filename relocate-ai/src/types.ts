import type { LucideIcon } from 'lucide-react';

export type Purpose = 'tourism' | 'work' | 'education' | 'health' | 'relocation';
export type Destination = 'UAE' | 'USA';
export type Step = 'landing' | 'purpose' | 'form' | 'checklist';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type SelectedCategory = 'all' | PriorityLevel;
export type ActiveTab = 'checklist' | 'overview' | 'chat';
export type NotificationType = 'info' | 'success' | 'warning';
export type ChatRole = 'user' | 'assistant';

export type VisaRequirements = {
  source: string;
  content: string;
  confidence: string;
  url?: string;
  lastUpdated?: string;
};

export type AirportProcedures = {
  source: string;
  content: string;
  confidence: string;
  scam_warning?: string;
};

export type TransportInfo = {
  source: string;
  content: string;
  confidence: string;
};

export type Costs = {
  accommodation: { budget: string; mid: string; luxury: string };
  food: { budget: string; mid: string; luxury: string };
  transport: { monthly_pass: string; taxi_avg?: string; uber_avg?: string };
  total_estimate: { budget: string; mid: string; luxury: string };
};

export type GeneralInfo = {
  source: string;
  content: string;
  confidence: string;
};

export type RiskFactors = {
  scam_risk: string;
  legal_risk: string;
  health_risk: string;
  transport_risk: string;
  overall: string;
};

export type KnowledgeBaseEntry = {
  visa_requirements: VisaRequirements;
  airport_procedures: AirportProcedures;
  transport: TransportInfo;
  costs: Costs;
  first_72_hours: GeneralInfo;
  legal_cultural: GeneralInfo;
  risk_factors: RiskFactors;
};

export type KnowledgeBase = Record<Destination, KnowledgeBaseEntry>;

export type ChecklistItem = {
  id: string;
  title: string;
  checked: boolean;
  priority: PriorityLevel;
  deadline: string;
  source: string;
  detail: string;
  risk: string;
  estimatedTime: string;
  cost?: string;
};

export type ChecklistCategory = {
  id: number;
  category: string;
  icon: LucideIcon;
  confidence: string;
  priority: PriorityLevel;
  items: ChecklistItem[];
};

export type BudgetBreakdown = {
  accommodation: { daily: string; total: string };
  food: { daily: string; total: string };
  transport: { description: string; total: string };
  miscellaneous: { description: string; total: string };
  total: string;
};

export type RiskScore = {
  overall: number;
  breakdown: { scam: string; legal: string; health: string; transport: string };
  level: 'Low' | 'Medium' | 'High' | string;
  color: 'green' | 'yellow' | 'red';
};

export type Notification = {
  id: number;
  message: string;
  type: NotificationType;
  timestamp: Date;
};

export type ChatMessage = {
  role: ChatRole;
  content: string;
  timestamp: Date;
};

export type PurposeIcons = Record<Purpose, { icon: LucideIcon; label: string; color: string }>;

export type UserContext = {
  origin: string;
  destination: Destination | '';
  purpose: Purpose;
  departureDate: string;
  travelIntent: string;
  departureCity: string;
  homeArea: string;
  flightTime: string;
  budget: string;
  duration: string;
};

// Agent-related prototype types (experimental)
export type AgentActionName =
  | 'search'
  | 'search_flights'            // travel-specific
  | 'compare_itineraries'
  | 'reserve_option'            // approval required
  | 'confirm_booking'           // approval required
  | 'book_accommodation'        // approval required
  | 'schedule_visa_appointment'
  | 'create_reminder'
  | 'summarize'
  | 'create-todo'
  | 'noop';

export type AgentTask = {
  id: string;
  action: AgentActionName;
  input: string;
  createdAt: string;
  approved?: boolean;
  dryRun?: boolean;
};

export type AgentLog = {
  id: string;
  taskId?: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  meta?: Record<string, any>;
};

export type AgentState = {
  running: boolean;
  lastRunAt?: string;
  queue: AgentTask[];
  logs: AgentLog[];
  provider?: 'mock' | 'groq';
};