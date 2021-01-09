const pokeApiBase = 'https://pokeapi.co/api/v2/pokemon'
const form = document.getElementById("pokemon-search");

function capitalise(string) {
    return string[0].toUpperCase() + string.substring(1);
}
function createbadge(types) {
    const colours = {
        normal: '#BEBEB0',
        poision: '#FFFDCF',
        pyschic: '#F563B1',
        grass: '#F04F3F',
        ground: '#C8B76F',
        ice: '#8574FF',
        fire: '#55ACFF',
        rock: '#CDBC72',
        dragon: '#8874FF',
        water: '#A75545',
        bug: '#BFCE20',
        dark: '#C2C1D4',
        fighting: '#9D9AD5',
        ghost: '#FDE03E',
        steel: '#C4C2DA',
        flying: '#C4C2DA',
        electric: '#FDE53C',
        fairy: '#141518',
        poison: '#AB5DA3'
    }

    const badgesString = types.reduce((inital, next) => {
        const type = next["type"]["name"]
        return inital += `<span class="badge badge-pill" style="border: 5px solid white; border-radius: 25%; background-color:${colours[type]}">${capitalise(type)}</span> `
}, "")

return badgesString

}

async function getRandomAbility(abilities) {
    const index = Math.floor(Math.random() * abilities.length)
    const ability = abilities[index].ability
    const {name, url} =ability
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    return {
        name, 
        description: data.effect_entries[1].effect
    }
  

}

async function createPokemonData(data) {
    const {types, forms, abilities, sprites} = data;
    const ability = await getRandomAbility(abilities)
    const pokemonName = forms[0].name;
    const {front_default: pictureUrl} = sprites;
    const badges = createbadge(types);
    return {
        pokemonName,
        pictureUrl,
        badges,
        ability
    }
}
function populatePokemonDiv(data) {
    const {pokemonName, pictureUrl, badges, ability} = data;

    document.getElementById('main-section').innerHTML = `
        <div class='card' style="width:60%; margin:auto;">
        <div class='card-header mb-2'>${capitalise(pokemonName)}</div>
        <h6 class="card-subtitle  text-muted">Type: ${badges}</h6> 
            <img src=${pictureUrl} class="card-img-top" style="width:50%" alt=${pokemonName}>
            <h5 class='card-title'>${capitalise(ability.name)}</h5>
            <p class="card-text">${ability.description}</p>
            
        </div>
    `
}

function errorCleanUp(error) {
    console.error(error.message);
    document.getElementById('main-section').innerHTML = `<p id='error-message' style="color:red">Something went wrong</p>`
    document.getElementById('search-bar').value = "";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    let {value} = document.getElementById("search-bar");
    fetch(`${pokeApiBase}/${value.toLowerCase()}`)
        .then(response => response.json())
        .then(createPokemonData)
        .then(populatePokemonDiv)
        .catch(errorCleanUp);
    value = ""
})