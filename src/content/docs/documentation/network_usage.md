---
title: How to use our network
description: Discover how the client communicate with the server 
---

# R-Type Network Documentation

Here is the documentation for the network communication between the client and server in the R-Type game.

## Protocol

### Client to Server

| Command ID | Arguments      | Function/Struct | Description                              |
|------------|----------------|-----------------|------------------------------------------|
| 1          |                | `login()`       | Request for client to connect to server |
| 2          |                | `disconnect()`  | Request for client to disconnect         |
| 3          | x, y           | `move()`        | Move the player on the scene            |
| 4          | id             | `startGame()`   | Request to start the game               |

### Server to Client

| Command ID | Arguments      | Function/Struct        | Description                               |
|------------|----------------|------------------------|-------------------------------------------|
| 1          | id, x, y       | `NewConnection()`      | Response to client connection request    |
| 2          | id, x, y       | `OtherPlayerConnection()` | Notify another player joined the scene |
| 3          | id             | `OtherPlayerDisconnection()` | Notify another player left the scene |
| 4          | id, x, y       | `OtherPlayerMove()`    | Notify another player's movement         |
| 5          | id             | `Forbidden()`          | Connection issue                         |
| 6          | id             | `GameStarted()`        | Notify the game has started              |

Command ID are integers that represent the type of command being sent. The arguments are the data that is sent along with the command.
Binary lenght : 

- Command ID :       `4 bytes integer`
- Arguments id :     `4 bytes integer`
- Arguments x :      `4 bytes float`
- Arguments y :      `4 bytes float`

## Implementation Details

### Client/Server Initialization

The client/server has a dedicated thread for network communication.

-> `./src/client-server.cpp`

```cpp
Client::Client(std::shared_ptr<C_Asio> asio, std::shared_ptr<Registry> registry)
    : asio(asio), registry(registry), command(asio, registry)
{
    std::thread loop_thread(&Client::loop, this);
    loop_thread.detach();
}

void Client::loop()
{
    while (true) {
        asio->receive_packet();

        // Call all the functions
        this->command.callCommand();
    }
}
```

### Command Handling

The `Command` class maps command IDs to specific functions using `std::bind`.

-> `./src/server-client/command/command.cpp`

```cpp
Command::Command(std::shared_ptr<C_Asio> asio, std::shared_ptr<Registry> registry)
{
    this->asio = asio;
    this->registry = registry;
    _cmdMap.emplace(1, std::bind(&Command::NewConnection, this));
    _cmdMap.emplace(2, std::bind(&Command::OtherPlayerConnection, this));
    _cmdMap.emplace(3, std::bind(&Command::OtherPlayerDisconnection, this));
    _cmdMap.emplace(4, std::bind(&Command::OtherPlayerMove, this));
    _cmdMap.emplace(5, std::bind(&Command::Forbidden, this));
    _cmdMap.emplace(6, std::bind(&Command::GameStarted, this));
}

void Command::callCommand()
{
    int id;

    std::memcpy(&id, asio->answer, sizeof(int));

    _cmdMap[id]();
}
```

### Example: `NewConnection`

Here is an example implementation for handling a new connection:

-> `./src/server-client/command/NewConnection.cpp`

```cpp
void Command::NewConnection()
{
    NewConnection_t newConnection;

    memcpy(&newConnection, asio->answer + sizeof(int), sizeof(NewConnection_t));
    // Process the new connection data
}
```

## Adding a New Command

1. **Define the Command**: Add the new command in the protocol table with a unique Command ID and specify the arguments and function name.

   For example:

   | Command ID | Arguments | Function/Struct   | Description                       |
   |------------|-----------|-------------------|-----------------------------------|
   | 7          | id, hp    | `OtherPlayerHp()` | Notify other player's health change |

2. **Update Command Map**: Register the new command in the `Command` constructor.

-> `./src/server-client/command/command.cpp`

   ```cpp
   _cmdMap.emplace(7, std::bind(&Command::OtherPlayerHp, this));
   ```

3. **Implement the Function**: Create the function that processes the new command in the `Command` class.

-> `./src/server-client/command/OtherPlayerHp.cpp`

   ```cpp
   void Command::OtherPlayerHp()
   {
       OtherPlayerHp_t hpData;

       memcpy(&hpData, asio->answer + sizeof(int), sizeof(OtherPlayerHp_t));
       // Process the health change data
   }
   ```

4. **Send command**: Send the new command from the server to the client.

-> `./src/server/<wherever_you_want_to_send_the_command.cpp>`

   ```cpp
   void Server::sendOtherPlayerHp(int id, int hp)
   {
       OtherPlayerHp_t hpData = {id, hp};

       asio->send_packet(7, OtherPlayerHp_t(100), asio->client_socket);
   }
   ```

You have to add the new command to both the client and server side. The client will receive the command and call the appropriate function to process the data. You have to add the function and the structure in the `Packet.hpp` file.

-> `./include/server-client/Packet.hpp`

```cpp
struct OtherPlayerHp_t {
    int id;
    int hp;
};
```

5. **Test the Command**: Verify the functionality by simulating server-client communication for the new command.

