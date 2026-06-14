import { useState, useMemo, useCallback } from 'react';
import {
  CalculatorState,
  CalculationResult,
  SubsidyStatus,
  OtherDiscount,
  CurrentStoreDiscount,
} from '../types';
import { calculateFinalPrice, validateAmount } from '../utils/calculator';
import { DEFAULT_ORIGINAL_PRICE } from '../constants/subsidyTiers';

const DEFAULT_OTHER_DISCOUNT: OtherDiscount = {
  enabled: false,
  name: '其他优惠',
  amount: 0,
};

const DEFAULT_STORE_DISCOUNT: CurrentStoreDiscount = {
  planId: null,
  name: '',
  amount: 0,
};

const DEFAULT_STATE: CalculatorState = {
  originalPrice: DEFAULT_ORIGINAL_PRICE,
  storeDiscount: DEFAULT_STORE_DISCOUNT,
  subsidyStatus: 'confirmed',
  otherDiscount: DEFAULT_OTHER_DISCOUNT,
  tradeInAmount: 0,
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  // 计算结果
  const result = useMemo<CalculationResult>(() => {
    const subsidyConfirmed = state.subsidyStatus === 'confirmed';
    return calculateFinalPrice(state, subsidyConfirmed);
  }, [state]);

  // 显示用的国补结果(包含待核验时的预计值)
  const displayResult = useMemo<CalculationResult>(() => {
    return calculateFinalPrice(state, true); // 始终按已确认计算用于展示
  }, [state]);

  // 更新商品原价
  const setOriginalPrice = useCallback((price: number) => {
    setState(prev => ({
      ...prev,
      originalPrice: validateAmount(price),
    }));
  }, []);

  // 更新门店优惠
  const setStoreDiscount = useCallback((discount: CurrentStoreDiscount) => {
    setState(prev => ({
      ...prev,
      storeDiscount: {
        ...discount,
        amount: validateAmount(discount.amount),
      },
    }));
  }, []);

  // 切换国补资格状态
  const setSubsidyStatus = useCallback((status: SubsidyStatus) => {
    setState(prev => ({ ...prev, subsidyStatus: status }));
  }, []);

  // 更新其他优惠
  const setOtherDiscount = useCallback((discount: OtherDiscount) => {
    setState(prev => ({
      ...prev,
      otherDiscount: {
        ...discount,
        amount: validateAmount(discount.amount),
      },
    }));
  }, []);

  // 更新旧机抵扣
  const setTradeInAmount = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      tradeInAmount: validateAmount(amount),
    }));
  }, []);

  // 重置所有数据
  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  // 清空商品原价
  const clearOriginalPrice = useCallback(() => {
    setState(prev => ({ ...prev, originalPrice: 0 }));
  }, []);

  return {
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
  };
}
