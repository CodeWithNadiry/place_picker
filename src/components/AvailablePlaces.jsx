import { useContext } from "react";
import Places from "./Places";
import { PlaceContext } from "../store/PlaceContext";
import ErrorPage from './ErrorPage'

const AvailablePlaces = () => {
  const { availablePlaces, selectPlace } = useContext(PlaceContext);

  if (!availablePlaces) {
    return <ErrorPage title='An error occured!' message='No places available' />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      loadingText="Fetching places data..."
      fallbackText="No places available"
      onSelectPlace={selectPlace}
    />
  );
};

export default AvailablePlaces;