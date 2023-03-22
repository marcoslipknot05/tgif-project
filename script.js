import {senateData} from './senate.mjs'; //Se importan los datos de senado de mi archivo 'senate.mjs'

import {stateData} from './states.mjs';

const membersArr = senateData.results[0].members;

//Se guardan esos datos en mi variable 'membersArr'

function buildTable(membersArr) {
  document.getElementById("tbody").innerHTML = ""; //traemos el elemento con id tbody y dentro le añadimos un texto vacio
  for (var i = 0; i < membersArr.length; i++) { //para cada i menor que array.length
    var row = document.createElement("tr"); //let row crear un elemento tr
    row.setAttribute("id", "memberRow" + i); // Agrega un id único a cada fila
    var link = document.createElement("a"); //let link crear un elemento a normalmente es un hipervinculo o algo parecido
    link.textContent = membersArr[i].first_name + " " + (membersArr[i].middle_name || "") + " " + membersArr[i].last_name; //el contenido de text content es el first middle y last name en cada indice i del array
    link.setAttribute("href", membersArr[i].url) //link que es crear un elemento a tiene a su vez un setAttribute que le da un atributo id name role href etc al elemento
    row.insertCell().append(link); //a row que es crear un tr le aplicamos insertCell que crea una celda y con append añadimos link dentro de la celda
    row.insertCell().innerHTML = membersArr[i].party; //creamos la celda y le añadimos un texto al html que es el party en cada posicion de i
    row.insertCell().innerHTML = membersArr[i].state; //...el state..
    row.insertCell().innerHTML = membersArr[i].seniority;
    row.insertCell().innerHTML = membersArr[i].votes_with_party_pct;
    document.getElementById("tbody").append(row) //nos traemos tbody y le añadimos row
  }
}

buildTable(membersArr);

//'buildTable(membersArr)' es una función que toma los datos de miembros del senado y construye la tabla en HTML con la informacion de cada miemnbro
//Con 'document.getElementById("tbody").innerHTML = ""; se borra el contenido previo de la tabla
//Después creo una nueva fila ('<tr>'), un enlace con el nombre de cada miembro y su URL ('<a>') y agrego celdas para el partido, estado, antiguedad y porcentaje de votos ('<td>')
//Y al final la función inserta la tabla a mi HTML con 'document.getElementById("tbody").append(row)'
//Y llamo a la función 'buildTable(membersArr)' que contine los datos para que me aparezca la tabla.

const parties = { //Creo el objeto 'parties' que utiliza las siglas de los partidos para después usarlos en la función 'filterTable(parties), que filtra la tabla según el partido seleccionado.
  D: 'Democrat',
  R: 'Republican',
  ID: 'Independent'
}

function filterTable(parties) {
  
  var selectedParties = Array.from(document.querySelectorAll('input[name="party"]:checked')).map(checkbox => checkbox.value); // Obtenemos todas las opciones seleccionadas a través de los checkboxes de la página, y se guardan en la variable selectedParties
  for (var i = 0; i < membersArr.length; i++) { //se realiza un loop a través de todos los elementos de la lista membersArr, que es la que contiene información sobre los miembros.
    var row = document.getElementById("memberRow" + i); //Se obtiene la fila correspondiente para cada miembro en la tabla de la página, y se guarda en la variable row
    var party = membersArr[i].party; //Se obtiene también la afiliación partidaria del miembro y se guarda en la variable party

    if (selectedParties.length === 0 || selectedParties.includes("All") || selectedParties.includes(party)) { //Luego, se compara si la lista de partidos seleccionados está vacía o si incluye la opción "All" o la afiliación partidaria del miembro
      // Mostrar la fila correspondiente y reemplazar la sigla del partido con el nombre completo
      row.style.display = "";
      var partyCell = row.getElementsByTagName("td")[1];
      partyCell.innerHTML = parties[party];
    } else { //Si no se cumple ninguna de estas condiciones, se oculta la fila correspondiente en la tabla.
      row.style.display = "none";
    }
  }
}

filterTable(parties);

// Selecciona todos los checkboxes por nombre
const checkboxes = document.querySelectorAll('input[type="checkbox"][name="party"]');

// Agrega un event listener a cada checkbox
for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener('click', function() {
    filterTable(parties);
  });
}
  
//La funcion obtiene el valor del partido seleccionado usando `document.querySelector('input[name="party"]:checked
  
function makeStatesMenu() {
  const select = document.createElement("select");

  const defaultOption = document.createElement("option"); //Creo la variable defaultOptiom y la guardo en un elemento 'option' utilizando 'document.createElement("option").
  defaultOption.value = ""; //Guardo su valor en una cadena vacía (defaultOption.value = "") para que no tenga ningún valor seleccionado de forma predeterminada.
  defaultOption.textContent = "Select a state"; //Establezco su texto en "Select a state" (defaultOption.textContent = "Select a state") para que aparezca como el primer elemento de la lista desplegable.
  select.appendChild(defaultOption); //Finalmente agrego esta opción a la lista desplegable utilizando la función select.appendChild(defaultOption).

  for (const [abbr, name] of Object.entries(stateData)) { //Creo un bucle que recorre cada elemento en el objeto stateData. El Object.entries() devuelve el par de valores del objeto, que se recorre usando el bucle. El valor de cada elemento es una matriz con dos elementos: el valor de la clave abbr y el valor de la clave name.
    const option = document.createElement("option");
    option.value = abbr;
    option.textContent = name;
    select.appendChild(option);
  }

  return select.outerHTML;
}

const statesMenuContainer = document.getElementById("states-menu-container");
statesMenuContainer.innerHTML = makeStatesMenu();

