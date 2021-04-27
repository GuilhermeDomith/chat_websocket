import { Socket } from "socket.io";
import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";
import { UsersService } from "../services/UsersService";

interface IParams {
  text: string,
  email: string
}

io.on("connect", (socket: Socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  socket.on("client_first_access", async (params) => {
    const socketId = socket.id;
    const { text, email } = params as IParams;
    let userId = null;
    console.log(params);

    let userExists = await usersService.findByEmail(email);

    if (!userExists) {
      const user = await usersService.create({ email });
      userId = user.id
      await connectionsService.create({ socketId, userId });

    } else {
      userId = userExists.id
      const connection = await connectionsService.findByUserId(userExists.id);

      if (!connection) {
        await connectionsService.create({ socketId, userId });
      } else {
        connection.socketId = socketId;
        await connectionsService.create(connection);
      }
    }

    await messagesService.create({
      text,
      userId
    })
  });

});