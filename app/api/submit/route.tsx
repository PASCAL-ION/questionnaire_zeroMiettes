import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        availability: data.availability,
        role: data.role,
        skills: data.skills,
        motivation: data.motivation,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    
    if (error instanceof Error) {
      console.error("Erreur lors de la sauvegarde :", error.message);
    }
    
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });    
  }
  
}
