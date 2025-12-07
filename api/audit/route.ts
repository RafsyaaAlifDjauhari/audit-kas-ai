// Isi file: app/api/audit/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Menggunakan API Key dari file .env.local
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        // SYSTEM INSTRUCTION (OTAK AUDITOR AI)
        systemInstruction: "Anda adalah Auditor Senior yang sangat mahir dalam audit kas, dengan fokus pada deteksi fraud dan kepatuhan PSAK/SA. Tugas Anda adalah: 1. Menganalisis data transaksi untuk mencari anomali (nominal bulat mencurigakan, duplikasi, atau transaksi di luar jam kerja). 2. Membandingkan saldo buku dengan hasil hitung fisik kas (cash opname) dan menghitung selisih. 3. Menyediakan saran jurnal penyesuaian yang akurat dan kesimpulan temuan audit." 
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: "Gagal memproses audit. Periksa konfigurasi API." }, { status: 500 });
  }
}