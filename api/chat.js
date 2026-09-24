export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'GEMINI_API_KEY no está configurada'
            });
        }

        const apiUrl =
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

        const googleResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify(req.body)
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            console.error('Gemini error:', data);

            return res.status(googleResponse.status).json({
                error: data
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);

        return res.status(500).json({
            error: 'Error comunicándose con Gemini'
        });
    }
}
