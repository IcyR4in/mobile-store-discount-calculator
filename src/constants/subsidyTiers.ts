import { SubsidyTier } from '../types';

// 国补档位配置
// 规则: 根据国补计算基数 B 判断档位
// B < 1000: 不进入档位,国补为0
// 1000 <= B < 2000: 档位金额 199
// 2000 <= B < 3000: 档位金额 299
// 3000 <= B < 4000: 档位金额 399
// B >= 4000: 档位金额 499

export const SUBSIDY_TIERS: SubsidyTier[] = [
  {
    minBase: 4000,
    maxBase: null,
    label: '4xxx元档',
    tierAmount: 499,
  },
  {
    minBase: 3000,
    maxBase: 4000,
    label: '3xxx元档',
    tierAmount: 399,
  },
  {
    minBase: 2000,
    maxBase: 3000,
    label: '2xxx元档',
    tierAmount: 299,
  },
  {
    minBase: 1000,
    maxBase: 2000,
    label: '1xxx元档',
    tierAmount: 199,
  },
];

// 国补上限金额
export const SUBSIDY_CAP = 500;

// 国补优惠比例 (15%)
export const SUBSIDY_RATE = 0.15;

// 默认商品原价
export const DEFAULT_ORIGINAL_PRICE = 3499;
