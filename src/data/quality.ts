// const QUALITIES = [
//   {
//     name: 'regular',
//     price: 1,
//   },
//   {
//     name: 'silver',
//     price: 1.25,
//   },
//   {
//     name: 'gold',
//     price: 1.5,
//   },
//   {
//     name: 'iridium',
//     price: 2,
//   },
// ];

export function cropQualityDistribution(farmingLevel: number, fertilizerLevel: number) {
  const goldProbability = Math.min(1,
    0.2 * (farmingLevel / 10)
    + (0.2 * fertilizerLevel * ((farmingLevel + 2) / 12))
    + 0.01
  );
  const silverProbability = (fertilizerLevel === 3 ? 1 : Math.min(.75, 2 * goldProbability));
  const iridiumProbability = (fertilizerLevel === 3 ? goldProbability / 2 : 0);

  const ret: number[] = [];

  let remainder = 1;

  ret[3] = remainder * iridiumProbability;
  remainder -= ret[3];

  ret[2] = remainder * goldProbability;
  remainder -= ret[2];

  ret[1] = remainder * silverProbability;
  remainder -= ret[1];

  ret[0] = remainder;

  return ret as [number, number, number, number];
}

export function cropQualityMultiplier(farmingLevel: number, fertilizerLevel: number) {
  const [regular, silver, gold, iridium] = cropQualityDistribution(farmingLevel, fertilizerLevel);
  return 2*iridium + 1.5*gold + 1.25*silver + regular;
};
