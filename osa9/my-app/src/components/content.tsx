import { CoursePart } from "../App";
import Part from "./part";

interface ContentProps {
  Courses: CoursePart[];
}

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.Courses.map((p) => (
        <Part key={p.name} Course={p} />
      ))}
    </div>
  );
};

export default Content;
