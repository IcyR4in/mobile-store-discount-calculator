import { CheckCircle, Clock } from 'lucide-react';
import { SubsidyStatus } from '../types';
import { useState } from 'react';

interface SubsidyStatusToggleProps {
  value: SubsidyStatus;
  onChange: (status: SubsidyStatus) => void;
}

export function SubsidyStatusToggle({ value, onChange }: SubsidyStatusToggleProps) {
  const [confirmed, setConfirmed] = useState(value === 'confirmed');

  const handleToggle = () => {
    const newStatus = confirmed ? 'pending' : 'confirmed';
    setConfirmed(!confirmed);
    onChange(newStatus);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {confirmed ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <Clock className="w-6 h-6 text-amber-500" />
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">国补资格状态</h2>
            <p className="text-sm text-gray-500">
              {confirmed ? '已确认符合资格' : '资格待核验'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            confirmed ? 'bg-green-500' : 'bg-amber-400'
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
              confirmed ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {!confirmed && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            预计优惠金额将在现场资格核验后生效
          </p>
        </div>
      )}
    </div>
  );
}
