import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const W_Q = gql`
  query CITY($loc: String!, $unit: Unit!) {
    getCityByName(name: $loc, config: { lang: en, units: $unit }) {
      id
      name
      weather {
        summary {
          description
        }
        temperature {
          actual
          min
          max
        }
        clouds {
          humidity
        }
        timestamp
      }
    }
  }
`;

const WEATHER_QUERY = gql`
  query CITY {
    getCityByName(name: "San Francisco") {
      id
      name
      country
    }
  }
`;

const Index = () => {
  const [loc, setLoc] = useState('Los Angeles');
  const [unit, setUnit] = useState('imperial');
  const [date, setDate] = useState<string>();
  const [weather, setWeather] = useState<any>();
  function changeCity(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    setLoc(e.target.value);
  }
  function changeMetric(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    setUnit(e.target.value);
  }
  const { loading, error, data, refetch } = useQuery(W_Q, {
    variables: { loc, unit },
    notifyOnNetworkStatusChange: true,
    onCompleted: (d) => {
      console.log(d, data);
      setWeather(d);
      var s = new Date(
        d.getCityByName.weather.timestamp * 1000
      ).toLocaleString('en-US');
      setDate(s);
    },
  });
  useEffect(() => {
    refetch();
  }, [loc, unit]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  return <>
    <div>
      <h1>Simple Weather in {loc}</h1>

      {weather && (
        <>
          <div>last update: {date}</div>
          <div>
            <h2>{weather.getCityByName.weather.summary.description}</h2>
          </div>
          <div>
            <h3>Temperature:</h3>
            Current: {
              weather.getCityByName.weather.temperature.actual
            }&deg; {unit === 'imperial' ? 'F' : 'C'} / Min:{' '}
            {weather.getCityByName.weather.temperature.min}&deg;{' '}
            {unit === 'imperial' ? 'F' : 'C'} / Max:{' '}
            {weather.getCityByName.weather.temperature.max}&deg;{' '}
            {unit === 'imperial' ? 'F' : 'C'}
            <br />
            Humidity: {weather.getCityByName.weather.clouds.humidity}%
          </div>
        </>
      )}
    </div>
    <div>
      <form>
        <select onChange={(e) => changeCity(e)} value={loc}>
          <option value="New York">
            New York
          </option>
          <option value="Los Angeles">
            Los Angeles
          </option>
          <option value="San Francisco">
            San Francisco
          </option>
        </select>
        <select onChange={(e) => changeMetric(e)} value={unit}>
          <option value="metric">
            Metric
          </option>
          <option value="imperial">
            Imperial
          </option>
        </select>
      </form>
    </div>
  </>
};

export default Index;