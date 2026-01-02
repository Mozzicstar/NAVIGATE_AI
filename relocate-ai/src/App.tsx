import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Send, CheckCircle2, Circle, AlertTriangle, Info, Plane, MapPin, Calendar, Target, Home, ChevronDown, ChevronUp, Loader2, User, Briefcase, GraduationCap, Heart, Globe, DollarSign, Shield, Clock, FileText, Camera, Navigation, Train, Building2, Phone, Wifi, CreditCard, Hospital, Scale, Users, TrendingUp, Download, Share2, Bell, X, Menu, ChevronRight, Zap, Star, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type {
  Purpose, Destination, Step, PriorityLevel, SelectedCategory, ActiveTab,
  NotificationType, ChatRole, Notification, ChatMessage, UserContext,
  ChecklistCategory, RiskScore, BudgetBreakdown
} from './types';
import { knowledgeBase } from './constants';
import { generateEnhancedChecklist, calculateRiskScore, generateBudgetBreakdown } from './utils';
import LandingPage from './components/LandingPage';
import PurposeSelection from './components/PurposeSelection';
import FormPage from './components/FormPage';
import Dashboard from './components/Dashboard';
import AgentDashboard from './components/AgentDashboard';

const RelocateAI: React.FC = () => {
  const [step, setStep] = useState<Step>('landing');
  const [userContext, setUserContext] = useState<UserContext>({
    origin: '',
    destination: '',
    purpose: 'tourism',
    departureDate: '',
    travelIntent: '',
    departureCity: '',
    homeArea: '',
    flightTime: '',
    budget: '',
    duration: ''
  });
  const [checklist, setChecklist] = useState<ChecklistCategory[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('checklist');
  const [showTimeline, setShowTimeline] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown | null>(null);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // using centralized implementation from ./utils

  // utility implementations moved to ./utils


  // using centralized implementation from ./utils


  // using centralized implementation from ./utils


  const handleDestinationSelect = async (dest: Destination): Promise<void> => {
    setUserContext(prev => ({ ...prev, destination: dest }));
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

  const handlePurposeSelect = (purpose: Purpose): void => {
    setUserContext(prev => ({ ...prev, purpose }));
    setStep('form');
  };

  const addNotification = (message: string, type: NotificationType = "info"): void => {
    const newNotif: Notification = {
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

  const toggleExpand = (itemId: string | number): void => {
    const key = String(itemId);
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const toggleChecklistItem = (itemId: string | number): void => {
    const key = String(itemId);
    setChecklist(prevChecklist => 
      prevChecklist.map(category => ({
        ...category,
        items: category.items.map(item => {
          if (item.id === key) {
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

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    if (!userContext.destination) {
      addNotification("Select a destination first", "warning");
      setLoading(false);
      return;
    }

    const kb = knowledgeBase[userContext.destination];
    let response = "";

    const query = inputMessage.toLowerCase();
  };

  const exportPDF = () => {
    addNotification("PDF export feature coming soon!", "info");
  };

  const shareProgress = () => {
    addNotification("Share feature coming soon!", "info");
  };

  // Calculate progress metrics
  const totalCount = checklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedCount = checklist.reduce((acc, cat) => acc + cat.items.filter(item => item.checked).length, 0);
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const filteredChecklist = selectedCategory === 'all'
    ? checklist
    : checklist.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.priority === selectedCategory)
      })).filter(cat => cat.items.length > 0);

  // Render based on step
  if (step === 'landing') return <LandingPage onStart={() => setStep('purpose')} />;
  if (step === 'purpose') return <PurposeSelection onPurposeSelect={handlePurposeSelect} />;
  if (step === 'form') return (
    <FormPage
      userContext={userContext}
      onUserContextChange={setUserContext}
      onDestinationSelect={handleDestinationSelect}
      loading={loading}
    />
  );

  if (step === 'checklist') return (
    <>
      <Dashboard
        userContext={userContext}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={setSelectedCategory}
        notifications={notifications}
        showNotifications={showNotifications}
        onShowNotificationsChange={setShowNotifications}
        checklist={checklist}
        onChecklistChange={setChecklist}
        expandedItems={expandedItems}
        onExpandedItemsChange={setExpandedItems}
        riskScore={riskScore}
        budgetBreakdown={budgetBreakdown}
        chatMessages={chatMessages}
        inputMessage={inputMessage}
        onInputMessageChange={setInputMessage}
        onSendMessage={handleSendMessage}
        loading={loading}
        totalCount={totalCount}
        completedCount={completedCount}
        progress={progress}
        filteredChecklist={filteredChecklist}
        onExportPDF={exportPDF}
        onShareProgress={shareProgress}
      />

      {/* Agent Dashboard (experimental) */}
      <div style={{ maxWidth: 960, margin: '12px auto' }}>
        <AgentDashboard />
      </div>
    </>
  );

  return null;
};

export default RelocateAI;