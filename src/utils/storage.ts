import { StoreDiscountPlan, CalculatorState } from '../types';

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = 'phone_store_calculator_';

// 存储键名
const KEYS = {
  PLANS: `${STORAGE_PREFIX}store_discount_plans`,
  STATE: `${STORAGE_PREFIX}last_state`,
} as const;

// 带版本的数据结构
interface VersionedData<T> {
  version: number;
  data: T;
}

// 默认门店优惠方案
const DEFAULT_PLANS: StoreDiscountPlan[] = [
  { id: '1', name: '开业优惠', amount: 100, order: 1, createdAt: Date.now() },
  { id: '2', name: '会员优惠', amount: 200, order: 2, createdAt: Date.now() },
  { id: '3', name: '节日优惠', amount: 300, order: 3, createdAt: Date.now() },
  { id: '4', name: '清仓优惠', amount: 500, order: 4, createdAt: Date.now() },
];

// 安全读取 localStorage
function safeRead<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;

    const parsed: VersionedData<T> = JSON.parse(raw);

    // 版本检查
    if (parsed.version !== STORAGE_VERSION) {
      // 版本不匹配,重置数据
      localStorage.removeItem(key);
      return defaultValue;
    }

    return parsed.data;
  } catch {
    // 解析失败,返回默认值
    return defaultValue;
  }
}

// 安全写入 localStorage
function safeWrite<T>(key: string, data: T): boolean {
  try {
    const versioned: VersionedData<T> = {
      version: STORAGE_VERSION,
      data,
    };
    localStorage.setItem(key, JSON.stringify(versioned));
    return true;
  } catch {
    // 存储失败(如容量已满)
    console.warn('localStorage write failed');
    return false;
  }
}

// 读取门店优惠方案列表
export function loadStoreDiscountPlans(): StoreDiscountPlan[] {
  return safeRead<StoreDiscountPlan[]>(KEYS.PLANS, DEFAULT_PLANS);
}

// 保存门店优惠方案列表
export function saveStoreDiscountPlans(plans: StoreDiscountPlan[]): boolean {
  return safeWrite(KEYS.PLANS, plans);
}

// 读取上次计算器状态
export function loadLastState(): Partial<CalculatorState> | null {
  return safeRead<Partial<CalculatorState> | null>(KEYS.STATE, null);
}

// 保存当前计算器状态
export function saveCurrentState(state: Partial<CalculatorState>): boolean {
  return safeWrite(KEYS.STATE, state);
}

// 清空所有数据
export function clearAllData(): void {
  try {
    localStorage.removeItem(KEYS.PLANS);
    localStorage.removeItem(KEYS.STATE);
  } catch {
    // 忽略错误
  }
}

// 重置为默认方案
export function resetToDefaultPlans(): void {
  saveStoreDiscountPlans(DEFAULT_PLANS);
}
