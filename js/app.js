"use strict";

console.log("P09 JavaScript aktif");

const produkUmkm = [
    { nama: "Mochi Daifuku cokelat", kategori: "per bundle", harga: 20000, stok: 12 },
    { nama: "Mochi Daifuku strawberry", kategori: "per bundle", harga: 25000, stok: 4 },
    { nama: "Mochi Daifuku mango", kategori: "per bundle", harga: 25000, stok: 9 },
    { nama: "Mochi Daifuku matcha", kategori: "per bundle", harga: 25000, stok: 0 },
];

console.table(produkUmkm);

const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
console.log(formatRupiah.format(produkUmkm[0].harga));
console.log(formatRupiah.format(produkUmkm[1].harga));
console.log(formatRupiah.format(produkUmkm[2].harga));
console.log(formatRupiah.format(produkUmkm[3].harga));

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

        if (produk.stok > 0) {
            jumlahTersedia = jumlahTersedia + 1;
        }

        markup = markup + `
      <article class="js-product-card">
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