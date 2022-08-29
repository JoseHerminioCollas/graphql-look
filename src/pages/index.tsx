import React from 'react';
import { useQuery, gql } from '@apollo/client';

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
  const { loading, error, data } = useQuery(WEATHER_QUERY);
  console.log(data);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  return <div>Got Data</div>;
};

export default Index;