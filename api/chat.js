export default async function handler(req, res) {
  // Asegurarnos de que sólo se acepten peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Obtenemos la API key desde las variables de entorno de Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Falta la API Key en Vercel. Asegurate de configurar GEMINI_API_KEY en tu dashboard."
    });
  }

  // MÉTODO INFALIBLE: Pasamos la key directamente en la URL en lugar de los headers
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Pasamos directamente el body que armamos en el index.html (historial y systemPrompt)
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Detalle del error de Google:', data);
      return res.status(response.status).json(data);
    }

    // Devolvemos la respuesta del bot hacia nuestro front (index.html)
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error interno:', error);

    return res.status(500).json({
      error: error.message
    });
  }
}
