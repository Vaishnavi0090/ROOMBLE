const { Server } = require('socket.io');
const Conversation = require('./models/Conversation');

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    let online_users = [];

    io.on('connection', (socket) => {

        socket.on('join', (data) => {
            //data will be a json
            /*
            Expected format:
            {
                user_id: 'user_id',
                socket_id: 'socket_id'
            }
            */
            console.log(data);
            online_users.push(data);
            console.log(online_users);
            io.emit('online_users', online_users);
        });

        socket.on('send_message', (data) => {
            /*
            Assuming I will get the following data from the frontend
            Expected format: 
            {
                message: 'message', 
                conversation_id: 'conversation_id', 
                sender_id: 'sender_id'
            }

            */
            
            const message = {
                senderID: data.sender_id,
                message: data.message,
                timestamp: new Date(),
                read: false
            }

            Conversation.findOneAndUpdate(
                { _id: data.conversation_id },
                { $push: { messages: message } },
                { new: true },
                (err, conversation) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(conversation);
                        //send the message to the other user
                        const receiver_id = conversation.members.filter((member) => member !== data.sender_id)[0];
                        const receiver_socket = online_users.find((user) => user.user_id === receiver_id);
                        if (receiver_socket) {
                            io.to(receiver_socket.socket_id).emit('receive_message', message);
                        }
                    }
                }
            );

        });

        socket.on('check_user_online', (data) => {
            /*
            Expected format:
            {
                user_id: 'user_id'
            }
            */
            const user = online_users.find((user) => user.user_id === data.user_id);
            const isOnline = !!user;
            socket.emit('user_online_status', { user_id: data.user_id, isOnline });
        });

        socket.on('read_message', (data) => {
            /*
            Expected format:
            {
                conversation_id: 'conversation_id'
            }
            */
           // Assuming that the user has read all the messages in the conversation
            Conversation.findOneAndUpdate(
            { _id: data.conversation_id },
            { $set: { 'messages.$[elem].read': true } },
            (err, conversation) => {
                if (err) {
                    console.log(err);
                } else {
                    socket.emit('message_read', { conversation_id: data.conversation_id });
                }
            });
        });

        socket.on('disconnect', () => {
            online_users = online_users.filter((user) => user.socket_id !== socket.id);
            io.emit('user_disconnected', { socket_id: socket.id });
        });
    });

    return io;
}

module.exports = setupSocket;