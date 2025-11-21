'use client';

import { useState } from 'react';
import { ArrowRight, Home, Menu, ShoppingCart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowVisualizationProps {
  patternName: string;
}

export default function FlowVisualization({ patternName }: FlowVisualizationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'home', name: 'ホーム', icon: Home, description: '店舗情報とメニュー一覧' },
    { id: 'menu', name: 'メニュー選択', icon: Menu, description: 'カテゴリまたはメニューを選択' },
    { id: 'cart', name: 'カート', icon: ShoppingCart, description: '注文内容の確認' },
    { id: 'confirm', name: '注文確定', icon: Check, description: '注文の確定と完了' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">画面遷移フロー: {patternName}</h3>
      
      <div className="flex items-center justify-center gap-4 mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.button
                  onClick={() => setCurrentStep(index)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.button>
                <span className={`text-xs mt-2 font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-gray-400 mx-2" />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300"
        >
          <div className="flex items-center gap-3 mb-3">
            {(() => {
              const Icon = steps[currentStep].icon;
              return <Icon className="w-6 h-6 text-blue-600" />;
            })()}
            <h4 className="text-lg font-semibold text-gray-900">{steps[currentStep].name}</h4>
          </div>
          <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
          
          {/* 画面プレビューエリア */}
          <div className="bg-white rounded-lg p-4 shadow-inner min-h-[200px] flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return <Icon className="w-12 h-12 mx-auto" />;
                })()}
              </div>
              <p className="text-sm">{steps[currentStep].description}の画面</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前へ
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          次へ
        </button>
      </div>
    </div>
  );
}

