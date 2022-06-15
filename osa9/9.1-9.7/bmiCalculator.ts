const make_pair = (num: number, str: string): { num: number; str: string } => {
  return { num, str };
};

const calculateBmi = (height: number, mass: number): string => {
  const inm = height / 100;
  if (!inm) {
    throw new Error("height can't be 0");
  }
  const bmi = mass / (inm * inm);
  const results = [
    make_pair(16, "Underweight (Severe thinness)"),
    make_pair(17, "Underweight (Moderate thinness)"),
    make_pair(18.5, "Underweight (Mild thinness)"),
    make_pair(25, "Normal (healthy weight)"),
    make_pair(30, "Overweight (Pre-obese)"),
    make_pair(35, "Obese (Class I)"),
    make_pair(40, "Obese (Class II)"),
  ];
  for (let i = 0; i < results.length; ++i) {
    if (bmi < results[i].num) {
      return results[i].str;
    }
  }
  return "Obese (Class III)";
};

if (require.main === module) {
  const getArgs = (): { height: number; mass: number } => {
    const height = Number(process.argv[2]);
    const mass = Number(process.argv[3]);
    if (!height || !mass || isNaN(height) || isNaN(mass)) {
      throw new Error("invalid args");
    }
    return { height, mass };
  };
  try {
    const { height, mass } = getArgs();
    console.log(calculateBmi(height, mass));
  } catch (ex) {
    if (ex instanceof Error) {
      console.log(ex.toString());
    }
  }
}

export { calculateBmi };
