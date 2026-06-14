import { ShoppingCart, RefreshCw } from 'lucide-react';
import { CalculationResult, CalculatorState } from '../types';
import { AnimatedNumber } from './AnimatedNumber';

interface PriceDisplayProps {
  state: CalculatorState;
  result: CalculationResult;
}

export function PriceDisplay({ state, result }: PriceDisplayProps) {
  const subsidyConfirmed = state.subsidyStatus === 'confirmed';
  const hasSubsidy = subsidyConfirmed && result.actualSubsidy > 0;
  const hasStoreDiscount = state.storeDiscount.amount > 0;
  const hasOtherDiscount = state.otherDiscount.enabled && state.otherDiscount.amount > 0;
  const hasTradeIn = state.tradeInAmount > 0;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-blue-200" />
        <h2 className="text-xl font-semibold">价格明细</h2>
      </div>

      {/* 计算明细 */}
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between py-2 border-b border-blue-500/30">
          <span className="text-blue-200">商品原价</span>
          <span className="font-medium">¥{state.originalPrice}</span>
        </div>

        {hasStoreDiscount && (
          <div className="flex justify-between py-2 border-b border-blue-500/30">
            <span className="text-blue-200">
              {state.storeDiscount.name || '门店优惠'}
            </span>
            <span className="font-medium">-¥{state.storeDiscount.amount}</span>
          </div>
        )}

        {hasSubsidy && (
          <div className="flex justify-between py-2 border-b border-blue-500/30">
            <span className="text-blue-200">国补优惠</span>
            <span className="font-medium">-¥{Math.round(result.actualSubsidy)}</span>
          </div>
        )}

        {hasOtherDiscount && (
          <div className="flex justify-between py-2 border-b border-blue-500/30">
            <span className="text-blue-200">
              {state.otherDiscount.name || '其他优惠'}
            </span>
            <span className="font-medium">-¥{state.otherDiscount.amount}</span>
          </div>
        )}

        {!hasSubsidy && !hasStoreDiscount && !hasOtherDiscount && (
          <div className="py-2 border-b border-blue-500/30 text-blue-300 text-center text-sm">
            暂无优惠
          </div>
        )}
      </div>

      {/* 商品成交价 */}
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-blue-100">商品成交价</span>
          <div className="text-right">
            <AnimatedNumber
              value={result.finalPrice}
              prefix="¥"
              className="text-3xl font-bold"
            />
          </div>
        </div>
      </div>

      {/* 旧机抵扣和换新实付 */}
      {hasTradeIn && (
        <>
          <div className="flex justify-between py-2 text-sm border-t border-blue-500/30">
            <span className="text-blue-200">旧机预计抵扣</span>
            <span className="font-medium">-¥{state.tradeInAmount}</span>
          </div>

          <div className="bg-green-400/20 rounded-xl p-4 mt-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-green-300" />
                <span className="text-green-100">换新预计实付</span>
              </div>
              <div className="text-right">
                <AnimatedNumber
                  value={result.tradeInFinal}
                  prefix="¥"
                  className="text-3xl font-bold text-green-300"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
