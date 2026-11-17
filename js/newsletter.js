

"use strict";

// ==========================================
// 1. DOM SELECTION
// ==========================================

// Mengambil elemen form newsletter
const newsletterForm = document.querySelector("#form-newsletter");

// Mengambil input email pelanggan
const newsletterEmail = document.querySelector("#newsletter-email");

// Mengambil tempat menampilkan pesan error
const newsletterError = document.querySelector("#newsletter-error");

// Mengambil tempat menampilkan pesan berhasil atau gagal
const newsletterFeedback = document.querySelector("#newsletter-feedback");

// ==========================================
// 2. PENGATURAN LOCAL STORAGE
// ==========================================

// Menentukan nama key untuk menyimpan daftar email newsletter
const NEWSLETTER_KEY = "mochi-daifuku-newsletter";

// ==========================================
// 3. MENYIMPAN EMAIL NEWSLETTER
// ==========================================

// Menyimpan email pelanggan ke Local Storage
function simpanNewsletter(email) {

    // Mengambil daftar email yang sudah tersimpan
    // Jika belum ada data, gunakan array kosong
    const tersimpan = localStorage.getItem(NEWSLETTER_KEY);
    const daftarEmail = tersimpan ? JSON.parse(tersimpan) : [];

    // Memeriksa apakah email sudah pernah didaftarkan
    const emailSudahAda = daftarEmail.some(
        (item) => item.toLowerCase() === email.toLowerCase()
    );

    // Menghentikan proses jika email sudah terdaftar
    if (emailSudahAda) {
        newsletterFeedback.textContent = "Email ini sudah terdaftar.";
        newsletterFeedback.classList.remove("success");
        return;
    }

    // Menambahkan email baru ke dalam daftar
    daftarEmail.push(email);

    // Mengubah array menjadi JSON dan menyimpannya
    localStorage.setItem(
        NEWSLETTER_KEY,
        JSON.stringify(daftarEmail)
    );

    // Menampilkan pesan bahwa pendaftaran berhasil
    newsletterFeedback.textContent = "Berhasil berlangganan newsletter!";
    newsletterFeedback.classList.add("success");
}

// ==========================================
// 4. MEMUAT DATA NEWSLETTER
// ==========================================

// Membaca daftar email yang tersimpan
function muatNewsletter() {
    try {

        // Mengambil data newsletter dari Local Storage
        const tersimpan = localStorage.getItem(NEWSLETTER_KEY);

        // Menghentikan fungsi jika belum ada data
        if (!tersimpan) return;

        // Mengubah JSON menjadi array JavaScript
        const daftarEmail = JSON.parse(tersimpan);

        // Memastikan data yang dibaca berbentuk array
        if (!Array.isArray(daftarEmail)) {
            throw new Error("Data newsletter tidak valid.");
        }

        // Menampilkan jumlah email yang sudah terdaftar di Console
        console.log("Jumlah pelanggan newsletter:", daftarEmail.length);

    } catch (error) {

        // Menampilkan peringatan jika data tidak dapat dibaca
        console.warn("Data newsletter tidak valid.", error);

        // Menghapus data newsletter yang rusak
        localStorage.removeItem(NEWSLETTER_KEY);
    }
}

// ==========================================
// 5. VALIDASI DAN PENGIRIMAN FORM
// ==========================================

// Menjalankan proses ketika form newsletter dikirim
newsletterForm.addEventListener("submit", (event) => {

    // Mencegah halaman melakukan reload
    event.preventDefault();

    // Menghapus pesan error sebelumnya
    newsletterError.textContent = "";
    newsletterFeedback.textContent = "";

    // Mengambil nilai email dan menghapus spasi di awal/akhir
    const email = newsletterEmail.value.trim();

    // Menghapus validasi kustom sebelumnya
    newsletterEmail.setCustomValidity("");

    // Memeriksa apakah email sudah diisi
    if (!email) {
        newsletterEmail.setCustomValidity("Email wajib diisi.");
    }

    // Memeriksa validitas format email
    if (!newsletterEmail.checkValidity()) {

        // Menampilkan pesan error pada halaman
        newsletterError.textContent = email
            ? "Masukkan alamat email dengan format yang benar."
            : "Email wajib diisi.";

        // Memberikan tanda bahwa input tidak valid
        newsletterEmail.setAttribute("aria-invalid", "true");

        // Mengarahkan fokus ke input email
        newsletterEmail.focus();

        return;
    }

    // Menghapus tanda invalid jika email sudah valid
    newsletterEmail.setAttribute("aria-invalid", "false");

    // Menyimpan email ke Local Storage
    simpanNewsletter(email);

    // Mengosongkan input jika email berhasil didaftarkan
    if (newsletterFeedback.classList.contains("success")) {
        newsletterForm.reset();
    }
});

// ==========================================
// 6. MEMUAT DATA SAAT HALAMAN DIBUKA
// ==========================================

// Memeriksa data newsletter ketika halaman dibuka
muatNewsletter();
