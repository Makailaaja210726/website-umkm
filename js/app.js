"use strict";

console.log("P09 JavaScript aktif");

const produkUmkm = [
    { nama: "Mochi Daifuku cokelat", kategori: "mochi", harga: 20000, stok: 12, unggulan: true },
    { nama: "Mochi Daifuku strawberry", kategori: "mochi", harga: 25000, stok: 4, unggulan: true },
    { nama: "Mochi Daifuku mango", kategori: "mochi", harga: 25000, stok: 9, unggulan: false },
    { nama: "Mochi Daifuku matcha", kategori: "mochi", harga: 25000, stok: 0, unggulan: false },
];

console.table(produkUmkm);

const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

produkUmkm.forEach((produk) => {
    console.log(formatRupiah.format(produk.harga));
});

function statusStok(stok) {
    if (stok === 0) {
        return { label: "Habis", className: "empty" };
    }

    if (stok <= 5) {
        return { label: "Stok terbatas", className: "warning" };
    }

    return { label: "Tersedia", className: "" };
}

function labelKategori(kategori) {
    switch (kategori) {
        case "mochi":
            return "Produk mochi pilihan";
        default:
            return "Produk UMKM";
    }
}

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");

    if (!grid || !ringkasan) {
        return;
    }

    let jumlahTersedia = 0;
    let markup = "";

    for (const produk of produkUmkm) {
        const status = statusStok(produk.stok);
        const kategori = labelKategori(produk.kategori);
        const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

        // Conditional keputusan 2: Badge Produk Unggulan (Poin 5 & 8)
        const badgeUnggulan = produk.unggulan 
            ? '<span class="badge-unggulan">Produk Unggulan</span>' 
            : '';

        if (produk.stok > 0) {
            jumlahTersedia = jumlahTersedia + 1;
        }

        markup = markup + `
      <article class="js-product-card">
        ${badgeUnggulan}
        <h3>${produk.nama}</h3>
        <p>${kategori}</p>
        <p class="price">${formatRupiah.format(produk.harga)}</p>
        <span class="stock-badge ${status.className}">${status.label}</span>
        <p>${labelAksi}</p>
      </article>
    `;
    }

    grid.innerHTML = markup;
    ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);