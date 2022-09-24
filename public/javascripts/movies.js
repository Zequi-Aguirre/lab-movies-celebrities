console.log("movies.js connected");

function searchMovies() {
  document.querySelector(".movies").innerHTML = "";
  const query = document.querySelector("#query").value;

  console.log(query);
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "22bb122a8bmshdc51eafb1829ebcp1ffd6ejsn4749669dbab2",
      "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
    },
  };

  fetch(`https://imdb8.p.rapidapi.com/auto-complete?q=${query}`, options)
    .then((response) => response.json())
    .then((data) => {
      const list = data.d;
      list.map((movie) => {
        console.log({ movie });
        const name = movie.l;
        const poster = movie.i.imageUrl;
        const movieHTML = `<li><img src="${poster}"> <h2>${name}</h2>
        
        <form action="/movies/create" method="post">

  <label style="display:none"  style="display:none" for="movie-name-input">
    Movie Title:
    <input
      id="movie-name-input"
      type="text"
      placeholder="Top Gun"
      name="title"
      value="${name}"
    />
  </label>

  <label style="display:none" >
    Genre:
    <input type="text" name="genre" />
  </label>

  <label style="display:none" >
    Plot:
    <input type="text" name="plot" />
  </label>

  <label style="display:none" >
    Image Link:
    <input type="text" name="image" value="${poster}" />
  </label>

  
  <button>Create</button>
  
</form>
</li>
        `;
        document.querySelector(".movies").innerHTML += movieHTML;
        console.log(movie);
      });
    })
    .catch((err) => console.error(err));
}

document.querySelector("#searchButton").addEventListener("click", searchMovies);
