## Autenticación y Funciones Firebase

Este archivo describe cómo usar las funciones y configuraciones del directorio `auth/` para facilitar las tareas de backend y permitir que el equipo de frontend consuma APIs preconfiguradas.

---

## Índice

1. [subirImagenALaNube](#1-subirimagenalanube)
2. [getID](#2-getid)
3. [obtenerAmbientesDeUsuario](#3-obtenerambientesdeusuario)
4. [obtenerDatosDeUsuario](#4-obtenerdatosdeusuario)
5. [obtenerPlantasDeAmbiente](#5-obtenerplantasdeambiente)
6. [obtenerRiegosDePlanta](#6-obtenerriegosdeplanta)

---

## 1. subirImagenALaNube

**Importación:**

```js
import { subirImagenALaNube } from './auth/cloud/subirImagenALaNube';
```

**Uso:**

```js
const url = await subirImagenALaNube('ruta/a/imagen.jpg');
```

**Retorna:** Un String

```js
"https://res.cloudinary.com/.../imagen-subida.jpg"
```

---

## 2. getID

**Importación:**

```js
import { getID } from './auth/getIDauth';
```

**Uso:**

```js
const token = await getID();
```

**Retorna:** ID del usuario logueado

```js
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 3. obtenerAmbientesDeUsuario

**Importación:**

```js
import { obtenerAmbientesDeUsuario } from './auth/getAmbientes';
```

**Uso:**

```js
const ambientes = await obtenerAmbientesDeUsuario();
```

**Retorna:** Array de objetos de Ambientes

```js
[
  { id: 'Jardin', nombre: 'Jardín' },
  { id: 'Cocina', nombre: 'Cocina' }
]
```

---

## 4. obtenerDatosDeUsuario

**Importación:**

```js
import { obtenerDatosDeUsuario } from './auth/getDataByID';
```

**Uso:**

```js
const datos = await obtenerDatosDeUsuario('usuario123');
```

**Retorna:** UN Array de objetos de todo lo que tiene el Usuario

```js
[
  {
    id: 'ambiente1',
    nombre: 'Jardín',
    plantas: [
      { id: 'planta1', nombre: 'Rosa' },
      { id: 'planta2', nombre: 'Lirio' }
    ]
  }
]
```

---

## 5. obtenerPlantasDeAmbiente

**Importación:**

```js
import { obtenerPlantasDeAmbiente } from './auth/getPlantas';
```

**Uso:**

```js
const plantas = await obtenerPlantasDeAmbiente('ambiente1');
```

**Retorna:** un array de objetos plantas

```js
[
  { id: 'planta1', nombre: 'Rosa' },
  { id: 'planta2', nombre: 'Lirio' }
]
```

---

## 6. obtenerRiegosDePlanta

**Importación:**

```js
import { obtenerRiegosDePlanta } from './auth/getRiegos';
```

**Uso:**

```js
const riegos = await obtenerRiegosDePlanta('ambiente1', 'planta1');
```

**Retorna:** un array de objetos de riegos

```js
[
  { fecha: '2024-06-18', cantidad: '500ml' },
  { fecha: '2024-06-19', cantidad: '600ml' }
]
```

---

> **Nota:** Todas las funciones devuelven `Promise`, por lo que deben usarse con `await` o `.then()`.

---
