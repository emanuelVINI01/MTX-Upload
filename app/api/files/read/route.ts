import { getStorageFolder, readFileBy } from "@/lib/data/storage";
import { prisma } from "@/lib/prisma";
// api/files/read

// Read a file data based on name
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { token, file } = json;
    if (!token) return new Response("Token required", { status: 400 });
    if (!file) return new Response("File required", { status: 400 });
    const tokenData = await prisma.token.findFirst({ where: { token } });
    if (!tokenData) return new Response("Invalid token", { status: 400 });
    const folder = await getStorageFolder(token);
    const fileData = await readFileBy(file, folder)
    if (fileData == null) {
      return new Response("File not exists", { status: 400 });
    }
    else {
      return new Response(JSON.stringify(fileData), { status: 200, headers: {
    "Content-Type": "application/json",
  }, });

    }
  } catch (ex) {
    console.log(ex)
    return new Response("Error when reading file", { status: 400 });

  }
}