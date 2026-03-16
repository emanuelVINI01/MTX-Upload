// components/Toast.tsx
"use client";

import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; // tempo em ms
  onClose?: () => void;
}

export default function Toast({
  message,
  type = "success",
  duration = 2000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // cores por tipo
  const bgColor =
    type === "success"
      ? "bg-green-soft"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-light";

  return (
    <div
      className={`fixed top-4 left-4 px-4 py-2 rounded shadow-lg text-white transform transition-all duration-300 z-50
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} 
        ${bgColor}`}
    >
      {message}
    </div>
  );
}