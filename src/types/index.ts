// 门店优惠方案
export interface StoreDiscountPlan {
  id: string;
  name: string;
  amount: number;
  order: number;
  createdAt: number;
}

// 国补资格状态
export type SubsidyStatus = 'confirmed' | 'pending';

// 其他优惠
export interface OtherDiscount {
  enabled: boolean;
  name: string;
  amount: number;
}

// 当前门店优惠状态
export interface CurrentStoreDiscount {
  planId: string | null;
  name: string;
  amount: number;
}

// 计算器状态
export interface CalculatorState {
  originalPrice: number;
  storeDiscount: CurrentStoreDiscount;
  subsidyStatus: SubsidyStatus;
  otherDiscount: OtherDiscount;
  tradeInAmount: number;
}

// 国补档位信息
export interface SubsidyTier {
  minBase: number;
  maxBase: number | null;
  label: string;
  tierAmount: number;
}

// 国补计算结果
export interface SubsidyResult {
  base: number;
  tier: SubsidyTier | null;
  rawSubsidy: number;
  isCapped: boolean;
  actualSubsidy: number;
  priceAfterSubsidy: number;
}

// 最终计算结果
export interface CalculationResult {
  subsidyBase: number;
  subsidyTier: SubsidyTier | null;
  tierAmount: number;
  rawSubsidy: number;
  isCapped: boolean;
  actualSubsidy: number;
  priceAfterSubsidy: number;
  finalPrice: number;
  tradeInFinal: number;
}

// localStorage 存储结构
export interface StorageData {
  storeDiscountPlans: StoreDiscountPlan[];
  lastCalculatorState?: Partial<CalculatorState>;
}
