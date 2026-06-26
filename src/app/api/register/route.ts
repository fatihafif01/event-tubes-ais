import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, company } = body;

    // Validasi field wajib
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Organizer wajib isi company
    if (role === "organizer" && !company) {
      return NextResponse.json(
        { message: "Nama perusahaan wajib diisi untuk role Organizer" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password sebelum simpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke Neon via Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        company: role === "organizer" ? company : null,
      },
    });

    const { password: _pw, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: userWithoutPassword,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Registrasi gagal. Silakan coba lagi." },
      { status: 500 }
    );
  }
}