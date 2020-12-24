import React from "react";
import { Country } from "./country";
import unreduxed from "../../../src";

type State = {
  text: string;
  countries: Country[];
  filtered: Country[];
};

type Action =
  | { type: "textChanged"; payload: string }
  | { type: "countriesFetched"; payload: Country[] }
  | { type: "filter"; payload: Country[] };

const initialState: State = {
  text: "",
  countries: [],
  filtered: [],
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "textChanged":
      return {
        ...state,
        text: action.payload,
      };

    case "countriesFetched":
      return { ...state, countries: action.payload };

    case "filter":
      return { ...state, filtered: action.payload };
  }
};

const useReduxLike = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    (async () => {
      const fetched = await fetch("https://restcountries.eu/rest/v2/all");
      const countries: Country[] = await fetched.json();

      dispatch({ type: "countriesFetched", payload: countries });
    })();
  }, []);

  React.useEffect(() => {
    dispatch({
      type: "filter",
      payload: state.countries.filter(country =>
        country.name.toLowerCase().includes(state.text.toLowerCase() ?? ""),
      ),
    });
  }, [state.countries, state.text]);

  return { state, dispatch };
};

const [ContainerProvider, useContainer] = unreduxed(useReduxLike);

function useSelector<T>(selector: (state: State) => T) {
  return useContainer(container => selector(container.state));
}

function useDispatch() {
  return useContainer(container => container.dispatch);
}

export { ContainerProvider, useSelector, useDispatch };
