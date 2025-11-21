'use client';

import { ReactNode } from 'react';

interface DeviceSimulatorProps {
  children: ReactNode;
  device: 'iphone-se' | 'iphone-15-pro-max';
  onChange?: (device: 'iphone-se' | 'iphone-15-pro-max') => void;
}

const deviceSizes = {
  'iphone-se': { width: '375px', height: '667px', name: 'iPhone SE' },
  'iphone-15-pro-max': { width: '430px', height: '932px', name: 'iPhone 15 Pro Max' },
};

export default function DeviceSimulator({ children, device, onChange }: DeviceSimulatorProps) {
  const size = deviceSizes[device];

  return (
    <div className="flex flex-col items-center">
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
        className="bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl"
        style={{
          width: `calc(${size.width} + 16px)`,
          height: `calc(${size.height} + 16px)`,
        }}
      >
        <div
          className="bg-white rounded-[2rem] overflow-hidden"
          style={{
            width: size.width,
            height: size.height,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

