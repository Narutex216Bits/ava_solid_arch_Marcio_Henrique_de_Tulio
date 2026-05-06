# ava_solid_arch [P1 o que Há de novo no projeto]

## Implementação de todos os métodos necessários para o controle de Pets: [PetController.js]

create: Criação do Pet incluindo validações de formulário, associação com o usuário logado e gravação do array de nomes de imagens.
getAll: Retorna todos os Pets disponíveis.
getAllUserPets: Retorna apenas os Pets cujo dono (user._id) é o usuário logado.
getAllUserAdoptions: Retorna todos os Pets nos quais o usuário logado consta como adotante.
getPetById: Retorna os dados de um Pet específico com base no ID.
removePetById: Remove um Pet se ele pertencer ao usuário logado.
updatePet: Atualiza os dados (e possivelmente imagens) de um Pet pertencente ao usuário logado.
schedule: Agenda a visita para adoção (associa o adotante ao Pet, se não for o próprio dono).
concludeAdoption: Finaliza a adoção marcando o Pet como não disponível (available = false).

## Novas Rotas: [PetRoutes.js]
Criação do roteador contendo os endpoints solicitados:

POST /create
GET /
GET /mypets
GET /myadoptions
GET /:id
DELETE /:id
PATCH /:id
PATCH /schedule/:id
PATCH /conclude/:id

## Adição Importante [index.js]
Importação do PetRoutes.
Inclusão do middleware para a rota /pets: app.use('/pets', PetRoutes).

## Verification Plan
Automated Tests
N/A para este projeto (não há suite de testes configurada).
Manual Verification
Iniciar o servidor utilizando npm start ou npm run start dentro do diretório backend.
Utilizar um cliente HTTP (como Postman ou Insomnia) para testar o CRUD completo na rota de Pets (incluindo autenticação com Token JWT e upload multipart/form-data para as imagens).
