document.addEventListener("DOMContentLoaded", function () {
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
        .then(Response => Response.json())
        .then(data => {
            console.log("Datos cargados correctamente:", data);

            const buscar = document.getElementById("btnBuscar");
            const input = document.getElementById("inputBuscar");
            const lista = document.getElementById("lista");

            buscar.addEventListener("click", function () {
                let valueInput = input.value.trim().toLowerCase();

                lista.innerHTML = "";

                if (valueInput !== "") {
                    const resultados = data.filter(pelicula =>
                        pelicula.title.toLowerCase().includes(valueInput) ||
                        pelicula.genres.join(", ").toLowerCase().includes(valueInput) ||
                        (pelicula.tagline && pelicula.tagline.toLowerCase().includes(valueInput)) ||
                        (pelicula.overview && pelicula.overview.toLowerCase().includes(valueInput))
                    );

                    if (resultados.length > 0) {
                        resultados.forEach(pelicula => {
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

                            for (let i = 1; i <= 5; i++) {
                                const star = document.createElement("span");
                                star.classList.add("fa", "fa-star");
                                if (i <= voteAverage) {
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

                            li.addEventListener("click", function () {
                                const overlay = document.createElement("div");
                                overlay.classList.add("overlay");
                                document.body.appendChild(overlay);

                                const detallesContainer = document.createElement("div");
                                detallesContainer.classList.add("detalles-container");

                                const title = document.createElement("h2");
                                const overview = document.createElement("p");
                                const hr = document.createElement("hr");
                                const genres = document.createElement("p");
                                const genresMore = document.createElement("div");

                                title.classList.add("detalles-title");
                                overview.classList.add("detalles-overview");
                                hr.classList.add("detalles-hr");
                                genres.classList.add("detalles-genres");
                                genresMore.classList.add("container-genresMore");

                                title.textContent = pelicula.title;
                                overview.textContent = pelicula.overview;

                                const genresArray = pelicula.genres;
                                const genreNames = genresArray.map(genre => genre.name);
                                genres.textContent = genreNames.join(", ");

                                const dropdownDiv = document.createElement("div");
                                dropdownDiv.classList.add("dropdown");

                                const dropdownLink = document.createElement("a");
                                dropdownLink.classList.add("btn", "btn-secondary", "dropdown-toggle");
                                dropdownLink.role = "button";
                                dropdownLink.textContent = "More";

                                const dropdownMenu = document.createElement("ul");
                                dropdownMenu.classList.add("dropdown-menu");
                                console.log("Menú creado:", dropdownMenu);

                                const year = pelicula.release_date.split("-")[0];

                                const option1 = document.createElement("li");
                                option1.textContent = "Year: " + year;
                                dropdownMenu.appendChild(option1);

                                const option2 = document.createElement("li");
                                option2.textContent = "Runtime: " + pelicula.runtime + " min";
                                dropdownMenu.appendChild(option2);

                                const option3 = document.createElement("li");
                                option3.textContent = "Budget: $" + pelicula.budget.toLocaleString();
                                dropdownMenu.appendChild(option3);

                                const option4 = document.createElement("li");
                                option4.textContent = "Revenue: $" + pelicula.revenue.toLocaleString();
                                dropdownMenu.appendChild(option4);

                                dropdownDiv.appendChild(dropdownLink);
                                document.body.appendChild(dropdownMenu);

                                dropdownLink.addEventListener("click", function(event) {
                                
                                    
                                    const modalRect = detallesContainer.getBoundingClientRect();
                                    const buttonRect = dropdownLink.getBoundingClientRect();
                                    
                                    // Calculamos la posición relativa del botón dentro del modal
                                    const relativeTop = buttonRect.bottom - modalRect.top;
                                    const relativeLeft = buttonRect.left - modalRect.left;
                                    
                                    // Posicionamos el menú relativo al modal
                                    dropdownMenu.style.top = `${modalRect.top + relativeTop}px`;
                                    dropdownMenu.style.left = `${modalRect.left + relativeLeft}px`;
                                    
                                    dropdownMenu.classList.toggle("show");
                                });

                                genresMore.classList.add("d-flex", "justify-content-between", "align-items-center");
                                genresMore.appendChild(genres);
                                genresMore.appendChild(dropdownDiv);

                                detallesContainer.appendChild(title);
                                detallesContainer.appendChild(overview);
                                detallesContainer.appendChild(hr);
                                detallesContainer.appendChild(genresMore);

                                document.body.insertAdjacentElement('beforeend', detallesContainer);

                                overlay.style.display = "block";
                                detallesContainer.style.display = "block";

                                document.addEventListener('click', function(event) {
                                    if (!dropdownLink.contains(event.target) && !dropdownMenu.contains(event.target)) {
                                        dropdownMenu.classList.remove('show');
                                    }
                                });

                                overlay.addEventListener("click", function () {
                                    dropdownMenu.classList.remove('show');
                                    document.body.removeChild(dropdownMenu);
                                    document.body.removeChild(detallesContainer);
                                    document.body.removeChild(overlay);
                                });
                            });
                        });
                        input.value = "";
                    }
                } else {
                    console.log("El campo de búsqueda está vacío");
                }
            });
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
        });
});