import { useState, useCallback } from 'react';
import { Gift, Check, Smartphone, Settings, Users, Shield, Sparkles } from 'lucide-react';

interface MemberServicesProps {
  onUnlock?: () => void;
}

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const defaultServices: Service[] = [
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: '免费数据迁移',
    description: '新机数据迁移,无忧换机',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: '免费手机清洁',
    description: '专业清洁服务,焕然一新',
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: '免费基础设置',
    description: '手机初始化设置,开机即用',
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: '一年内免费贴膜2次',
    description: '保护屏幕,持久如新',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: '老年人手机使用指导',
    description: '耐心讲解,轻松上手',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: '售后问题协助',
    description: '专业售后支持,全程无忧',
  },
];

export function MemberServices({ onUnlock }: MemberServicesProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    onUnlock?.();

    // 依次显示卡片
    defaultServices.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 200);
    });
  }, [onUnlock]);

  const handleCollapse = useCallback(() => {
    setVisibleCards([]);
    setTimeout(() => {
      setUnlocked(false);
    }, 200);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-pink-600" />
        <h2 className="text-xl font-semibold text-gray-800">会员权益</h2>
      </div>

      {!unlocked ? (
        <button
          onClick={handleUnlock}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          解锁会员权益
        </button>
      ) : (
        <div>
          <div className="space-y-3">
            {defaultServices.map((service, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-500 ${
                  visibleCards.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                  {service.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{service.title}</div>
                  <div className="text-sm text-gray-500">{service.description}</div>
                </div>
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />
              </div>
            ))}
          </div>

          <button
            onClick={handleCollapse}
            className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            收起会员权益
          </button>
        </div>
      )}
    </div>
  );
}
