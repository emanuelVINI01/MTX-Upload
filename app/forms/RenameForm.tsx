"use client";

import React, { useState, useEffect } from "react";
import AnimatedInput from "../components/InputStyled";
import AnimatedButton from "../components/AnimatedButton";
import Toast from "../components/Toast";
import { FileData } from "@/lib/data/storage";

interface RenameFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, file : FileData) => void;
    file: FileData
}

function RenameFileModal({ isOpen, onClose, onSubmit, file }: RenameFileModalProps) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState(file.name);
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

                    <h2 className="text-2xl font-bold mb-4 text-white">Renomear Arquivo</h2>

                    <AnimatedInput
                        label="Novo nome"
                        type="text"
                        placeholder="Novo nome do arquivo"
                        className="text-white placeholder-white text-center"
                        classNameLabel="text-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />



                    <div className="mt-6 flex justify-center">
                        <AnimatedButton
                            className="bg-purple-neon"
                            onClick={() => {
                                if (!name || name == file.name) {
                                    setToastMessage("Por favor, preencha todos os campos corretamente.");
                                    setToastType("error");
                                    setToastOpen(true);
                                    return;
                                }
                                onSubmit(name, file);
                                setName("");

                                onClose();
                            }}
                        >
                            Renomear
                        </AnimatedButton>

                    </div>
                </div>
            </div>
        </>
    );
}

interface TokenFormProps {
    onSubmit: (name: string, file : FileData) => void;
    file: FileData
}

export default function RenameFileForm(props: TokenFormProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <AnimatedButton className="bg-yellow-alert ml-5 mt-5 mb-5" onClick={() => setIsModalOpen(true)}>
                Renomear
            </AnimatedButton>

            <RenameFileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={props.onSubmit} file={props.file}            />
        </>

    );
}