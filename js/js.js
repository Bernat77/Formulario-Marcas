var xhttp = new XMLHttpRequest();
var formElement = null;
var respuestaText = [];
var respuestaSelect = [];
var respuestasMultiple = [];
var respuestasCheckbox = [];
var respuestasRadio = [];
var nota = 0; //nota de la prueba sobre 3 puntos (hay 3 preguntas)
var preguntaHTML;
var urlXML = "https://rawgit.com/Bernat77/Formulario-Marcas/master/xml/preguntas.xml";

//**************************************************************************************************** 
//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function () {

    preguntaHTML = document.getElementsByClassName("pregunta");
    formElement = document.getElementById('myform');
    formElement.onsubmit = function () {
        inicializar();
        if (comprobar()) {
            if (confirm("¿Quieres corregir el examen?")) {
                corregir();
                presentarNota();
            }
        }
        return false;
    }

    document.getElementById("rein").onclick = function () {
        if (confirm("¿Quieres reintentar el examen?")) {
            document.getElementById("myform").reset();
            scroll(0, 0);
            location.reload();
        }
    }

    //LEER XML de xml
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            gestionarXml(this);
        }
    };
    xhttp.open("GET", urlXML, true);
    xhttp.send();
}

//****************************************************************************************************
// Recuperamos los datos del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml) {
    var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc
    //
    //text 
    //Recuperamos el título y la respuesta correcta de Input, guardamos el número secreto
    var numpregunta = 0;
    for (; numpregunta < 2; numpregunta++) {
        var titulo = xmlDoc.getElementsByTagName("title")[numpregunta].innerHTML;
        ponerEnunciado(titulo, numpregunta);
        respuestaText[numpregunta] = xmlDoc.getElementsByTagName("answer")[numpregunta].innerHTML.toLowerCase();
    }

//SELECT
//Recuperamos el título y las opciones, guardamos la respuesta correcta

    for (var c = 0; numpregunta < 4; c++, numpregunta++) {
        var titulo = xmlDoc.getElementsByTagName("title")[numpregunta].innerHTML;
        var opcionesSelect = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName("option").length;
        for (i = 0; i < nopt; i++) {
            opcionesSelect[i] = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerEnunciado(titulo, numpregunta);
        ponerSelect(opcionesSelect, c);
        respuestaSelect[c] = parseInt(xmlDoc.getElementsByTagName("answer")[numpregunta].innerHTML);
    }

//SELECT Múltiple
//
//
    for (var c = 0; numpregunta < 6; c++, numpregunta++) {
        var titulo = xmlDoc.getElementsByTagName("title")[numpregunta].innerHTML;
        var opcionesMultiple = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName("option").length;
        for (i = 0; i < nopt; i++) {
            opcionesMultiple[i] = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerEnunciado(titulo, numpregunta);
        ponerSelect(opcionesMultiple, (c + 2));
        respuestasMultiple[c] = [];
        var tam = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName("answer").length;
        for (var j = 0; j < tam; j++) {
            respuestasMultiple[c][j] = parseInt(xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName("answer")[j].innerHTML);
        }
    }

//CHECKBOX
//Recuperamos el título y las opciones, guardamos las respuestas correctas

    for (var c = 0; numpregunta < 8; c++, numpregunta++) {
        var titulo = xmlDoc.getElementsByTagName("title")[numpregunta].innerHTML;
        var opcionesCheckbox = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName('option').length;
        for (i = 0; i < nopt; i++) {
            opcionesCheckbox[i] = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerEnunciado(titulo, numpregunta);
        ponerCheckbox(opcionesCheckbox, c, numpregunta);
        respuestasCheckbox[c] = [];
        var tam = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName('answer').length;
        for (i = 0; i < tam; i++) {
            respuestasCheckbox[c][i] = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName("answer")[i].innerHTML;
        }
    }

//RADIO

    for (var c = 0; numpregunta < 10; c++, numpregunta++) {
        var titulo = xmlDoc.getElementsByTagName("title")[numpregunta].innerHTML;
        var opcionesRadio = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName("option").length;
        for (i = 0; i < nopt; i++) {
            opcionesRadio[i] = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName("option")[i].innerHTML;
        }
        ponerRadio(titulo, opcionesRadio, c, numpregunta);
        respuestasRadio[c] = xmlDoc.getElementsByTagName("question")[numpregunta].getElementsByTagName("answer")[0].innerHTML;
    }

}

//****************************************************************************************************
//Corrección

function corregirText() {
    for (n = 0; n < 2; n++) {
        var texto = preguntaHTML[n].getElementsByTagName("input")[0].value;
        if (texto.toLowerCase() == respuestaText[n]) {
            darRespuestaHtml("Pregunta " + (n + 1) + ": Correcta");
            nota++;
        } else {
            darRespuestaHtml("Pregunta " + (n + 1) + ": Incorrecta");
        }

    }
}

function corregirSelect() {
//Compara el índice seleccionado con el valor del íncide que hay en el xml (<answer>2</answer>)
//para implementarlo con type radio, usar value para enumerar las opciones <input type='radio' value='1'>...
//luego comparar ese value con el value guardado en answer

    for (n = 2, z = 0; n < 4; n++, z++) {
        var sel = preguntaHTML[n].getElementsByTagName("select")[0];
        if (sel.selectedIndex - 1 == respuestaSelect[z]) { //-1 porque hemos puesto una opción por defecto en el select que ocupa la posición 0
            darRespuestaHtml("Pregunta " + (n + 1) + ": Correcta");
            nota++;
        } else {
            darRespuestaHtml("Pregunta " + (n + 1) + ": Incorrecta");
        }
    }
}

function corregirMultiple() {
    for (n = 4, c = 0; n < 6; n++, c++) {
        var puntuacion;
        var sel = preguntaHTML[n].getElementsByTagName('select')[0];
        var puntosBien = 1 / respuestasMultiple[c].length;
        var mal;
        puntuacion = 0;
        var i;
        var j;

        for (i = 0; i < sel.length; i++) {

            if (sel.options[i].selected) {
                mal = true;

                for (j = 0; j < respuestasMultiple[c].length; j++) {

                    if (i == respuestasMultiple[c][j]) {
                        mal = false;
                        puntuacion += puntosBien;
                        darRespuestaHtml("Pregunta " + (n + 1) + " Opción " + i + " Correcta");
                    }
                }
                if (mal) {
                    puntuacion = puntuacion - puntosBien;
                    darRespuestaHtml("Pregunta " + (n + 1) + " Opción " + i + " Incorrecta");

                }
            }
        }
        if (puntuacion < 0) {
            puntuacion = 0;
        }
        nota = nota + puntuacion;
    }
}

function corregirCheckbox() {
//Para cada opción mira si está checkeada, si está checkeada mira si es correcta y lo guarda en un array escorrecta[]
    for (n = 6, c = 0; n < 8; n++, c++) {
        var puntuacion = 0;
        var check = preguntaHTML[n].getElementsByTagName("input");
        var escorrecta = [];
        for (i = 0; i < check.length; i++) {
            if (check[i].checked) {
                escorrecta[i] = false;
                for (j = 0; j < respuestasCheckbox[c].length; j++) {
                    if (i == respuestasCheckbox[c][j])
                        escorrecta[i] = true;
                }
                if (escorrecta[i]) {
                    puntuacion += 1.0 / respuestasCheckbox[c].length; //dividido por el número de respuestas correctas   
                    darRespuestaHtml("Pregunta " + (n + 1) + ": Opción " + i + " correcta");
                } else {
                    puntuacion -= 1.0 / respuestasCheckbox[c].length; //dividido por el número de respuestas correctas            
                    darRespuestaHtml("Pregunta " + (n + 1) + ": Opción " + i + " incorrecta");
                }
            }
        }
        if (puntuacion < 0) {
            puntuacion = 0;
        }
        nota = nota + puntuacion;
    }
}

function corregirRadio() {
    for (n = 8, c = 0; n < 10; n++, c++) {
        var radio = preguntaHTML[n].getElementsByTagName("input");

        for (j = 0; j < radio.length; j++) {
            if (radio[j].checked) {
                if (j == respuestasRadio[c]) {
                    darRespuestaHtml("Pregunta " + (n + 1) + ": Correcta");
                    nota++;
                } else {
                    darRespuestaHtml("Pregunta " + (n + 1) + ": Incorrecta");
                }
            }
        }
    }
}

function corregir() {
    corregirText();
    corregirSelect();
    corregirMultiple();
    corregirCheckbox();
    corregirRadio();
}




//****************************************************************************************************
// poner los datos recibios en el HTML
function ponerEnunciado(t, n) {
    document.getElementsByTagName("h3")[n].innerHTML = t;
}

function ponerSelect(opt, n) {
    var select = document.getElementsByTagName("select")[n];
    for (i = 0; i < opt.length; i++) {
        var option = document.createElement("option");
        option.text = opt[i];
        option.value = i + 1;
        select.options.add(option);
    }
}

function ponerCheckbox(opt, n, numPregunta) {

    var nombreAsignado;
    if (numPregunta == 6) {
        nombreAsignado = "siete";
    } else {
        nombreAsignado = "ocho";
    }

    var checkboxContainer = document.getElementsByClassName("checkbox")[n];
    for (i = 0; i < opt.length; i++) {
        var input = document.createElement("input");
        var label = document.createElement("label");
        label.innerHTML = opt[i];
        label.setAttribute("for", "color_" + i);
        input.type = "checkbox";
        input.name = nombreAsignado;
        input.id = nombreAsignado + i;
        ;
        checkboxContainer.appendChild(input);
        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(document.createElement("br"));
    }
}

function ponerRadio(t, opt, n, j) {

    var nombre;
    if (j == 8) {
        nombre = "nueve";
    } else {
        nombre = "diez";
    }
    document.getElementsByTagName("h3")[j].innerHTML = t;
    var radioCont = document.getElementsByClassName("radio")[n];
    for (i = 0; i < opt.length; i++) {
        var input = document.createElement("input");
        var label = document.createElement("label");
        label.innerHTML = opt[i];
        input.type = "radio";
        input.name = nombre;
        input.value = i;
        radioCont.appendChild(input);
        radioCont.appendChild(label);
        radioCont.appendChild(document.createElement("br"));
    }
}
//****************************************************************************************************
//Gestionar la presentación de las respuestas
function darRespuestaHtml(r) {
    var p = document.createElement("p");
    var node = document.createTextNode(r);
    p.appendChild(node);
    document.getElementById('resultadosDiv').appendChild(p);
}

function presentarNota() {
    var r = parseInt(nota) + "/10";
    var p = document.createElement("p");
    var node = document.createTextNode(r);
    p.appendChild(node);
    document.getElementById("nota").appendChild(p);
    document.getElementById("nota").scrollIntoView();
    document.getElementById("reintentar").style.display = "block";
}

function inicializar() {
    document.getElementById('resultadosDiv').innerHTML = "";
    nota = 0;
}

//Comprobar que se han introducido datos en el formulario
function comprobar() {

    for (i = 0; i < 10; i++) {

        if (i == 0 || i == 1) {
            if (preguntaHTML[i].getElementsByTagName('input')[0].value == "") {
                alert("Por favor, contesta la pregunta " + (i + 1));
                preguntaHTML[i].getElementsByTagName('input')[0].focus();
                return false;
            }
        } else if (i == 2 || i == 3) {
            if (preguntaHTML[i].getElementsByTagName("select")[0].selectedIndex == 0) {
                alert("Por favor, selecciona una opción en la pregunta " + (i + 1));
                preguntaHTML[i].getElementsByTagName("select")[0].focus();
                return false;
            }
        } else if (i == 4 || i == 5) {
            contestado = false;
            var sel = preguntaHTML[i].getElementsByTagName("select")[0];
            for (j = 0; j < sel.length; j++) {
                if (sel.options[j].selected) {
                    contestado = true;
                }
            }
            if (!contestado) {
                alert("Por favor, selecciona al menos una opción en la pregunta " + (i + 1));
                sel.focus();

                return false;
            }
        } else if (i == 6 || i == 7) {
            contestado = false;

            var check = preguntaHTML[i].getElementsByTagName("input");
            for (j = 0; j < check.length; j++) {
                if (check[j].checked) {
                    contestado = true;
                }
            }

            if (!contestado) {
                alert("Por favor, marca al menos una opción en la pregunta " + (i + 1));
                check[0].focus();

                return false;
            }
        } else {

            contestado = false;

            var radio = preguntaHTML[i].getElementsByTagName("input");
            for (j = 0; j < radio.length; j++) {
                if (radio[j].checked) {
                    contestado = true;
                }
            }
            if (!contestado) {
                alert("Por favor, selecciona una opción en la pregunta " + (i + 1));
                radio[0].focus();
                return false;
            }
        }
    }
    return true;
}


