import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';

interface CurrencyConverterProps {
  userContext: any;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ userContext }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('NGN');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock exchange rates (in real app, fetch from API)
  const exchangeRates: Record<string, Record<string, number>> = {
    USD: { NGN: 1500, EUR: 0.85, GBP: 0.75, AED: 3.67 },
    NGN: { USD: 0.00067, EUR: 0.00057, GBP: 0.0005, AED: 0.0024 },
    EUR: { USD: 1.18, NGN: 1765, GBP: 0.88, AED: 4.32 },
    GBP: { USD: 1.33, NGN: 2000, EUR: 1.14, AED: 4.90 },
    AED: { USD: 0.27, NGN: 408, EUR: 0.23, GBP: 0.20 }
  };

  useEffect(() => {
    if (userContext.origin === 'Lagos, Nigeria') {
      setFromCurrency('NGN');
      setToCurrency('USD');
    } else if (userContext.destination === 'UAE') {
      setFromCurrency('USD');
      setToCurrency('AED');
    }
  }, [userContext]);

  const convertCurrency = () => {
    setLoading(true);
    setTimeout(() => {
      const rate = exchangeRates[fromCurrency]?.[toCurrency];
      if (rate) {
        setConvertedAmount(amount * rate);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <DollarSign className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-900">Currency Converter</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="USD">USD</option>
            <option value="NGN">NGN</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="AED">AED</option>
          </select>
          
          <ArrowRight className="w-5 h-5 text-gray-400" />
          
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="USD">USD</option>
            <option value="NGN">NGN</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="AED">AED</option>
          </select>
        </div>
        
        <button
          onClick={convertCurrency}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
        
        {convertedAmount !== null && (
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-lg font-semibold text-green-800">
              {amount.toLocaleString()} {fromCurrency} = {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;