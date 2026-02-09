/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  fetchUserPlaces,
  fetchAvailablePlaces,
  updateUserPlaces,
} from "../services/http";

export const PlaceContext = createContext({
  availablePlaces: [],
  userPlaces: [],
  selectPlace: () => {},
  removePlace: () => {},
  modalIsOpen: false,
  startRemovePlace: () => {},
  stopRemovePlace: () => {},
  errorUpdatingPlaces: null,
  clearError: () => {},
});

function placeReducer(state, action) {
  switch (action.type) {
    case "SET_AVAILABLE_PLACES":
      return { ...state, availablePlaces: action.payload };

    case "SET_USER_PLACES":
      return { ...state, userPlaces: action.payload };

    case "ADD_PLACE":
      return {
        ...state,
        userPlaces: [action.payload, ...state.userPlaces],
      };

    case "REMOVE_PLACE":
      return {
        ...state,
        userPlaces: state.userPlaces.filter(
          (p) => p.id !== action.payload
        ),
      };

    default:
      return state;
  }
}

const PlaceContextProvider = ({ children }) => {
  const [places, dispatch] = useReducer(placeReducer, {
    availablePlaces: [],
    userPlaces: [],
  });

  const selectedPlaceRef = useRef(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);

  const hasError = !!errorUpdatingPlaces;

  // 🔹 Load initial data
  useEffect(() => {
    async function loadPlaces() {
      try {
        const available = await fetchAvailablePlaces();
        const user = await fetchUserPlaces();

        dispatch({ type: "SET_AVAILABLE_PLACES", payload: available });
        dispatch({ type: "SET_USER_PLACES", payload: user });
      } catch (err) {
        console.error("Failed to load places:", err.message);
      }
    }

    loadPlaces();
  }, []);

  // 🔹 OPTIMISTIC ADD (safe)
  const selectPlace = async (place) => {
    if (hasError) return;

    if (places.userPlaces.some((p) => p.id === place.id)) return;

    const prevUserPlaces = places.userPlaces;

    // ✅ optimistic UI update
    dispatch({ type: "ADD_PLACE", payload: place });

    try {
      await updateUserPlaces([place, ...prevUserPlaces]);
    } catch (err) {
      // 🔁 rollback
      dispatch({
        type: "SET_USER_PLACES",
        payload: prevUserPlaces,
      });

      setErrorUpdatingPlaces({
        message: err.message || "Failed to add place.",
      });
    }
  };

  // 🔹 Open delete modal
  const startRemovePlace = (place) => {
    if (hasError) return;
    selectedPlaceRef.current = place;
    setModalIsOpen(true);
  };

  const stopRemovePlace = () => {
    selectedPlaceRef.current = null;
    setModalIsOpen(false);
  };

  // 🔹 OPTIMISTIC REMOVE (safe)
  const removePlace = useCallback(async () => {
    if (!selectedPlaceRef.current || hasError) return;

    const id = selectedPlaceRef.current.id;
    const prevUserPlaces = places.userPlaces;

    // ✅ optimistic UI update
    dispatch({ type: "REMOVE_PLACE", payload: id });
    setModalIsOpen(false);

    try {
      await updateUserPlaces(
        prevUserPlaces.filter((p) => p.id !== id)
      );
    } catch (err) {
      // 🔁 rollback
      dispatch({
        type: "SET_USER_PLACES",
        payload: prevUserPlaces,
      });

      setErrorUpdatingPlaces({
        message: err.message || "Failed to delete place.",
      });
    }

    selectedPlaceRef.current = null;
  }, [places.userPlaces, hasError]);

  const clearError = () => setErrorUpdatingPlaces(null);

  return (
    <PlaceContext.Provider
      value={{
        availablePlaces: places.availablePlaces,
        userPlaces: places.userPlaces,
        selectPlace,
        removePlace,
        modalIsOpen,
        startRemovePlace,
        stopRemovePlace,
        errorUpdatingPlaces,
        clearError,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

export default PlaceContextProvider;