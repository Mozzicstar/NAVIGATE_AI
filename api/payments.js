async function readJsonBody(req) {
  if (req.body) return req.body;
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  let body;
  try { body = await readJsonBody(req); } catch (e) {
    res.statusCode = 400; return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
  }

  const id = `pay-${Math.random().toString(36).slice(2,8)}`;
  res.statusCode = 200;
  return res.end(JSON.stringify({ paymentId: id, status: 'charged', amount: body.amount }));
};
