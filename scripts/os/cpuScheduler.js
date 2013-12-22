/* ----------------------------------
   cpuScheduler.js
   
   Requires globals.js
   
   The CPU scheduler for the OS
   Handles changes in the Round Robin quantum and 
   subsequent process execution based on said quantum
   Handles first come,first serve and priority scheduling
   as well.
   
   Added by Stuart
   ---------------------------------- */ 
   
function cpuScheduler()
{
  //TODO: Adopt kernel queues, or create own?
  //Adopt kernel queue, why waste memory?
  
  //Properties
  this.currentAlgorithm = "rr"; 
  this.currentRRQ = rrq;
  this.tempRRQ = 0;
  this.activeProcess = null;
   
  //Methods
  //this.receiveNewProcess = schedulerReceiveNewProcess;
  this.contextSwitch = schedulerContextSwitch;
  this.checkSchedule = schedulerCheckSchedule;
  this.schedule = schedulerSchedule;
  //this.scheduleNewProcess = schedulerScheduleNewProcess;
  this.rrSchedule = schedulerRRSchedule;
  this.prioritySchedule = schedulerPrioritySchedule;
  this.kill = schedulerKill; 
  this.checkPriority = schedulerCheckPriority;
  this.setAlgorithm = schedulerSetAlgorithm;
  this.getAlgorithm = schedulerGetAlgorithm;
}

//Kill a currently active process
//Intermediary that transfers control to kernel
//Do I need this?
function schedulerKill(pid)
{
   var killedPCB = null; 
}


//Called on clock pulse
function schedulerCheckSchedule()
{
	if(this.currentAlgorithm == "rr")
	{
		this.rrSchedule();
	}
	/*
	else if (this.currentAlgorithm = "priority");
	{
		this.prioritySchedule();
	}
	*/
}

//Called on clock pulse if round robin scheduling active
function schedulerRRSchedule()
{
	tempRRQ++;
	if(tempRRQ === rrq && runAllBool && !_KernelReadyQueue.isEmpty())
		{
			krnTrace("Initiating context switch");
			krnInterruptHandler(CONTEXT_SWITCH_IRQ, _ActiveProcess);	
			//process = _CPUScheduler.contextSwitch();
			tempRRQ = 1;
		}
}

//Called on clock pulse if priority scheduling active (Primes with highest priority)
function schedulerPrioritySchedule()
{
	if(!_KernelReadyQueue.isEmpty())
		{
			var process = this.checkPriority();
			process.state = pcbRunning;
			_ActiveProcess = process;
			return _ActiveProcess;
		}
}



//Checks to see if the current scheduling algorithm calls for a context switch
function schedulerSchedule()
{
	if(!_KernelReadyQueue.isEmpty()) //Why schedule nothing?
	{
		if(this.currentAlgorithm == "fcfs")
		{
			if(!_KernelReadyQueue.isEmpty())
			{
				var process = _KernelReadyQueue.dequeue();
				process.state = pcbRunning;
				_ActiveProcess = process;
				_ActiveProcess.loadRegisters();
				krnRunProcess(_ActiveProcess.getPID());
			}
			else
				_CPU.isExecuting = false;
		}
		else if(this.currentAlgorithm == "priority")
		{
			if(!_KernelReadyQueue.isEmpty())
			{
				var process = _KernelPriorityQueue.dequeue();
				process.state = pcbRunning;
				_ActiveProcess = process;
				_ActiveProcess.loadRegisters();
				krnRunProcess(_ActiveProcess.getPID());
			}
			else
				_CPU.isExecuting = false;
		}
		else if(this.currentAlgorithm == "rr")
		{
			if(_KernelReadyQueue.getSize() > 2)
			{
				krnInterruptHandler(CONTEXT_SWITCH_IRQ, _ActiveProcess);
			}
			
			else 
			{
				if(_KernelReadyQueue.getSize() == 2)
				{
					_CPU.isExecuting = false;
				}
				var process = _KernelReadyQueue.dequeue();
				process.state = pcbRunning;
				_ActiveProcess = process;
				_ActiveProcess.loadRegisters();
				krnRunProcess(_ActiveProcess.getPID());	
			}
		}
	
	}
   else
	{
		if(localStorage.length != 0) //If a file is present on disk
		{
			_KernelFileSystemDeviceDriver.rollOut(_ActiveProcess);
			var procFromMem = _KernelFileSystemDeviceDriver.rollIn(_ActiveProcess);
			_ActiveProcess = procFromMem;
			//_ActiveProcess.loadRegisters();
			krnRunProcess(_ActiveProcess.getPID()); 
		}
		
		_CPU.isExecuting = false;
	}
}

//Performs context switch based on specified round robin quantum
//Intermediary that transfers control to kernel
function schedulerContextSwitch(activeProcess)
{
	_ActiveProcess = activeProcess;
	_ActiveProcess.saveRegisters(_CPU.PC, _CPU.ir, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag, _CPU.Acc);
	_Mode = 0; //Switch to kernel mode
   //krnInterruptHandler(CONTEXT_SWITCH_IRQ, _ActiveProcess);	
   _ActiveProcess = krnContextSwitch(_ActiveProcess);
   _ActiveProcess.loadRegisters();
   _Mode = 1; //Switch to user mode
   krnRunProcess(_ActiveProcess.getPID());
   return _ActiveProcess;
   
}

function schedulerSetAlgorithm(algorithm)
{
	this.currentAlgorithm = algorithm; 
}

function schedulerGetAlgorithm()
{
	return this.currentAlgorithm;
}

//Searches ready queue for process with highest priority after program execution
function schedulerCheckPriority()
{
	//This way, even though it violates the queue principle (which
	//is technically an array)?
	var highPriIndex = 0;
	var tempProcess = null;
	for (var j = 0; j < _KernelReadyQueue.getSize(); j++)
	{
		if(_KernelReadyQueue.get(j).priority < _KernelReadyQueue.get(j).priority)
		{
			highPriIndex = j;
		}
	}
	//I understand it says kill, but it still serves the same function by removing
	//the process from the queue (array).
	tempProcess = _KernelReadyQueue.kill(highPriIndex);
	return tempProcess;
}


