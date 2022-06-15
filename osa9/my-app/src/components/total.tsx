interface Part {
  name: string;
  exerciseCount: number;
}

interface TotalProps {
  Courses: Part[];
}

const Total = ({ Courses }: TotalProps) => {
  return (
    <p>
      Number of exercises{" "}
      {Courses.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

export default Total;
