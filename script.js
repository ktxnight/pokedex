let numTotalPokemon = 0;

/* ELEMENTOS HTML */
const lista = document.querySelector("#lista-pokemon");
const form = document.querySelector("#form-pesquisa");
const pesquisa = document.querySelector("#pesquisa");
const restante = document.querySelector("#restante");
const informacao = document.querySelector("#informacao")

/* FUNÇÕES */
function renderizarRestante(length) {
    restante.textContent = "Foram encontrados " + length + " de" + numTotalPokemon + " pokemons!"
}

async function renderizarInformacoes(numero) {
    const pokemon = await fetch("https://pokeapi.co/api/v2/pokemon/" + numero)
    .then(res => res.json())
    .then(dta => {
        console.log(dta)

        const elPeso = document.querySelector("#pkm-peso")
        elPeso.textContent = dta["weight"] + " kg"

        const elAltura = document.querySelector("#pkm-altura")
        elAltura.textContent = dta["height"] + " cm"

        const elExp = document.querySelector("#pkm-base-exp")
        elExp.textContent = dta["base_experience"]

        const elStatus = document.querySelector("#pkm-status")
        elStatus.replaceChildren()

        const atributos = [
            { key: "hp", value: "HP" },
            { key: "attack", value: "ATK" },
            { key: "defene", value: "DEF" },
            { key: "special-attack", value: "SPA" },
            { key: "special-defense", value: "SPD" },
            { key: "speed", value: "SP" }
        ]

        for(const att of atributos){
            const status = dta["stats"].find(sta => sta["stat"]["name"] === att.key)
            
            if(!status) continue

            const valor = status["base_stat"]

            const li = document.createElement("li")
            
            const dvStatus = document.createElement("div")
            dvStatus.textContent = att.value

            const lbValor = document.createElement("label")
            lbValor.textContent = valor

            li.appendChild(dvStatus)
            li.appendChild(lbValor)
            elStatus.appendChild(li)
        }
    })
    .catch(err => { console.error("Não foi possível recuperar o pokemon " + numero + ": " + err) })
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

    const ctnTipos = document.createElement("div")
    ctnTipos.setAttribute("class", "ctn-tipos")


    if (pokemon?.tipos) {
        const ulCtnTipos = document.createElement("ul")
        ulCtnTipos.setAttribute("class", "lista-tipos")

        for (const tipo of pokemon.tipos) {
            const liTipo = document.createElement("li")

            const imgTipo = document.createElement("img")

            fetch(tipo.url)
                .then(res => res.json())
                .then(dta => {
                    const iconUrl = dta.sprites["generation-ix"]["scarlet-violet"]["name_icon"]
                    imgTipo.setAttribute("src", iconUrl);
                })
                .catch(err => console.error("Erro ao carregar tipo:", err));

            imgTipo.setAttribute("height", "13px")
            imgTipo.setAttribute("alt", tipo.name)

            liTipo.appendChild(imgTipo)

            ulCtnTipos.appendChild(liTipo)
        }
        ctnTipos.appendChild(ulCtnTipos)
    }


    card.appendChild(ctnNumero)
    card.appendChild(ctnNome)
    card.appendChild(ctnTipos)

    li.appendChild(card)
    li.addEventListener("click", () => {
        const display = informacao.style.display || "none";
        const newDisplay = display === "none" ? "block" : "none"
        if (newDisplay === "block") renderizarInformacoes(pokemon.numero)
        informacao.setAttribute("style", "display: ".concat(newDisplay))

    })
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

function abrirInfo() {
    informacao.setAttribute("style",)
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
    const tipos = pokemon.types.map(({ type }) => type) // {url e name}

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
        nome,
        tipos
    })

    localStorage.setItem("pokedex", JSON.stringify(pokedex.sort((a, b) => a.nome.localeCompare(b.nome))))
    renderizarLista()
})

pesquisa.addEventListener("input", e => {
    const texto = e.currentTarget.value.trim();
    const pokedex = JSON.parse(localStorage.getItem("pokedex")) || []

    if (!Array.isArray(pokedex)) return;

    lista.replaceChildren();

    const pokemons = pokedex.filter(vl => vl.nome.toLocaleLowerCase().includes(texto.toLocaleLowerCase()) || vl.numero == texto)

    if (pokemons.length === 0 || texto.length === 0) {
        renderizarLista()
    } else {
        for (const pokemon of pokemons) {
            const li = createPokemonCard(pokemon)
            lista.appendChild(li)
        }
        renderizarRestante(pokedex.length)
    }
})