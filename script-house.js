import {houseData} from './house.mjs';

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