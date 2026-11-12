
"use strict";

console.log("P10 dan P11 JavaScript aktif");

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
        unggulan: false
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
            className: "empty"
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
// 4. DOM SELECTION FILTER PRODUK
// ==========================================

// Mengambil elemen HTML untuk katalog filter
const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

// ==========================================
// 5. FUNCTION LABEL KATEGORI
// ==========================================

function labelKategori(kategori) {
    switch (kategori) {
        case "mochi":
            return "Produk mochi pilihan";
        default:
            return "Produk UMKM";
    }
}

// ==========================================
// 6. FUNCTION MEMBUAT KARTU PRODUK
// ==========================================

function buatKartuProduk(produk) {
    const status = statusStok(produk.stok);

    return `
        <article class="js-product-card">
            <h3>${produk.nama}</h3>
            <p class="category-note">
                ${labelKategori(produk.kategori)}
            </p>
            <p class="price">${formatRupiah(produk.harga)}</p>
            <span class="stock-badge ${status.className}">
                ${status.label}
            </span>
        </article>
    `;
}

// ==========================================
// 7. FUNCTION MEMBUAT ELEMEN PRODUK (DOM)
// ==========================================


function buatElemenProduk(produk) {

    // Membuat elemen kartu
    const card = document.createElement("article");
    card.classList.add("product-card");

    // Membuat judul produk
    const title = document.createElement("h3");
    title.textContent = produk.nama;

    // Membuat kategori produk
    const category = document.createElement("p");
    category.classList.add("category-note");
    category.textContent = labelKategori(produk.kategori);

    // Membuat harga produk
    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = formatRupiah(produk.harga);

    // Membuat status stok
    const stock = document.createElement("span");
    const status = statusStok(produk.stok);

    stock.classList.add("stock-badge");

    if (status.className) {
        stock.classList.add(status.className);
    }

    stock.textContent = status.label;

    // Membuat tombol Sembunyikan
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Sembunyikan";
    removeButton.classList.add("ghost-button");

    // Menghapus kartu dari tampilan
    removeButton.addEventListener("click", () => {
        card.remove();

        produkStatus.textContent =
            "Satu kartu disembunyikan dari tampilan sementara.";
    });

    // Memasukkan semua elemen ke dalam kartu
    card.append(title, category, price, stock, removeButton);

    // Mengembalikan elemen kartu
    return card;
}

// ==========================================
// 8. FUNCTION MEMBUAT EMPTY STATE
// ==========================================

function buatEmptyState(kategori) {
    const empty = document.createElement("p");

    empty.classList.add("empty-state");

    empty.textContent =
        `Belum ada produk pada kategori ${kategori}.`;

    return empty;
}

// ==========================================
// 9. FUNCTION RENDER KATALOG FILTER
// ==========================================

function renderProduk(kategoriAktif = "Semua") {

    // Memastikan elemen HTML tersedia
    if (!produkGrid || !produkStatus) {
        console.warn("Target render produk tidak ditemukan.");
        return;
    }

    console.log("Render kategori:", kategoriAktif);

    // Memfilter produk berdasarkan nama
    const kataKunci = kategoriAktif.toLowerCase();

    const produkTampil = kategoriAktif === "Semua"
        ? produkUmkm
        : produkUmkm.filter((produk) =>
            produk.nama.toLowerCase().includes(kataKunci)
        );

    // Menghapus isi katalog sebelumnya
    produkGrid.replaceChildren();

    // Menampilkan empty state jika produk tidak ditemukan
    if (produkTampil.length === 0) {
        produkGrid.append(buatEmptyState(kategoriAktif));

        produkStatus.textContent = "0 produk ditemukan.";

    } else {

        // Menampilkan setiap produk menggunakan DOM
        produkTampil.forEach((produk) => {
            produkGrid.append(buatElemenProduk(produk));
        });

        // Memperbarui informasi jumlah produk
        produkStatus.textContent =
            `${produkTampil.length} produk ditampilkan.`;
    }

    // Mengatur tombol filter yang sedang aktif
    tombolFilter.forEach((tombol) => {
        const aktif = tombol.dataset.filter === kategoriAktif;

        tombol.classList.toggle("is-active", aktif);
        tombol.setAttribute("aria-pressed", aktif);
    });
}

// ==========================================
// 10. FUNCTION RENDER PRODUK DARI DATA LOKAL
// ==========================================

function renderProdukLokal() {

    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");

    // Memastikan semua elemen HTML tersedia
    if (!grid || !ringkasan || !unggulan) {
        console.warn("Target render produk lokal belum lengkap.");
        return;
    }

    // ==========================================
    // 11. FOREACH: DEBUGGING DATA PRODUK
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
    // 12. FILTER: MENGAMBIL PRODUK TERSEDIA
    // ==========================================

    const produkTersedia = produkUmkm.filter(
        (produk) => produk.stok > 0
    );

    // ==========================================
    // 13. FIND: MENCARI PRODUK UNGGULAN
    // ==========================================

    const produkUnggulan = produkUmkm.find(
        (produk) => produk.unggulan === true
    );

    // ==========================================
    // 14. MAP: MEMBUAT KARTU PRODUK
    // ==========================================

    const markupProduk = produkTersedia
        .map(buatKartuProduk)
        .join("");

    // ==========================================
    // 15. RENDERING KE HTML
    // ==========================================

    grid.innerHTML = markupProduk;

    ringkasan.textContent =
        `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

    unggulan.textContent = produkUnggulan
        ? `Produk unggulan: ${produkUnggulan.nama}`
        : "Belum ada produk unggulan.";

    // ==========================================
    // 16. DEBUGGING CONSOLE
    // ==========================================

    console.log(
        "Jumlah produk tersedia:",
        produkTersedia.length
    );

    console.log(
        "Produk unggulan:",
        produkUnggulan ? produkUnggulan.nama : "Belum ada"
    );

    console.table(produkUmkm);
}

// ==========================================
// 17. EVENT LISTENER FILTER
// ==========================================

tombolFilter.forEach((tombol) => {

    tombol.addEventListener("click", (event) => {

        const tombolAktif = event.currentTarget;
        const kategori = tombolAktif.dataset.filter;

        // Menampilkan produk sesuai filter
        renderProduk(kategori);

    });

});

// ==========================================
// 18. MENJALANKAN PROGRAM
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Menampilkan katalog filter pertama kali
    renderProduk();

    // Menampilkan produk dari data lokal P10
    renderProdukLokal();

});
