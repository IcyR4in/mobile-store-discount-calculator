import { AlertTriangle, Calculator } from 'lucide-react';
import { CalculationResult, CalculatorState } from '../types';
import { AnimatedNumber } from './AnimatedNumber';

interface SubsidyDisplayProps {
  state: CalculatorState;
  displayResult: CalculationResult;
}

export function SubsidyDisplay({ state, displayResult }: SubsidyDisplayProps) {
  const subsidyConfirmed = state.subsidyStatus === 'confirmed';
  const hasTier = displayResult.subsidyTier !== null;
  const hasStoreDiscount = state.storeDiscount.amount > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">国补实际优惠</h2>
      </div>

      {/* 模式提示 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        {hasStoreDiscount ? (
          <span>模式 B: 按门店优惠后价格计算 (基数 = 原价 - 门店优惠 = ¥{displayResult.subsidyBase})</span>
        ) : (
          <span>模式 A: 按商品原价计算 (基数 = 原价 = ¥{displayResult.subsidyBase})</span>
        )}
      </div>

      {/* 未进入档位提示 */}
      {!hasTier && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">当前价格未进入国补计算范围</span>
          </div>
        </div>
      )}

      {/* 国补金额展示 */}
      {hasTier && (
        <div className="space-y-4">
          {/* 国补金额 */}
          <div className={`p-4 rounded-lg ${subsidyConfirmed ? 'bg-green-50' : 'bg-amber-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">
                  {subsidyConfirmed ? '国补实际优惠' : '预计国补优惠'}
                </div>
                {displayResult.isCapped && (
                  <div className="text-xs text-amber-600 mt-1">(已触发500元上限)</div>
                )}
              </div>
              <div className="text-right">
                <AnimatedNumber
                  value={displayResult.actualSubsidy}
                  prefix="¥"
                  className={`text-3xl font-bold ${subsidyConfirmed ? 'text-green-700' : 'text-amber-600'}`}
                />
              </div>
            </div>
          </div>

          {/* 待核验提示 */}
          {!subsidyConfirmed && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>预计优惠,待现场资格核验后生效</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
