---
title: Create a new client
description: Discover how to create a new client 
---

## Implémenter un Nouveau Client

### Prérequis

1. **Cloner le projet** :
   ```
   git clone git@github.com:EpitechPromo2027/B-CPP-500-PAR-5-2-rtype-ulysse.rousselet.git
   ```

2. **Configurer le projet** :
   ```
   cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug && cmake --build build --parallel
   ```

### Étape 1 : Comprendre le Protocole de Communication

Le protocole de communication entre le client et le serveur est défini dans 

network_doc.md

. Voici un extrait des commandes utilisées :

#### Client vers Serveur
| Command ID | Arguments | Function/Struct | Description                              |
|------------|-----------|-----------------|------------------------------------------|
| 1          |           | `login()`       | Request for client to connect to server |
| 2          |           | `disconnect()`  | Request for client to disconnect         |
| 3          | x, y      | `move()`        | Move the player on the scene            |
| 4          | id        | `startGame()`   | Request to start the game               |

#### Serveur vers Client
| Command ID | Arguments      | Function/Struct        | Description                               |
|------------|----------------|------------------------|-------------------------------------------|
| 1          | id, x, y       | 

NewConnection()

      | Response to client connection request    |
| 2          | id, x, y       | `OtherPlayerConnection()` | Notify another player joined the scene |
| 3          | id             | `OtherPlayerDisconnection()` | Notify another player left the scene |
| 4          | id, x, y       | `OtherPlayerMove()`    | Notify another player's movement         |
| 5          | id             | `Forbidden()`          | Connection issue                         |
| 6          | id             | `GameStarted()`        | Notify the game has started              |

### Étape 2 : Créer le Client dans un Nouveau Langage

#### Exemple en Python

1. **Installer les dépendances** :
   ```
   pip install asyncio websockets
   ```

2. **Implémenter le client** :

   ```python
   import asyncio
   import websockets
   import struct

   async def login(websocket):
       await websocket.send(struct.pack('i', 1))

   async def move(websocket, x, y):
       await websocket.send(struct.pack('i', 3) + struct.pack('f', x) + struct.pack('f', y))

   async def start_game(websocket):
       await websocket.send(struct.pack('i', 4))

   async def client(uri):
       async with websockets.connect(uri) as websocket:
           await login(websocket)
           await move(websocket, 100.0, 200.0)
           await start_game(websocket)

           while True:
               response = await websocket.recv()
               command_id = struct.unpack('i', response[:4])[0]
               if command_id == 1:
                   id, x, y = struct.unpack('i f f', response[4:])
                   print(f"New connection: id={id}, x={x}, y={y}")
               elif command_id == 4:
                   id, x, y = struct.unpack('i f f', response[4:])
                   print(f"Other player moved: id={id}, x={x}, y={y}")

   asyncio.get_event_loop().run_until_complete(client('ws://localhost:8080'))
   ```

### Étape 3 : Tester le Client

1. **Lancer le serveur** :
   ```
   ./r-type_server <address> <port>
   ```

2. **Lancer le client** :
   ```
   python client.py
   ```

### Conclusion

Vous avez maintenant un client fonctionnel dans un nouveau langage. Vous pouvez étendre ce client pour gérer plus de commandes et ajouter des fonctionnalités supplémentaires selon vos besoins. Pour plus de détails sur les commandes et la structure du projet, consultez les fichiers de documentation dans le répertoire
