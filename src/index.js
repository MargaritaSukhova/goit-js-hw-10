import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const countryEL = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleInputSearch, 300));

function handleInputSearch(event) {
  const countryQuerry = event.target.value.trim();
  if (countryQuerry === '') {
    listEl.innerHTML = '';
    countryEL.innerHTML = '';
    return;
  }
  fetchCountries(countryQuerry)
    .then(countries => {
      if (countries.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length < 10 && countries.length >= 2) {
        countryEL.innerHTML = '';
        const countryListMarkup = makeCoutriesListMarkup(countries);
        listEl.innerHTML = countryListMarkup;
      } else if (countries.length === 1) {
        listEl.innerHTML = '';
        const countryCardMarkup = makeCoutryCardMarkup(countries);
        countryEL.innerHTML = countryCardMarkup;
      }
    })
    .catch(error => {
      listEl.innerHTML = '';
      countryEL.innerHTML = '';
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
    });
}

function makeCoutriesListMarkup(coutriesList) {
  return coutriesList
    .map(({ name, flags }) => {
      return `<li class="country__item"><img src="${flags.svg}" alt="${name.official}" width="60" height="30"></img><p>${name.official}</p></li>`;
    })
    .join('');
}

function makeCoutryCardMarkup(country) {
  return country
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="coutry__header"><img src="${flags.svg}" alt="${
        name.official
      }" width="60" height="30"></img><h1>${name.official}</h1></div>
    <p><b>Capital: </b>${capital}</p>
    <p><b>Population: </b>${population}</p>
    <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
}
