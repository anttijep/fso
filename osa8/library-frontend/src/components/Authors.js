import { useQuery, useMutation } from "@apollo/client";
import Select from "react-select";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useState } from "react";

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);
  const [selected, setSelected] = useState(null);
  const [born, setBorn] = useState("");
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }, "AllAuthors"],
  });

  if (!props.show || result.loading) {
    return null;
  }

  const authors = result.data.allAuthors;
  const selectOptions = authors.map((a) => {
    return { value: a.name, label: a.name };
  });
  const updateAuthor = (e) => {
    e.preventDefault();
    if (selected && born) {
      editAuthor({
        variables: {
          name: selected.value,
          setBornTo: Number(born),
        },
      }).catch((ex) => {
        console.log(ex);
      });
    }
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.isAuthed && (
        <>
          <h2>Set birthyear</h2>
          <form onSubmit={updateAuthor}>
            <Select
              name="selectAuthor"
              defaultValue={selected}
              onChange={setSelected}
              options={selectOptions}
            />
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
            <input type="submit" value="update author" />
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
