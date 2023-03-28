import {houseData} from './house.mjs';

const membersPart = houseData.results[0].members.party;

// Obtener los datos de cada partido
const partyData = {};
houseData.results[0].members.forEach(member => {
  if (member.party in partyData) {
    partyData[member.party].count++;
    partyData[member.party].votesWithPartyPct += member.votes_with_party_pct;
  } else {
    partyData[member.party] = {
      count: 1,
      votesWithPartyPct: member.votes_with_party_pct
    };
  }
});

// Calcular los porcentajes de votos con el partido
Object.keys(partyData).forEach(party => {
  partyData[party].votesWithPartyPct /= partyData[party].count;
  partyData[party].votesWithPartyPct = partyData[party].votesWithPartyPct.toFixed(2);
  const members = houseData.results[0].members.filter(member => member.party === party);
  const totalVotesWithParty = members.reduce((total, member) => total + member.total_votes, 0);
  const avgVotesWithParty = (totalVotesWithParty / members.length).toFixed(2);
});

  function renderTable(data) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    const parties = {
      R: 'Republican',
      D: 'Democrat',
      I: 'Independent'
    };
    const votesWithParty = {
      R: {total: 0, count: 0},
      D: {total: 0, count: 0},
      I: {total: 0, count: 0},
    }
    for (const member of data) {
      if (member.votes_with_party_pct !== undefined) {
        votesWithParty[member.party].total += member.votes_with_party_pct;
        votesWithParty[member.party].count++;
      }
    }
    for (const party in parties) {
      const members = data.filter(member => member.party === party);
      const row = document.createElement('tr');
      const partyCell = document.createElement('td');
      const numRepsCell = document.createElement('td');
      const pctVotedPartyCell = document.createElement('td');
  
      partyCell.textContent = parties[party];
      numRepsCell.textContent = members.length;
      const totalVotesWithParty = votesWithParty[party].total;
      const countVotesWithParty = votesWithParty[party].count;
      const avgVotesWithParty = countVotesWithParty > 0 ? (totalVotesWithParty / countVotesWithParty).toFixed(2) : '0.00';
      pctVotedPartyCell.textContent = `${avgVotesWithParty}%`;
  
      row.appendChild(partyCell);
      row.appendChild(numRepsCell);
      row.appendChild(pctVotedPartyCell);
  
      tableBody.appendChild(row);
    }
  }

// Agregar los datos a la tabla HTML
renderTable(houseData.results[0].members);