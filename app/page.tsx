"use client";

import React, { useRef, useState } from "react";
import AnimatedButton from "./components/AnimatedButton";
import Divider from "./components/Divider";
import AnimatedInput from "./components/InputStyled";
import TokenForm from "./forms/TokenForm";
import UserData from "@/lib/data/user";
import Toast from "./components/Toast";
import StorageBox from "./components/StorageBox";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer); // cria o "buffer" manipulável
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary); // converte pra Base64
}

export default function Home() {

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<UserData | null>(null)

  const fileUploadRef = useRef<HTMLInputElement>(null)
  async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {

    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    const arrayBuffer = await file.arrayBuffer();

    const base64Data = arrayBufferToBase64(arrayBuffer)

    const res = await fetch("/api/files", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        token: token,
        filename: file.name,
        data: base64Data
       }),
    })
    if (res.status == 200) {
      setToastMessage("Arquivo enviado com sucesso.")
      setToastType("success")
      setToastOpen(true)
    } else {
      setToastMessage(await res.text())
      setToastType("error")
      setToastOpen(true)
    }


  }
  async function handleLogin() {
    if (token.length != 16) {
      setToastMessage("Insira um token válido.")
      setToastType("error")
      setToastOpen(true)
      return
    }
    else {
      const res = await fetch("/api/tokens", {
        method: "OPTIONS",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      if (res.status == 200) {
        const data = await res.json()
        setData(data)
        setToken(data.token)
        setAuthenticated(true)
        setToastMessage(`Autenticado com sucesso. Seja bem vindo ${data.name}`)
        setToastType("success")
        setToastOpen(true)
      } else {
        setToastMessage("Esse token não existe.")
        setToastType("error")
        setToastOpen(true)
      }

    }
  }
  async function handleCreateToken(name: string, email: string) {
    const res = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
    if (res.status == 200) {
      const data = await res.json()
      setData(data)
      setToken(data.token)
      setAuthenticated(true)
    } else {
      setToastMessage(await res.text())
      setToastType("error")
      setToastOpen(true)
    }
  }
  return (
    <>
      <div className="flex items-center flex-col p-5">
        {toastOpen && (
          <Toast
            message={toastMessage}
            type={toastType}
            duration={2500}
            onClose={() => setToastOpen(false)}
          />
        )}
        <h1 className="text-3xl font-bold">Bem vindo ao gerenciador de arquivos.</h1>
        {!authenticated && (
          <>
            <p>Insira abaixo seu token para ter acesso aos seus arquivos. Caso não tenha um clique em criar.</p>

            <AnimatedInput value={token} onChange={(e) => setToken(e.target.value)} placeholder="Insira seu token" type="text" className="text-center" />

            <div className="flex items-center flex-col p-5">
              <AnimatedButton className="bg-blue-main text-white px-4 py-2 rounded mt-4" onClick={handleLogin}>
                Entrar
              </AnimatedButton>
              <TokenForm onSubmit={handleCreateToken} />
            </div>
          </>
        )}
        {authenticated && (
          <>
            <div className="flex items-center flex-col p-3">
              <span className="text-4xs font-bold ">Você está autenticado com o token: {token}</span>
              <div className="flex items-center flex-col p-3">
                <span className="text-2xs font-bold ">ID: {data?.id}</span>
                <span className="text-2xs font-bold ">Email: {data?.email}</span>
                <span className="text-2xs font-bold ">Nome: {data?.name}</span>
                <span className="text-2xs font-bold ">Criado em: {
                  new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,      // 24h
                    timeZone: "America/Sao_Paulo", // define fuso horário
                  }).format(new Date(data?.createdAt!))}</span>

              </div>
              <AnimatedButton className="bg-green-soft text-white px-4 py-2 rounded mt-4" onClick={() => {
                navigator.clipboard.writeText(token).then(() => {
                  setToastMessage("Token copiado com sucesso.")
                  setToastType("success")
                  setToastOpen(true)
                });
              }}>
                Copiar
              </AnimatedButton>
              <AnimatedButton className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={() => setAuthenticated(false)}>
                Sair
              </AnimatedButton>
            </div>

          </>
        )}

      </div>
      <Divider />
      {authenticated && (
        <div className="flex items-center flex-col w-full">
          <div className="flex items-center flex-row ">
            <AnimatedButton className="bg-blue-main ml-5 mt-5 mb-5" onClick={() => {
              fileUploadRef.current?.click()
            }}>
              Enviar
              <input className="hidden" type="file" ref={fileUploadRef} onChange={handleUploadFile}></input>
            </AnimatedButton>
          </div>
          <div
            className="w-full flex-row flex justify-center items-center "
          >
            <StorageBox token={token} />

          </div>

        </div>
      )}
    </>

  );
}
