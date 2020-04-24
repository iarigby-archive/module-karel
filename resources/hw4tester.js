const { expect } = require('chai')

/**
 *
 * @returns {number} integer from 1 to 10
 */
function getRandom() {
    return Math.round(Math.random()*10)
}

function getColumnWorld(columns, columnHeight) {
    if (columns < 2) {
        throw "not enough columns"
    }
    const width = 1 + (columns - 1)*4
    const beepers = []
    const walls = []
    function getWall(column) {
        return [[column, columnHeight], [column, columnHeight + 1]]
    }
    for (let i = 0; i < columns; i++) {
        const column = 1 + i*4
        walls.push(getWall(column))
        for (let j = 1; j <= columnHeight; j++) {
            if (Math.random() > 0.2) {
                beepers.push([column, j])
            }
        }
    }
    return {
        width: width,
        height: columnHeight + 4, // whatever :D,
        beepers: beepers,
        walls: walls
    }
}

function getProperties(world) {
    return {
        columns: (world.width - 1) / 4 + 1,
        columnHeight: world.height - 4
    }
}

function beeperCount(world, x, y) {
    const beeperPresent = world.beepers.filter(e => e.x === x && e.y === y)
    return beeperPresent.length
}
function checkColumns(world) {
    const {columns, columnHeight} = getProperties(world)
    for (let i = 0; i < columns; i++) {
        const column = 1 + i*4
        for (let j = 1; j <= columnHeight; j++) {
            if(beeperCount(world, column, j) !== 1) {
                return false
            }
        }
    }
    return true
}
module.exports.config = [
    {
        world: getColumnWorld(2, 1)
    },
    {
        world: getColumnWorld(getRandom()+ 5, getRandom() + 5)
    }
]

function getDescription(columns, columnHeight) {
    return `${columns} სვეტი, ${columnHeight} სიგრძის`
}
module.exports.assertions = [
    karel => {
        return expect(checkColumns(karel.world)).equal(true, `ყველა სვეტი უნდა იყოს შევსებული`)
    },
    karel => {
        const {columns, columnHeight} = getProperties(karel.world)
        const expected = columns * columnHeight
        const message = `${getDescription(columns, columnHeight)}, სულ ${expected} ბურთი`
        return expect(karel.world.beepers.length).equal(expected, message)
    }
]