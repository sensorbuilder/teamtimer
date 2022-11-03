//variables

const txtTimer = document.querySelector('.timetrialer .timer');
const btnStartNext = $('#btnStartNext');
const btnReset = $('#btnReset');
const btnPause = document.getElementById('btnPause');
const txtNext = document.querySelector('.next');
const ridersList = document.getElementById('ridersList');
let rider = 0 //starting position
let numOfRiders = 8;
var riders = {};

function createRiderList () {
    rdrs = {};
    for (let i = 0; i <8; i++) {
        rdrs[i] = {RiderId:i, Name: "Rider"+(i+1), Interval:60, Active:true};
    }
    return rdrs;
}

//store rider object To LocalStorage
function pushRidersTLS(r) {
    localStorage.setItem("data" , JSON.stringify(r));
}
//get rider object From LocalStorage
function getRidersFLS() {
    var obj = {};
    obj = JSON.parse(localStorage.getItem('data'));
    return obj;
}

function updateActiveRiders() {
    //only accept input from 3 till 8 and no characters  
    let i = $('.numberOfRiders tr div').html();
    if (!(isNaN(i) || ( i < 3 ) || (i > 8))) {
        numOfRiders = i;
        createTableofRiders();
    }
    $('.numberOfRiders tr div').html(numOfRiders);
    createTableofRiders();  
    
}

let myIntervalTimer = 5; //in seconds
var myInterval = null;

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
    $(this).closest('div').attr('contenteditable','true');
    $(this).addClass('bg-secondary').css('padding', '4px');
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
    var row_div = $(this).removeClass('bg-secondary').css('padding','');

    var col_name = row_div.attr('col_name');
    if (col_name == 'numOfRiders') {
        updateActiveRiders();
    } else {
        var col_val = row_div.html();
           riders[rowId][col_name] = col_val;
           pushRidersTLS(riders);
           console.log('riders pushed to localstorage');
           console.log(riders);
           console.log(getRidersFLS());
    }
})

function timer() {
    myIntervalTimer--;
    if (myIntervalTimer == 0 ) { next();}
    txtTimer.innerText = `${myIntervalTimer}`;
}

function reset() {
    clearInterval(myInterval);
    myInterval = null;
    rider = 0;
    btnStartNext.html('Start');
    txtNext.innerText = (riders)[rider % numOfRiders].Name;
    txtTimer.innerText = `--`;
    createTableofRiders();
}

function start() {
    if(myInterval) {
    } else
    myInterval = setInterval(timer, 1000);
    btnStartNext.html('Next');
    next();
}

function next() {
    let nextRider = rider++ % numOfRiders;
    myIntervalTimer = (riders)[nextRider].Interval;
    txtNext.innerText = (riders)[nextRider].Name;
    createTableofRiders();
}


function createTableofRiders(){
    var riderTbl = '';
    riderTbl +='<table class="table table-hover table-borderless">';

    riderTbl +='<thead>';
        riderTbl +='<tr>';
        riderTbl +='<th>Name</th>';
        riderTbl +='<th>Interval</th>';
        riderTbl +='</tr>';
    riderTbl +='</thead>';

    riderTbl +='<tbody>';
    $.each(riders, function(index){
        if (index == numOfRiders) {return false};
        let idx = (rider + index) % numOfRiders;
            riderTbl +=`<tr rowId="${riders[idx].RiderId}">`
                riderTbl +=`<td><div class="row_data" edit_type="click" col_name="Name">${riders[idx].Name}</div></td>`;
                riderTbl +=`<td><div class="row_data" edit_type="click" col_name="Interval">${riders[idx].Interval}</div></td>`;
            });
        
        riderTbl +='</tr>';
    riderTbl +='</tbody>';
riderTbl +='</table>';
$(document).find('.ridersTable').html(riderTbl);
}

function createTableNumberOfRiders() {
    var riderTbl = '';
    riderTbl +='<table class="table table-hover table-borderless">';
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
    //Initialize RiderList
    if (!localStorage.getItem('data')) {
        riders = createRiderList(); //initial rider setup
        pushRidersTLS(riders);
    
    } else {
        riders = getRidersFLS();
    }
    $.when( $.ready ).then(function () {
        createTableofRiders();
        createTableNumberOfRiders()
    });   
}

startOnload();