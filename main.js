//variables

const txtTimer = document.querySelector('.timetrialer .timer');
const btnStartNext = document.getElementById('btnStartNext');
const btnReset = document.getElementById('btnReset');
const btnPause = document.getElementById('btnPause');
const txtNext = document.querySelector('.next');
const ridersList = document.getElementById('ridersList');
var riders = [
    {
        "Name": "Rider1",
        "Interval": 20
    },
    {   
        "Name": "Rider2",
        "Interval": 20
    },
    {   
        "Name": "Rider3",
        "Interval": 20
    },
    {
        "Name": "Rider4",
        "Interval": 20
    },
    {
        "Name": "Rider5",
        "Interval": 20
    },
    {
        "Name": "Rider6",
        "Interval": 20
    },
    {
        "Name": "Rider7",
        "Interval": 20
    },
    {
        "Name": "Rider8",
        "Interval": 20
    }
];

let rider = 0 //starting position
const numOfRiders = Object.keys(riders).length;

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
    init();
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
    init();
}

function init() {
    let headers = `<thead><tr>
      ${Object.keys(riders[0]).map((col) => {
        return `<th>${col}</th>`
      }).join('')}</thead></tr>`;
      //console.log(headers);

    /*let content = riders.map((row, idx) => {
        return `<tr id="riderId${idx}">
          ${Object.values(row).map((datum) => {
          return `<td>${datum}</td>`
        }).join('')}
        </tr>
    `}).join('');*/
    let content = ``;
    for(let i = 0; i < numOfRiders; i++) {
        var j = (rider + i) % numOfRiders; 
        content += `<tr id="ridersId${i}">
        <td>${riders[j].Name}</td>
        <td>${riders[j].Interval}</td><tr>`
        //console.log(j + ' ' + riders[j].Name);
        //console.log(rider)
    }
 // console.log(content);
    let list = `
    <table>
    ${headers}
    ${content}
    </table>`
    //console.log(list);
    document.querySelector('.ridersTable').innerHTML = list;
    }

init();