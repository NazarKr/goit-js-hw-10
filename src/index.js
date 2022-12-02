import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchCountry: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let formValue = '';

refs.searchCountry.addEventListener('input', debounce(formInput, DEBOUNCE_DELAY));

function formInput(e) {
    e.preventDefault();
    formValue = refs.searchCountry.value.trim();
    if (formValue === '') {
      clearRender();
      return;
    }


    fetchCountries(formValue)
      .then(countries => {
        if (countries.length === 1) {
          clearRender();
          renderCountryList(countries);
          renderCountryInfo(countries);
        } else if (countries.length > 1 && countries.length <= 10) {
          clearRender();
          renderCountryList(countries);
        } else if (countries.length > 10) {
          clearRender();
          Notify.info(
            'Too many mathces found. Please enter a more spesific name',
            { timeout: 100, cssAnimationDuration: 1000 }
          );
        }
      })
      .catch(catchError);
};

function renderCountryList(countries) {
    const markup = countries
      .map(country => {
        return `<li class="country-item">
        <img class='country-img' src="${country.flags.svg}" alt="flag" width=60>
      <p class="country-official">${country.name.official}</p>
    </li>`;
      }).join('');
    refs.countryList.insertAdjacentHTML('beforeend', markup);
}


function renderCountryInfo(countries) {
    const langs = countries.map(({ languages }) => Object.values(languages).join(', '));
  const markup = countries
    .map(country => {
      return `<p class="country-text">Capital: <span class="country-value">${country.capital}</span></p>
      <p class="country-text">Population: <span class="country-value">${country.population}</span></p>
      <p class="country-text">Languages: <span class="country-value">${langs}</span></p>`;
    })
      .join('');
    
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
};

function clearRender() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}


function catchError() {
  clearRender();
  Notify.failure('Oops, there is no country with that name');
}
console.log()