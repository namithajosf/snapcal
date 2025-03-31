import React, { createContext, useState, useContext } from 'react';

const NutritionContext = createContext();

export const useNutrition = () => useContext(NutritionContext);

export const NutritionProvider = ({ children }) => {
  const [consumedCalories, setConsumedCalories] = useState(600);
  const [dailyGoal, setDailyGoal] = useState(1346);
  const [macros, setMacros] = useState({
    fat: { consumed: 20, goal: 44 },
    protein: { consumed: 40, goal: 67 },
    carbs: { consumed: 100, goal: 168 },
  });
  const [waterCount, setWaterCount] = useState(0);
  const [waterAmount, setWaterAmount] = useState(0);
  const [drinks, setDrinks] = useState({
    coffee: { count: 3 },
    tea: { count: 2 },
    coke: { count: 5 },
    milkshake: { count: 1 },
  });

  // Functions to update state
  const incrementDrinkCount = (drinkKey) => {
    setDrinks({
      ...drinks,
      [drinkKey]: { count: drinks[drinkKey].count + 1 },
    });
  };

  const decrementDrinkCount = (drinkKey) => {
    if (drinks[drinkKey].count > 0) {
      setDrinks({
        ...drinks,
        [drinkKey]: { count: drinks[drinkKey].count - 1 },
      });
    }
  };

  const incrementWaterCount = () => {
    setWaterCount(waterCount + 1);
    setWaterAmount(waterAmount + 150);
  };

  const decrementWaterCount = () => {
    if (waterCount > 0) {
      setWaterCount(waterCount - 1);
      setWaterAmount(waterAmount - 150);
    }
  };

  const value = {
    consumedCalories,
    setConsumedCalories,
    dailyGoal,
    setDailyGoal,
    macros,
    setMacros,
    waterCount,
    waterAmount,
    drinks,
    incrementDrinkCount,
    decrementDrinkCount,
    incrementWaterCount,
    decrementWaterCount,
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};
