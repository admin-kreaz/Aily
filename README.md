# Aily Character & Soulmate Quiz + kirim kartu ke email

Isi folder:
- `index.html`: quiz (sudah mengarah ke `/api/send-card`)
- `api/send-card.js`: fungsi server yang mengirim email lewat Resend
- `package.json`

## Cara aktifkan (sekitar 10 menit)
1. Buat akun di https://resend.com, verifikasi domain kamu, lalu buat API key.
   (Tanpa domain terverifikasi, Resend hanya mengizinkan kirim ke email akunmu sendiri, cukup untuk tes.)
2. Deploy folder ini ke Vercel: `npm i -g vercel`, lalu jalankan `vercel` di dalam folder ini.
3. Di Vercel, buka Project Settings > Environment Variables, tambahkan:
   - `RESEND_API_KEY` = API key dari Resend
   - `FROM_EMAIL` = `Aily Quiz <quiz@domainkamu.com>`
   - `ALLOWED_ORIGIN` (opsional) = alamat website kamu, supaya endpoint tidak dipakai situs lain
4. Deploy ulang (`vercel --prod`), buka URL-nya, dan coba quiz sampai akhir dengan emailmu.

## Catatan
- Pakai Netlify, Cloudflare, atau server sendiri? Cukup pindahkan logika `api/send-card.js` dan arahkan `EMAIL_ENDPOINT` di `index.html` ke URL-nya.
- Tambahkan rate limit (misalnya Vercel WAF atau Upstash) sebelum kampanye besar, supaya form tidak disalahgunakan untuk spam.
- Beri tahu peserta bahwa email mereka dipakai untuk mengirim kartu (pertimbangkan kebijakan privasi).
