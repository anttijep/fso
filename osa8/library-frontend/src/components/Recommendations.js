import { ALL_BOOKS, ME } from "../queries";
import { useQuery } from "@apollo/client";

const Recommendations = (props) => {
  const { loading, data } = useQuery(ME, {
    onError: () => {},
    skip: !props.isAuthed,
  });
  const books = useQuery(ALL_BOOKS, {
    variables: {
      genre: loading || !data || !data.me ? null : data.me.favoriteGenre,
    },
    skip: !props.isAuthed,
  });
  if (!props.show || loading || books.loading || !data || !data.me) {
    return null;
  }
  const { favoriteGenre } = data.me;
  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre {favoriteGenre}</p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
