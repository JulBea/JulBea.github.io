---
title: How to use the ECS
description: Discover how to use our ecs 
---

# R-Type ECS Documentation

Here is the documentation for the usage of the ECS in the R-Type game.

## What is an ECS?

ECS stands for Entity-Component-System. It is a design pattern used to manage the state of entities in a game. The ECS pattern separates data from logic, improving performance and scalability.

## Components

Navigate to `./include/ECS/Component/` and create a new `.cpp` file. For example, create a `TransformComponent` to store an entity's position and rotation.

```hpp
struct TransformComponent {
    float x, y;
    float rotation;
};
```

### Register the Component

Update the registry class in `./scene/Scene.cpp`:

```cpp
#include "C_Game.hpp"

void SceneManager::loadAllComponents() {
    registry->register_component<TransformComponent>();
    // Register other components
}
```

## Creating a System Function

Go to `./src/systems/` and create a new `.cpp` file, e.g., `TransformSystem.cpp`:

```cpp
#include "TransformSystem.hpp"

void transform_system(Registry &registry, Sparse_array<TransformComponent> &transform) {
    Zipper zipper(transform);

    for (auto it = zipper.begin(); it != zipper.end(); ++it) {
        TransformComponent &transform = std::get<0>(*it);

        // Example: Update the entity's position
        transform.x += 1;
        transform.y += 1;
    }
}
```

### Register the System Function

Update the registry class in `./scene/Scene.cpp`:

```cpp
#include "C_Game.hpp"

void SceneManager::loadAllSystems() {
    registry->add_system<TransformComponent>(transform_system);
}
```

## Creating an Entity and Adding a Component

Edit `./src/scene/Scene.cpp`:

```cpp
#include "C_Game.hpp"

void SceneManager::createPlayer() {
    Entity entityIndex = registry->spawn_entity();

    registry->add_component<TransformComponent>(registry->entity_from_index(entityIndex), TransformComponent{100, 150, 90});
}
```

After these steps, the system will automatically update the entity's position each frame.

## ECS Components List

| Component Name | Description |
|----------------|-------------|
| Controllable   | Indicates if the entity can be controlled by the player |
| Drawable       | Determines if the entity should be drawn on the screen |
| Images         | Stores the path to the entity's image |
| MapSelected    | Stores the ID of the selected map |
| Player         | Stores the ID of the player |
| PlayerName     | Stores the name of the player |
| Position       | Stores the position of the entity |
| Settings       | Stores various settings for the entity |
| UIButton       | Stores the ID of the UI button |
| UIRect         | Stores the dimensions of the UI rectangle |
| UIText         | Stores the text for the UI element |
| Velocity       | Stores the velocity of the entity |
| Window         | Stores the ID of the window |

## Doxygen Documentation

To generate the Doxygen documentation, run the following command:

```bash
doxygen Doxyfile
cd html
python3 -m http.server 8080
```