export interface Country {
  name: string;
  topLevelDomain: string[];
  alpha2Code: string;
  alpha3Code: string;
  callingCodes: string[];
  capital: string;
  altSpellings: string[];
  region: string;
  subregion: string;
  population: number;
  latlng: number[];
  demonym: string;
  area: number | null;
  gini: number | null;
  timezones: string[];
  borders: string[];
  nativeName: string;
  numericCode: string | null;
  currencies: Currency[];
  languages: Language[];
  translations: Translations;
  flag: string;
  regionalBlocs: RegionalBloc[];
  cioc?: string | null;
}

interface RegionalBloc {
  acronym: string;
  name: string;
  otherAcronyms: string[];
  otherNames: string[];
}

interface Translations {
  de: string | null;
  es: string | null;
  fr: string | null;
  ja: string | null;
  it: string | null;
  br: string | null;
  pt: string | null;
  nl: string | null;
  hr: string | null;
  fa: string | null;
}

interface Language {
  iso639_1: string | null;
  iso639_2: string;
  name: string;
  nativeName: string;
}

interface Currency {
  code: string | null;
  name: string;
  symbol: string | null;
}
