import {senateData} from './senate.mjs';

const members = senateData.results[0].members;
function crearTabla() {
    let body = document.body;
    let tbl  = document.createElement('table');
    tbl.style.width  = '200px';
    tbl.style.border = '1px solid black';

    for(let i = 0; i < row; i++){
        let tr = tbl.insertRow();
        for(let j = 0; j < col; j++){
                let td = tr.insertCell();
                td.appendChild(document.createTextNode(`${i},${j}` ));
                td.style.border = '1px solid black';
            }     
    }
    body.appendChild(tbl);
}  

crearTabla();
