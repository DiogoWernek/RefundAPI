"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const AppError_1 = require("./utils/AppError");
const prisma_1 = require("./database/prisma");
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const zod_1 = require("zod");
class UsersController {
    async create(request, response) {
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string().trim().min(2, { message: "Nome é obrigatório" }),
            email: zod_1.z
                .string()
                .trim()
                .email({ message: "E-mail inválido" })
                .toLowerCase(),
            password: zod_1.z
                .string()
                .min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
            role: zod_1.z
                .enum([client_1.UserRole.employee, client_1.UserRole.manager])
                .default(client_1.UserRole.employee),
        });
        const { name, email, password, role } = bodySchema.parse(request.body);
        console.log({ name, email, password });
        const userWithSameEmail = await prisma_1.prisma.user.findFirst({ where: { email } });
        if (userWithSameEmail) {
            throw new AppError_1.AppError("Já existe um usuário cadastrado com esse e-mail");
        }
        const hashedPassword = await (0, bcrypt_1.hash)(password, 8);
        await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        response.status(201).json();
    }
}
exports.UsersController = UsersController;
