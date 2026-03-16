"use client";

import { FileData } from "@/lib/data/storage";
import React, { useState, useEffect } from "react";
import AnimatedButton from "./AnimatedButton";
import Toast from "./Toast";
import { createHash } from "crypto";
import RenameFileForm from "../forms/RenameForm";
interface StorageBoxProps {
    token: string;
}


export default function StorageBox({ token }: StorageBoxProps) {
    const [files, setFiles] = useState<FileData[]>([]);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
    const hash = createHash("sha256");
    hash.update(token);
    const tokenHash = hash.digest("hex")
    // Função pra buscar arquivos
    async function fetchData() {
        try {
            const res = await fetch("/api/files", {
                method: "OPTIONS", // use POST se estiver enviando JSON
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();
            setFiles(data);
        } catch (err) {
            console.error("Erro ao buscar arquivos:", err);
        }
    }

    async function renameFile(name: string, file: FileData) {
        try {
            const res = await fetch("/api/files", {
                method: "PATCH", // use POST se estiver enviando JSON
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, "newName": name, "oldName": file.name }),
            });
            if (res.status == 200) {
                fetchData()
                setToastMessage("Arquivo renomeado com sucesso.")
                setToastType("success")
                setToastOpen(true)
            }


        } catch (err) {
            console.error("Erro ao deletar arquivo:", err);
        }
    }

    async function deleteFile(file: FileData) {
        try {
            const res = await fetch("/api/files", {
                method: "DELETE", // use POST se estiver enviando JSON
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, "filename": file.name }),
            });
            if (res.status == 200) {
                fetchData()
                setToastMessage("Arquivo deletado com sucesso.")
                setToastType("success")
                setToastOpen(true)
            }


        } catch (err) {
            console.error("Erro ao deletar arquivo:", err);
        }
    }
    async function shareFile(file: FileData) {
        const baseUrl = `${window.location.origin}`;
        const url = `${baseUrl}/api/files/shared?hash=${encodeURIComponent(tokenHash)}&file=${encodeURIComponent(file.name)}`;

        navigator.clipboard.writeText(url).then(() => {
            setToastMessage("Link copiado para a aréa de transferência com sucesso.")
            setToastType("success")
            setToastOpen(true)
        });
    }
    async function downloadFile(file: FileData) {
        try {
            const res = await fetch("/api/files/read", {
                method: "POST", // use POST se estiver enviando JSON
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, "file": file.name }),
            });
            if (res.status == 200) {
                const data = await res.json()
                // cria um Blob
                const blob = new Blob([Buffer.from(data.data, "base64")]);
                const url = URL.createObjectURL(blob);

                // cria um link temporário para download
                const a = document.createElement("a");
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();

                // remove o link e libera memória
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                fetchData()
                setToastMessage("Arquivo baixado com sucesso.")
                setToastType("success")
                setToastOpen(true)
            }


        } catch (err) {
            console.error("Erro ao ler  arquivo:", err);
        }
    }
    useEffect(() => {
        fetchData()
    })

    return (
        <div className="flex flex-col w-full mt-4 gap-2">
            {toastOpen && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    duration={2500}
                    onClose={() => setToastOpen(false)}
                />
            )}
            {files.length === 0 && (
                <p className="text-gray-light text-center py-4">Nenhum arquivo encontrado.</p>
            )}

            {files.map((file, index) => (
                <div
                    key={index}
                    className="bg-blue-light text-white px-4 py-2 rounded-md flex justify-between items-center hover:bg-blue-light transition-colors"
                >
                    <div className=" flex-row flex justify-center items-center">
                        <span className="truncate p-3 text-2xl">{file.name}</span>
                        <span className="text-sm text-gray-light text-3xs">
                            {(file.size / 1024).toFixed(1)} KB
                        </span>
                    </div>
                    <div className=" flex-row flex justify-center items-center">
                        <AnimatedButton className="bg-gray-dark ml-5 mt-5 mb-5" onClick={() => downloadFile(file)}>
                            Baixar
                        </AnimatedButton>
                        <RenameFileForm file={file} onSubmit={renameFile} />
                        <AnimatedButton className="bg-red-500 ml-5 mt-5 mb-5" onClick={() => {
                            deleteFile(file)
                        }}>
                            Deletar
                        </AnimatedButton>
                        <AnimatedButton className="bg-green-soft ml-5 mt-5 mb-5" onClick={() => shareFile(file)}>
                            Compartilhar
                        </AnimatedButton>
                    </div>
                </div>
            ))}
        </div>
    );
}