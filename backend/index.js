const express = require('express')

//Aqui ele obriga a usar o cors usando o comando require para fazer o cruzamento dos recursos para mais mais seguranã
const cors = require('cors')
//Aqui a rota original dos usuários
const UserRouters = require('./routers/UserRouters')

//Aqui a rota nova dos pets, que chama a rota lá dentro da pasta routers, para o arquivo .JS que está lá!
const PetRoutes = require ('./routers/PetRoutes')



const app = express()

app.use(express.json())

// Aqui ele usa as credenciais no localhost Duuhh a gente não tem servidor na núvem pra rodar isso!
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use(express.static('public'))

//Aquie estão as rotas de usuários que já usamos em aula, então não precisa escrever denovo
app.use('/users', UserRouters)

//Aqui de novo  é a rota nova para os pets que deve ser adicionada!
app.use('/pets', PetRoutes)

app.listen(5000)