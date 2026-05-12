const Pet = require('../models/Pet')
const mongoose = require('mongoose')
const getToken = require('../helpers/get-tokens')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class PetController {

    // Task 2 - Criação do Pet com upload multiplo! um usuário pode upar várias imagens dos pets!
    static async create(req, res) {
        const { name, age, weight, color } = req.body

        if (!name) {
            return res.status(422).json({ message: 'Não pode ser sem nome, tem que colocar um nome!!' })
        }
        if (!age) {
            return res.status(422).json({ message: 'A idade é obrigatória, não adianta você tentar esconder!' })
        }
        if (!weight) {
            return res.status(422).json({ message: 'O peso é obrigatório! Estou vendo levando seu pet na churrascaria!' })
        }
        if (!color) {
            return res.status(422).json({ message: 'A cor é obrigatória! Ele não é um arco-iris, mas você tem que colocar!' })
        }
        if (!req.files || req.files.length === 0) {
            return res.status(422).json({ message: 'Ao menos uma imagem é obrigatória! Os outros tem que ver como é o seu pet!' })
        }

        const images = req.files.map(file => file.filename)

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            image: images,
            available: true,
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
                email: user.email,
            }
        })

        try {
            const newPet = await pet.save()
            return res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet,
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    // Task 3 - Resgatar todos os Pets
    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')
        return res.status(200).json({ pets })
    }

    // Task 4 - Mostra os pets do usuário logado!
    static async getAllUserPets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')
        return res.status(200).json({ pets })
    }

    // Task 4 - Comando para que o usuário realize adoções enquanto está logado!
    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')
        return res.status(200).json({ pets })
    }

    // Task 5 - Buscar Pet por ID
    static async getPetById(req, res) {
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' })
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado!' })
        }

        return res.status(200).json({ pet })
    }

    // Task 5 - Comando para remover o pet pelo ID
    static async removePetById(req, res) {
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' })
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado!' })
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Acesso negado! Você não é o dono deste pet.' })
        }

        await Pet.findByIdAndDelete(id)
        return res.status(200).json({ message: 'Pet removido com sucesso!' })
    }

    // Task 6 - Atualizar Pet do dono
    static async updatePet(req, res) {
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' })
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado!' })
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Acesso negado! Você não é o dono deste pet.' })
        }

        const { name, age, weight, color } = req.body

        const updatedData = {}

        if (name) updatedData.name = name
        if (age) updatedData.age = age
        if (weight) updatedData.weight = weight
        if (color) updatedData.color = color

        if (req.files && req.files.length > 0) {
            updatedData.image = req.files.map(file => file.filename)
        }

        try {
            await Pet.findByIdAndUpdate(id, updatedData)
            return res.status(200).json({ message: 'Pet atualizado com sucesso!' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    // Task 7 - Agendar visita para os pets
    static async schedule(req, res) {
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' })
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado!' })
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() === user._id.toString()) {
            return res.status(422).json({ message: 'Você não pode agendar uma visita para o seu próprio pet Duuh!!' })
        }

        if (pet.adopter) {
            if (pet.adopter._id.toString() === user._id.toString()) {
                return res.status(422).json({ message: 'Você já agendou uma visita para este pet, não pode agendar denovo!' })
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image,
        }

        try {
            await pet.save()
            return res.status(200).json({
                message: `Visita agendada com sucesso! Entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`,
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    // Task 7 - Concluir adoção
    static async concludeAdoption(req, res) {
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' })
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado!' })
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Acesso negado! Você não é o dono deste pet.' })
        }

        try {
            await Pet.findByIdAndUpdate(id, { available: false })
            return res.status(200).json({ message: 'Adoção concluída com sucesso!' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

}