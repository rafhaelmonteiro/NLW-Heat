import { Request, Response } from "express";
import { GetLast3MessagesService } from "../services/GetLast3MessagesService";


class GetLast3MessagesController {
  async handle(request: Request, response: Response) {

    const service = new GetLast3MessagesService();
    //cria a mensagem
    const result = await service.execute();

    return response.json(result);
    
  }
}

export { GetLast3MessagesController };