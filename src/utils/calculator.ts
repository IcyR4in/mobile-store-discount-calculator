import { SubsidyTier, CalculationResult, CalculatorState } from '../types';
import { SUBSIDY_TIERS, SUBSIDY_CAP, SUBSIDY_RATE } from '../constants/subsidyTiers';
import { clampToZero } from './rounding';

// 根据国补计算基数获取档位
export function getSubsidyTier(base: number): SubsidyTier | null {
  if (base < 1000) return null;

  for (const tier of SUBSIDY_TIERS) {
    if (base >= tier.minBase && (tier.maxBase === null || base < tier.maxBase)) {
      return tier;
    }
  }

  return null;
}

// 计算国补金额
// G_raw = (B - T) × 15%
// G = min(G_raw, 500)
export function calculateSubsidy(base: number, tier: SubsidyTier | null): {
  rawSubsidy: number;
  isCapped: boolean;
  actualSubsidy: number;
  priceAfterSubsidy: number;
} {
  if (!tier) {
    return {
      rawSubsidy: 0,
      isCapped: false,
      actualSubsidy: 0,
      priceAfterSubsidy: base,
    };
  }

  const tierAmount = tier.tierAmount;
  const rawSubsidy = (base - tierAmount) * SUBSIDY_RATE;
  const isCapped = rawSubsidy > SUBSIDY_CAP;
  const actualSubsidy = Math.min(rawSubsidy, SUBSIDY_CAP);

  // 国补后价格 = (B - T) × 0.85 + T
  const priceAfterSubsidy = base - actualSubsidy;

  return {
    rawSubsidy,
    isCapped,
    actualSubsidy,
    priceAfterSubsidy,
  };
}

// 核心计算引擎 - 计算最终价格
// 模式自动判断: 有门店优惠就模式B,无门店优惠就模式A
export function calculateFinalPrice(state: CalculatorState, subsidyConfirmed: boolean): CalculationResult {
  const {
    originalPrice,
    storeDiscount,
    otherDiscount,
    tradeInAmount,
  } = state;

  const storeDiscountAmount = storeDiscount.amount;

  // 自动判断模式: 有门店优惠就模式B(按优惠后价格计算),否则模式A(按原价计算)
  const useModeB = storeDiscountAmount > 0;

  // Step 1: 计算国补基数
  // 模式A: B = 商品原价
  // 模式B: B = 商品原价 - 门店优惠
  const subsidyBase = useModeB
    ? clampToZero(originalPrice - storeDiscountAmount)
    : originalPrice;

  // Step 2: 判断国补档位
  const subsidyTier = getSubsidyTier(subsidyBase);
  const tierAmount = subsidyTier?.tierAmount ?? 0;

  // Step 3: 计算国补
  const subsidyCalc = calculateSubsidy(subsidyBase, subsidyTier);

  // Step 4: 计算最终成交价
  let finalPrice: number;

  if (!subsidyConfirmed) {
    // 待核验时,国补不计入最终价格
    finalPrice = originalPrice - storeDiscountAmount - (otherDiscount.enabled ? otherDiscount.amount : 0);
  } else {
    // 已确认时,国补计入最终价格
    if (useModeB) {
      // 模式B: 国补后价格 - 其他优惠(门店优惠已在基数中扣除)
      const otherAmount = otherDiscount.enabled ? otherDiscount.amount : 0;
      finalPrice = subsidyCalc.priceAfterSubsidy - otherAmount;
    } else {
      // 模式A: 原价 - 国补 - 门店优惠 - 其他优惠
      const otherAmount = otherDiscount.enabled ? otherDiscount.amount : 0;
      finalPrice = originalPrice - subsidyCalc.actualSubsidy - storeDiscountAmount - otherAmount;
    }
  }

  // 确保不为负
  finalPrice = clampToZero(finalPrice);

  // Step 5: 计算换新实付
  const tradeInFinal = clampToZero(finalPrice - tradeInAmount);

  return {
    subsidyBase,
    subsidyTier,
    tierAmount,
    rawSubsidy: subsidyCalc.rawSubsidy,
    isCapped: subsidyCalc.isCapped,
    actualSubsidy: subsidyConfirmed ? subsidyCalc.actualSubsidy : 0,
    priceAfterSubsidy: subsidyCalc.priceAfterSubsidy,
    finalPrice,
    tradeInFinal,
  };
}

// 验证金额输入
export function validateAmount(value: number): number {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  return Math.max(0, value);
}

// 解析输入字符串为数字
export function parseAmountInput(input: string): number {
  const cleaned = input.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}
