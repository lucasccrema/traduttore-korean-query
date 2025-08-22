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
      { role: "system", content: "Sei un insegnante di Coreano e non usi mai la romanizzazione. Devi rispondere con la frase originale in coreano poi vai a capo e scrivi la traduzione in italiano;  vai a capo e poi dai spiegazioni grammaticali senza usare la romanizzazione. Non usare romanizzazione." },
      { role: "user", content: `Traduci in italiano la seguente frase (scritta in coreano): ${frase}` }
    ]
  })
});
    const data = await response.json();
    const traduzione = data.choices?.[0]?.message?.content || "Errore: nessuna traduzione trovata";
    const traduzionegrassetto = traduzione.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    const traduzioneConLineBreaks = traduzionegrassetto.replace(/\n/g, '<br>');
    // Crea l'HTML con sfondo bianco e testo in grassetto
const html = `
<!DOCTYPE html>
<html>
<head>
<title>Traduzione</title>
<style>
  body {
    background-color: white; /* Sfondo bianco */
    font-family: Verdana; /* Opzionale: scegli un font */
    font-size: 12px;
  }
  strong {
    font-weight: bold; /* Testo in grassetto */
    font-size: 1.2em;
  }
</style>
</head>
<body>
  
  <p>${traduzioneConLineBreaks}</p>
</body>
</html>
`;
    
    //res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html); // Invia l'HTML
    //res.send(traduzione);
   // res.status(200).json({ traduzione });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errore: "Errore nella traduzione" });
  }
}
