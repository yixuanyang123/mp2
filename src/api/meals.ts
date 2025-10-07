import axios from 'axios';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

export async function searchMealsByName(q: string) {
  const res = await axios.get(`${BASE}/search.php`, { params: { s: q } });
  return res.data.meals || [];
}

export async function getMealById(id: string) {
  const res = await axios.get(`${BASE}/lookup.php`, { params: { i: id } });
  return (res.data.meals && res.data.meals[0]) || null;
}

export async function listCategories() {
  const res = await axios.get(`${BASE}/list.php`, { params: { c: 'list' } });
  return res.data.meals || [];
}

export async function filterByCategory(cat: string) {
  const res = await axios.get(`${BASE}/filter.php`, { params: { c: cat } });
  return res.data.meals || [];
}

export async function fetchAllMealsByLetter() {
  try {
    const cacheKey = 'dishbook_all_meals_v1';
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(cacheKey) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.ts && (Date.now() - parsed.ts) < 1000 * 60 * 60 * 24) {
        return parsed.data || [];
      }
    }
  } catch (err) {
    // ignore storage errors
  }

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const batchSize = 5;
  const map = new Map<string, any>();

  for (let i = 0; i < letters.length; i += batchSize) {
    const batch = letters.slice(i, i + batchSize);
    const promises = batch.map(l =>
      axios
        .get(`${BASE}/search.php`, { params: { f: l }, timeout: 10_000 })
        .then(r => r.data.meals || [])
        .catch(err => {
          console.warn('fetchAllMealsByLetter: letter failed', l, err && err.message ? err.message : err);
          return [];
        })
    );
    const results = await Promise.all(promises);
    for (const list of results) {
      for (const m of list || []) {
        if (m && m.idMeal && !map.has(m.idMeal)) map.set(m.idMeal, m);
      }
    }
    await new Promise(res => setTimeout(res, 150));
  }

  const out = Array.from(map.values());
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dishbook_all_meals_v1', JSON.stringify({ ts: Date.now(), data: out }));
    }
  } catch (err) {
    // ignore storage errors
  }

  return out;
}
