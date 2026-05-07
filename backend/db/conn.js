const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb://localhost:27017/getpet')
    console.info('Conectado ao serviço do Mongoose!')
}

main().catch((err) => console.error(err))

module.exports = mongoose