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
    }
]

function beeperCount(karel, x, y) {
    const beeperPresent = karel.world.beepers.filter(e => e.x === x && e.y === y)
    return beeperPresent.length
}

function oneBeeper(karel) {
    const results = []
    for (let i = 1; i <= karel.world.width; i++) {
        for(let j = 1; j <= karel.world.height; j++) {
            results.push(beeperCount(karel, i, j))
        }
    }
    return results.filter(e => e).length === karel.world.beepers.length
}
module.exports.assertions = [
    karel => expect(karel.world.beepers.length).equal(karel.world.width*karel.world.width, 'there should be widthxheight beepers'),
    karel => expect(oneBeeper(karel)).equal(true, 'each corner should have exactly one beeper')
]