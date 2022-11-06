let row = 2;
let table = document.getElementById("scheduling-table");

function addRow(){
    
    let arrTime = document.getElementById("arrival-time-priority-preemptive").value;
    let burTime = document.getElementById("burst-time-priority-preemptive").value;
    let prio = document.getElementById("priority-preemptive").value;
    if(arrTime == "" || burTime == "" || prio == ""){
        alert("Please enter all the fields");
    }
    else if(Number(arrTime) < 0 || Number(burTime) < 0 || Number(prio) < 0){
        alert("Please only enter positive integers");
        return;
    }
    else if(Math.floor(Number(arrTime))!= Number(arrTime) || Math.floor(Number(burTime))!= Number(burTime) || Math.floor(Number(prio))!= Number(prio)){
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
        let C8 = dynRow.insertCell(7);

        C1.innerHTML = `P${row-1}`;
    	C2.innerHTML = arrTime;
    	C3.innerHTML = burTime;
        C4.innerHTML = prio;
        C5.innerHTML = "";
        C6.innerHTML = "";
        C7.innerHTML = "";
        C8.innerHTML = ""; 
         
        row += 1;

        document.getElementById("burst-time-priority-preemptive").value="";
        document.getElementById("arrival-time-priority-preemptive").value="";
        document.getElementById("priority-preemptive").value="";
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

    let AT = [];

    for(let i = 2; i < row; i++){

        AT.push(Number(table.rows[i].cells[1].innerHTML));
    }

    return AT;
}

function getBurstTimeArray(){

    let BT = [];

    for(let i = 2; i < row; i++){

        BT.push(Number(table.rows[i].cells[2].innerHTML));
    }

    return BT;
}

function getPriorityArray(){

    let PR = [];

    for(let i = 2; i < row; i++){

        PR.push(Number(table.rows[i].cells[3].innerHTML));
    }

    return PR;
}

function display(n, WT, TAT, CT, RT, proNo){

    for(let i = 0; i < n; i++){

        let rowNo = proNo[i] + 1;

        table.rows[rowNo].cells[4].innerHTML = CT[i];
        table.rows[rowNo].cells[5].innerHTML = TAT[i];
        table.rows[rowNo].cells[6].innerHTML = RT[i];
        table.rows[rowNo].cells[7].innerHTML = WT[i];

    }
}

function calculateAverages(n, totCT, totTAT, totRT, totWT){

    let avgCT = 0, avgTAT = 0, avgRT = 0, avgWT = 0;

    avgCT = totCT/n;
    avgTAT = totTAT/n;
    avgRT = totRT/n;
    avgWT = totWT/n;

    document.getElementById("avg-comp-time-priority-preemptive").value = avgCT.toPrecision(3);
    document.getElementById("avg-turn-time-priority-preemptive").value = avgTAT.toPrecision(3);
    document.getElementById("avg-resp-time-priority-preemptive").value = avgRT.toPrecision(3);
    document.getElementById("avg-wt-time-priority-preemptive").value = avgWT.toPrecision(3);
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

    //PRIORITY Algorithm

    let NoOfProcess = row - 2;

    let total_turnaround_time = 0, total_waiting_time = 0, total_response_time = 0, total_completion_time = 0, total_idle_time = 0;

    let is_completed = new Array (NoOfProcess);
    let burst_remaining = new Array (NoOfProcess);
    let start_time = new Array (NoOfProcess);
    let completion_time = new Array (NoOfProcess);
    let turnaround_time = new Array (NoOfProcess);
    let waiting_time = new Array (NoOfProcess);
    let response_time = new Array (NoOfProcess);

    let arrivalTime = getArrivalTimeArray();
    let burstTime = getBurstTimeArray()
    let priority = getPriorityArray();


    for(let i = 0; i < NoOfProcess; i++){
        
        is_completed[i] = 0;
        burst_remaining[i] = burstTime[i];
    }
    
    let processNo = new Array (NoOfProcess);

    for(i = 0; i < NoOfProcess; i++){

        processNo[i] = i+1;
    }

    let current_time = 0, completed = 0, prev = 0;

    while(completed != NoOfProcess) {
        
        let idx = -1, mx = -1;//-1 || Infinity
         
        for(let i = 0; i < NoOfProcess; i++) {

            if(arrivalTime[i] <= current_time && is_completed[i] == 0) {
                
                if(priority[i] > mx) {//> || <
                    
                    mx = priority[i];
                    idx = i;
                }
                if(priority[i] == mx) {
                    
                    if(arrivalTime[i] < arrivalTime[idx]) {
                        
                        mx = priority[i];
                        idx = i;
                    }
                }
            }
        }

        if(idx != -1) {
            
            if(burst_remaining[idx] == burstTime[idx]) {
                start_time[idx] = current_time;
                total_idle_time += start_time[idx] - prev;
            }
            burst_remaining[idx] -= 1;//time quanta
            current_time++;
            prev = current_time;
            
            createProcessSchedule(idx, current_time, arrivalTime[idx]);

            if(burst_remaining[idx] == 0) {
                completion_time[idx] = current_time;
                turnaround_time[idx] = completion_time[idx] - arrivalTime[idx];
                waiting_time[idx] = turnaround_time[idx] - burstTime[idx];
                response_time[idx] = start_time[idx] - arrivalTime[idx];

                total_turnaround_time += turnaround_time[idx];
                total_waiting_time += waiting_time[idx];
                total_response_time += response_time[idx];
                //total_idle_time += start_time[idx] - prev;
                total_completion_time += completion_time[idx];

                is_completed[idx] = 1;
                completed++;
            }
        }
        else {
            current_time++;
        }
    }

    display(NoOfProcess, waiting_time, turnaround_time, completion_time, response_time, processNo);
    calculateAverages(NoOfProcess, total_completion_time, total_turnaround_time, total_response_time, total_waiting_time);
   
   
}