import { getStorageFolder, readFileBy } from "@/lib/data/storage";
import { prisma } from "@/lib/prisma";

// Read a file data based on name
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const hash = url.searchParams.get("hash")
        const file = url.searchParams.get("file")

        if (!hash) return new Response("Hash required", { status: 400 });
        if (!file) return new Response("File required", { status: 400 });

        const folder = `./data/${hash}`;
        const fileData = await readFileBy(file, folder)
        if (fileData == null) {
            return new Response("File not exists", { status: 400 });
        }
        else {
            const buffer = Buffer.from(fileData.data, "base64")

            return new Response(buffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/octet-stream",
                    "Content-Disposition": `attachment; filename="${fileData.name}"`,
                },
            });

        }
    } catch (ex) {
        console.log(ex)
        return new Response("Error when reading file", { status: 400 });

    }
}