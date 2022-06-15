interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const exerciseResults = (
  exercises: Array<number>,
  target: number
): ExerciseResult => {
  const periodLength = exercises.length;
  if (!periodLength) throw new Error("invalid args");
  const parsed = exercises.reduce(
    (p, n) => (n ? [p[0] + 1, p[1] + n] : p),
    [0, 0]
  );
  const trainingDays = parsed[0];
  const average = parsed[1] / periodLength;
  const success = average >= target;
  const rating = Math.floor(Math.random() * 3) + 1;
  const ratingDescription = (() => {
    switch (rating) {
      case 1:
        return "aika huono";
      case 2:
        return "no juu";
      case 3:
        return "taidat koijata";
      default:
        return "jaa epic rating algorithmis on joku bugi";
    }
  })();

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  const getArgs = (): { target: number; data: Array<number> } => {
    const data = process.argv.slice(3).map((n) => {
      const ret = Number(n);
      if (isNaN(ret)) {
        throw new Error("invalid args");
      }
      return ret;
    });
    const target = Number(process.argv[2]);
    if (!target || isNaN(target)) {
      throw new Error("invalid args");
    }
    return {
      target,
      data,
    };
  };

  try {
    const { target, data } = getArgs();
    console.log(exerciseResults(data, target));
  } catch (ex) {
    if (ex instanceof Error) {
      console.log(ex.toString());
    }
  }
}

export { exerciseResults };
