import { FromStorage, ToStorage } from "../utils/Storage";

const WeightKey = "weightKg";
const HeightKey = "heightCm";

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

export { LoadWeight, LoadHeight, SaveWeight, SaveHeight };
