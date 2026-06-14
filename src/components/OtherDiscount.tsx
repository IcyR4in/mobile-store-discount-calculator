import { useState, useCallback } from 'react';
import { Tag, Power } from 'lucide-react';
import { OtherDiscount as OtherDiscountType } from '../types';
import { parseAmountInput } from '../utils/calculator';

interface OtherDiscountProps {
  value: OtherDiscountType;
  onChange: (discount: OtherDiscountType) => void;
}

export function OtherDiscountComponent({ value, onChange }: OtherDiscountProps) {
  const [nameInput, setNameInput] = useState(value.name);
  const [amountInput, setAmountInput] = useState(value.amount.toString());

  const handleToggleEnabled = useCallback(() => {
    onChange({
      ...value,
      enabled: !value.enabled,
    });
  }, [value, onChange]);

  const handleNameBlur = useCallback(() => {
    onChange({
      ...value,
      name: nameInput.trim() || '其他优惠',
    });
  }, [value, nameInput, onChange]);

  const handleAmountBlur = useCallback(() => {
    const parsed = parseAmountInput(amountInput);
    setAmountInput(parsed.toString());
    onChange({
      ...value,
      amount: parsed,
    });
  }, [value, amountInput, onChange]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">其他优惠</h2>
        </div>

        <button
          onClick={handleToggleEnabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            value.enabled
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          <Power className={`w-4 h-4 ${value.enabled ? 'text-green-600' : 'text-gray-400'}`} />
          <span className="text-sm font-medium">
            {value.enabled ? '已启用' : '已停用'}
          </span>
        </button>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!value.enabled ? 'opacity-50' : ''}`}>
        <div>
          <label className="block text-sm text-gray-500 mb-1">优惠名称</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleNameBlur}
            disabled={!value.enabled}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:bg-gray-50"
            placeholder="其他优惠"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">优惠金额</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
            <input
              type="text"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              onBlur={handleAmountBlur}
              disabled={!value.enabled}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:bg-gray-50"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        适用场景: 临时优惠、赠品折现、特殊活动、其他抵扣
      </p>
    </div>
  );
}
