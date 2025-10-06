import React, { useEffect, useState } from 'react';
import { listCategories, filterByCategory, searchMealsByName } from '../api/meals';
import { fetchAllMealsByLetter } from '../api/meals';
import { useMeals } from '../context/MealsContext';
import MealCard from '../shared/MealCard';

const GalleryView: React.FC = () => {
  const { meals, setMeals } = useMeals();
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cats = await listCategories();
      setCategories(cats.map((c: any) => c.strCategory));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selected) {
        const res = await filterByCategory(selected);
        setMeals(res || []);
      } else {
        const res = await fetchAllMealsByLetter();
        setMeals(res || []);
      }
    })();
  }, [selected, setMeals]);

  return (
    <div>
      <h2>Gallery View</h2>
      <div className="controls">
        <label>Filter by category:</label>
        <select value={selected || ''} onChange={e => setSelected(e.target.value || null)}>
          <option value="">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid">
        {meals.map((m: any) => (
          <MealCard key={m.idMeal} meal={m} showImageOnly />
        ))}
      </div>
    </div>
  );
};

export default GalleryView;
