import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  meal: any;
  showImageOnly?: boolean;
  variant?: 'card' | 'list';
};

const MealCard: React.FC<Props> = ({ meal, showImageOnly, variant = 'card' }) => {
  const isList = variant === 'list';
  return (
    <div className={`meal-card ${isList ? 'list' : ''}`}>
      <Link to={`/meal/${meal.idMeal}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
        <img src={meal.strMealThumb} alt={meal.strMeal} />
        {!showImageOnly && (
          <div className="meta">
            <h4>{meal.strMeal}</h4>
            <div className="sub">{meal.strCategory} — {meal.strArea}</div>
          </div>
        )}
      </Link>
    </div>
  );
};

export default MealCard;
