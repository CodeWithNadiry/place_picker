import logoImg from "./assets/logo.png";
import Places from "./components/Places";
import { useContext } from "react";
import { PlaceContext } from "./store/PlaceContext";
import AvailablePlaces from "./components/AvailablePlaces";
import Modal from './components/Modal'
import ErrorPage from "./components/ErrorPage";
import DeleteConfirmation from "./components/DeleteConfirmation";
const App = () => {
  const { userPlaces, errorUpdatingPlaces, startRemovePlace, removePlace, stopRemovePlace , modalIsOpen, clearError } = useContext(PlaceContext);

  return (
    <>
    <Modal open={errorUpdatingPlaces} onClose={clearError}>
    {errorUpdatingPlaces && (
      <ErrorPage title="An error occured!" message={errorUpdatingPlaces.message} onConfirm={clearError} />
    )}
    </Modal>
    <Modal open={modalIsOpen} onClose={stopRemovePlace}>
      <DeleteConfirmation onCancel={stopRemovePlace} onConfirm={removePlace} />
    </Modal>
      <header>
        <img src={logoImg} alt="stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the place you would like to visit below."
          loadingText="Fetching you places..."
          places={userPlaces}
          onSelectPlace={startRemovePlace}
        />
        <AvailablePlaces />
      </main>
    </>
  );
};

export default App;
