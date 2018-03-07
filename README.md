# Formulario: Documentación


**Enlace a la portada del formulario**

https://rawgit.com/Bernat77/Formulario-Marcas/master/index.html


## Explicación

Esta aplicación es un formulario con capacidad de autoevaluacion, es capaz de leer un fichero XML, implementarlas todas y presentarlo de manera ordenada.
Muestra una nota en función de las respuestas corregidas y ofrece la posibilidad de volver a la portada, la cual contiene instrucciones y la opción de reintentar el examen.

## **Características**

La página principal (index.html) contiene instrucciones que varían en función de si el usuario se encuentra en un dispositivo remoto o en un PC, y por último un botón llamativo que nos dirige al examen.

La página del examen (formulario.html) consta de 10 preguntas, si una pregunta no es contestada, la aplicación lo detecta y avisa mediante un alert y redirige al usuario a dicha pregunta. La aplicación es adaptable a versiones móviles y todas sus funcionalidades son exactamente iguales a la versión de PC.

Una vez implementa todas las preguntas y respuestas del archivo Xml, el usuario contesta todas las preguntas y la aplicación las 
corregirá si se pulsa la opción correspondiente.
Cuando se lleva a cabo la correción, la página muestra directamente la nota y un registro de los fallos y aciertos.

Por último, el botón de "Reintentar", aparecerá una vez se lleve a cabo la correción, justo debajo de la nota. Si se le pulsa, 
pedirá una confirmación y en caso afirmativo, reseteará el examen y volverá arriba del todo de la página.

## **Observaciones**

* Se ha optado por usar ficheros xml con validación dtd.
* Se incluye rama "minify" con versión minificada del proyecto.
* La página formulario incluye metadatos preparados para compartir en redes sociales.
* Se han realizado las tareas de .xsd y .dtd

----
