import { Hono } from 'hono';
import { getDataset } from './dataset';
import {
  getCharter,
  getCowboy,
  getCowboys,
  getLeaderboard,
  getPhotos,
  getTimeline,
  getWrapped,
} from './cowboys';
import { auth, getViewer } from './auth';

type AppEnv = { Bindings: Env; Variables: { publicOnly: boolean } };

const app = new Hono<AppEnv>().basePath('/api');

app.route('/auth', auth);

app.use('/cowboys/*', async (c, next) => {
  // Signed-in cowboys see private photos unblurred.
  const isCowboy = (await getViewer(c)) !== null;
  c.set('publicOnly', !isCowboy);
  await next();
  // The archive never changes, but cowboy views must never be cached or shared.
  c.header('Cache-Control', isCowboy ? 'private, no-store' : 'public, max-age=3600');
  c.header('Vary', 'Cookie');
});

app.get('/cowboys', async (c) => {
  const data = await getDataset(c.env.DB);
  return c.json({ cowboys: getCowboys(data, c.var.publicOnly) });
});

app.get('/cowboys/photos', async (c) => {
  const data = await getDataset(c.env.DB);
  return c.json({ photos: getPhotos(data, c.var.publicOnly) });
});

app.get('/cowboys/leaderboard', async (c) => {
  const data = await getDataset(c.env.DB);
  return c.json({ leaderboard: getLeaderboard(data), timeline: getTimeline(data) });
});

app.get('/cowboys/charter', async (c) => {
  const data = await getDataset(c.env.DB);
  const charter = getCharter(data);
  if (!charter) return c.json({ error: { message: 'No charter found.' } }, 404);
  return c.json({ charter });
});

app.get('/cowboys/wrapped', async (c) => {
  const data = await getDataset(c.env.DB);
  return c.json({ wrapped: getWrapped(data, c.var.publicOnly) });
});

app.get('/cowboys/:identifier', async (c) => {
  const data = await getDataset(c.env.DB);
  const cowboy = getCowboy(data, c.req.param('identifier'), c.var.publicOnly);
  if (!cowboy) return c.json({ error: { message: 'Cowboy not found.' } }, 404);
  return c.json({ cowboy });
});

app.notFound((c) => c.json({ error: { message: 'Not found.' } }, 404));

app.onError((err, c) => {
  console.error(JSON.stringify({ message: 'Unhandled error', error: String(err), path: c.req.path }));
  return c.json({ error: { message: 'Something went wrong.' } }, 500);
});

export default app;
