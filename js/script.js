const global = {
    currentpage: window.location.pathname
}

// Helight active links
function highlightActiveLinks() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach((links) => {
        if (links.getAttribute('href') === global.currentpage) {
            links.classList.add('active')
        }
    })
}

//display 20 most popular movies on home page
async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular')
    
    results.forEach((movie) => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              ${
                movie.poster_path 
                ?`<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"/>`
                : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${movie.title}"/>`
              }
            </a>
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
              <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
         </div> `;
    
        document.querySelector('#popular-movies').appendChild(div)
    })
}

//display 20 most popular TV show
async function displayPopularShows() {
    const { results } = await fetchAPIData('tv/popular')

    results.forEach((show) => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
            ${
            show.poster_path ? `
                <img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
                />`
                : `
                <img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
                />`
            }
            </a>
            <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small>
             </p>
            </div> `;

    document.querySelector('#popular-shows').appendChild(div)
    })
}


// Display Movie Details 
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1]
    
    const movie = await fetchAPIData(`movie/${movieId}`)
    console.log(movie);
    //overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path)

    const div = document.createElement('div')
    
    div.innerHTML = `
    <div class="details-top">
  <div>
  ${
    movie.poster_path 
    ? `<img 
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.title}" 
    />`
    : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${movie.title}"
    />`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
    ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${movie.genres.map((genre) => `<li>${genre.name}</li>`)
    .join('')}
    </ul>
    <a href="${
        movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span>
    $ ${addCommasToNumber(Math.floor(Math.random() * 700000) +10000)}
    </li>
    <li><span class="text-secondary">Revenue:</span> 
    $ ${addCommasToNumber(Math.floor(Math.random() * 800000) +20000)}
    </li>
    <li><span class="text-secondary">Runtime:</span> 
    ${movie.runtime} minutes</li>
    <li><span class="text-secondary">Status:</span> 
    ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${movie.production_companies
    .map((company) => `<span>${company.name}</span>`).join('')}
  </div>
</div>
    `;

    document.querySelector('#movie-details').appendChild(div)
}





// Background image of movie, show details page
function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div')
    overlayDiv.style.backgroundImage = 
    `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover'; 
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '135vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0' 
    overlayDiv.style.left = '0' 
    overlayDiv.style.zIndex = '-1' 
    overlayDiv.style.opacity = '0.1' 

//check for type if its movie or show detail
    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv)
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv)
    }
}


// Feth data from TMDB API
async function fetchAPIData(endpoint) {
// only use this key for development or small project 
//you should store your key and make request from a server
    const API_KEY = 'f377ae6687ca580212d1190f61f55170';
    const API_URL = 'https://api.themoviedb.org/3/';

    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)

    const data = await response.json()

    hideSpinner();

    return data;
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show')
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",");
}

// Init App
function init() {
    switch (global.currentpage) {
        case '/':
        case '/index.html': 
            displayPopularMovies();
        break;
        case '/shows.html':
            displayPopularShows();
        break;
        case '/movie-details.html':
            displayMovieDetails();
        break;
        case '/tv-details.html':
            console.log('tv details');
        break;
        case '/search.html':
            console.log('search');
        break;
    }
    highlightActiveLinks()
}

document.addEventListener('DOMContentLoaded', init)