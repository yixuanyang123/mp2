import React, { useEffect, useState } from 'react';
import { searchMealsByName, fetchAllMealsByLetter } from '../api/meals';
import { useMeals } from '../context/MealsContext';
import MealCard from '../shared/MealCard';

const ListView: React.FC = () => {
  const { meals, setMeals } = useMeals();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'name' | 'area'>('name');
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    let mounted = true;
      (async () => {
        if (!query) {
          const results = await fetchAllMealsByLetter();
          if (mounted) setMeals(results || []);
        } else {
          const results = await searchMealsByName(query || '');
          if (mounted) setMeals(results || []);
        }
      })();
    return () => { mounted = false; };
  }, [query, setMeals]);

  const sorted = [...meals].sort((a, b) => {
    const key = (obj: any) => (obj[sort === 'name' ? 'strMeal' : 'strArea'] || '').toString();
    const A = key(a);
    const B = key(b);
    const cmp = A.localeCompare(B, undefined, { sensitivity: 'base', ignorePunctuation: true });
    return dir === 'asc' ? cmp : -cmp;
  });

  return (
    <div>
      <h2>List View</h2>
      <div className="controls">
        <div className="search">
          <input placeholder="Search meals..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <label>Sort</label>
        <select value={sort} onChange={e => setSort(e.target.value as any)}>
          <option value="name">Name</option>
          <option value="area">Area</option>
        </select>
        <button className="btn secondary" onClick={() => setDir(dir === 'asc' ? 'desc' : 'asc')}>{dir === 'asc' ? 'Asc' : 'Desc'}</button>
      </div>
      <div className="list-view">
        {sorted.map((m: any) => (
          <div key={m.idMeal} className="list-item">
            <MealCard meal={m} variant="list" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;
