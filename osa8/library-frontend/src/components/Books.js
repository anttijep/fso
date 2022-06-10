import { useQuery } from "@apollo/client";
import { useState } from "react";
import { BOOKS_AND_GENRES } from "../queries";
import Select from "react-select";

const Books = (props) => {
  const [selected, setSelected] = useState(null);
  const result = useQuery(BOOKS_AND_GENRES, {
    variables: {
      genre: selected ? selected.value : null,
    },
  });
  if (!props.show || result.loading) {
    return null;
  }

  const books = result.data.allBooks;

  const possibleGenres = result.data.allGenres.map((g) => {
    return { value: g, label: g };
  });
  possibleGenres.push({ value: null, label: "w/e" });

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Select
        defaultValue={selected}
        options={possibleGenres}
        onChange={setSelected}
      />
    </div>
  );
};

export default Books;
