import { KgToPound } from "../consts/MetricConversion";

function CalcBurntCaloriesFromActivity(activity, weight, durationMins) {
  if (activity === "Jogging") {
    // https://captaincalculator.com/health/calorie/calories-burned-jogging-calculator/
    const met = 7;
    return (met * weight) / 200 * durationMins;
  } else if (currentEvent.activity === "Swimming") {
    // https://www.omnicalculator.com/sports/swimming-calorie
    // assuming side stroke (7 MET)
    const met = 7;
    return (met * weight * 3.5) / 200 * durationMins;
  } else if (currentEvent.activity === "Cycling") {
    // https://www.omnicalculator.com/sports/calories-burned-biking
    // average 8 to 8.5 MET
    const met = 8;
    return durationMins * met * 3.5 * weight / 200;
  }

  return 0;
}

function WeightToKg(weight, metric) {
  if (metric === "kg") {
    return weight;
  }
  return weight / KgToPound;
}

export { CalcBurntCaloriesFromActivity, WeightToKg }; 
