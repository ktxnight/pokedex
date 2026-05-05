function createPokemonCard() {
    const li = document.createElement("li");

    const ctnImagem = document.createElement("div")
    ctnImagem.setAttribute("class", "ctn-imagem")

    li.appendChild(ctnImagem)

    const card = document.createElement("div")
    card.setAttribute("class", "card")

    const ctnNumero = document.createElement("div")
    ctnNumero.setAttribute("class", "ctn-numero")

    ctnNumero.textContent = "Numero"

    const ctnNome = document.createElement("div")
    ctnNome.setAttribute("class", "ctn-nome")

    ctnNome.textContent = "Nome"

    card.appendChild(ctnNumero);
    card.appendChild(ctnNome);
    li.appendChild(card);
    return li
}

const pokedex = document.querySelector("#lista-pokemon");

const tempo = Array.from({ length: 20 })

for (const pokemon of tempo) {
    const li = createPokemonCard()
    pokedex.appendChild(li)
}