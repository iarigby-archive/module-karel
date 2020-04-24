const { expect } = require('chai')

function getRandomWidth() {
    return Math.round(Math.random()*10) + 10
}
const w = getRandomWidth()
module.exports.config = [
    {
        world: {
            width: 1,
            height: 1
        },
    },
    {
        world: {
            width: w,
            height: w
        }
    },
    {
        world: {
            width: w +1,
            height: w + 1
        }
    }
]

function beeperCount(karel, x, y) {
    const beeperPresent = karel.world.beepers.filter(e => e.x === x && e.y === y)
    return beeperPresent.length
}

function oneBeeper(karel, beepers) {
    const results = []
    for (let i = 1; i <= karel.world.width; i++) {
        for(let j = 1; j <= karel.world.height; j++) {
            results.push(beeperCount(karel, i, j))
        }
    }
    return results.filter(e => e === 1).length === beepers
}
module.exports.assertions = [
    karel => {
        const w = karel.world.width
        const e = w*w
        return expect(karel.world.beepers.length).equal(e, `${w}x${w} სამყაროში უნდა იყოს ${e} ბურთი`)
    },
    karel => {
        const w = karel.world.width
        return expect(oneBeeper(karel, w*w)).equal(true, `ყველა კუთხეში უნდა იყოს ზუსტად 1 ბურთი`)
    }
]