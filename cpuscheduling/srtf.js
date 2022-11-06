let row = 2;
let table = document.getElementById("scheduling-table");

function addRow() {
    let arrTime = document.getElementById("arrival-time-srtf").value;
    let burTime = document.getElementById("burst-time-srtf").value;
    if(arrTime == "" || burTime == ""){
        alert("Please enter all the fields");
    }
    else if(Number(arrTime) < 0 || Number(burTime) < 0){
        alert("Please only enter positive integers");
        return;
    }
    else if(Math.floor(Number(arrTime))!= Number(arrTime) || Math.floor(Number(burTime))!= Number(burTime)){
        alert("Please only enter positive integers");
        return;
    }
    else{
        
        let dynRow = table.insertRow(row);
        
        let C1 = dynRow.insertCell(0);
        let C2 = dynRow.insertCell(1);
        let C3 = dynRow.insertCell(2);
        let C4 = dynRow.insertCell(3);
        let C5 = dynRow.insertCell(4);
        let C6 = dynRow.insertCell(5);
        let C7 = dynRow.insertCell(6);

        C1.innerHTML = `P${row-1}`;
    	C2.innerHTML = arrTime;
    	C3.innerHTML = burTime;
        C4.innerHTML = "";
        C5.innerHTML = "";
        C6.innerHTML = "";
        C7.innerHTML = ""; 
         
        row += 1;

        document.getElementById("burst-time-srtf").value="";
        document.getElementById("arrival-time-srtf").value="";
    }
}

function delRow(){
	if(row==2){
    	alert("Cannot delete anymore rows");
    }
    else{
		table.deleteRow(row-1);
    	row -= 1;
    }
}

function getArrivalTimeArray(){

    let AT = []

    for(let i = 2; i < row; i++){

        AT.push(Number(table.rows[i].cells[1].innerHTML));
    }

    return AT;
}

function getBurstTimeArray(){

    let BT = []

    for(let i = 2; i < row; i++){

        BT.push(Number(table.rows[i].cells[2].innerHTML));
    }

    return BT;
}

function findTurnAroundTime(n, AT, CT){

    let TAT = new Array (n);

    for (let i = 0; i < n ; i++){

        TAT[i] = CT[i] - AT[i];
    }

    return TAT;
}

function findWaitingTime(n, BT, TAT){

    let WT = new Array (n);
    for (i = 0; i < n ; i++)
    {
        WT[i] = TAT[i] - BT[i];
    }

    return WT;
}


function display(n, WT, TAT, CT, RT, proNo){

    for(let i = 0; i < n; i++){

        let rowNo = proNo[i] + 1;

        table.rows[rowNo].cells[3].innerHTML = CT[i];
        table.rows[rowNo].cells[4].innerHTML = TAT[i];
        table.rows[rowNo].cells[5].innerHTML = RT[i];
        table.rows[rowNo].cells[6].innerHTML = WT[i];

    }
}

function calculateAverages(n, CT, TAT, WT, RT){

    let avgCT = 0, avgTAT = 0, avgRT = 0,avgWT=0;

    for(i = 0; i < n; i++){

        avgCT += Number(CT[i]);
        avgTAT += Number(TAT[i]);
        avgRT += Number(RT[i]);
        avgWT += Number(WT[i]);
    }

    avgCT = avgCT/n;
    avgTAT = avgTAT/n;
    avgRT = avgRT/n;
    avgWT = avgWT/n;

    document.getElementById("avg-comp-time-srtf").value = avgCT.toPrecision(3);
    document.getElementById("avg-turn-time-srtf").value = avgTAT.toPrecision(3);
    document.getElementById("avg-resp-time-srtf").value = avgRT.toPrecision(3);
    document.getElementById("avg-wt-time-srtf").value = avgWT.toPrecision(3);

}

let psrow = 1;
let pstable = document.getElementById("process-schedule");
let psDynRow1 = pstable.insertRow(1);
let psDynRow2 = pstable.insertRow(2);
let cellCount = 0;
let prevProcess;
let prevCompletionTime=0;
let psCell1;
let psCell2;

function createProcessSchedule(index, CT, AT){
    
    let PNO = index + 1;
    if(prevCompletionTime < AT){

        psCell1 = psDynRow1.insertCell(cellCount);
        psCell2 = psDynRow2.insertCell(cellCount);

        psCell1.innerHTML = `IDLE`;
        psCell2.innerHTML = AT;

        cellCount += 1;
    }
    
    if(prevProcess == PNO){

        psCell1.innerHTML = `P${PNO}`;
        psCell2.innerHTML = CT;
        prevCompletionTime = CT;            

    }else{

        psCell1 = psDynRow1.insertCell(cellCount);
        psCell2 = psDynRow2.insertCell(cellCount);
        
        psCell1.innerHTML = `P${PNO}`;
        psCell2.innerHTML = CT;

        prevProcess = PNO;
        prevCompletionTime = CT;
        cellCount += 1;
    }
}



function execute(){

    //SRTF Algorithm

    let NoOfProcess = row - 2;
    let arrivalTime = getArrivalTimeArray();
    let burstTime = getBurstTimeArray();

    let completionTime = new Array(NoOfProcess);
    let turnAroundTime = new Array(NoOfProcess);
    let waitingTime = new Array(NoOfProcess);
    let responseTime = new Array(NoOfProcess);
    let startTime = new Array(NoOfProcess);

    let pid = new Array (NoOfProcess);
    let burst_remaining = new Array(NoOfProcess);

    let isCompleted = new Array(NoOfProcess);
    
    for(i = 0; i < NoOfProcess; i++){
        pid[i] = i+1;
        isCompleted[i] = 0;
        burst_remaining[i] = burstTime[i];
    }

    
    let total_idle_time=0;
    let current_time=0;
    let completed=0;
    let prev = 0;

    while(completed != NoOfProcess) {
        let idx = -1;
        let mn = 10000000;
        for(let i = 0; i < NoOfProcess; i++) {
            if(arrivalTime[i] <= current_time && isCompleted[i]==0) {
                if(burst_remaining[i] < mn) {
                    mn = burst_remaining[i];
                    idx = i;
                }
                if(burst_remaining[i] == mn) {
                    if(arrivalTime[i] < arrivalTime[idx]) {
                        mn = burst_remaining[i];
                        idx = i;
                    }
                }
            }
        }

        if(idx != -1) {
            if(burst_remaining[idx] == burstTime[idx]) {
                startTime[idx] = current_time;
                total_idle_time += startTime[idx] - prev;
            }
            burst_remaining[idx] -= 1;
            current_time++;
            prev = current_time;

            createProcessSchedule(idx, current_time, arrivalTime[idx]);

            
            if(burst_remaining[idx] == 0) {
                completionTime[idx] = current_time;
                responseTime[idx] = startTime[idx]-arrivalTime[idx];
                isCompleted[idx] = 1;
                completed++;
            }
        }
        else {
             current_time++;
        }  
    }

    turnAroundTime = findTurnAroundTime(NoOfProcess, arrivalTime, completionTime);
    waitingTime = findWaitingTime(NoOfProcess, burstTime, turnAroundTime);


    display(NoOfProcess, waitingTime, turnAroundTime, completionTime, responseTime, pid);
    calculateAverages(NoOfProcess, completionTime, turnAroundTime, waitingTime, responseTime);


}