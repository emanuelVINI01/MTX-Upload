"use client";

import React, { InputHTMLAttributes } from "react";

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // opcional, se quiser mostrar label acima
  classNameLabel?: string; // para customizar a classe do label
}

export default function AnimatedInput({ label, className, classNameLabel, ...props }: AnimatedInputProps) {
  return (
    <div className={`flex flex-col w-full max-w-sm mt-4 ${classNameLabel ?? ""}`}>
      {label && <label className="mb-1 font-medium">{label}</label>}
      <input
        {...props}
        className={`
          border border-gray-300
          p-3
          rounded-lg
          focus:outline-none
          focus:ring-2 focus:ring-blue-main
          focus:border-transparent
          placeholder-gray-400
          transition-all duration-150
          shadow-sm hover:shadow-md
          ${className ?? ""}
        `}
      />
    </div>
  );
}