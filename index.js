'use strict';

//https://developer.nps.gov/api/v1/parks?stateCode=CO&api_key=gcUGALBm35IkRAkYql7IJiKobuFvSkyu0PgUzTQF
const apiKey = '200518328-8bca963655d57f39a898f6a5ed451149'; 
const searchURL = 'https://www.hikingproject.com/data/';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

//returns an array. inside array are repo objects (each repo the username has)
//repo object will have name variable we could use
function displayResults(responseJson) {
    console.log(responseJson);
    for(let i = 0; i < responseJson.data.length; i++) {
        console.log(responseJson.data[i].name);
        const listItem = '<li><a href="' + responseJson.data[i].html_url + '" target="_blank">' 
        + responseJson.data[i].name 
        +'</a><p>' + responseJson.data[i].description + '</p></li>';
        $('#results-list').append(listItem);
    }
    $('#results').removeClass('hidden');
}

function renderTrailList(userLat, userLong, maxResults=10) {
    const params = {
      api_key: apiKey,
      Latitude: userLat,
      Longitude: userLong,
      limit: maxResults
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
  
    console.log(url);
    
  fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => displayResults(responseJson))
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#results-list').empty();
    // const searchTerm = $('#searchNatlParks').val();
    const maxResults = $('#js-max-results').val();
    // const stateCode = $('#userStateCode').val().replace(' ','');
    renderTrailList(userLat, userLong, maxResults);
  });
}

$(watchForm);