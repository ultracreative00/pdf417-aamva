const { createCanvas } = require("canvas")
const { PDF417, HUB3 } = require("../../lib/pdf417")

const code = HUB3.format({
    amount: 12355,
    sender: {
        name: "PETAR KORETIĆ",
        street: "PREVOJ DD",
        city: "10000 Zagreb"
    },
    receiver: {
        name: "FIRMA J.D.O.O",
        street: "PREVOJ DD",
        city: "10000 ZAGREB",
        iban: "HR1210010051863000160",
        model: "HR01",
        reference: "7336-68949637625-00001"
    },
    purpose: "COST",
    description: "Uplata za 1. mjesec"
})

const canvas = createCanvas(1, 1)
PDF417.draw(code, canvas)

console.log(`<img src="${canvas.toDataURL()}" />`)
