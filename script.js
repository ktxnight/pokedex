let numTotalPokemon = 0;

/* ELEMENTOS HTML */
const lista = document.querySelector("#lista-pokemon");
const form = document.querySelector("#form-pesquisa");
const pesquisa = document.querySelector("#pesquisa");
const restante = document.querySelector("#restante");

/* FUNÇÕES */
function renderizarRestante(length) {
    restante.textContent = "Foram encontrados " + length + " de " + numTotalPokemon + " pokemons!"
}

function createPokemonCard(pokemon) {
    const li = document.createElement("li")
    if (!pokemon?.nome) {
        li.setAttribute("class", "inactive")
    }

    const ctnImagem = document.createElement("div")
    ctnImagem.setAttribute("class", "ctn-imagem")

    const img = document.createElement("img")
    img.setAttribute("src", pokemon?.foto || "./public/pokebola.png")
    if (!pokemon?.nome) img.setAttribute("style", "opacity:35%")
    img.setAttribute("width", "100%")
    img.setAttribute("height", "100%")
    img.setAttribute("alt", pokemon?.nome || "Desconhecido")

    ctnImagem.appendChild(img)
    li.appendChild(ctnImagem)

    const card = document.createElement("div")
    card.setAttribute("class", "card")

    const ctnNumero = document.createElement("div")
    ctnNumero.setAttribute("class", "ctn-numero")

    ctnNumero.textContent = "Nº " + pokemon.numero

    const ctnNome = document.createElement("div")
    ctnNome.setAttribute("class", "ctn-nome")

    ctnNome.textContent = pokemon?.nome || "Desconhecido"

    card.appendChild(ctnNumero)
    card.appendChild(ctnNome)

    li.appendChild(card)
    return li
}

async function getPokemon(nome) {
    return await fetch("https://pokeapi.co/api/v2/pokemon/" + nome)
        .then(async dta => await dta.json())
        .catch(err => {
            console.error(err)
            return null
        })
}

function renderizarLista() {
    const pokedex = JSON.parse(localStorage.getItem("pokedex")) || []

    if (!Array.isArray(pokedex)) return;

    lista.replaceChildren();

    for (let i = 1; i <= numTotalPokemon; i++) {
        const pokemon = pokedex.find((vl) => vl.numero === i) || { numero: i }
        const li = createPokemonCard(pokemon)
        lista.appendChild(li)
    }
    renderizarRestante(pokedex.length)
}

fetch("https://pokeapi.co/api/v2/pokemon/")
    .then(async res => await res.json())
    .then(data => { numTotalPokemon = data.count })
    .catch(err => { console.error(err) })
    .finally(() => { renderizarLista() })

/* EVENTOS */

form.addEventListener("submit", async e => {
    e.preventDefault()

    if (!pesquisa || !pesquisa.value.trim().length < 0) {
        return;
    }

    const pokemon = await getPokemon(pesquisa.value)

    if (!pokemon) return;

    const numero = pokemon.id
    const foto = pokemon.sprites.front_default
    const nome = pokemon.name

    const pokedex = JSON.parse(localStorage.getItem("pokedex")) || [];

    if (!Array.isArray(pokedex)) {
        return;
    }

    if (pokedex.findIndex(vl => vl.numero === numero) > -1) {
        return;
    }

    pokedex.push({
        numero,
        foto,
        nome
    })

    localStorage.setItem("pokedex", JSON.stringify(pokedex.sort((a, b) => a.nome.localeCompare(b.nome))))
    restante.textContent = "Foram encontrados " + pokedex.length + " de " + numTotalPokemon;
    renderizarLista()
})

pesquisa.addEventListener("input", e => {
    const texto = e.currentTarget.value.trim();
    const pokedex = JSON.parse(localStorage.getItem("pokedex")) || []

    if (!Array.isArray(pokedex)) return;

    lista.replaceChildren();

    const pokemons = pokedex.filter(vl => vl.nome.toLocaleLowerCase().includes(texto )|| vl.numero == texto)

    if (pokemons.length === 0 || texto.length === 0) {
        renderizarLista()
    } else {
        for (const pokemon of pokemons) {
            const li = createPokemonCard(pokemon)
            lista.appendChild(li)
        }
        renderizarRestante(pokedex.length)
    }})