import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.searchBox.addEventListener('input', debounce(onHandleInput, DEBOUNCE_DELAY));

function onHandleInput(e) {
  const inputValue = e.target.value.trim().toLowerCase();

  if (inputValue.length > 0) {

    fetchCountries(inputValue)
      .then(data => {
        // console.log('начальный масив', data);

          if (data.length === 1) {
          renderOneCountry(data);
          // console.log('один элемент')
        } else if (data.length > 1 && data.length <= 10) {
          renderList(data);
          // console.log('до десяти элементов')
        } else {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } 
      })
      .catch(err => {
        console.log('~ err', err);
        renderError();
      });
    } else if(inputValue.length === 0) {
      // console.log('нет елементов')
      renderEmpty();
    }
  }

function renderList(data) {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
  console.log('список стран', data);

  data.forEach(item => {
    const { name, flags } = item;

    const countryItem = document.createElement('li');
    countryItem.classList.add('country-item');
    countryItem.innerHTML = `
    <div class="flag">
      <img src="${flags.svg}" alt="${name.official}">
    </div>
    <div class="country-name">${name.official}</div>
    `;
    refs.countryList.appendChild(countryItem);
  
  });
}

function renderOneCountry(data) {
  // console.log('одна страна', data);
  refs.countryList.innerHTML = '';
  const { name, flags, capital, population, languages } = data[0];
  const { official } = name;
  const { svg } = flags;
    refs.countryInfo.innerHTML = `
  <li class="country-item">
    <div class="country-item-name">
      <div class="flag">
        <img src="${svg}" alt="${official}">
     </div>
    <div class="country-name">${official}</div> 
    </div>
    
    <div class="country-capital"><span class="country-element">Capital:</span> ${capital}</div>
    <div class="country-population"><span class="country-element">Population:</span> ${population}</div>
    <div class="country-languages"><span class="country-element">Languages:</span> ${Object.values(languages).map(item => item).join(', ')}</div>
  </li>
    `;
}

function renderError() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function renderEmpty() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
