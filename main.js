//variables

const txtTimer = document.querySelector('.timetrialer .timer');
const btnStartNext = document.getElementById('btnStartNext');
const btnReset = document.getElementById('btnReset');
const btnPause = document.getElementById('btnPause');
const txtNext = document.querySelector('.next');
const ridersList = document.getElementById('ridersList');
var riders = 
[
    {"RiderID": 0, "Name": "Rider1", "Interval": 20, "Active": true},
    {"RiderID": 1, "Name": "Rider2", "Interval": 20, "Active": true},
    {"RiderID": 2, "Name": "Rider3", "Interval": 20, "Active": true},
    {"RiderID": 3, "Name": "Rider4", "Interval": 20, "Active": true},
    {"RiderID": 4, "Name": "Rider5", "Interval": 20, "Active": true},
    {"RiderID": 5, "Name": "Rider6", "Interval": 20, "Active": true},
    {"RiderID": 6, "Name": "Rider7", "Interval": 20, "Active": false},
    {"RiderID": 7, "Name": "Rider8", "Interval": 20, "Active": false}
];


let rider = 0 //starting position
let numOfRiders = 8;

function updateActiveRiders(){
    console.log($('.numberOfRiders tr div').html());
    numOfRiders = $('.numberOfRiders tr div').html();
    createTableofRiders();
}

//console.log(numOfRiders);
let myIntervalTimer = 5; //in seconds
var myInterval = null;
//const numOfRiders = 5;

//event listener
btnStartNext.addEventListener('click' , (event) => {
    //console.log('started');
    start();
});

btnReset.addEventListener('click' , (event) => {
    reset();
});

$(document).on('click', '.row_data', function(event) {
    event.preventDefault();
    if($(this).attr('edit_type') == 'button') {
        return false;
    }
   // console.log($(this).attr('col_name'));
    $(this).closest('div').attr('contenteditable','true');
    $(this).addClass('bg-warning').css('padding', '4px');
    $(this).focus();
    $(this).keypress( function(e) {
        if($(this).attr('col_name') == 'Interval') {
            if(isNaN(String.fromCharCode(e.which))) e.preventDefault();
        };
    });
});

$(document).on('focusout', '.row_data', function(event) {
    event.preventDefault();
    if($(this).attr('edit_type') == 'button') {
        return false;
    }

    var rowId = $(this).closest('tr').attr('rowId');
    var row_div = $(this).removeClass('bg-warning').css('padding','');

    var col_name = row_div.attr('col_name');
    if (col_name == 'numOfRiders') {
        updateActiveRiders();
    } else {
        var col_val = row_div.html();
        //   console.log(riders[rowId]);
        //   console.log(riders[rowId][col_name]);
           riders[rowId][col_name] = col_val;
        //   console.log(rowId, col_name, col_val);
    }
})

//update timer
function timer() {
    myIntervalTimer--;
    if (myIntervalTimer == 0 ) { next();}
    txtTimer.innerText = `${myIntervalTimer}`;
}

function reset() {
    clearInterval(myInterval);
    myInterval = null;
    rider = 0;
    btnStartNext.innerHTML = 'Start';
    txtNext.innerText = (riders)[rider % numOfRiders].Name;
    txtTimer.innerText = `--`;
    init2();
}

function start() {
    //console.log('myInterval: ' + myInterval);
    if(myInterval) {
        
    } else
    myInterval = setInterval(timer, 1000);
    btnStartNext.innerHTML = 'Next'
    //txtNext.innerText = (riders)[rider % numOfRiders].Name;
    next();
}

function next() {
    let nextRider = rider++ % numOfRiders;
    myIntervalTimer = (riders)[nextRider].Interval;
    txtNext.innerText = (riders)[nextRider].Name;
    createTableofRiders();
}


function createTableofRiders(){

    console.log('start init2');
    var riderTbl = '';
    riderTbl +='<table class="table table-hover">';

    riderTbl +='<thead>';
        riderTbl +='<tr>';
        riderTbl +='<th>Name</th>';
        riderTbl +='<th>Interval</th>';
        //riderTbl +='<th>Options</th>';
        riderTbl +='</tr>';
    riderTbl +='</thead>';

    riderTbl +='<tbody>';
    $.each(riders, function(index){
        console.log($('.numberOfRiders tr div').html());
        if (index == numOfRiders) {return false};
        let idx = (rider + index) % numOfRiders;
        console.log(index, idx, numOfRiders, rider);
        
        //console.log('riders.Active' + riders[idx].Active + 'idx :' + idx + 'numOfRiders :' + numOfRiders);
            riderTbl +=`<tr rowId="${riders[idx].RiderID}">`
                riderTbl +=`<td><div class="row_data" edit_type="click" col_name="Name">${riders[idx].Name}</div></td>`;
                riderTbl +=`<td><div class="row_data" edit_type="click" col_name="Interval">${riders[idx].Interval}</div></td>`;
           // riderTbl +='<td>';
           // riderTbl +=`<span class="btn_edit"><a href="#" class="btn bnt-link" rowId="${riders[idx].RiderID}">Deactivate</a></span>`;
            //riderTbl +='</td>';
            });
        
        riderTbl +='</tr>';
    riderTbl +='</tbody>';
riderTbl +='</table>';
$(document).find('.ridersTable').html(riderTbl);
}

function createTableNumberOfRiders() {
    var riderTbl = '';
    riderTbl +='<table class="table table-hover">';

    riderTbl +='<thead>';
        riderTbl +='<tr>';
        riderTbl +='<th>Number of Riders</th>';
        riderTbl +='</tr>';
    riderTbl +='</thead>';

    riderTbl +='<tbody>';
            riderTbl +=`<tr">`
                riderTbl +=`<td><div class="row_data" edit_type="click" col_name="numOfRiders">8</div></td>`;
        riderTbl +='</tr>';
    riderTbl +='</tbody>';
riderTbl +='</table>';
$(document).find('.numberOfRiders').html(riderTbl);
}


function startOnload(){
    $.when( $.ready ).then(function () {
        createTableofRiders();
        createTableNumberOfRiders()
        console.log($('.numberOfRiders tr div').html());
    });
    
}

startOnload();
