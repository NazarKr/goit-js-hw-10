import axios from 'axios';

const URL = 'https://restcountries.com/v3.1/name';

export function fetchCountries(name) {
  return axios
    .get(
      `${URL}/${name}?fields=name,capital,population,flags,languages`
    )
    .then(({ data }) => data);
}
