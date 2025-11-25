'use client';

import { ReactNode } from 'react';

interface DeviceSimulatorProps {
  children: ReactNode;
  device: 'iphone-se' | 'iphone-15-pro-max';
  onChange?: (device: 'iphone-se' | 'iphone-15-pro-max') => void;
  maxHeight?: string;
}

const deviceSizes = {
  'iphone-se': { width: '375px', height: '667px', name: 'iPhone SE' },
  'iphone-15-pro-max': { width: '430px', height: '932px', name: 'iPhone 15 Pro Max' },
};

const parseDimension = (value: string) => parseInt(value.replace('px', ''), 10);

export default function DeviceSimulator({ children, device, onChange, maxHeight }: DeviceSimulatorProps) {
  const size = deviceSizes[device];
  const screenWidth = parseDimension(size.width);
  const screenHeight = parseDimension(size.height);
  const framePadding = 16; // p-2 = 0.5rem ≒ 8px * 2
  const frameWidth = screenWidth + framePadding;
  const frameHeight = screenHeight + framePadding;

  return (
    <div className="flex flex-col items-center w-full">
      {onChange && (
        <div className="mb-4">
          <select
            value={device}
            onChange={(e) => onChange(e.target.value as 'iphone-se' | 'iphone-15-pro-max')}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="iphone-se">iPhone SE (375×667)</option>
            <option value="iphone-15-pro-max">iPhone 15 Pro Max (430×932)</option>
          </select>
        </div>
      )}
      <div
        className="bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl w-full"
        style={{
          maxWidth: `${frameWidth}px`,
          aspectRatio: maxHeight ? undefined : `${frameWidth} / ${frameHeight}`,
          maxHeight: maxHeight,
        }}
      >
        <div className="bg-white rounded-[2rem] overflow-hidden w-full h-full">
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

