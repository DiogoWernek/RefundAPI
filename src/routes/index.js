"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const users_routes_1 = require("./users-routes");
const sessions_routes_1 = require("./sessions-routes");
const refunds_routes_1 = require("./refunds-routes");
const uploads_routes_1 = require("./uploads-routes");
const ensure_authenticated_1 = require("./middlewares/ensure-authenticated");
const routes = (0, express_1.Router)();
exports.routes = routes;
// Rotas publicas.
routes.use("/users", users_routes_1.usersRoutes);
routes.use("/sessions", sessions_routes_1.sessionsRoutes);
// Rotas privadas.
routes.use(ensure_authenticated_1.ensureAuthenticated);
routes.use("/refunds", refunds_routes_1.refundsRoutes);
routes.use("/uploads", uploads_routes_1.uploadsRoutes);
