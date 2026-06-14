import { useState, useCallback, useEffect, useRef } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { parseAmountInput } from '../utils/calculator';

interface OriginalPriceInputProps {
  value: number;
  onChange: (value: number) => void;
  onClear: () => void;
  onResetAll: () => void;
}

export function OriginalPriceInput({
  value,
  onChange,
  onClear,
  onResetAll,
}: OriginalPriceInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部值变化
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // 处理输入变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // 处理失焦解析
  const handleBlur = useCallback(() => {
    const parsed = parseAmountInput(inputValue);
    onChange(parsed);
    setInputValue(parsed.toString());
  }, [inputValue, onChange]);

  // 处理回车键
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }, []);

  // 清空按钮
  const handleClear = useCallback(() => {
    onClear();
    setInputValue('0');
    inputRef.current?.focus();
  }, [onClear]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">商品原价</h2>
        <button
          onClick={onResetAll}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="重置全部数据"
        >
          <RotateCcw className="w-4 h-4" />
          重置全部
        </button>
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">¥</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 py-4 text-3xl font-bold text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          placeholder="0"
        />
        {value > 0 && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-500">
        输入商品原价后,下方计算将实时更新
      </p>
    </div>
  );
}
