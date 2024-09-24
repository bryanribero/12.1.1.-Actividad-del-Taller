document.addEventListener("DOMContentLoaded", function(){

fetch("https://japceibal.github.io/japflix_api/movies-data.json")
.then(Response => Response.json())
.then(data =>{
    console.log("Datos cargados correctamente:", data);

    const buscar = document.getElementById("btnBuscar");
    const input = document.getElementById("inputBuscar");
    const lista = document.getElementById("lista");

    buscar.addEventListener("click", function(){
        let valueInput = input.value.trim().toLowerCase();

        lista.innerHTML ="";

        if(valueInput !== ""){
            const resultados = data.filter(pelicula =>
                pelicula.title.toLowerCase().includes(valueInput) ||
                pelicula.genres.join(", ").toLowerCase().includes(valueInput) ||
                (pelicula.tagline && pelicula.tagline.toLowerCase().includes(valueInput)) ||
                (pelicula.overview && pelicula.overview.toLowerCase().includes(valueInput))
            );

            if(resultados.length > 0){
                resultados.forEach(pelicula =>{
                    const li = document.createElement("li");
                    const h5 = document.createElement("h4");
                    const p = document.createElement("p");
                    const titleContainer = document.createElement("div");
                    const starsContainer = document.createElement("div");
                    

                    li.classList.add("card-content");
                    h5.classList.add("card-title");
                    p.classList.add("card-tagline");
                    starsContainer.classList.add("stars-container");
                    titleContainer.classList.add("title-container");

                    const voteAverage = Math.round((pelicula.vote_average / 12) * 5);

                    for(i = 1; i <= 5; i++){
                        const star = document.createElement("span");
                        star.classList.add("fa", "fa-star");
                        if (i <= voteAverage){
                            star.classList.add("checked");
                        }
                        starsContainer.appendChild(star);
                    }

                    h5.textContent = pelicula.title;
                    p.textContent = pelicula.tagline || "Sin tagline disponible";

                    titleContainer.appendChild(h5);
                    titleContainer.appendChild(starsContainer);
                    li.appendChild(titleContainer);
                    li.appendChild(p);


                    lista.appendChild(li);

                    li.addEventListener("click", function(){
                        const overlay = document.createElement("div");
                            overlay.classList.add("overlay");
                            document.body.appendChild(overlay);

                        const detallesContainer = document.createElement("div");

                        detallesContainer.classList.add("detalles-container");

                        const title = document.createElement("h2");
                        const overview = document.createElement("p");
                        const hr = document.createElement("hr");
                        const genres = document.createElement("p");

                        title.classList.add("detalles-title");
                        overview.classList.add("detalles-overview");
                        hr.classList.add("detalles-hr");
                        genres.classList.add("detalles-genres");

                        title.textContent = pelicula.title;
                        overview.textContent = pelicula.overview;

                        const genresArray = pelicula.genres;
                        const genreNames = genresArray.map(genre => genre.name); 
                        genres.textContent = genreNames.join(", ");

                        detallesContainer.appendChild(title);
                        detallesContainer.appendChild(overview);
                        detallesContainer.appendChild(hr);
                        detallesContainer.appendChild(genres);

                        document.body.appendChild(detallesContainer);

                        overlay.style.display = "block";
                        detallesContainer.style.display = "block";

                        overlay.addEventListener("click", function() {
                            document.body.removeChild(detallesContainer);
                            document.body.removeChild(overlay);
                        });
                    });
                });
        input.value = "";
            }
        }else{
            console.log("El campo de búsqueda esta vacío");
        }
    });
})
.catch(error =>{
    console.error("Error al cargar los datos:", error);
})

});