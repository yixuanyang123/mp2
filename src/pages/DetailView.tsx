import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMealById } from '../api/meals';
import { useMeals } from '../context/MealsContext';

const DetailView: React.FC = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState<any | null>(null);
  const { meals } = useMeals();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (id) {
        const m = await getMealById(id);
        setMeal(m);
      }
    })();
  }, [id]);

  const index = meals.findIndex((m: any) => m.idMeal === id);

  const goIndex = (i: number) => {
    if (i >= 0 && i < meals.length) {
      navigate(`/meal/${meals[i].idMeal}`);
    }
  };

  return (
    <div>
      <h2>Detail</h2>
      {meal ? (
        <div className="detail">
          <img src={meal.strMealThumb} alt={meal.strMeal} />
          <div className="info">
            <h3>{meal.strMeal}</h3>
            <p><strong>Category:</strong> {meal.strCategory}</p>
            <p><strong>Area:</strong> {meal.strArea}</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{meal.strInstructions}</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn secondary" onClick={() => goIndex(index - 1)} disabled={index <= 0}>Previous</button>
              <button className="btn" onClick={() => goIndex(index + 1)} disabled={index === -1 || index >= meals.length - 1} style={{ marginLeft: 8 }}>Next</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailView;
