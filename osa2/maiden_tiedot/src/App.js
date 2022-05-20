
import { useEffect, useState } from 'react'
import axios from 'axios'

const Country = ({name, button}) => <p>{name} {button}</p>

const Weather = ({weather}) => {
  if (!weather) return <div></div>
  return (
    <>
      <h1>Weather in {weather.name}</h1>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'}/>
      <p>wind {weather.wind.speed} m/s</p>
    </>
  )

}

const CountryInfo = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <b>languages:</b>
      <ul>
        {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
      </ul>
      <img src={country.flags.png}/>
    </div>
  )
}

const Countries = ({selected, updateSelected}) => {
  if (selected.length === 1) {
    return (
    <div>
      <CountryInfo country={selected[0]}/>
    </div>
    )
  }
  if (selected.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  return (
    <div>
    {selected.map(c =>
      <div key={c.name.common}>
        <Country name={c.name.common} button={<button value={c.name.common} onClick={updateSelected}>show</button>}/>
      </div>
    )}
    </div>
  )
}

function App() {
  const [selected, setSelected] = useState([]);
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState(undefined);
  useEffect(() => { axios.get('https://restcountries.com/v3.1/all', {headers: {'Content-type' : 'application/json'}}).then(r => setCountries(r.data))}, []);

  useEffect(() => {
    if (selected.length === 1) {
      axios.get('http://api.openweathermap.org/data/2.5/weather?units=metric&q=' + selected[0].capital + '&appid=' + process.env.REACT_APP_API_KEY,
      {headers: {'Content-type' : 'application/json'}}).then(r => setWeather(r.data))
    }
  }, [selected]);
  const updateSelected = e => {
    const list = countries.filter(c => c.name.common.toUpperCase().match(e.target.value.toUpperCase()));
    list.sort((f, s) => f.name.common.localeCompare(s.name.common));
    if (list.length === 1) {
      if (selected.length === 1 && list[0] === selected[0]) {
        return;
      }
      setSelected(list);
    }
    setWeather(undefined);
    if (list.length === selected.length) {
      for (let i = 0; i < list.length; ++i) {
        if (list[i] !== selected[i]) {
          setSelected(list);
          return;
        }
      }
      return;
    }
    setSelected(list);
  }
  return (
    <div>
      find countries <input onChange={updateSelected}/>
      <Countries selected={selected} updateSelected={updateSelected}/>
      <Weather weather={weather}/>
    </div>
  );
}

export default App;
