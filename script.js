'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
//old way of making AJAX calls using XML

/*const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}?fullText=true`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `
    <article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} MM</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  })
};


getCountryData('canada');
getCountryData("India");*/
//////////////////////////

// Modern way of making AJAX calls by using PROMISES which is basically a container for a FUTURE value
// calling Fetch( or using FETCH API)

// const request = fetch('https://restcountries.eu/rest/v2/name/India?fullText=true');
// console.log(request);

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

// with function expression
// const getCountryData = function (country) {
//   fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
//     .then(function (response) {
//       console.log(response);
//       //JSON is a method that is available on all the response objects that we GET from FETCH
//       //JSON itself is an asyn fn, so it will also return a promise, hence we use THEN method on its response. To read that response, we apply json on the response object
//       return response.json();
//     }).then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     })
// };

// with arrow function

const getCountryData = function (country) {
  //1st AJAX call for counrtry 1
  fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      console.log(neighbour);

      if (!neighbour) return;

      // 2nd AJAX call for country 2 (or neighbouring country)
      return fetch(`https://restcountries.eu/rest/v2/name/${neighbour}?fullText=true`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data[0], 'neighbour'))

};

getCountryData('canada');
