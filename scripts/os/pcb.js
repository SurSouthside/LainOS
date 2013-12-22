/* ----------------------------------
   pcb.js
   
   Requires globals.js 
   
   The Process Control Block for the OS
   
   Contains various info about a given pcb, including state, base and limit
   addresses, and registers
    
   Added by Stuart
   ---------------------------------- */ 
  var processID = 0;
   
  //States
  var pcbStateCycle = 0;
  var pcbNew = pcbStateCycle++;
  var pcbRunning = pcbStateCycle++;
  var pcbReady = pcbStateCycle++;
  var pcbWaiting = pcbStateCycle++;
  var pcbExecuted = pcbStateCycle++;
   
function PCB(){

  //Properties
  this.state = pcbNew;
  this.pid = processID++;
  this.isLoaded = true;
  this.priority = DEFAULT_PRIORITY;
  this.baseAddr = 0x0000; 
  this.limitAddr = 0x0000; 
  this.inMemory = false;
  
  //Registers
  this.programCounter = 0;
  this.IR = 0;
  this.regX = 0;
  this.regY = 0;
  this.regZ = 0;
  this.regA = 0;
  
  //Functions
  this.updateState = updatePCBState;
  this.updateRegisters = updateRegisters;
  this.saveRegisters = pcbSaveRegisters;
  this.loadRegisters = pcbLoadRegisters
  this.setBaseAddr = pcbSetBaseAddr;
  this.setLimitAddr = pcbSetLimitAddr
  
  this.toString = pcbToString;
  this.toReadyString = pcbToReadyString;
  this.getPID = pcbGetPID;
  
}   

//Thanks to Joe Casey
function updatePCBState(state)
{
  if(state >= 0 && state <= pcbStateCycle)
     this.state = state;
}

function updateRegisters(pc, ir, x, y, z, a)
{
  _CPU.PC = pc;
  _CPU.ir = ir;
  _CPU.Xreg = x;
  _CPU.Yreg = y;
  _CPU.Zflag = z;
  _CPU.Acc = a;
}

//Display registers in string format
function pcbToString(pcb)
{
  var pcbRegs = document.getElementById("pcbRegs");
  
  pcbRegs.innerHTML = "State   PC    IR    X    Y    Z    Acc";
  
  //While an array is slower, I find it easier to manage
  var pcbStats = new Array();
  
  pcbStats.push(pcb.state.toString());
  pcbStats.push("\t" + "\t");  //These tabs don't appear to work
  pcbStats.push(pcb.programCounter.toString(16));
  pcbStats.push("\t" + "\t");
  pcbStats.push(_CPU.ir.toString(16));
  pcbStats.push("\t" + "\t");
  pcbStats.push(_CPU.Xreg.toString(16));
  pcbStats.push("\t" + "\t");
  pcbStats.push(_CPU.Yreg.toString(16));
  pcbStats.push("\t" + "\t");
  pcbStats.push(_CPU.Zflag.toString(16));
  pcbStats.push("\t" + "\t");
  pcbStats.push(_CPU.Acc.toString(16));
  return pcbStats.toString(); 
  
}

//Display PCB stats for ready queue
function pcbToReadyString(pcb)
{
	var pcbStats = new Array();
	
	pcbStats.push("PID: ");
	pcbStats.push(pcb.pid.toString());
	pcbStats.push("\n");
	pcbStats.push("Base Address: ");
	pcbStats.push(pcb.baseAddr.toString(16));
	pcbStats.push("\n");
	pcbStats.push("Limit Address: ");
	pcbStats.push(pcb.limitAddr.toString(16));
	pcbStats.push("\n");
	pcbStats.push("X Register: ");
	pcbStats.push(pcb.regX.toString(16));
	pcbStats.push("\n");
	pcbStats.push("Y Register: ");
	pcbStats.push(pcb.regY.toString(16));
	pcbStats.push("\n");
	return pcbStats.toString();
}

//Used during context switch
function pcbSaveRegisters(pc, ir, x, y, z, a)
{
	this.programCounter = pc;
	this.IR = ir;
	this.regX = x;
	this.regY = y;
	this.regZ = z;
	this.regA = a;
}

//Used during context switch
function pcbLoadRegisters() 
{
	_CPU.PC = _ActiveProcess.programCounter;
	_CPU.ir = _ActiveProcess.IR;
	_CPU.Xreg = _ActiveProcess.regX;
	_CPU.Yreg = _ActiveProcess.regY;
	_CPU.Zflag = _ActiveProcess.regZ;
	_CPU.Acc = _ActiveProcess.regA;
	
}

//Do we need these, or just set directly through MMU?
function pcbSetBaseAddr()
{

}

function pcbSetLimitAddr()
{

}

//Gettor for easier use I suppose
function pcbGetPID()
{
  return this.pid;
}