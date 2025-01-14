---
title: Implement a new graphic lib
description: Discover how to implement a new graphic lib 
---

## Implémenter une Nouvelle Bibliothèque graphique.
### Exemple avec SDL2

### Prérequis

1. **Cloner le projet** :
   ```
   git clone git@github.com:EpitechPromo2027/B-CPP-500-PAR-5-2-rtype-ulysse.rousselet.git
   ```

2. **Configurer le projet** :
   ```
   cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug && cmake --build build --parallel
   ```

### Étape 1 : Installer SDL2

#### Sous Linux
```
sudo apt-get install libsdl2-dev
```

#### Sous Windows
Téléchargez SDL2 depuis [libsdl.org](https://libsdl.org/download-2.0.php) et suivez les instructions d'installation.

### Étape 2 : Modifier le 

CMakeLists.txt



Modifiez le fichier 

CMakeLists.txt

 pour inclure SDL2 :

```txt
cmake_minimum_required(VERSION 3.25.1)
project(r-type_client VERSION 0.1.0 LANGUAGES C CXX)

include(FetchContent)

if (WIN32)
    add_definitions(-D_WIN32_WINNT=0x0A00)
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(
    ${PROJECT_SOURCE_DIR}/include/ECS/Components
    ${PROJECT_SOURCE_DIR}/include/ECS/Systems
    ${PROJECT_SOURCE_DIR}/include/ECS/Registry
    ${PROJECT_SOURCE_DIR}/include/ECS
    ${PROJECT_SOURCE_DIR}/include/Client
    ${PROJECT_SOURCE_DIR}/include
    ${SDL2_INCLUDE_DIRS}
)

file(GLOB SOURCES "src/*.cpp" "src/game/*.cpp" "src/game/scene/*.cpp" "src/client/*.cpp" "src/systems/*.cpp"
"src/client/command/*.cpp" "src/asio/*.cpp")

add_executable(r-type_client ${SOURCES} ${HEADERS})

find_package(SDL2 REQUIRED)
target_link_libraries(r-type_client ${SDL2_LIBRARIES})

file(COPY  ${PROJECT_SOURCE_DIR}/assets DESTINATION ${CMAKE_BINARY_DIR}/bin)
```

### Étape 3 : Adapter le Code pour Utiliser SDL2

#### Exemple de Modification

Modifiez les fichiers pour remplacer les appels à SFML par des appels à SDL2. Voici un exemple pour le fichier 

UIscene.cpp

 :

```cpp
#include "C_Game.hpp"
#include <SDL2/SDL.h>
#include <SDL2/SDL_ttf.h>

void SceneManager::loadClientMenu()
{
    Entity uiRectIndex = registry->spawn_entity();

    SDL_Rect rect = {0, 0, 960, 540};
    SDL_Color color = {30, 30, 30, 150};

    TTF_Font *font = TTF_OpenFont("bin/assets/rtype_font.ttf", 24);
    if (!font) {
        throw std::runtime_error("Failed to load font.");
    }

    SDL_Surface *textSurface = TTF_RenderText_Solid(font, "You will connect to ...", color);
    if (!textSurface) {
        throw std::runtime_error("Failed to create text surface.");
    }

    SDL_Texture *textTexture = SDL_CreateTextureFromSurface(renderer, textSurface);
    SDL_FreeSurface(textSurface);

    registry->add_component<UIRect>(registry->entity_from_index(uiRectIndex), UIRect{rect, {480, 270}, {960, 540}});
}
```

### Étape 4 : Tester le Client

1. **Lancer le serveur** :
   ```sh
   ./r-type_server <address> <port>
   ```

2. **Lancer le client** :
   ```sh
   ./r-type_client <address> <port>
   ```

### Conclusion

Vous avez maintenant un client fonctionnel utilisant SDL2. Vous pouvez étendre ce client pour gérer plus de commandes et ajouter des fonctionnalités supplémentaires selon vos besoins. Pour plus de détails sur les commandes et la structure du projet, consultez les fichiers de documentation dans le répertoire 
