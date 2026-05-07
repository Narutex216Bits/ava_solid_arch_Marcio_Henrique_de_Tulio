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

# Walkthrough: Avaliação de Pets Implementada
Concluímos a avaliação referente a criação, controle e adoção de Pets neste projeto. Abaixo detalho tudo que foi feito.

## O que será implementado
### 1. Rotas de Pets (PetRoutes.js)
Configuramos todas as rotas listadas na tarefa para dar suporte à manipulação de Pets, associadas ao PetController. Importamos os middlewares adequados para segurança (Validação de Token) e funcionalidades adicionais (Upload Múltiplo de Imagens).
<img width="670" height="602" alt="image" src="https://github.com/user-attachments/assets/c0aae8ce-b8a0-469c-b739-d20526651aca" />

### 2. Integração no Servidor (index.js)
Adicionamos o módulo de rotas PetRoutes no servidor Express (index.js), sob o endpoint /pets.
<img width="539" height="460" alt="image" src="https://github.com/user-attachments/assets/f1649a4b-3ed9-4ebf-9bc6-99fc59627e51" />

### 3. Controlador de Pets (PetController.js)
Implementamos todos os métodos do CRUD, bem como a lógica de adoções (onde aplicável):
[Esta parte deixo com vocês!!]
create: Realiza validações (obrigando campos como name, age, weight, color), vincula as imagens e também o usuário autenticado que está realizando o cadastro. Salva o status do Pet automaticamente como available: true.
getAll: Resgata todos os Pets ordenados por data de criação (-createdAt).
getAllUserPets e getAllUserAdoptions: Filtram os pets onde o usuário logado é o respectivo dono (user._id) ou o adotante da visita agendada (adopter._id).
getPetById e removePetById: Operações via Parâmetro (ID) com validações adicionais de formato do Object ID do MongoDB para evitar crash na aplicação.
updatePet: Método PATCH que lida com modificação nos dados do formulário e também substituição/adição de novas imagens caso enviadas.
schedule e concludeAdoption: Endpoints vitais para os ciclos de adoção; O primeiro garante o interesse adicionando um adotante provisório (após checagem para impedir que o dono tente adotar o próprio pet); o segundo finaliza o negócio (fechando o status available = false).
Validação
TIP

## Você agora já pode testar o fluxo de Pets via Insomnia ou Postman no ambiente local!

### Como testar:

Inicie a API com npm run start (ou o comando de início do seu projeto) dentro de backend.
Faça Login (/users/login) para obter um Bearer Token de algum usuário existente.
Envie um form multipart para POST http://localhost:5000/pets/create passando campos como name, age e um arquivo de upload no campo images associado ao header de Autorização de Token.

# Tarefas: [Passe as Terfas para o Backlog em anexo deixei um modelo para cópia!]
Abaixo estão as 7 tarefas que devem ser executadas para completar a avaliação de Pets.

## [x] Task 1: Estruturação das Rotas (PetRoutes.js)

Instruções:
Crie o arquivo backend/routers/PetRoutes.js.
Importe o roteador do Express, os middlewares de validação de token (verify-token.js) e upload de imagens (image-upload.js).
Exponha as rotas de manipulação do Pet, direcionando as chamadas para os métodos futuros do PetController.
Vá até backend/index.js e importe PetRoutes.js, configurando o app para usar esse roteador na rota base /pets.
## [x] Task 2: Criação do Pet com Upload Múltiplo (create)

Instruções:
Crie o arquivo backend/controllers/PetController.js.
Implemente o método create responsável por receber name, age, weight e color via req.body.
Valide se todos os dados existem.
Acesse as imagens através de req.files (que foram interceptadas via middleware multer imageUpload.array('images')).
Atribua o usuário atual (buscando por token) à propriedade user do Pet, defina available: true, e salve o Pet no banco de dados.
## [x] Task 3: Função de Resgatar todos os Pets (getAll)

Instruções:
No PetController, implemente o método getAll.
Realize uma busca no modelo Pet com Pet.find().
Ordene a listagem por data de criação (sort('-createdAt')).
Retorne a lista com o status HTTP 200 (OK).
## [x] Task 4: Listagem de Pets e Adoções do Usuário (getAllUserPets e getAllUserAdoptions)

Instruções:
Implemente o método getAllUserPets filtrando na busca por Pets em que o id do dono (user._id) seja igual ao ID do usuário do token atual.
Implemente o método getAllUserAdoptions buscando no banco Pets em que o usuário logado consta na propriedade adopter._id.
Ambas as buscas devem ser ordenadas do mais recente para o mais antigo.
## [x] Task 5: Busca e Remoção de Pet por ID (getPetById e removePetById)

Instruções:
Implemente getPetById: Verifique se o id da URL é válido. Se não for, retorne status 422. Caso o Pet não exista, retorne 404.
Implemente removePetById: Localize o Pet pelo ID, depois verifique se o usuário que está fazendo a requisição é o mesmo usuário que cadastrou o Pet.
Somente se o usuário for o dono do Pet, efetue a remoção via Pet.findByIdAndDelete(id).
## [x] Task 6: Atualização do Pet por Endpoint (updatePet)

Instruções:
No método updatePet, receba o ID via URL e os dados via form-data.
Valide se o ID é correto, se o Pet existe e se o usuário autenticado é o real dono dele.
Modifique as propriedades que foram enviadas com novos valores.
Caso novas imagens sejam enviadas (array req.files contendo arquivos), limpe as antigas da variável de alteração e recadastre os nomes das novas imagens. Realize a alteração com Pet.findByIdAndUpdate(id, updatedData).
## [x] Task 7: Agendamento e Conclusão de Adoção (schedule e concludeAdoption)

Instruções:
Implemente schedule: Valide se o Pet existe e certifique-se de que o dono do Pet não possa agendar uma visita para o próprio animal.
Vincule o usuário logado na propriedade adopter do modelo de Pet e salve.
Implemente concludeAdoption: Verifique se quem está chamando a rota é o dono do Pet. Se sim, altere a flag available para false no banco de dados e salve a atualização.
