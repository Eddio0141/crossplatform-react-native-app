import { FromStorage, ToStorage } from "../utils/Storage";

const WeightKey = "weightKg";
const HeightKey = "heightCm";
const WeightMetric = "weightMetric";
const HeightMetric = "heightMetric";

function LoadWeight(setWeightKg) {
  FromStorage(WeightKey, 0).then((weightKgData) => {
    setWeightKg(weightKgData);
  });
}

function LoadHeight(setHeightCm) {
  FromStorage(HeightKey, 0).then((heightCmData) => {
    setHeightCm(heightCmData);
  });
}

function SaveWeight(weightKg) {
  ToStorage(WeightKey, weightKg);
}

function SaveHeight(heightCm) {
  ToStorage(HeightKey, heightCm);
}

function LoadWeightMetric(setWeightMetric) {
  FromStorage(WeightMetric, "kg").then((weightMetricData) => {
    setWeightMetric(weightMetricData);
  });
}

function LoadHeightMetric(setHeightMetric) {
  FromStorage(HeightMetric, "cm").then((heightMetricData) => {
    setHeightMetric(heightMetricData);
  });
}

export { LoadWeight, LoadHeight, SaveWeight, SaveHeight, LoadWeightMetric, LoadHeightMetric };
