require('dotenv-defaults').config()

const getActiveUser =function() {
    return process.env.USERNAME
}

module.exports = getActiveUser