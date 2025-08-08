import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const NutritionContext = createContext();

// Custom hook to use Nutrition Context
export const useNutrition = () => useContext(NutritionContext);

// Nutrition Provider Component
export const NutritionProvider = ({ children }) => {
  const [consumedCalories, setConsumedCalories] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCalories = localStorage.getItem('consumedCalories');
      return savedCalories ? JSON.parse(savedCalories) : 0;
    }
    return 0; // Default value if localStorage is not available
  });

  const [dailyGoal, setDailyGoal] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedGoal = localStorage.getItem('dailyGoal');
      return savedGoal ? JSON.parse(savedGoal) : 1346;
    }
    return 1346;
  });

  const [macros, setMacros] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedMacros = localStorage.getItem('macros');
      return savedMacros ? JSON.parse(savedMacros) : {
        fat: { consumed: 20, goal: 44 },
        protein: { consumed: 40, goal: 67 },
        carbs: { consumed: 100, goal: 168 },
      };
    }
    return {
      fat: { consumed: 20, goal: 44 },
      protein: { consumed: 40, goal: 67 },
      carbs: { consumed: 100, goal: 168 },
    };
  });

  const [waterCount, setWaterCount] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedWaterCount = localStorage.getItem('waterCount');
      return savedWaterCount ? JSON.parse(savedWaterCount) : 0;
    }
    return 0;
  });

  const [waterAmount, setWaterAmount] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedWaterAmount = localStorage.getItem('waterAmount');
      return savedWaterAmount ? JSON.parse(savedWaterAmount) : 0;
    }
    return 0;
  });

  const [drinks, setDrinks] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedDrinks = localStorage.getItem('drinks');
      return savedDrinks ? JSON.parse(savedDrinks) : {
        coffee: { count: 0 },
        tea: { count: 0 },
        coke: { count: 0 },
        milkshake: { count: 1 },
      };
    }
    return {
      coffee: { count: 0 },
      tea: { count: 0 },
      coke: { count: 0 },
      milkshake: { count: 1 },
    };
  });

  const [calorieStatus, setCalorieStatus] = useState(() => {
    return consumedCalories >= dailyGoal ? 'exceeded' : 'normal';
  });

  // Update localStorage whenever any state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('consumedCalories', JSON.stringify(consumedCalories));
      localStorage.setItem('dailyGoal', JSON.stringify(dailyGoal));
      localStorage.setItem('macros', JSON.stringify(macros));
      localStorage.setItem('waterCount', JSON.stringify(waterCount));
      localStorage.setItem('waterAmount', JSON.stringify(waterAmount));
      localStorage.setItem('drinks', JSON.stringify(drinks));
      localStorage.setItem('calorieStatus', JSON.stringify(calorieStatus));
    }
  }, [consumedCalories, dailyGoal, macros, waterCount, waterAmount, drinks, calorieStatus]);

  // Function to update calorieStatus based on consumedCalories
  useEffect(() => {
    if (consumedCalories >= dailyGoal) {
      setCalorieStatus('exceeded');
    } else {
      setCalorieStatus('normal');
    }
  }, [consumedCalories, dailyGoal]);

  // Functions to update state
  const incrementDrinkCount = (drinkKey) => {
    setDrinks((prevDrinks) => {
      const newDrinks = { ...prevDrinks, [drinkKey]: { count: prevDrinks[drinkKey].count + 1 } };
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('drinks', JSON.stringify(newDrinks));
      }
      return newDrinks;
    });
  };

  const decrementDrinkCount = (drinkKey) => {
    setDrinks((prevDrinks) => {
      if (prevDrinks[drinkKey].count > 0) {
        const newDrinks = { ...prevDrinks, [drinkKey]: { count: prevDrinks[drinkKey].count - 1 } };
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('drinks', JSON.stringify(newDrinks));
        }
        return newDrinks;
      }
      return prevDrinks;
    });
  };

  const incrementWaterCount = () => {
    setWaterCount((prevWaterCount) => {
      const newWaterCount = prevWaterCount + 1;
      setWaterAmount((prevWaterAmount) => prevWaterAmount + 150);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('waterCount', JSON.stringify(newWaterCount));
        localStorage.setItem('waterAmount', JSON.stringify(waterAmount + 150));
      }
      return newWaterCount;
    });
  };

  const decrementWaterCount = () => {
    if (waterCount > 0) {
      setWaterCount((prevWaterCount) => {
        const newWaterCount = prevWaterCount - 1;
        setWaterAmount((prevWaterAmount) => prevWaterAmount - 150);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('waterCount', JSON.stringify(newWaterCount));
          localStorage.setItem('waterAmount', JSON.stringify(waterAmount - 150));
        }
        return newWaterCount;
      });
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
    calorieStatus, // Add calorieStatus to context
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
