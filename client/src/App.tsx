export default function App() {
  return (
    <main className="page-shell">
      <section className="form-panel" aria-labelledby="page-title">
        <div className="eyebrow">Online Basvuru</div>
        <h1 id="page-title">Basvuru formu hazir.</h1>
        <p>
          Bu uygulama Netlify uzerinde yayinlanmak icin gereken istemci ve sunucu giris
          dosyalariyla paketlenir.
        </p>
        <form className="application-form">
          <label>
            Ad Soyad
            <input name="fullName" type="text" autoComplete="name" />
          </label>
          <label>
            E-posta
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label>
            Telefon
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label>
            Aciklama
            <textarea name="description" rows={4} />
          </label>
          <button type="button">Basvuruyu hazirla</button>
        </form>
      </section>
    </main>
  );
}
