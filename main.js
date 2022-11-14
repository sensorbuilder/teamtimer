//variables

const txtTimer = document.querySelector('.timetrialer .timer');
const btnStartNext = $('#btnStartNext');
const btnReset = $('#btnReset');
const bntResetLocalStorage = $('#btnResetLocalStorage');
const btnPause = document.getElementById('btnPause');
const txtNext = document.querySelector('.next');
const ridersList = document.getElementById('ridersList');
const webStoreURL = 'http://192.168.2.81:5000';

let rider = 0 //starting position
let numOfRiders = 8;
var riders = {};
let myIntervalTimer = 0; //in seconds
var myInterval = null; //variable for setinterval object

function createRiderList () {
    var rdrs = [...Array(numOfRiders).keys()].map(function(item) {
        return { RiderId : item, RiderName: `Rider${item+1}`, Interval : 60, Active: 'Yes' };
    });
   return rdrs;
    
}

//store rider object To LocalStorage
function pushRidersTLS(r) {
    localStorage.setItem("data" , JSON.stringify(r));
}

//get riders from webstore
//function getRidersFWB () {
//    axios.get('http://192.168.2.81:5000/team/1')
//    .then(function(response) {
//        riders = response.data.riderList;
//    });
//}

//get rider object From LocalStorage
function getRidersFLS() {
    var obj = {};
    obj = JSON.parse(localStorage.getItem('data'));
    return obj;
}

bntResetLocalStorage.click(function() {
    localStorage.clear();
    startOnload();
});

btnStartNext.click(function() {
    start();
});

btnReset.click(function() {
    reset();
});

$(document).on('click', '.row_data', function(event) {
    event.preventDefault();
    if($(this).attr('edit_type') == 'button') {
        return false;
    }
    if($(this).attr('col_name') == 'Pull') {
        var rowId = $(this).closest('tr').attr('rowId'); //reads value of attribute rowId;
        var rowDiv = $(this);
        if (rowDiv.html() == 'Yes') {
            riders[riders.findIndex( (rdr) => rdr.RiderId == rowId)].Active = 'No';
            rowDiv.html('No');
        } else { 
            riders[riders.findIndex( (rdr) => rdr.RiderId == rowId)].Active = 'Yes';
            rowDiv.html('Yes');
        };
        pushRidersTLS(riders); //store update locally
        createTableofRiders(); //update table on screen
        return;
    }

    $(this).closest('div').attr('contenteditable','true');
    $(this).addClass('bg-secondary').css('padding', '4px');
    $(this).focus();
    $(this).keypress( function(e) {
        
        if($(this).attr('col_name') == 'Interval') {
            console.log($(this).attr('col_name'));
            if(isNaN(String.fromCharCode(e.which))) e.preventDefault();
        };
    });
    $(this)
});

$(document).on('focusout', '.row_data', function(event) {
    event.preventDefault();
    if($(this).attr('edit_type') == 'button') {
        return false;
    }

    var rowId = $(this).closest('tr').attr('rowId');
    var row_div = $(this).removeClass('bg-secondary').css('padding','');
    var col_name = row_div.attr('col_name');
    var col_val = row_div.text();
    //riders[rowId][col_name] = col_val;
    if (col_name == 'Interval') {
        //check input interval must be integer and larger then 10 other reset to old setting
        if(isNumber(col_val)) {
            if ( col_val > 10) {
                //interval value in riders object
                riders[riders.findIndex( (rdr) => rdr.RiderId == rowId)][col_name] = parseInt(col_val);
            }
        }
        //reset screen value to existing setting           
        row_div.html(riders[riders.findIndex( (rdr) => rdr.RiderId == rowId)][col_name]);
    } else {
        //update for other columns then Interval - strings are allowed.
        riders[riders.findIndex( (rdr) => rdr.RiderId == rowId)][col_name] = col_val; 
    } 

    
    pushRidersTLS(riders);
});

function isNumber(s)
    {
        for (let i = 0; i < s.length; i++)
            if (s[i] < '0' || s[i] > '9')
                return false;
  
        return true;
    }

function timer() {
    myIntervalTimer--;
    if (myIntervalTimer == 0 ) { next();}
    txtTimer.innerText = `${myIntervalTimer}`;
}

function reset() {
    clearInterval(myInterval);
    myInterval = null;
    riders.sort((a,b)=> {
        return a.RiderId - b.RiderId;
    });
    btnStartNext.html('Start');
    txtNext.innerHTML = riders[0].RiderName;
    txtTimer.innerText = riders[0].Interval;
    createTableofRiders();
    console.log('from reset function :',riders)
}

function start() {
    if(myInterval) {
    } else
    myInterval = setInterval(timer, 1000);
    btnStartNext.html('Next');
    next();
}

function next() {
    if (riders[0].Active == 'Yes') {
        myIntervalTimer = riders[0].Interval;
        txtNext.innerHTML = riders[0].RiderName;
        riders.push((riders.splice(0,1)[0]));
        createTableofRiders();
    } else { 
        riders.push((riders.splice(0,1)[0]));
        next(); //potential looping error!!!
    }
}

function riderTableHeader () {
    var tableStr ='<table class="table table-hover table-borderless">';
    tableStr +='<thead><tr><th>Name</th><th>Interval</th><th>Pull</th></tr></thead>';
    return tableStr;
}

function createTableofRiders(){
    console.log('creattable of riders');
    var rdrTblAct = riderTableHeader();
    var rdrTblNotAct = '<tr><td><div><hr></div></td><td><div><hr></div></td><td><div><hr></div></td><tr>' /*empty data row*/;
    rdrTblAct +='<tbody>';
   // numOfRiders = riders.filter(rider => rider.Active == 'Yes').length;
    riders.forEach(rdr => {
        if ( rdr.Active == 'Yes') {
            rdrTblAct +=`<tr rowId="${rdr.RiderId}">`
                rdrTblAct +=`<td><div class="row_data" edit_type="click" col_name="RiderName">${rdr.RiderName}</div></td>`;
                rdrTblAct +=`<td><div class="row_data" edit_type="click" col_name="Interval">${rdr.Interval}</div></td>`;
                rdrTblAct +=`<td><div class="row_data" edit_type="click" col_name="Pull">${rdr.Active}</div></td>`;
            } else {
            rdrTblNotAct +=`<tr rowId="${rdr.RiderId}">`
                rdrTblNotAct +=`<td><div class="row_data bg-secondary" edit_type="click" col_name="RiderName">${rdr.RiderName}</div></td>`;
                rdrTblNotAct +=`<td><div class="row_data bg-secondary" edit_type="click" col_name="Interval">${rdr.Interval}</div></td>`;
                rdrTblNotAct +=`<td><div class="row_data bg-secondary" edit_type="click" col_name="Pull">${rdr.Active}</div></td>`;
            }});
        rdrTblAct += rdrTblNotAct;       
        rdrTblAct +='</tr>';
    rdrTblAct +='</tbody>';
rdrTblAct +='</table>';
$(document).find('.ridersTable').html(rdrTblAct);
}

function startOnload(){
    //Initialize RiderList
    if (!localStorage.getItem('data')) {
        riders = createRiderList(); //initial rider setup
        pushRidersTLS(riders);
    
    } else {
        riders = getRidersFLS();
        //console.log(riders);
    }
    $.when( $.ready ).then(function () {
        txtNext.innerText = riders[0].RiderName;
        txtTimer.innerText = riders[0].Interval;
        createTableofRiders();
    });   
}

async function startOnWebload () {
    await axios.get('http://192.168.2.81:5000/team/1')
    .then(function(response) {
        riders = response.data.riderList;
    });
    console.log('riders :', riders);

    $.when( $.ready ).then(function () {
        txtNext.innerText = riders[0].RiderName;
        txtTimer.innerText = riders[0].Interval;
        createTableofRiders();
    });   
}

startOnWebload();