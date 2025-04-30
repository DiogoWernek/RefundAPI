"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundsController = void 0;
const AppError_1 = require("./utils/AppError");
const prisma_1 = require("./database/prisma");
const zod_1 = require("zod");
const CategoriesEnum = zod_1.z.enum([
    "food",
    "others",
    "services",
    "transport",
    "accommodation",
]);
class RefundsController {
    async create(request, response) {
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string().min(1),
            category: CategoriesEnum,
            amount: zod_1.z.number().positive(),
            filename: zod_1.z.string().min(20),
        });
        const { name, category, amount, filename } = bodySchema.parse(request.body);
        if (!request.user?.id) {
            throw new AppError_1.AppError("Não autorizado", 401);
        }
        const refund = await prisma_1.prisma.refunds.create({
            data: {
                name,
                category,
                amount,
                filename,
                userId: request.user.id,
            },
        });
        response.status(201).json(refund);
    }
    async index(request, response) {
        const querySchema = zod_1.z.object({
            name: zod_1.z.string().optional().default(""),
            page: zod_1.z.coerce.number().optional().default(1),
            perPage: zod_1.z.coerce.number().optional().default(10),
        });
        const { name, page, perPage } = querySchema.parse(request.query);
        // Calcular os valores de 'skip' e 'take'
        const skip = (page - 1) * perPage;
        const refunds = await prisma_1.prisma.refunds.findMany({
            skip,
            take: perPage,
            where: {
                user: {
                    name: {
                        contains: name.trim(),
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            include: { user: true },
        });
        // Obter o total de registros para calcular o número de páginas
        const totalRecords = await prisma_1.prisma.refunds.count();
        const totalPages = Math.ceil(totalRecords / perPage);
        response.json({
            refunds,
            pagination: {
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1,
            },
        });
    }
    async show(request, response) {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const refund = await prisma_1.prisma.refunds.findFirst({
            where: { id },
            include: { user: true },
        });
        response.json(refund);
    }
}
exports.RefundsController = RefundsController;
