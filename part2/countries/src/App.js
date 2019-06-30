import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Country = ({ country }) => {
  const [buttonClicked, setButtonClicked] = useState(false)

  if (buttonClicked) {
    return (
      <CountryDetailed key={country.name} country={country} />
    )
  } else {
    return (
      <div>
        {country.name} <button onClick={() => setButtonClicked(true)}>show</button>
      </div>
    )
  }
}

const Weather = ({ country }) => {
  const weatherAPIKey = '99a058eb0c0d4582a08181115192706'
  const weatherURL = `http://api.apixu.com/v1/current.json?key=${weatherAPIKey}&q=${country.capital}`
  const [weather, setWeather] = useState([])

  useEffect(() => {
    axios
      .get(weatherURL)
      .then(response => {
        console.log('weather data = ', response.data)
        setWeather(response.data)
      })
    // eslint-disable-next-line
  }, [])
  if (weather.length === 0) {
    return (
      <div></div>
    )
  } else {
    return (
      <div>
        <h2>Weather in {country.capital}</h2>
        <b>temperature:</b> {weather.current.temp_c} Celsius <br />
        <img src={weather.current.condition.icon} alt={`${country.capital}'s weather icon`} /> <br />
        <b>wind: </b>{weather.current.wind_kph} kph direction {weather.current.wind_dir}
      </div>
    )
  }
}

const CountryDetailed = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital} <br />
        population {country.population}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
      </ul>
      <img src={country.flag} width="100" alt={`${country.name}'s flag`} />
      <Weather country={country} />
    </div>
  )
}

const Countries = ({ countriesToShow }) => {
  if (Object.keys(countriesToShow).length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (Object.keys(countriesToShow).length > 1) {
    return (
      countriesToShow.map(country =>
        <Country
          key={country.name}
          country={country}
        />)
    )
  } else {
    return (
      countriesToShow.map(country =>
        <CountryDetailed
          key={country.name}
          country={country}
        />)
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = showAll
    ? countries
    : countries.filter(country =>
      country.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)

  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
    setShowAll(false)
  }

  return (
    <div>
      find countries <input onChange={handleFilter} /> <br />
      <Countries countriesToShow={countriesToShow} />
    </div>
  )
}

export default App;
