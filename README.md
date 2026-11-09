# SAFER-Vest: Klasifikasi Peringatan Keselamatan Berbasis Sensor

Model klasifikasi prediktif untuk mendeteksi kondisi darurat relawan lapangan secara otomatis dari telemetri sensor rompi keselamatan pintar **SAFER-Vest** (detak jantung, gerak tubuh, dan koordinat GPS).

---

## 1. Arsitektur Alur Kerja Sistem

Arsitektur sistem dibagi menjadi dua siklus kerja: **Siklus Pelatihan Model (*Offline*)** untuk melatih dan memilih model AI terbaik, serta **Siklus Inferensi Lapangan (*Real-Time*)** saat rompi dipakai bertugas:

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart TD
    subgraph Training ["1. Siklus Pelatihan & Seleksi Model (Offline)"]
        A[Data Sensor SAFER-Vest] --> B[Validasi & Pembersihan Sinyal]
        B --> C[Ekstraksi Fitur Biosignal & Jarak Spasial]
        C --> D[Stratified Data Split 80:20]
        D --> E[Benchmarking 6 Algoritma ML]
        E --> F{Akurasi > 99% & F1 > 0.95?}
        F -- Belum --> G[Optimasi Hyperparameter]
        G --> E
        F -- Tercapai --> H[XGBoost Terpilih: Akurasi 99.44%]
    end

    subgraph Inference ["2. Siklus Pemantauan Lapangan (Real-Time)"]
        H --> I[Sensor Rompi Streaming Data Tiap 12 Detik]
        I --> J[Prediksi Model Prediktif]
        J --> K{Anomali / Bahaya?}
        K -- Ya --> L[STATUS BAHAYA: Bunyikan Buzzer & Kirim Koordinat ke Posko]
        K -- Tidak --> M[STATUS NORMAL: Catat Log & Tetap Standby]
    end
```

### Penjelasan Ringkas Alur Sistem:
* **Fase Pelatihan:** Data telemetri mentah dibersihkan dan diperkaya dengan variabel lonjakan denyut nadi (*rolling mean BPM*) serta jarak radius posko. Enam algoritma diuji dan dioptimasi hingga model XGBoost mencapai batas performa tinggi (akurasi 99.44% dan F1 0.9545).
* **Fase Operasional:** Model yang terpilih diintegrasikan ke sistem pemantauan. Jika sensor mendeteksi lonjakan BPM ekstrem atau relawan terjatuh tanpa gerakan (*NO MOTION*), sistem seketika membunyikan *buzzer* rompi dan memancarkan koordinat GPS darurat ke posko komando. Sebaliknya, saat data fisiologis normal, sistem berada dalam mode siaga (*standby*).

---

## 2. Teknologi yang Digunakan

| Komponen | Pustaka / Tools | Fungsi Utama |
| :--- | :--- | :--- |
| **Bahasa Utama** | Python 3.10+ | Bahasa pemrograman untuk komputasi analitik dan pemodelan |
| **Manipulasi Data** | Pandas, NumPy, OpenPyXL | Pembersihan data telemetri, ekstraksi fitur biosignal & spasial |
| **Machine Learning** | Scikit-Learn, XGBoost | Pelatihan 6 algoritma klasifikasi, penskalaan fitur, & evaluasi metrik |
| **Visualisasi** | Matplotlib, Seaborn | Eksplorasi data sensor, plot matriks konfusi, & tingkat kepentingan fitur |
| **Lingkungan Kerja** | Jupyter Notebook | Dokumentasi analisis interaktif pada [index.ipynb](index.ipynb) |

---

## 3. Alasan Pemilihan Algoritma

Enam algoritma machine learning diuji untuk membandingkan pendekatan linier, jarak, pohon keputusan, dan boosting:

* **XGBoost Classifier:** Algoritma *gradient boosting* yang mengoreksi kesalahan prediksi secara berulang. Dipilih karena paling andal menangani interaksi rumit antara lonjakan denyut nadi, status gerak, dan posisi spasial untuk mencapai akurasi tertinggi.
* **Random Forest:** Kumpulan ratusan pohon keputusan independen yang mengambil keputusan lewat voting terbanyak. Dipilih karena sangat stabil, tahan terhadap *overfitting*, dan memberikan estimasi signifikansi fitur yang baik.
* **Support Vector Machine (SVM):** Mencari garis pemisah dengan jarak maksimal antar-kelas menggunakan kernel non-linear RBF. Efektif mengelompokkan kondisi darurat pada data berskala seragam.
* **Decision Tree:** Model berbasis aturan logika *if-else* transparan. Dipilih karena perilakunya mudah diaudit oleh tim medis lapangan dan dapat dikonversi langsung ke bahasa C untuk mikrokontroler rompi.
* **K-Nearest Neighbors (KNN):** Menentukan status relawan berdasarkan kedekatan pola data di sekitarnya. Cocok untuk mendeteksi kesamaan profil denyut jantung dan kedekatan koordinat lokasi bahaya.
* **Logistic Regression:** Model linier probabilistik dasar. Digunakan sebagai *baseline* pembanding untuk menguji apakah pola kondisi darurat bisa dipisahkan secara linier sederhana sebelum memakai model kompleks.

---

## 4. Hasil Komparasi Model

Evaluasi diuji secara ketat pada 20% data uji independen (710 sampel) dengan metode *Stratified Sampling* untuk menjaga proporsi kejadian bahaya:

| Model | Akurasi | Presisi | Recall | F1-Score | Catatan Evaluasi |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **XGBoost Classifier** | **99.44%** | **97.67%** | **93.33%** | **0.9545** | **Performa Terbaik:** Hanya 1 false alarm, mendeteksi 42/45 bahaya |
| **Random Forest** | 97.89% | 94.12% | 71.11% | 0.8101 | Sangat presisi, namun recall masih di bawah XGBoost |
| **SVM (RBF Kernel)** | 97.75% | 85.37% | 77.78% | 0.8140 | Stabil setelah penskalaan fitur (*StandardScaler*) |
| **Decision Tree** | 97.46% | 88.57% | 68.89% | 0.7750 | Logika ringkas, cocok untuk firmware edge perangkat |
| **K-Nearest Neighbors** | 97.18% | 82.05% | 71.11% | 0.7619 | Efektif pada klaster spasial, sensitif terhadap outlier |
| **Logistic Regression** | 96.48% | 85.71% | 53.33% | 0.6575 | Baseline linier, belum optimal menangkap interaksi non-linear |

---

## 5. Kesimpulan & Interpretasi Lapangan

1. **Denyut Jantung sebagai Sinyal Utama:**
   Fitur *rolling mean BPM* dan nilai detak jantung riil menjadi variabel paling menentukan (>40% skor *feature importance*). Rata-rata denyut nadi relawan saat kondisi bahaya melonjak mendekati 150 BPM (puncak 187 BPM) dibandingkan kondisi normal (~106 BPM), menandakan kelelahan fisik ekstrem atau stres operasional berat.
2. **Korelasi Gerak Tubuh & Spasial:**
   Kondisi tidak bergerak (*NO MOTION*) saat denyut jantung tetap tinggi atau berada di radius deviasi tertentu mengindikasikan relawan terjatuh, pingsan, atau terjebak reruntuhan.
3. **Rekomendasi Deployment Dua Tingkat (*Dual-Tier*):**
   * **Tingkat 1 (Rompi / Edge):** Gunakan aturan dari model **Decision Tree** pada mikrokontroler rompi agar peringatan suara *buzzer* tetap berbunyi instan tanpa butuh koneksi internet.
   * **Tingkat 2 (Posko Induk / Cloud):** Gunakan model **XGBoost Classifier** pada backend pemantauan untuk menerima data telemetri seluruh regu relawan secara terpusat dengan akurasi 99.44%.

---

## 6. Struktur Berkas

```text
SAFER-Vest/
├── index.ipynb                    # Notebook analisis data, EDA, pemodelan, & evaluasi
├── safer_vest_dataset_dummy.xlsx  # Dataset telemetri sensor relawan (3.547 baris)
└── README.md                      # Dokumentasi teknis proyek
```

---

## 7. Cara Menjalankan Proyek

1. **Clone atau buka folder proyek:**
   ```bash
   cd /home/iklil/SAFER-Vest
   ```

2. **Instal dependensi yang diperlukan:**
   ```bash
   pip install pandas numpy matplotlib seaborn scikit-learn xgboost openpyxl jupyter
   ```

3. **Buka dan jalankan notebook:**
   ```bash
   jupyter notebook index.ipynb
   ```
   Seluruh sel pada [index.ipynb](index.ipynb) sudah tersimpan dalam keadaan selesai dieksekusi, sehingga seluruh grafik dan hasil tabel metrik dapat langsung ditinjau.
