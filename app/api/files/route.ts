// api/tokens/

import crypto from "crypto";
import { prisma } from "@/lib/prisma";

import { addFile, deleteFile, getFiles, getStorageFolder, readFileBy, renameFile } from "@/lib/data/storage";

export async function OPTIONS(req: Request) {
  try {
    const json = await req.json();
    const { token } = json;
    if (!token) return new Response("Token required", { status: 400 });
    const tokenData = await prisma.token.findFirst({ where: { token } });
    if (!tokenData) return new Response("Invalid token", { status: 400 });
    const folder = await getStorageFolder(token);
    const files = await getFiles(folder);
    return new Response(JSON.stringify(files), { status: 200, headers: {
    "Content-Type": "application/json",
  }, });
  } catch (err) {
    return new Response("Failed to Search Files", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const json = await req.json();
    const { token, filename, data } = json;
    if (!token || !filename || !data) return new Response("Token, filename and data required", { status: 400 });
    const tokenData = await prisma.token.findFirst({ where: { token } });
    if (!tokenData) return new Response("Invalid token", { status: 400 });
    const folder = await getStorageFolder(token);

    
    const buffer = Buffer.from(data);
    const added = await addFile(folder, filename, buffer);
    if (!added) return new Response("File already exists", { status: 400 });
    return new Response("File added", { status: 200 });
  } catch (err) {
    console.log(err)
    return new Response("Failed to add file", { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const json = await req.json();
    const { token, filename } = json;
    if (!token || !filename) return new Response("Token and filename required", { status: 400 });
    const tokenData = await prisma.token.findFirst({ where: { token } });
    if (!tokenData) return new Response("Invalid token", { status: 400 });
    const folder = await getStorageFolder(token);
    const deleted = await deleteFile(folder, filename);
    if (!deleted) return new Response("File not found", { status: 400 });
    return new Response("File deleted", { status: 200 });
  } catch (err) {
    return new Response("Failed to delete file", { status: 500 });
  }
}
export async function PATCH(req: Request) {
  try {
    const json = await req.json();
    const { token, oldName, newName } = json;
    if (!token || !oldName || !newName) return new Response("Token, oldName and newName required", { status: 400 });
    const tokenData = await prisma.token.findFirst({ where: { token } });
    if (!tokenData) return new Response("Invalid token", { status: 400 });
    const folder = await getStorageFolder(token);
    const renamed = await renameFile(folder, oldName, newName);
    if (!renamed) return new Response("File not found", { status: 400 });
    return new Response("File renamed", { status: 200 });
  } catch (err) {
    return new Response("Failed to rename file", { status: 500 });
  }
}
