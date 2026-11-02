
"use strict";

console.log("P10 JavaScript aktif");

// ==========================================
// 1. DATA PRODUK UMKM
// ==========================================

const produkUmkm = [
    {
        nama: "Mochi Daifuku cokelat",
        kategori: "mochi",
        harga: 20000,
        stok: 12,
        unggulan: true
    },
    {
        nama: "Mochi Daifuku strawberry",
        kategori: "mochi",
        harga: 25000,
        stok: 4,
        unggulan: true
    },
    {
        nama: "Mochi Daifuku mango",
        kategori: "mochi",
        harga: 25000,
        stok: 9,
        unggulan: false
    },
    {
        nama: "Mochi Daifuku matcha",
        kategori: "mochi",
        harga: 25000,
        stok: 0,
        unggulan: false
    }
];


// ==========================================
// 2. FUNCTION FORMAT RUPIAH
// ==========================================

function formatRupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nilai);
}


// ==========================================
// 3. FUNCTION STATUS STOK
// ==========================================

function statusStok(stok) {
    if (stok <= 0) {
        return {
            label: "Habis",
            className: "warning"
        };
    }

    if (stok <= 5) {
        return {
            label: "Stok terbatas",
            className: "warning"
        };
    }

    return {
        label: "Tersedia",
        className: ""
    };
}


// ==========================================
// 4. FUNCTION MEMBUAT KARTU PRODUK
// ==========================================

function buatKartuProduk(produk) {
    const status = statusStok(produk.stok);

    return `
        <article class="js-product-card">
            <h3>${produk.nama}</h3>
            <p class="category-note">${produk.kategori}</p>
            <p class="price">${formatRupiah(produk.harga)}</p>
            <span class="stock-badge ${status.className}">${status.label}</span>
        </article>
    `;
}


// ==========================================
// 5. FUNCTION RENDER PRODUK
// ==========================================

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");

    // Memastikan semua elemen HTML tersedia
    if (!grid || !ringkasan || !unggulan) {
        console.warn("Target render produk belum lengkap.");
        return;
    }

    // ==========================================
    // 6. FOREACH: DEBUGGING DATA PRODUK
    // ==========================================

    produkUmkm.forEach((produk) => {
        console.log(
            "Debug produk:",
            produk.nama,
            "stok:",
            produk.stok
        );
    });

    // ==========================================
    // 7. FILTER: MENGAMBIL PRODUK TERSEDIA
    // ==========================================

    const produkTersedia = produkUmkm.filter(
        (produk) => produk.stok > 0
    );

    // ==========================================
    // 8. FIND: MENCARI PRODUK UNGGULAN
    // ==========================================

    const produkUnggulan = produkUmkm.find(
        (produk) => produk.unggulan === true
    );

    // ==========================================
    // 9. MAP: MEMBUAT KARTU PRODUK
    // ==========================================

    const markupProduk = produkTersedia
        .map(buatKartuProduk)
        .join("");

    // ==========================================
    // 10. RENDERING KE HTML
    // ==========================================

    grid.innerHTML = markupProduk;

    ringkasan.textContent =
        `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

    unggulan.textContent = produkUnggulan
        ? `Produk unggulan: ${produkUnggulan.nama}`
        : "Belum ada produk unggulan.";

    // ==========================================
    // 11. DEBUGGING CONSOLE
    // ==========================================

    console.log(
        "Jumlah produk tersedia:",
        produkTersedia.length
    );

    console.table(produkUmkm);
}


// ==========================================
// 12. MENJALANKAN PROGRAM
// ==========================================

document.addEventListener("DOMContentLoaded", renderProduk);
