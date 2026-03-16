import crypto from "crypto";
import { readdir, mkdir, stat, unlink, writeFile, rename, readFile } from "fs/promises";
export interface FileData {
    name: string;
    size: number;
}

export interface FileInfo {
    name: string;
    size: number;
    data: string
}

async function hashToken(token: string) {
    const hash = crypto.createHash("sha256");
    hash.update(token);
    return hash.digest("hex"); // retorna em hexadecimal
}


export async function getStorageFolder(token: string) {
    const folder = `./data/${await hashToken(token)}`;
    await mkdir(folder, { recursive: true })
    return folder;
}
export async function  readFileBy(file : string, folder : string): Promise<FileInfo | null> {
    try {
        const filePath = `${folder}/${file}`
        const stats = await stat(filePath)
        const data = await readFile(filePath)
        return {
            name: file,
            size: stats.size, 
            data: data.toString("utf-8")
        }
    } catch (ex) {
        console.log(ex)
        return null
    } 
}
export async function getFiles(folder: string): Promise<FileData[]> {
    const files = await readdir(folder);
    return await Promise.all(
        files.map(async (name) => {
            const filePath = `${folder}/${name}`;
            const stats = await stat(filePath);
            // Aqui você poderia obter informações adicionais do arquivo, como o tamanho
            return { name, size: stats.size }; // Placeholder - substitua com a lógica real
        })
    );
}
export async function deleteFile(folder: string, filename: string) : Promise<boolean> {
    const filePath = `${folder}/${filename}`;
    const stats = await stat(filePath);
    if (stats.isFile()) {
        await unlink(filePath);
        return true;
    }
    return false;
}
export async function addFile(folder: string, filename: string, data: Buffer) : Promise<boolean> {
    const filePath = `${folder}/${filename}`;
    await mkdir(folder, { recursive: true });
    try{
        await stat(filePath);
        return false;
    }
    catch {
        await writeFile(filePath, data.toString("utf-8"));
        return true;
    }
}
export async function renameFile(folder: string, oldName: string, newName: string) : Promise<boolean> {
    const oldPath = `${folder}/${oldName}`;
    const newPath = `${folder}/${newName}`;
    const stats = await stat(oldPath);
    if (stats.isFile()) {
        await rename(oldPath, newPath);
        return true;
    }
    return false;
}