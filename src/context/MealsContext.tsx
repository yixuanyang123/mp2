import React, { createContext, useContext, useState } from 'react';

type Meal = any;

type MealsContextType = {
  meals: Meal[];
  setMeals: (m: Meal[]) => void;
};

const MealsContext = createContext<MealsContextType | undefined>(undefined);

export const MealsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  return <MealsContext.Provider value={{ meals, setMeals }}>{children}</MealsContext.Provider>;
};

export function useMeals() {
  const ctx = useContext(MealsContext);
  if (!ctx) throw new Error('useMeals must be used within MealsProvider');
  return ctx;
}

export default MealsContext;
