export default async function handler(req, res) {
  const targetUrl = 'https://api-morning-fog-5849.fly.dev/api/controller';

  try {
    console.log('Proxying request to:', targetUrl);
    console.log('Request body:', req.body);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const text = await response.text();
    console.log('Backend response:', text);

    res.status(response.status).send(text);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
}
