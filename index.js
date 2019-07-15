'use strict';

const apiKey = '200518328-8bca963655d57f39a898f6a5ed451149';
const googleAPIKey = 'AIzaSyAeGiEt4c7marM2v1Z2EAM2yH4rjFcjvXo';
const searchURL = 'https://www.hikingproject.com/data/get-trails';
const googleSearchURL = 'https://maps.googleapis.com/maps/api/geocode/json'

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

//returns an array. inside array are repo objects (each repo the username has)
//repo object will have name variable we could use
function displayResults(responseJson) {
    console.log(responseJson);
    for(let i = 0; i < responseJson.trails.length; i++) {
        console.log(responseJson.trails[i].name);
        const listItem = '<li><a href="' + responseJson.trails[i].url + '" target="_blank"><p class="linkName">' 
        + responseJson.trails[i].name +'</p><p>' + '<img class="trailImgSmall" src="' + responseJson.trails[i].imgSmallMed +'"/><img class="trailImgMed" src="' + responseJson.trails[i].imgMedium +'"/>' + 
        '</p></a><p class="summary">' + responseJson.trails[i].summary + '</p><p>' + responseJson.trails[i].location + 
        '</p><p>' + responseJson.trails[i].length + ' miles</p></li>';
        $('#results-list').append(listItem);
    }
    $('#results').removeClass('hidden');
}

function getLatLng (address, maxResults=10) {
  const params = {
    address: address,
    key: googleAPIKey
  }
  const queryString = formatQueryParams(params);
  const url = googleSearchURL + '?' + queryString;

  // console.log(url);

  return fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    console.log(responseJson.results[0].geometry.location);
    const location = responseJson.results[0].geometry.location;
    renderTrailList(location.lat, location.lng, maxResults);
  });

}

function getTrailList(userLat, userLong, maxResults=10) {
  const params = {
    lat: userLat,
    lon: userLong,
    maxResults: maxResults,
    key: apiKey
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

return fetch(url)
.then(response => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(response.statusText);
})
.then(responseJson => {
  responseJson.trails.sort(function(a,b) {
      return a.length - b.length; 
    });
    return responseJson;
  });
}

function renderTrailList(userLat, userLong, maxResults=10) {
  getTrailList(userLat, userLong, maxResults)
  .then(responseJson => displayResults(responseJson))
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#results-list').empty();
    const maxResults = $('#js-max-results').val();
    const address = $('#userAddress').val();
    getLatLng(address, maxResults);
  });
}

$(watchForm);