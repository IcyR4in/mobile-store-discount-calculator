import { useState, useCallback } from 'react';
import { Gift, Smartphone, Cable, Star, ChevronUp } from 'lucide-react';

interface GiftItem {
  icon: React.ReactNode;
  name: string;
  description: string;
}

const defaultGifts: GiftItem[] = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    name: '手机保护壳',
    description: '高品质保护壳',
  },
  {
    icon: <Cable className="w-8 h-8" />,
    name: '数据线',
    description: '原装数据线一根',
  },
  {
    icon: <Star className="w-8 h-8" />,
    name: '会员积分300分',
    description: '可用于兑换礼品',
  },
];

export function GiftBox() {
  const [opened, setOpened] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [visibleGifts, setVisibleGifts] = useState<number[]>([]);

  const handleOpen = useCallback(() => {
    if (animating || opened) return;

    setAnimating(true);

    // 礼盒动画持续时间
    setTimeout(() => {
      setOpened(true);
      setAnimating(false);

      // 依次显示赠品
      defaultGifts.forEach((_, index) => {
        setTimeout(() => {
          setVisibleGifts(prev => [...prev, index]);
        }, index * 300);
      });
    }, 500);
  }, [animating, opened]);

  const handleCollapse = useCallback(() => {
    setVisibleGifts([]);
    setTimeout(() => {
      setOpened(false);
    }, 200);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-amber-600" />
        <h2 className="text-xl font-semibold text-gray-800">购机礼包</h2>
      </div>

      {!opened ? (
        <button
          onClick={handleOpen}
          disabled={animating}
          className="w-full relative group"
        >
          {/* 礼盒盒子 */}
          <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-8 transition-transform ${animating ? 'animate-bounce' : 'hover:scale-[1.02]'}`}>
            <div className="flex flex-col items-center">
              {/* 盒盖 */}
              <div className={`relative transition-transform ${animating ? '-translate-y-8' : ''}`}>
                <Gift className="w-16 h-16 text-white" />
              </div>

              <div className="mt-4 text-white font-semibold text-lg">
                {animating ? '开启中...' : '点击开启购机礼包'}
              </div>

              <div className="mt-2 text-white/80 text-sm">
                查看已确认的赠品
              </div>
            </div>

            {/* 装饰星星 */}
            <div className="absolute top-2 right-4 animate-pulse">
              <Star className="w-4 h-4 text-yellow-200" />
            </div>
            <div className="absolute bottom-4 left-4 animate-pulse delay-100">
              <Star className="w-3 h-3 text-yellow-200" />
            </div>
          </div>
        </button>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {defaultGifts.map((gift, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-4 bg-orange-50 rounded-xl transition-all duration-500 ${
                  visibleGifts.includes(index)
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-75'
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white">
                  {gift.icon}
                </div>
                <div className="mt-3 font-semibold text-gray-800 text-center">
                  {gift.name}
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {gift.description}
                </div>
              </div>
            ))}
          </div>

         <button
  onClick={handleUnlock}
  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
>
  <Check className="w-5 h-5" />
  解锁会员权益
</button>
        </div>
      )}
    </div>
  );
}
