exports.verifyHmac = (xSignature, xRequestId, dataID, secret) => {
  if (!xSignature) return false;
  const parts = xSignature.split(',');
  let ts;
  let hash;
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey === 'ts') {
        ts = trimmedValue;
      } else if (trimmedKey === 'v1') {
        hash = trimmedValue;
      }
    }
  });
  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  const sha = hmac.digest('hex');
  return sha === hash;
};
