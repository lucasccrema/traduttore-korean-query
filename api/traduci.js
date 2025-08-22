// api/traduci.js

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ errore: "Metodo non consentito" });
  }

  const { frase } = req.query;

  if (!frase) {
    return res.status(400).json({ errore: "Manca il parametro 'frase'" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Sei un insegnante di Coreano. Devi rispondere con la frase originale in coreano poi vai a capo e scrivi la traduzione in italiano;  vai a capo e poi dai spiegazioni grammaticali. Non usare romanizzazione , bensì fonetica IPA" },
      { role: "user", content: `Traduci in italiano la seguente frase (scritta in coreano): ${frase}` }
    ]
  })
});
    const data = await response.json();
    const traduzione = data.choices?.[0]?.message?.content || "Errore: nessuna traduzione trovata";
res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(traduzione);
   // res.status(200).json({ traduzione });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errore: "Errore nella traduzione" });
  }
}
