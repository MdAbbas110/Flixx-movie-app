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

//display the popular on home page
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

// Feth data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = 'f377ae6687ca580212d1190f61f55170';
    const API_URL = 'https://api.themoviedb.org/3/';

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)

    const data = await response.json()
    return data;
}



// Init App
function init() {
    switch (global.currentpage) {
        case '/':
        case '/index.html': 
            displayPopularMovies()
        break;
        case '/shows.html':
            console.log('shows');
        break;
        case '/movie-details.html':
            console.log('movies');
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