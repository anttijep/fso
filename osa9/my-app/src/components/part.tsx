import { CoursePart } from "../App";

interface PartProps {
  Course: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled type ${JSON.stringify(value)}`);
};

const Part = ({ Course }: PartProps): JSX.Element => {
  const content: JSX.Element[] = [];
  content.push(
    <h3>
      {Course.name} {Course.exerciseCount}
    </h3>
  );
  const italic = {
    fontStyle: "italic",
  };
  switch (Course.type) {
    case "normal":
      content.push(<p style={italic}>{Course.description}</p>);
      break;
    case "groupProject":
      content.push(<p>project exercises {Course.groupProjectCount}</p>);
      break;
    case "submission":
      content.push(<p style={italic}>{Course.description}</p>);
      content.push(<p>submit to {Course.exerciseSubmissionLink}</p>);
      break;
    case "special":
      content.push(<p style={italic}>{Course.description}</p>);
      content.push(<p>required skills: {Course.requirements.join(", ")}</p>)
      break;
    default:
      assertNever(Course);
  }
  return <div>{content}</div>;
};

export default Part;
