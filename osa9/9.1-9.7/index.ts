import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { exerciseResults } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, resp) => {
  resp.send("Hello Full Stack!");
});

app.get("/bmi", (req, resp) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || isNaN(height) || !weight || isNaN(weight)) {
    return resp.status(400).json({ error: "malformatted parameters" });
  }
  try {
    const bmi = calculateBmi(height, weight);
    return resp.json({ weight, height, bmi });
  } catch (ex) {
    return resp.status(400).json({ error: "malformatted parameters" });
  }
});

app.post("/exercises", (req, resp) => {
  try {
    if (!("daily_exercises" in req.body && "target" in req.body)) {
      return resp.status(400).json({ error: "parameters missing" });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const exercises: Array<number> = req.body.daily_exercises;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const target = Number(req.body.target);
    if (isNaN(target) || !Array.isArray(exercises)) {
      return resp.status(400).json({ error: "malformatted parameters" });
    }
    for (let i = 0; i < exercises.length; ++i) {
      if (typeof exercises[i] !== "number") {
        return resp.status(400).json({ error: "malformatted parameters" });
      }
    }
    const exresult = exerciseResults(exercises, target);
    return resp.json(exresult);
  } catch (ex) {
    return resp.status(400).json({ error: "malformatted parameters" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
