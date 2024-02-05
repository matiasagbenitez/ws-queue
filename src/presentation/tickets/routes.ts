import { Router } from "express";
import { TicketController } from "./controller";

export class TicketRoutes {
    static get routes() {
        const router = Router();

        const ticketController = new TicketController();

        router.get("/", ticketController.getTickets);
        router.get("/last", ticketController.getLastTicketNumber);
        router.get("/pending", ticketController.getPendingTickets);

        router.post("/", ticketController.createTicket);

        router.get("/draw/:desk", ticketController.drawTicket);
        router.put("/done/:ticketId", ticketController.doneTicket);

        router.get("/working-on", ticketController.getWorkingOn);

        return router;
    }
}