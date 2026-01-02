import React from 'react';
import {
  Plane, Bell, Download, Share2, X, CheckCircle2, Info, AlertTriangle,
  TrendingUp, Send, Shield, DollarSign, Home, Users, Award,
  ChevronDown, ChevronUp, Circle, FileText, MapPin, Calendar, Target,
  Home as HomeIcon, Clock, Star
} from 'lucide-react';
import type {
  UserContext, ActiveTab, SelectedCategory, Notification,
  ChecklistCategory, RiskScore, BudgetBreakdown, ChatMessage
} from '../types';
import AgentInline from './AgentInline';

interface DashboardProps {
  userContext: UserContext;
  activeTab: ActiveTab;
  onActiveTabChange: (tab: ActiveTab) => void;
  selectedCategory: SelectedCategory;
  onSelectedCategoryChange: (category: SelectedCategory) => void;
  notifications: Notification[];
  showNotifications: boolean;
  onShowNotificationsChange: (show: boolean) => void;
  checklist: ChecklistCategory[];
  onChecklistChange: (checklist: ChecklistCategory[]) => void;
  expandedItems: Record<string, boolean>;
  onExpandedItemsChange: (items: Record<string, boolean>) => void;
  riskScore: RiskScore | null;
  budgetBreakdown: BudgetBreakdown | null;
  chatMessages: ChatMessage[];
  inputMessage: string;
  onInputMessageChange: (message: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  totalCount: number;
  completedCount: number;
  progress: number;
  filteredChecklist: ChecklistCategory[];
  onExportPDF: () => void;
  onShareProgress: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userContext,
  activeTab,
  onActiveTabChange,
  selectedCategory,
  onSelectedCategoryChange,
  notifications,
  showNotifications,
  onShowNotificationsChange,
  checklist,
  onChecklistChange,
  expandedItems,
  onExpandedItemsChange,
  riskScore,
  budgetBreakdown,
  chatMessages,
  inputMessage,
  onInputMessageChange,
  onSendMessage,
  loading,
  totalCount,
  completedCount,
  progress,
  filteredChecklist,
  onExportPDF,
  onShareProgress
}) => {
  const toggleChecklistItem = (itemId: string | number): void => {
    const key = String(itemId);
    const newChecklist = checklist.map(cat => ({
      ...cat,
      items: cat.items.map(item =>
        item.id === key ? { ...item, checked: !item.checked } : item
      )
    }));
    onChecklistChange(newChecklist);
  };

  const toggleExpand = (itemId: string | number): void => {
    const key = String(itemId);
    onExpandedItemsChange({
      ...expandedItems,
      [key]: !expandedItems[key]
    });
  };

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
                onClick={() => onShowNotificationsChange(!showNotifications)}
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
                onClick={onExportPDF}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={onShareProgress}
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
            <button onClick={() => onShowNotificationsChange(false)}>
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
            onClick={() => onActiveTabChange('checklist')}
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
            onClick={() => onActiveTabChange('overview')}
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
            onClick={() => onActiveTabChange('chat')}
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
                            <div className="text-sm text-gray-600">{budgetBreakdown.accommodation.daily}/night</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">{budgetBreakdown.accommodation.total}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-orange-600 mr-3" />
                          <div>
                            <div className="font-semibold text-gray-900">Food & Dining</div>
                            <div className="text-sm text-gray-600">{budgetBreakdown.food.daily}/day</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">{budgetBreakdown.food.total}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <Target className="w-5 h-5 text-purple-600 mr-3" />
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
                          <div className="font-bold text-gray-900">Total Estimated Cost</div>
                          <div className="text-2xl font-bold text-green-600">{budgetBreakdown.total}</div>
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
                    onChange={(e) => onSelectedCategoryChange(e.target.value as SelectedCategory)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical Only</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div className="space-y-6">
                  {filteredChecklist.map(category => (
                    <div key={category.id} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <category.icon className="w-6 h-6 mr-3 text-blue-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                              <p className="text-sm text-gray-600">Confidence: {category.confidence}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            category.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            category.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            category.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {category.priority}
                          </div>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {category.items.map(item => (
                          <div key={item.id} className="p-6">
                            <div className="flex items-start">
                              <button
                                onClick={() => toggleChecklistItem(item.id)}
                                className="mt-1 mr-4 flex-shrink-0"
                              >
                                {item.checked ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                                ) : (
                                  <Circle className="w-6 h-6 text-gray-400" />
                                )}
                              </button>

                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className={`text-lg font-semibold ${
                                    item.checked ? 'text-gray-500 line-through' : 'text-gray-900'
                                  }`}>
                                    {item.title}
                                  </h4>
                                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                    item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                    item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {item.priority}
                                  </div>
                                </div>

                                <div className="text-sm text-gray-600 mb-3">
                                  <p><strong>Deadline:</strong> {item.deadline}</p>
                                  <p><strong>Time:</strong> {item.estimatedTime}</p>
                                  {item.cost && <p><strong>Cost:</strong> {item.cost}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => toggleExpand(item.id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center"
                                  >
                                    {expandedItems[item.id] ? (
                                      <>
                                        <ChevronUp className="w-4 h-4 mr-1" />
                                        Hide Details
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-4 h-4 mr-1" />
                                        Show Details
                                      </>
                                    )}
                                  </button>

                                  <div className="text-xs text-gray-500">
                                    Source: {item.source}
                                  </div>
                                </div>

                                {expandedItems[item.id] && (
                                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="mb-3">
                                      <h5 className="font-semibold text-gray-900 mb-1">Details:</h5>
                                      <p className="text-sm text-gray-700">{item.detail}</p>
                                    </div>
                                    <div>
                                      <h5 className="font-semibold text-gray-900 mb-1">Risks:</h5>
                                      <p className="text-sm text-red-700">{item.risk}</p>
                                    </div>

                                    {/* Agent inline suggestion */}
                                    <div style={{ marginTop: 12 }}>
                                      <AgentInline item={item} userContext={userContext} />
                                    </div>

                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Assistant</h2>

                <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                  {loading && (
                    <div className="text-left mb-4">
                      <div className="inline-block px-4 py-2 rounded-lg bg-white border border-gray-200">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => onInputMessageChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                    placeholder="Ask me anything about your relocation..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={onSendMessage}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-semibold text-blue-900">View Documents</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-semibold text-green-900">Find Accommodation</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="font-semibold text-purple-900">Book Appointments</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-bold text-green-600">{completedCount}/{totalCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;