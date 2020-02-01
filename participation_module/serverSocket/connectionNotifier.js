function ConnectionNotifier() {
    this.connections = {};
    this.chat = [];

    this.saveMsg = (username, msg) => {
        this.chat.push({username: username, msg: msg});
    };

    this.start = (io) => {
        io.sockets.on('connection', socket => {
            socket.on('new connection', data => {
                this.connections[socket.id] = data.username;
                let msg = `${data.username} joined chat!`;
                this.saveMsg("", msg);
                socket.broadcast.emit('about connection', {msg: msg});
                socket.emit('chat history', {chat: this.chat});
            });

            socket.on('disconnect', data => {
                if (socket.id && this.connections[socket.id]) {
                    let msg = `${this.connections[socket.id]} left chat!`;
                    io.sockets.emit('about connection', {msg: msg});
                    this.saveMsg("", msg);
                    delete this.connections[socket.id];
                }
            });
        });
    }
}

module.exports.ConnectionNotifier = ConnectionNotifier;