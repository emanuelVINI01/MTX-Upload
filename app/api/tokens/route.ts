// app/api/tokens/

import crypto from "crypto";
import { prisma } from "@/lib/prisma";


export async function OPTIONS(req: Request) {
  try {

    const { token } = await req.json();
    if (!token) return new Response("Token is needed", { status: 400 });
    const findData = await prisma.token.findFirst({ where: { token } })

    if (findData) {
      return new Response(JSON.stringify(findData), { status: 200, headers: {
    "Content-Type": "application/json",
  }, });
    }
    else {
      if (!token) return new Response("Not Found", { status: 404 });

    }
  } catch (err) {
    console.log(err)
    return new Response("Failed to create token", { status: 400 });
  }
}

export async function POST(req: Request) {
  try {

    const { name, email } = await req.json();

    if (!name || !email) return new Response("Name and email required", { status: 400 });

    if (!email.includes("@")) return new Response("Invalid email format", { status: 400 });

    if (email.length > 255) return new Response("Email too long", { status: 400 });
    if (name.length > 255) return new Response("Name too long", { status: 400 });
    if (name.length < 3) return new Response("Name too short", { status: 400 });
    if (email.length < 5) return new Response("Email too short", { status: 400 });

    if (await prisma.token.findFirst({ where: { email } })) {
      return new Response("Email already has a token", { status: 400 });
    }

    const token = crypto.randomBytes(8).toString("hex").toUpperCase();

    const saved = await prisma.token.create({
      data: { name, email, token },
    });

    return new Response(JSON.stringify(saved), { status: 200 , headers: {
    "Content-Type": "application/json",
  }, });
  } catch (err) {
    console.log(err)

    return new Response("Failed to create token", {
      status: 400});
  }
}

