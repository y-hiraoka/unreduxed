import React from "react";
import { ContainerProvider, useSelector, useDispatch } from "./container";
import { Country as ICountry } from "./country";
import styles from "./styles.css";

export const ReduxLike: React.FC = () => {
  return (
    <ContainerProvider>
      <div className={styles.root}>
        <SearchInput />
        <Countries />
      </div>
    </ContainerProvider>
  );
};

const SearchInput: React.FC = () => {
  const text = useSelector(state => state.text);
  const dispatch = useDispatch();

  return (
    <div className={styles.search}>
      <input
        className={styles.searchInput}
        type="search"
        value={text}
        placeholder="search..."
        onChange={e => dispatch({ type: "textChanged", payload: e.target.value })}
      />
    </div>
  );
};

const Countries: React.FC = () => {
  const countries = useSelector(state => state.filtered);

  return (
    <div className={styles.countries}>
      {countries.map(country => (
        <Country key={country.numericCode} country={country} />
      ))}
    </div>
  );
};

const Country: React.FC<{ country: ICountry }> = ({ country }) => {
  return (
    <div className={styles.country}>
      <img className={styles.countryFlag} src={country.flag} alt={country.name} />
      <p className={styles.countryName}>{country.name}</p>
    </div>
  );
};
