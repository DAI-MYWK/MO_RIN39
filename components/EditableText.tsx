'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

export default function EditableText({
  value,
  onChange,
  className = '',
  placeholder = '',
  multiline = false,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    if (tempValue !== value) {
      onChange(tempValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          className={`w-full px-2 py-1 border-2 border-blue-500 rounded focus:outline-none ${className}`}
          placeholder={placeholder}
          rows={3}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave();
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        }}
        className={`w-full px-2 py-1 border-2 border-blue-500 rounded focus:outline-none ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-blue-50 px-1 rounded transition-colors ${className}`}
      title="クリックして編集"
    >
      {value || placeholder}
    </span>
  );
}

