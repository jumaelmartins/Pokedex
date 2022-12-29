function convertPokemonToLi(pokemon) {
  return ` 
        <li class="pokemon ${pokemon.type}" >
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

                <div class="detail ">
                    <ol class="types " >
                        ${pokemon.types
                          .map(
                            (type) => `<li class="type ${type}">${type}</li>`
                          )
                          .join("")}
                    </ol>
                   <img src="${pokemon.photo}"
                          alt="${pokemon.name}">
                </div>
        </li>
    `;
}

const inputBtn = document.querySelector("#input");
const pokemonList = document.getElementById("pokemonList");
const nextButton = document.getElementById("nextPage");

// paginação

//loadPokemonItens(offset, limit);

let offset = 0;
let perPage = 10;
let limit = 251;

/*nextButton.addEventListener("click", () => {
  offset += limit;
  loadPokemonItens(offset, limit);
});*/

const state = {
  page: 1,
  perPage,
  totalPage: Math.ceil(limit / perPage),
  maxVisibleButtons: 5,
};

const hmtl = {
  get(element) {
    return document.querySelector(element);
  },
};

const controls = {
  next() {
    state.page++;

    const lastPage = state.page > state.totalPage;
    if (lastPage) {
      state.page--;
    }
  },
  prev() {
    state.page--;
    if (state.page < 1) {
      state.page++;
    }
  },
  goTo(page) {
    state.page = page;
    if (page < 1) {
      page = 1;
    }

    state.page = Number(page);

    if (page > state.totalPage) {
      state.page = state.totalPage;
    }
  },
  createListeners() {
    hmtl.get("#firstPage").addEventListener("click", () => {
      controls.goTo(1);
      update();
    });
    hmtl.get("#lastPage").addEventListener("click", () => {
      controls.goTo(state.totalPage);
      update();
    });
    hmtl.get("#nextPage").addEventListener("click", () => {
      controls.next();
      update();
    });
    hmtl.get("#prevPage").addEventListener("click", () => {
      controls.prev();
      update();
    });
  },
};

const buttons = {
  create(number) {
    const button = document.createElement("button");
    button.innerHTML = number;

    const buttons = hmtl.get("#numbers");
    buttons.appendChild(button);

    if (state.page === number) {
      button.classList.add("active");
    }

    button.classList.add("button");

    button.addEventListener("click", (e) => {
      const page = Number(e.target.innerText);
      controls.goTo(page);
      update();
    });
  },
  update() {
    hmtl.get("#numbers").innerHTML = "";
    const { maxLeft, maxRight } = buttons.calculateMaxVisible();

    for (let page = maxLeft; page <= maxRight; page++) {
      buttons.create(page);
    }
  },
  calculateMaxVisible() {
    const { maxVisibleButtons } = state;
    let maxLeft = state.page - Math.floor(maxVisibleButtons / 2);
    let maxRight = state.page + Math.floor(maxVisibleButtons / 2);

    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = maxVisibleButtons;
    }

    if (maxRight > state.totalPage) {
      maxLeft = state.totalPage - (maxVisibleButtons - 1);
      maxRight = state.totalPage;

      if (maxLeft < 1) maxLeft = 1;
    }

    return { maxLeft, maxRight };
  },
};

function update() {
  list.update();
  buttons.update();
}

const list = {
  update() {
    showLoading();

    hmtl.get("#pokemonList").innerHTML = "";

    let page = state.page - 1;
    let start = page * state.perPage;
    let end = start + state.perPage;

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
      const paginatedItems = pokemons
        .slice(start, end)
        .map(convertPokemonToLi)
        .join("");
      pokemonList.innerHTML = paginatedItems;
      hideLoading();
    });
    /*function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}*/
    // const paginatedItems = arrayPokemons.slice(start, end);
    // paginatedItems.array.forEach(list.create());
  },
};

function init() {
  update();
  controls.createListeners();
  filter();
}

init();

function hideLoading() {
  const load = document.querySelector(".boxLoad");
  load.classList.add("hidden");
  pokemonList.classList.remove("hidden");
}

function showLoading() {
  const load = document.querySelector(".boxLoad");
  load.classList.remove("hidden");
  pokemonList.classList.add("hidden");
}

function filter() {
    
  let page = state.page - 1;
  let start = page * state.perPage;
  let end = start + state.perPage;

  inputBtn.addEventListener("input", (e) => {
    showLoading();
    let searchValue = e.target.value.trim().toLowerCase();

    pokeApi.getPokemons(offset, limit).then((pokemons) => {
      const filterPokemons = Array.from(pokemons)
        .filter((pokemon) => pokemon.name.toLowerCase().includes(searchValue))
        .slice(start, end)
        .map(convertPokemonToLi)
        .join("");
      pokemonList.innerHTML = filterPokemons;
      hideLoading();
    });
  });

  list.update();
}

//.then((pokemons = [] ) => {
//const filterPokemons = pokemons.map(convertPokemonToLi).join("")
//pokemonList.innerHTML = filterPokemons;
//hideLoading()})})}

/*pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const filterPokemons = pokemons
          .includes()
           .map(convertPokemonToLi)
          .join("");
        pokemonList.innerHTML = paginatedItems;
        hideLoading()
      }**/
