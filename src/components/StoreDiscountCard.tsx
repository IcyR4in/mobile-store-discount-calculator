import { useState, useCallback, useRef } from 'react';
import { Store, ChevronRight, Edit2, List, Settings, X, Plus, Trash2, GripVertical } from 'lucide-react';
import { StoreDiscountPlan, CurrentStoreDiscount } from '../types';
import { usePointerEvents } from '../hooks/usePointerEvents';
import { validateAmount } from '../utils/calculator';
import { generateId } from '../utils/helpers';

interface StoreDiscountCardProps {
  currentDiscount: CurrentStoreDiscount;
  plans: StoreDiscountPlan[];
  onSelectPlan: (plan: StoreDiscountPlan) => void;
  onUpdateCurrent: (discount: CurrentStoreDiscount) => void;
  onSavePlans: (plans: StoreDiscountPlan[]) => void;
}

export function StoreDiscountCard({
  currentDiscount,
  plans,
  onSelectPlan,
  onUpdateCurrent,
  onSavePlans,
}: StoreDiscountCardProps) {
  const [mode, setMode] = useState<'idle' | 'edit' | 'list' | 'manage'>('idle');
  const [editName, setEditName] = useState(currentDiscount.name);
  const [editAmount, setEditAmount] = useState(currentDiscount.amount.toString());
  const [editingPlan, setEditingPlan] = useState<StoreDiscountPlan | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 关闭所有弹窗
  const closeAllModes = useCallback(() => {
    setMode('idle');
    setEditName('');
    setEditAmount('');
    setEditingPlan(null);
  }, []);

  // 手势处理
  const gestureHandlers = usePointerEvents({
    onSingleClick: useCallback(() => {
      setEditName(currentDiscount.name);
      setEditAmount(currentDiscount.amount.toString());
      setMode('edit');
    }, [currentDiscount]),
    onDoubleClick: useCallback(() => {
      setMode('list');
    }, []),
    onLongPress: useCallback(() => {
      setMode('manage');
    }, []),
    longPressDelay: 600,
    doubleClickDelay: 300,
    moveThreshold: 10,
  });

  // 编辑弹窗保存
  const handleEditSave = useCallback(() => {
    const amount = validateAmount(parseFloat(editAmount) || 0);
    onUpdateCurrent({
      planId: null,
      name: editName.trim() || '门店优惠',
      amount,
    });
    closeAllModes();
  }, [editName, editAmount, onUpdateCurrent, closeAllModes]);

  // 选择方案
  const handleSelectPlan = useCallback((plan: StoreDiscountPlan) => {
    onSelectPlan(plan);
    closeAllModes();
  }, [onSelectPlan, closeAllModes]);

  // 添加新方案
  const handleAddPlan = useCallback(() => {
    const newPlan: StoreDiscountPlan = {
      id: generateId(),
      name: '新优惠方案',
      amount: 100,
      order: plans.length + 1,
      createdAt: Date.now(),
    };
    onSavePlans([...plans, newPlan]);
    setEditingPlan(newPlan);
  }, [plans, onSavePlans]);

  // 删除方案
  const handleDeletePlan = useCallback((planId: string) => {
    onSavePlans(plans.filter(p => p.id !== planId));
  }, [plans, onSavePlans]);

  // 更新方案
  const handleUpdatePlan = useCallback((plan: StoreDiscountPlan) => {
    onSavePlans(plans.map(p => p.id === plan.id ? plan : p));
    setEditingPlan(null);
  }, [plans, onSavePlans]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 relative">
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">门店优惠</h2>
      </div>

      {/* 主卡片 */}
      <div
        ref={cardRef}
        onPointerDown={gestureHandlers.onPointerDown}
        onPointerUp={gestureHandlers.onPointerUp}
        onPointerMove={gestureHandlers.onPointerMove}
        onContextMenu={(e) => e.preventDefault()}
        className={`relative cursor-pointer select-none transition-all ${
          currentDiscount.amount > 0
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
            : 'bg-gray-100 text-gray-400'
        } rounded-xl p-6 touch-manipulation`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-80 mb-1">
              {currentDiscount.name || '单击编辑优惠'}
            </div>
            <div className="text-3xl font-bold">
              {currentDiscount.amount > 0 ? `¥${currentDiscount.amount}` : '设置优惠'}
            </div>
          </div>
          <ChevronRight className="w-6 h-6 opacity-60" />
        </div>

        <div className="mt-4 text-xs opacity-60 text-center">
          单击编辑 · 双击选择优惠 · 长按管理方案
        </div>
      </div>

      {/* 编辑弹窗 */}
      {mode === 'edit' && (
        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl z-10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">本次优惠快速编辑</h3>
            </div>
            <button onClick={closeAllModes} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-sm text-gray-500 mb-1">优惠名称</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="例如: 节日优惠"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">优惠金额</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={closeAllModes}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              取消编辑
            </button>
            <button
              onClick={handleEditSave}
              className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              保存本次优惠
            </button>
          </div>
        </div>
      )}

      {/* 方案列表弹窗 */}
      {mode === 'list' && (
        <div className="mt-4 bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <List className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">已保存优惠方案</span>
          </div>

          <div className="space-y-2">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  currentDiscount.planId === plan.id
                    ? 'bg-indigo-100 border-2 border-indigo-500'
                    : 'bg-white border border-gray-200 hover:border-indigo-300'
                }`}
              >
                <span className="font-medium text-gray-800">{plan.name}</span>
                <span className="text-indigo-600 font-semibold">¥{plan.amount}</span>
              </button>
            ))}
          </div>

          <button
            onClick={closeAllModes}
            className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            关闭列表
          </button>
        </div>
      )}

      {/* 管理模式 */}
      {mode === 'manage' && (
        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl z-10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">保存方案管理</h3>
            </div>
            <button onClick={closeAllModes} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-grow space-y-2 overflow-y-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move flex-shrink-0" />
                <div className="flex-grow">
                  <div className="font-medium text-gray-800">{plan.name}</div>
                  <div className="text-sm text-indigo-600">¥{plan.amount}</div>
                </div>
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {editingPlan ? (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg space-y-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">优惠名称</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">优惠金额</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={editingPlan.amount}
                  onChange={(e) => setEditingPlan({ ...editingPlan, amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <button
                onClick={() => handleUpdatePlan(editingPlan)}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg"
              >
                保存更改
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddPlan}
              className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              新增优惠方案
            </button>
          )}

          <button
            onClick={closeAllModes}
            className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            保存并退出
          </button>
        </div>
      )}
    </div>
  );
}
