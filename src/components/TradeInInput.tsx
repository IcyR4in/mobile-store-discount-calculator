import { useState, useCallback } from 'react';
import { Smartphone } from 'lucide-react';
import { parseAmountInput } from '../utils/calculator';

interface TradeInInputProps {
  value: number;
  onChange: (amount: number) => void;
}

export function TradeInInput({ value, onChange }: TradeInInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    const parsed = parseAmountInput(inputValue);
    setInputValue(parsed.toString());
    onChange(parsed);
  }, [inputValue, onChange]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-5 h-5 text-cyan-600" />
        <h2 className="text-xl font-semibold text-gray-800">旧机预计抵扣</h2>
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">¥</span>
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          className="w-full pl-10 pr-4 py-3 text-xl font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all"
          placeholder="输入旧机抵扣金额"
        />
      </div>

      <p className="mt-3 text-sm text-gray-500">
        旧机抵扣不影响商品成交价,单独计入换新实付
      </p>
    </div>
  );
}
