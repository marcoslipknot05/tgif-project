import { houseData } from './house.mjs';

// Obtener los datos de cada partido
const getPartyData = (members) => {
  const partyData = members.reduce((acc, member) => {
    const { party, votes_with_party_pct } = member;
    const partyKey = party || 'I';
    const partyStats = acc[partyKey] || { count: 0, votesWithPartyPct: 0 };
    partyStats.count += 1;
    partyStats.votesWithPartyPct += votes_with_party_pct || 0;
    return { ...acc, [partyKey]: partyStats };
  }, {});
  
  return Object.entries(partyData).reduce((acc, [party, { count, votesWithPartyPct }]) => {
    const avgVotesWithParty = (votesWithPartyPct / count || 0).toFixed(2);
    return { ...acc, [party]: { count, votesWithPartyPct: avgVotesWithParty } };
  }, {});
};

/* Esta función, "getPartyData", calcula algunos datos sobre el porcentaje de votos de los miembros del congreso que coinciden con el partido de la membresía. Toma una matriz de objetos "members" como argumento. La primera línea crea un objeto vacío llamado "partyData".

El método "reduce" se utiliza para iterar sobre cada miembro de "members". En cada iteración, se extraen las propiedades "party" y "votes_with_party_pct" del objeto "member". Si el valor de "party" es "undefined", se establece en "I" (independiente). Se comprueba si existe un objeto "partyStats" para la clave "partyKey" (es decir, el partido del miembro). Si no existe, se crea un objeto "partyStats" con una propiedad "count" establecida en 0 y una propiedad "votesWithPartyPct" establecida en 0. En cualquier caso, se incrementa la propiedad "count" de "partyStats" y se agrega el valor de "votes_with_party_pct" a la propiedad "votesWithPartyPct".

Después de que el método "reduce" haya terminado, la función utiliza el método "Object.entries" para convertir el objeto "partyData" en una matriz de pares [clave, valor]. Luego, utiliza otro método "reduce" para iterar sobre esta matriz. En cada iteración, se calcula el porcentaje promedio de votos con el partido para ese partido y se agrega un objeto con tres propiedades (la "clave" del partido, el número de miembros que pertenecen a ese partido, y el porcentaje promedio de votos con el partido) al objeto "acc" (el objeto acumulativo). El objeto "acc" se inicializa como un objeto vacío. */

// Calcular los porcentajes de votos con el partido
const calculatePartyStats = (members) => { //Aquí se declara una función llamada calculatePartyStats que toma como argumento una matriz de miembros.
  const partyData = getPartyData(members); //Se llama a la función getPartyData pasando la matriz de miembros como argumento, y se almacena el objeto resultante en la constante partyData.

  const getMembersByParty = (party) => members.filter((member) => member.party === party); //Se define una función llamada getMembersByParty que toma un partido como argumento y devuelve una nueva matriz de miembros que pertenecen a ese partido.
  const getAvgVotesWithParty = (members) => (members.reduce((total, member) => total + member.total_votes, 0) / members.length).toFixed(2); //Se define una función llamada getAvgVotesWithParty que toma una matriz de miembros como argumento y devuelve el promedio de votos totales por miembro en esa matriz, redondeado a dos decimales.

  return Object.keys(partyData).reduce((acc, party) => { //Se llama al método reduce() en las claves del objeto partyData (que son los partidos), y se proporciona una función de devolución de llamada que toma dos argumentos: acc es el acumulador y party es la clave actual.
    const members = getMembersByParty(party); //Se llama a la función getMembersByParty pasando el partido actual como argumento, y se almacena la matriz resultante en la constante members.
    const avgVotesWithParty = getAvgVotesWithParty(members); //Se llama a la función getAvgVotesWithParty pasando la matriz de miembros actual como argumento, y se almacena el resultado en la constante avgVotesWithParty.
    const { count, votesWithPartyPct } = partyData[party]; //Se desestructura el objeto partyData en las propiedades count y votesWithPartyPct, que pertenecen al partido actual.
    return { ...acc, [party]: { count, votesWithPartyPct, avgVotesWithParty } }; //Se devuelve un nuevo objeto que contiene la clave actual ([party]) y un objeto con las propiedades count, votesWithPartyPct y avgVotesWithParty, que se obtienen de los cálculos anteriores.
  }, {});
};
/* la función calculatePartyStats utiliza la función getPartyData para obtener los datos de cada partido, y luego calcula el promedio de votos totales por miembro en cada partido, junto con otros datos relevantes. Luego devuelve un objeto que contiene estos datos para cada partido. */

// Mostrar los datos en una tabla HTML
function renderTable(data) {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = ''; //se obtiene la referencia al elemento tbody de la tabla en el HTML y se borra cualquier contenido anterior que pudiera tener.
  const parties = {
    R: 'Republican',
    D: 'Democrat',
    I: 'Independent'
  }; //Se define un objeto que relaciona las siglas de los partidos políticos con su nombre completo.
  const votesMissed = {
    R: {total: 0, count: 0},
    D: {total: 0, count: 0},
    I: {total: 0, count: 0},
  } //Se define un objeto que contendrá los votos perdidos (missed votes) de cada partido. La estructura del objeto es un objeto anidado, donde cada partido tiene un objeto con dos propiedades: total y count, que se utilizan para calcular el promedio de votos perdidos por cada miembro de ese partido.
  for (const member of data) {
    if (member.missed_votes_pct !== undefined) {
      votesMissed[member.party].total += member.missed_votes_pct;
      votesMissed[member.party].count++;
    }
  } //Este bucle for itera por cada objeto en el array data y actualiza los votos perdidos para cada partido en el objeto votesMissed. Solo se actualizan los partidos que tienen un valor válido de missed_votes_pct.
  for (const party in parties) {
    const members = data.filter(member => member.party === party);
    const row = document.createElement('tr');
    const partyCell = document.createElement('td');
    const numRepsCell = document.createElement('td');
    const pctMissedVotesCell = document.createElement('td');

    partyCell.textContent = parties[party];
    numRepsCell.textContent = members.length;
    const totalMissedVotes = votesMissed[party].total;
    const countMissedVotes = votesMissed[party].count;
    const avgMissedVotes = countMissedVotes > 0 ? (totalMissedVotes / countMissedVotes).toFixed(2) : '0.00';
    pctMissedVotesCell.textContent = `${avgMissedVotes}%`;

    row.appendChild(partyCell);
    row.appendChild(numRepsCell);
    row.appendChild(pctMissedVotesCell);

    tableBody.appendChild(row);
  }
}

/*Este segundo bucle for itera por cada partido en el objeto parties y crea una nueva fila en la tabla con los datos correspondientes. Para cada partido, se filtra el array data para obtener solo los miembros de ese partido, se calcula el promedio de votos perdidos y se crea una nueva fila en la tabla con las celdas correspondientes. Finalmente, se añade la nueva fila a la tabla.*/

// Agregar los datos a la tabla HTML
renderTable(houseData.results[0].members); //se llama a la función renderTable pasándole como parámetro el array de miembros del primer resultado en houseData.results. Esto actualiza la tabla con los datos del primer resultado.

function getEngagementData(members) {
  // Ordena los miembros por el porcentaje de votos perdidos
  const sortedMembers = members.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct);
  
  // Calcula el índice que representa el 10% de la longitud de la lista
  const tenPercentIndex = Math.ceil(sortedMembers.length * 0.1);
  
  // Obtiene los miembros menos comprometidos
  const leastEngaged = sortedMembers.slice(0, tenPercentIndex);
  
  // Obtiene los miembros más comprometidos
  const mostEngaged = sortedMembers.slice(-tenPercentIndex);
  
  // Devuelve los datos
  return {
    leastEngaged,
    mostEngaged
  };
}

function fillTables() {
  // Obtiene los datos de compromiso
  const engagementData = getEngagementData(houseData.results[0].members);
  
  // Obtiene las tablas en HTML
  const leastTable = document.getElementById('least');
  const mostTable = document.getElementById('most');
  
  // Llena la tabla de los miembros menos comprometidos
  engagementData.leastEngaged.forEach(member => {
    const row = leastTable.insertRow();
    row.insertCell().innerText = `${member.last_name}, ${member.first_name}`;
    row.insertCell().innerText = member.missed_votes;
    row.insertCell().innerText = `${member.missed_votes_pct.toFixed(2)}%`;
  });
  
  // Llena la tabla de los miembros más comprometidos
  engagementData.mostEngaged.forEach(member => {
    const row = mostTable.insertRow();
    row.insertCell().innerText = `${member.last_name}, ${member.first_name}`;
    row.insertCell().innerText = member.missed_votes;
    row.insertCell().innerText = `${member.missed_votes_pct.toFixed(2)}%`;
  });
}

fillTables();