
"use strict";

// ==========================================
// 1. DOM SELECTION
// ==========================================

// Mengambil elemen form kontak berdasarkan ID
const form = document.querySelector("#form-kontak");

// Mengambil elemen untuk menampilkan preview data
const preview = document.querySelector("#preview-form");

// Mengambil elemen untuk menampilkan informasi validasi form
const formFeedback = document.querySelector("#form-feedback");

// Mengambil semua input yang akan diperiksa validitasnya
const fields = [
    "nama",
    "email",
    "whatsapp",
    "paket",
    "pesan",
    "persetujuan"
].map((id) => document.querySelector(`#${id}`));

// Mengambil semua radio button dengan nama topik
const topikInputs = document.querySelectorAll('input[name="topik"]');


// ==========================================
// 2. PENGATURAN LOCAL STORAGE
// ==========================================

// Menentukan nama key untuk menyimpan preferensi kontak
const STORAGE_KEY = "mochi-daifuku-preferensi-kontak";


// ==========================================
// 3. HELPER PESAN ERROR
// ==========================================

// Memeriksa kondisi input dan menentukan pesan error
function getFieldError(field) {

    // Mengambil informasi validitas dari input
    const validity = field.validity;

    // Memeriksa apakah input wajib masih kosong
    if (validity.valueMissing) return "Bagian ini wajib diisi.";

    // Memeriksa apakah format input tidak sesuai
    if (validity.typeMismatch) return "Format data belum sesuai.";

    // Memeriksa apakah jumlah karakter kurang dari batas minimal
    if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;

    // Memeriksa apakah input tidak sesuai pola yang ditentukan
    if (validity.patternMismatch) return "Format belum sesuai contoh yang diminta.";

    // Mengembalikan string kosong jika tidak ditemukan error
    return "";
}


// ==========================================
// 4. MENAMPILKAN PESAN ERROR
// ==========================================

// Menampilkan pesan error dan memberikan tanda pada input
function tampilkanError(field, pesan) {

    // Mengambil elemen pesan error berdasarkan ID input
    const error = document.querySelector(`#${field.id}-error`);

    // Mengatur pesan error pada Constraint Validation API
    field.setCustomValidity(pesan);

    // Memberikan tanda apakah input memiliki kesalahan
    field.setAttribute("aria-invalid", pesan ? "true" : "false");

    // Menampilkan pesan error jika elemen tersedia
    if (error) {
        error.textContent = pesan;
    }
}


// ==========================================
// 5. VALIDASI SETIAP FIELD
// ==========================================

// Memeriksa apakah satu input sudah memenuhi ketentuan
function validasiField(field) {

    // Menghapus pesan error sebelumnya
    field.setCustomValidity("");

    // Mengambil pesan error berdasarkan kondisi input
    const pesan = getFieldError(field);

    // Menampilkan pesan error jika ditemukan
    tampilkanError(field, pesan);

    // Mengembalikan true jika valid, false jika tidak valid
    return pesan === "";
}


// ==========================================
// 6. MENAMPILKAN PREVIEW DATA
// ==========================================

// Menampilkan data form setelah semua input dinyatakan valid
function tampilkanPreview() {

    // Mengambil seluruh data dari form
    const data = new FormData(form);

    // Menampilkan data yang sudah diisi ke bagian preview
    preview.textContent = [
        `Nama: ${data.get("nama")}`,
        `Email: ${data.get("email")}`,
        `Telepon: ${data.get("whatsapp")}`,
        `Paket: ${data.get("paket")}`,
        `Topik: ${data.get("topik")}`,
        `Waktu dihubungi: ${data.get("waktu")}`,
        `Pesan: ${data.get("pesan")}`,
    ].join("\n");

    // Menampilkan pemberitahuan bahwa form berhasil divalidasi
    formFeedback.textContent = "Form valid. Preview berhasil dibuat.";

    // Memberikan class success sebagai tanda keberhasilan
    formFeedback.classList.add("success");
}


// ==========================================
// 7. MENYIMPAN PREFERENSI
// ==========================================

// Menyimpan pilihan paket dan topik ke localStorage
function simpanPreferensi() {

    // Mengambil data dari form
    const data = new FormData(form);

    // Membuat objek preferensi yang akan disimpan
    const preferensi = {
        paket: data.get("paket"),
        topik: data.get("topik"),
        updatedAt: new Date().toISOString(),
    };

    // Mengubah objek menjadi JSON dan menyimpannya
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
}


// ==========================================
// 8. MEMUAT PREFERENSI
// ==========================================

// Mengambil kembali preferensi yang pernah disimpan
function muatPreferensi() {

    try {

        // Mengambil data preferensi dari localStorage
        const tersimpan = localStorage.getItem(STORAGE_KEY);

        // Menghentikan proses jika belum ada data tersimpan
        if (!tersimpan) return;

        // Mengubah teks JSON menjadi objek JavaScript
        const preferensi = JSON.parse(tersimpan);

        // Mengembalikan pilihan paket yang pernah disimpan
        document.querySelector("#paket").value = preferensi.paket ?? "";

        // Mencari radio button sesuai topik yang tersimpan
        const topik = document.querySelector(
            `input[name="topik"][value="${preferensi.topik}"]`
        );

        // Memilih kembali radio button jika ditemukan
        if (topik) topik.checked = true;

    } catch (error) {

        // Menampilkan peringatan jika data tidak dapat dibaca
        console.warn("Preferensi tidak valid.", error);

        // Menghapus data yang rusak dari localStorage
        localStorage.removeItem(STORAGE_KEY);
    }
}


// ==========================================
// 9. VALIDASI SAAT FORM DIKIRIM
// ==========================================

// Menjalankan validasi ketika tombol submit ditekan
form.addEventListener("submit", (event) => {

    // Mencegah form langsung dikirim
    event.preventDefault();

    // Memeriksa seluruh input satu per satu
    const semuaValid = fields.every((field) => validasiField(field));

    // Memeriksa apakah salah satu radio topik sudah dipilih
    const topikValid = Array.from(topikInputs).some((input) => input.checked);

    // Mengambil elemen pesan error topik
    const topikError = document.querySelector("#topik-error");

    // Menampilkan pesan error topik jika belum dipilih
    if (topikError) {
        topikError.textContent = topikValid
            ? ""
            : "Silakan pilih topik pertanyaan.";
    }

    // Menghentikan proses jika masih ada input yang tidak valid
    if (!semuaValid || !topikValid || !form.checkValidity()) {

        // Menghapus preview lama jika form tidak valid
        preview.textContent = "Perbaiki data sebelum melihat preview.";

        // Menampilkan pemberitahuan bahwa form memiliki kesalahan
        formFeedback.textContent = "Periksa kembali bagian yang ditandai.";

        // Menghapus class success jika sebelumnya ada
        formFeedback.classList.remove("success");

        // Meminta browser memeriksa dan melaporkan validitas form
        form.reportValidity();

        // Mengarahkan fokus ke input pertama yang tidak valid
        form.querySelector(":invalid")?.focus();

        // Menghentikan proses submit
        return;
    }

    // Menampilkan preview jika seluruh validasi berhasil
    tampilkanPreview();

    // Menyimpan preferensi setelah form valid
    simpanPreferensi();
});


// ==========================================
// 10. MEMUAT PREFERENSI SAAT HALAMAN DIBUKA
// ==========================================

// Memuat preferensi ketika halaman pertama kali dibuka
muatPreferensi();
