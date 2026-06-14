import { useCallback, useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { OriginalPriceInput } from './components/OriginalPriceInput';
import { StoreDiscountCard } from './components/StoreDiscountCard';
import { SubsidyStatusToggle } from './components/SubsidyStatusToggle';
import { SubsidyDisplay } from './components/SubsidyDisplay';
import { OtherDiscountComponent } from './components/OtherDiscount';
import { TradeInInput } from './components/TradeInInput';
import { PriceDisplay } from './components/PriceDisplay';
import { MemberServices } from './components/MemberServices';
import { GiftBox } from './components/GiftBox';
import { useCalculator } from './hooks/useCalculator';
import { StoreDiscountPlan, CurrentStoreDiscount } from './types';
import { loadStoreDiscountPlans, saveStoreDiscountPlans } from './utils/storage';

function App() {
  // 门店优惠方案
  const [storeDiscountPlans, setStoreDiscountPlans] = useState<StoreDiscountPlan[]>([]);

  // 计算器状态
  const {
    state,
    result,
    displayResult,
    setOriginalPrice,
    setStoreDiscount,
    setSubsidyStatus,
    setOtherDiscount,
    setTradeInAmount,
    resetAll,
    clearOriginalPrice,
  } = useCalculator();

  // 初始化加载门店优惠方案
  useEffect(() => {
    const savedPlans = loadStoreDiscountPlans();
    setStoreDiscountPlans(savedPlans);
  }, []);

  // 保存门店优惠方案到 localStorage
  const handleSavePlans = useCallback((plans: StoreDiscountPlan[]) => {
    setStoreDiscountPlans(plans);
    saveStoreDiscountPlans(plans);
  }, []);

  // 选择门店优惠方案
  const handleSelectPlan = useCallback((plan: StoreDiscountPlan) => {
    setStoreDiscount({
      planId: plan.id,
      name: plan.name,
      amount: plan.amount,
    });
  }, [setStoreDiscount]);

  // 更新当前门店优惠
  const handleUpdateDiscount = useCallback((currentDiscount: CurrentStoreDiscount) => {
    setStoreDiscount(currentDiscount);
  }, [setStoreDiscount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">手机门店互动优惠计算器</h1>
          <p className="text-gray-500">输入商品原价,体验实时优惠计算展示</p>
        </div>

        {/* 1. 商品原价 */}
        <OriginalPriceInput
          value={state.originalPrice}
          onChange={setOriginalPrice}
          onClear={clearOriginalPrice}
          onResetAll={resetAll}
        />

        {/* 2. 门店优惠互动卡 */}
        <StoreDiscountCard
          currentDiscount={state.storeDiscount}
          plans={storeDiscountPlans}
          onSelectPlan={handleSelectPlan}
          onUpdateCurrent={handleUpdateDiscount}
          onSavePlans={handleSavePlans}
        />

        {/* 3. 国补资格状态 */}
        <SubsidyStatusToggle
          value={state.subsidyStatus}
          onChange={setSubsidyStatus}
        />

        {/* 4. 国补实际优惠 */}
        <SubsidyDisplay
          state={state}
          displayResult={displayResult}
        />

        {/* 5. 其他优惠 */}
        <OtherDiscountComponent
          value={state.otherDiscount}
          onChange={setOtherDiscount}
        />

        {/* 6. 旧机预计抵扣 */}
        <TradeInInput
          value={state.tradeInAmount}
          onChange={setTradeInAmount}
        />

        {/* 7. 价格明细 */}
        <PriceDisplay
          state={state}
          result={result}
        />

        {/* 8. 会员权益 */}
        <MemberServices />

        {/* 9. 购机礼包 */}
        <GiftBox />

        {/* 页脚 */}
        <div className="text-center text-sm text-gray-400 mt-8 pb-8">
          <p>数据仅保存在本地浏览器</p>
          <p>刷新页面后优惠方案将保留</p>
        </div>
      </div>
    </div>
  );
}

export default App;
