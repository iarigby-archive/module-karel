const { expect } = require('chai')

module.exports.config = {
    karel: {
        position: [3, 4]
    },
    world: {
        beepers: [[6, 3]],
        walls: [
            [[3, 1], [3, 2]],
            [[4, 1], [4, 2]],
            [[5, 1], [5, 2]],
            [[2, 2], [3, 2]],
            [[2, 3], [3, 3]],
            [[2, 4], [3, 4]],
            [[3, 4], [3, 5]],
            [[4, 4], [4, 5]],
            [[5, 4], [5, 5]],
            [[5, 2], [6, 2]],
            [[5, 4], [6, 4]],
        ]
    }
}

function beeperIsPickedUp(karel) {
    const beeperPresent = karel.world.beepers.filter(e => e.x == 6 && e.y == 3)
    return expect(beeperPresent.length).eql(0, 'karel should pick up beeper from 6x3. ' + karel)
}
module.exports.assertions = [
    karel => beeperIsPickedUp(karel),
    karel => expect(karel.position).eql({ x: 3, y: 4 }, 'karel should return to starting position')
]