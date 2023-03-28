import {houseData} from './house.mjs';

import {stateData} from './states.mjs';

let membersHouseArr = houseData.results[0].members;

function buildTable(membersHouseArr) {
  
    document.getElementById("tbody").innerHTML = "";
    for (var i = 0; i < membersHouseArr.length; i++) { 
      var row = document.createElement("tr"); 
      row.setAttribute("id", "memberRow" + i); 
      var link = document.createElement("a");
      link.textContent = membersHouseArr[i].first_name + " " + (membersHouseArr[i].middle_name || "") + " " + membersHouseArr[i].last_name;
      link.setAttribute("href", membersHouseArr[i].url)
      row.insertCell().append(link);
      row.insertCell().innerHTML = membersHouseArr[i].party;
      row.insertCell().innerHTML = membersHouseArr[i].state;
      row.insertCell().innerHTML = membersHouseArr[i].seniority;
      row.insertCell().innerHTML = membersHouseArr[i].votes_with_party_pct;
      document.getElementById("tbody").append(row)
    }
  }
  buildTable(membersHouseArr);

  const parties = {
    D: 'Democrat',
    R: 'Republican',
    ID: 'Independent'
  }
  
  function filterTable(parties) {
    
    var selectedParties = Array.from(document.querySelectorAll('input[name="party"]:checked')).map(checkbox => checkbox.value);
    for (var i = 0; i < membersHouseArr.length; i++) { 
      var row = document.getElementById("memberRow" + i);
      var party = membersHouseArr[i].party;
  
      if (selectedParties.length === 0 || selectedParties.includes("All") || selectedParties.includes(party)) {
        row.style.display = "";
        var partyCell = row.getElementsByTagName("td")[1];
        partyCell.innerHTML = parties[party];
      } else {
        row.style.display = "none";
      }
    }
  }
  
  filterTable(parties);

const checkboxes = document.querySelectorAll('input[type="checkbox"][name="party"]');

for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener('click', function() {
    filterTable(parties);
  });
}
  
function makeStatesMenu() {
  const select = document.createElement("select");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a state";
  select.appendChild(defaultOption);

  for (const [abbr, name] of Object.entries(stateData)) {
    const option = document.createElement("option");
    option.value = abbr;
    option.textContent = name;
    select.appendChild(option);
  }

  return select.outerHTML;
}

const statesMenuContainer = document.getElementById("states-menu-container");
statesMenuContainer.innerHTML = makeStatesMenu();

const selectElement = document.querySelector("#states-menu-container select");
selectElement.addEventListener("change", () => {
  const selectedState = selectElement.value;
  const filteredMembers = membersHouseArr.filter(member => member.state === selectedState || selectedState === "");
  buildTable(filteredMembers);
});