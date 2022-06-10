import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient, useSubscription } from "@apollo/client";
import Recommendations from "./components/Recommendations";
import { BOOK_ADDED, BOOKS_AND_GENRES, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const storagetoken = localStorage.getItem("user-token");
  const [token, setToken] = useState(storagetoken);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: async ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded;
      window.alert(`Added book '${book.title}' by ${book.author.name}`);
      // en kyl malta odottaa, että näen mallivastauksen cache päivittämisestä...
      // tästäkin varmasti joku bugi löytyy.
      // tää varmaa pitäis tehä sellai et ottaa kaikki tehdyt queryt jonnekki global objectii ja
      // sen perusteella päivittää cachee sielt mis tarvii...
      const queries = [BOOKS_AND_GENRES, ALL_BOOKS];
      const genres = book.genres.concat(null);
      queries.forEach((query) => {
        genres.forEach((g) => {
          const qdata = client.cache.readQuery({
            query,
            variables: { genre: g },
          });
          if (qdata) {
            client.cache.updateQuery(
              { query, variables: { genre: g } },
              (data) => {
                const map = data.allBooks.reduce(
                  (m, n) => m.set(n.title, n),
                  new Map()
                );
                map.set(book.title, book);
                const allBooks = [...map.values()];
                if (data.allGenres) {
                  const allGenres = [...new Set(data.allGenres.concat(g))];
                  return { allGenres, allBooks };
                }
                return { allBooks };
              }
            );
          }
        });
      });
      // tää refetch toimii varmaa isommal todennäköisyydel
      await client.refetchQueries({
        include: ["AllAuthors"],
      });
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {(token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button
              onClick={() => {
                setPage("authors");
                setToken(null);
                localStorage.clear();
                client.resetStore();
              }}
            >
              Logout
            </button>
          </>
        )) || <button onClick={() => setPage("login")}>login</button>}
      </div>
      <Authors isAuthed={Boolean(token)} show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <Login show={page === "login"} setToken={setToken} />
      <Recommendations show={page === "recommend"} isAuthed={Boolean(token)} />
    </div>
  );
};

export default App;
