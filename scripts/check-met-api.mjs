const ids = [436535, 37189, 544512];
const checkedAt = new Date().toISOString();
const results = await Promise.all(ids.map(async (id) => {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { Origin: 'http://localhost:4173' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const record = await response.json();
    if (record.objectID !== id || typeof record.title !== 'string' || !record.title) throw new Error('Unusable object record');
    let officialRecordUrl = false;
    try {
      const objectUrl = new URL(record.objectURL);
      officialRecordUrl = objectUrl.protocol === 'https:' && ['metmuseum.org', 'www.metmuseum.org'].includes(objectUrl.hostname) && objectUrl.pathname.endsWith(`/${id}`);
    } catch {
      officialRecordUrl = false;
    }
    const checks = {
      numericBounds: Number.isFinite(record.objectBeginDate) && Number.isFinite(record.objectEndDate) && record.objectBeginDate <= record.objectEndDate,
      displayDate: typeof record.objectDate === 'string' && Boolean(record.objectDate.trim()),
      medium: typeof record.medium === 'string' && Boolean(record.medium.trim()),
      officialRecordUrl,
      publicDomain: record.isPublicDomain === true,
    };
    const missingFields = Object.entries(checks).filter(([, valid]) => !valid).map(([field]) => field);
    const imageUrl = record.primaryImageSmall || record.primaryImage;
    let image = { status: 'not-provided' };
    if (imageUrl) {
      try {
        const imageResponse = await fetch(imageUrl, { method: 'HEAD', signal: AbortSignal.timeout(12000) });
        image = { status: imageResponse.ok && imageResponse.headers.get('content-type')?.startsWith('image/') ? 'available' : 'unavailable', httpStatus: imageResponse.status };
      } catch (error) {
        image = { status: 'unavailable', error: error.message };
      }
    }
    return { id, url, document: 'available', fields: missingFields.length ? 'incomplete' : 'valid', missingFields, title: record.title, numericBounds: [record.objectBeginDate, record.objectEndDate], displayDate: record.objectDate, corsHeader: response.headers.get('access-control-allow-origin'), image };
  } catch (error) {
    return { id, url, document: 'unavailable', error: error.message };
  }
}));
process.stdout.write(`${JSON.stringify({ checkedAt, results }, null, 2)}\n`);
if (results.some((result) => result.document !== 'available' || result.fields !== 'valid' || result.image.status !== 'available')) process.exitCode = 1;
