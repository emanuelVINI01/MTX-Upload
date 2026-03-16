"use client";

import React, { useState, useEffect } from "react";
import AnimatedInput from "../components/InputStyled";
import AnimatedButton from "../components/AnimatedButton";
import Toast from "../components/Toast";

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string) => void;
}

function TokenFormModal({ isOpen, onClose, onSubmit }: TokenModalProps) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  if (!show && toastOpen) return (

    <Toast
      message={toastMessage}
      type={toastType}
      duration={2500}
      onClose={() => setToastOpen(false)}
    />

  )
  if (!show) return null;

  return (
    <>

      <div
        className={`fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      >

        <div
          className={`rounded-xl shadow-xl w-full max-w-md p-6 relative transform transition-transform duration-200 ${isOpen ? "scale-100" : "scale-90"
            } bg-[var(--gray-dark)]`}
          onClick={(e) => e.stopPropagation()}
        >
          {toastOpen && (
            <Toast
              message={toastMessage}
              type={toastType}
              duration={2500}
              onClose={() => setToastOpen(false)}
            />
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-light hover:text-gray-dark font-bold text-lg"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold mb-4 text-white">Criar seu token</h2>

          <AnimatedInput
            label="Nome"
            type="text"
            placeholder="Seu Nome"
            className="text-white placeholder-white text-center"
            classNameLabel="text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <AnimatedInput
            label="Email"
            type="email"
            placeholder="Seu Email"
            className="text-white placeholder-white text-center"
            classNameLabel="text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mt-6 flex justify-center">
            <AnimatedButton
              className="bg-purple-neon"
              onClick={() => {
                if (!name || !email || (!email.includes("@"))) {
                  setToastMessage("Por favor, preencha todos os campos corretamente.");
                  setToastType("error");
                  setToastOpen(true);
                  return;
                }
                onSubmit(name, email);
                setName("");
                setEmail("");

                onClose();
              }}
            >
              Criar token
            </AnimatedButton>

          </div>
        </div>
      </div>
    </>
  );
}

interface TokenFormProps {
  onSubmit: (name: string, email: string) => void;
}

export default function TokenForm(props: TokenFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AnimatedButton
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-light text-gray-dark px-4 py-2 rounded mt-4"
      >
        Criar Token
      </AnimatedButton>

      <TokenFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={props.onSubmit}
      />
    </>

  );
}