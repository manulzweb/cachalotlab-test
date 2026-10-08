import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${
        disabled
          ? 'text-slate-400'
          : 'bg-gradient-to-r from-slate-200 via-sky-300 to-slate-200 animate-pulse'
      } ${className}`}
      style={{
        animationDuration,
      }}
    >
      {text}
    </span>
  );
};
