"use client";

import React, { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string; // permite adicionar classes extras
}

export default function AnimatedButton({ children, onClick, className }: AnimatedButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        
        text-white
        px-6 py-3
        rounded-lg
        font-bold
        transition-transform
        duration-150
        active:scale-95
        hover:scale-105
        shadow-md
        hover:shadow-lg
        transform
        ${className ?? ""}
      `}
    >
      {children}
    </button>
  );
}