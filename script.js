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
      <h3 class="country__capital">${data.capital}</h3>
      <h4 class="country__region">${data.region}</h4>
     <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
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
//     //VERY IMP NOTE: This 'response' paramter is basically the name of a variable, which we have chosen, into which we are storing the ACTUAL RESPONSE from the FETCH call
//     .then(function (response) {
//       console.log('I am the value of response from fetch:', response);
//       //JSON is a method that is available on all the response objects that we GET from FETCH
//       //JSON itself is an asyn fn, so it will also return a promise, hence we use THEN method on its response. To read that response, we apply json method on the response object
//       return response.json();
//     }).then(function (data) {
//       console.log('I am the value of response.json:', data);
//       renderCountry(data[0]);
//       const neighbour = data[0].borders[0];
//       console.log(neighbour);

//       if (!neighbour) return;
//       return fetch(`https://restcountries.eu/rest/v2/name/${neighbour}?fullText=true`);
//     }).then(function (response) {
//       console.log(response);
//       return response.json()
//     })
//     .then(function (data) {
//       console.log(data[0]);
//       renderCountry(data[0], 'neighbour')
//     })
// };

// with arrow function

// const getCountryData = function (country) {
//   //1st AJAX call for counrtry 1
//   fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
//     .then(response => response.json())
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbour = data[0].borders[0];
//       console.log(neighbour);

//       if (!neighbour) return;

//       // 2nd AJAX call for country 2 (or neighbouring country)
//       return fetch(`https://restcountries.eu/rest/v2/name/${neighbour}?fullText=true`);
//     })
//     .then(response => response.json())
//     .then(data => renderCountry(data[0], 'neighbour'))

// };

// calling the function
//getCountryData('India');



///////////////////// Using ASYNC/AWAIT function for AJAX call
// async will run in the background and once its done it will return a PROMISE like FETCH
// await keyword will stop the async function from running till the promise is fulfilled or the data has been fetched like in this case
// We are storing the ACTUAL RESPONSE from the promise( or the fulfilled value of the promise) in a variable 'response' or 'res' or whatever name we like
//ASYNC?AWAIT is just a SYNTACTIC SUGAR over THEN method. Behind the scenes its just THEN
// const whereAmI = async function (country) {
//   const response = await fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`);
//   console.log(response);
//   const data = await response.json();
//   console.log(data);
//   // we write data[0] below because from the 'data' array, we just want the 0th index
//   renderCountry(data[0]);
// }

// whereAmI('india')

////////////////// Using ASYNC/AWAIT, geolocation and reverse geocoding all together
///In total we have 5 promises now( or 5 awaits) in a single ASYNC function!!!!

// Promisifying the Geolocation API
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  // Geo Location
  const pos = await getPosition();
  console.log('value of my position:', pos);
  // we are changing the names by de structuring the pos object that we receive
  const { latitude: lat, longitude: lng } = pos.coords;
  console.log('My position:', lat, lng);
  // Reverse geocoding
  const responseGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
  const dataGeo = await responseGeo.json();
  console.log('Response from dataGeo:', dataGeo);

  // Country data we receive directly from dataGeo
  const response = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.country}?fullText=true`);
  console.log(response);
  const data = await response.json();
  console.log(data);
  // we write data[0] below because from the 'data' array, we just want the 0th index
  renderCountry(data[0]);
}

// calling the function with any parameter as we are getting the info directly from geolocation now
whereAmI();