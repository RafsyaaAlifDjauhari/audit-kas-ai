"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [auditResult, setAuditResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!input) return;
    setLoading(true);
    try {
      // Memanggil backend (route.ts)
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      if (!res.ok) {
        throw new Error('Gagal memproses API');
      }

      const data = await res.json();
      setAuditResult(data.result);
    } catch (error) {
      alert("Terjadi kesalahan sistem atau API. Cek konsol.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">🕵️‍♂️ AI Audit Kas Assistant</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <label className="block mb-2 font-semibold text-gray-700">Input Data Kas / Temuan Audit:</label>
        <textarea
          className="w-full border p-3 rounded h-40 text-black border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tempel data transaksi kas (CSV), saldo buku vs fisik, atau catatan temuan di sini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button
          onClick={handleAudit}
          disabled={loading}
          className={`mt-4 w-full text-white py-2 rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? "Sedang Menganalisis (Mohon Tunggu)..." : "Lakukan Audit dengan AI"}
        </button>
      </div>

      {auditResult && (
        <div className="w-full max-w-2xl mt-6 bg-green-50 p-6 rounded-lg border border-green-200 shadow-md">
          <h2 className="text-xl font-bold text-green-800 mb-2">Hasil Analisis Auditor AI:</h2>
          <div className="prose text-gray-800 whitespace-pre-wrap">
            {auditResult}
          </div>
        </div>
      )}
    </div>
  );
}