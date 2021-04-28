import { Socket } from "socket.io";
import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();
  const connectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

  io.emit("admin_list_all_users", connectionsWithoutAdmin);

  socket.on("admin_list_messages_by_user", async (params, callback) => {
    const { userId } = params;

    const messages = await messagesService.listByUser(userId);
    callback(messages);
  });

  socket.on("admin_send_message", async (params) => {
    const { userId, text } = params;

    await messagesService.create({
      text,
      userId,
      adminId: socket.id
    });

    const connection = await connectionsService.findByUserId(userId);
    const { socketId } = connection

    const data = {
      text,
      socketId: socket.id
    }

    io.to(socketId).emit("admin_send_to_client", data)
  });

  socket.on("admin_user_in_support", async (params) => {
    const { userId } = params;

    connectionsService.updateAdminId({
      userId,
      adminId: socket.id
    });

    const connectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();
    io.emit("admin_list_all_users", connectionsWithoutAdmin);
  });

});