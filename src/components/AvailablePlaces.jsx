import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import Error from './Error.jsx';
import {sortPlacesByDistance} from '../loc.js';
import { fetchAvailablePlaces } from '../fetchData.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState([false]);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();
  useEffect(() => {
    setIsFetching(true);
    async function fetchPlaces(){
      try{
      const places = await fetchAvailablePlaces();
      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
        setAvailablePlaces(sortedPlaces);
        setIsFetching(false);
      })
     
      }
      catch (error) {
        setError({message:
          error.message || 'Could not fetch places, Plesae try again later'
          
        });
        setIsFetching(false);

      }
     
    }
    fetchPlaces();
  }, []);

  if (error) {
    return <Error title='An Error occurred' message={error.message}/>
  }
  return (

    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingTextt="Fetching data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
