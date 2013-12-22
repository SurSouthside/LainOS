/* ------------
   Kernel.js
   
   Requires globals.js 
   
   Routines for the Operataing System, NOT the host.
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th editiion by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5   
   ------------ */


//
// OS Startup and Shutdown Routines   
//
function krnBootstrap()      // Page 8. 
{
    simLog("bootstrap", "host");  // Use simLog because we ALWAYS want this, even if _Trace is off.

    // Initialize our global queues.
    _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
    _KernelBuffers = new Array();         // Buffers... for the kernel.
    _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
    _Console = new Console();             // The console output device.
	_CPUScheduler = new cpuScheduler();   // The CPU scheduler for changing processes
	_KernelFileSystemDeviceDriver = new FileSystemDeviceDriver(); //File system device driver 
	
	// Initialize standard input and output to the _Console.
	_StdIn  = _Console;
    _StdOut = _Console;
	
	//_StatusBar = new statusBar();         // The status bar

    // Initialize the Console.
	//_StatusBar.init();
    _Console.init();
	
	//Added by Stuart - Initialize the memory management unit and CPU 
	/*_CPU = new CPU();
	_Memory = new MainMemory();
	_MemoryAccessor = new MemoryAccessor();
	*/
	_MMU = new MMU();

    // Load the Keyboard Device Driver
    krnTrace("Loading the keyboard device driver.");
    krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
    krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
    krnTrace(krnKeyboardDriver.status);
	//Load the FSDD
	krnTrace("Loading the file system device driver.");
	krnFSDD = new DeviceDriverFSDD();
	krnFSDD.driverEntry();
	krnTrace(krnFSDD.status);
	
	//Initialize program entry
	programInput = document.getElementById("programTxtBox");
	
	// Initialize the process queues
	_KernelReadyQueue = new Queue();
	_KernelPriorityQueue = new Queue();
	_KernelResidentList = new Queue();


    // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
    krnTrace("Enabling the interrupts.");
    krnEnableInterrupts();
    // Launch the shell.
    krnTrace("Creating and Launching the shell.");
    _OsShell = new Shell();
    _OsShell.init();
	
	
}

function krnShutdown()
{
    krnTrace("begin shutdown OS");
    // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...    
    // ... Disable the Interruupts.
    krnTrace("Disabling the interrupts.");
    krnDisableInterrupts();
    // 
    // Unload the Device Drivers?
    // More?
    //
	krnDisableCPU();
	
    krnTrace("end shutdown OS");
}


function krnOnCPUClockPulse() 
{
    /* This gets called from the host hardware every time there is a hardware clock pulse. 
       This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
       This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel 
       that it has to look for interrupts and process them if it finds any. */
	     

    // Check for an interrupt, are any. Page 560
    if (_KernelInterruptQueue.getSize() > 0)    
    { 
        // Process the first interrupt on the interrupt queue.
        // TODO: Implement a priority queye based on the IRQ number/id to enforce interrupt priority.
        var interrupt = _KernelInterruptQueue.dequeue();
        krnInterruptHandler(interrupt.irq, interrupt.params);        
    }
	
	else if (_ActiveProcess != null && _ActiveProcess.state == pcbExecuted)
	{
		//krnKill(_ActiveProcess.pid);
		//_ActiveProcess = _KernelReadyQueue.dequeue();
		_CPUScheduler.schedule();
		//My own workaround
		if (!_CPU.isExecuting)
		{	
			krnTrace("Idle");
			if(!check)
			{
				_StdOut.advanceLine();
				_OsShell.putPrompt();
			}
			check = true;	
		}
	}
	
    else if (_CPU.isExecuting) // If there are no interrupts then run a CPU cycle if there is anything being processed.
    {
		/*
		if(tempRRQ == DEFAULT_RRQ)
			{
				krnTrace("Initiating context switch");
			   _CPUScheduler.contextSwitch(); 
			   tempRRQ = 0;
			}
		*/
		
			_CPUScheduler.checkSchedule();
		
		/*
		else if (_ActiveProcess.state == pcbExecuted)
		{
			_CPUScheduler.schedule();
		}
		*/
		_ActiveProcess.updateRegisters(_CPU.PC, _CPU.ir, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag, _CPU.Acc);
		_CPU.cycle(_ActiveProcess);
		/*
		if(_ActiveProcess.state === pcbExecuted)
		{
			krnKill(_ActiveProcess.pid);
		}
		*/
		//_CPU.execute(_ActiveProcess);
		//tempRRQ++;	
    }    
    else                       // If there are no interrupts and there is nothing being executed then just be idle.
    {
       krnTrace("Idle");
    }
	
	//Update date
	var currentTime = new Date().toString();
	document.getElementById('statusBarDate').innerHTML = currentTime;
    simUpdateCPUPanel(_CPU);
	
}

// 
// Interrupt Handling
// 
function krnEnableInterrupts()
{
    // Keyboard
    simEnableKeyboardInterrupt();
    // Put more here.
}

function krnDisableInterrupts()
{
    // Keyboard
    simDisableKeyboardInterrupt();
    // Put more here.
}

function krnDisableCPU()
{
	_CPU.isExecuting = false;
}

function krnInterruptHandler(irq, params)    // This is the Interrupt Handler Routine.  Page 8.
{
    // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
    krnTrace("Handling IRQ~" + irq);

    // Save CPU state. (I think we do this elsewhere.)

    // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
    // TODO: Use Interrupt Vector in the future.
    // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.  
    //       Maybe the hardware simulation will grow to support/require that in the future.
    switch (irq)
    {
        case TIMER_IRQ: 
            krnTimerISR();                   // Kernel built-in routine for timers (not the clock).
            break;
        case KEYBOARD_IRQ: 
            krnKeyboardDriver.isr(params);   // Kernel mode device driver
            _StdIn.handleInput();
            break;
		case WRITE_TO_CONSOLE_IRQ:			// Called when process requires text output to console
			_StdOut.putText(params);
			break;
		case CONTEXT_SWITCH_IRQ:			// Called when CPU scheduler require context switch
			schedulerContextSwitch(params); 
			break;
		//case I/O_REQUEST_IRQ:	
			//break;
		case SYSTEM_CALL_IRQ:				// Called when CPU finds system call ("FF") opcode
			krnHandleSystemCall(params)
			break;
        default: 
            krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
    }

    // 3. Restore the saved state.  TODO: Question: Should we restore the via IRET in the ISR instead of here? p560.
}

function krnTimerISR()  // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver).
{
    // Check multiprogramming parameters and enfore quanta here. Call the scheduler / context switch here if necessary.
}   

function krnHandleSystemCall(params)
{
  var callType = params[0];
}



//
// System Calls... that generate software interrupts via tha Application Programming Interface library routines.
//
// Some ideas:
// - ReadConsole
// - WriteConsole
// - CreateProcess
// - ExitProcess
// - WaitForProcessToExit
// - CreateFile
// - OpenFile
// - ReadFile
// - WriteFile
// - CloseFile


//
// OS Utility Routines
//
function krnTrace(msg)
{
   // Check globals to see if trace is set ON.  If so, then (maybe) log the message. 
   if (_Trace)
   {
      if (msg === "Idle")
      {
         // We can't log every idle clock pulse because it would lag the browser very quickly.
         if (_OSclock % 100 == 0)  // Check the CPU_CLOCK_INTERVAL in globals.js for an 
         {                        // idea of the tick rate and adjust this line accordingly.
            simLog(msg, "OS");          
         }         
      }
      else
      {
       simLog(msg, "OS");
      }
   }
}

//Added by Stuart. Load the program in the text box into memory
function krnLoadProgramIntoMem(code, priority)
{
    var pid = -1;

	if(code != null)
	{
		var process = new PCB();
		
		process.priority = priority;
		
		pid = process.pid;
		
		if(OCCUPIED_PAGES == 3)
		{
			_StdOut.advanceLine();
			_StdOut.putText("Writing process to disk");
			_StdOut.advanceLine();
			var successful = _KernelFileSystemDeviceDriver.createFile(pid.toString());
			if(successful)
				successful = _KernelFileSystemDeviceDriver.writeFile(pid.toString(), code);
				if(successful)
				{
					process.inMemory = true;
					return pid;
				}
		}
	
		//Add the process to the ready queue
		_KernelReadyQueue.enqueue(process);
		
		//Add the process to the priority queue
		_KernelPriorityQueue.enqueuePriority(process);
	
		var prgmByteCode = new Array();
		var byteString;
	
		for (var i = 0; i < code.length; i += 2)
		{
		byteString = code.substring(i, i+2);
	
		prgmByteCode.push(byteString);
		}
	
		code = prgmByteCode;
		
		_MMU.loadProcess(code, process);
	/*
		//Attempt to load process into memory
	  
	    for(var k = 0; k < code.length; k++)
		{
		  _MemoryAccessor.writeTo( k, parseInt( code[k], 16 ) );
		}
		//Fill remainder of page with 00
		
		for(var j = code.length; j < 128; j++)
		{
		   _MemoryAccessor.writeTo(j, "00");
		}
		*/
		
		process.updateState(pcbReady);
		
		_KernelResidentList.enqueue(process);
		
		//Display new registers
		
		simUpdatePCBPanel(process);
		
		//simUpdateCPUPanel(_CPU);
		
		simUpdateMemoryDisplay();
		
		simUpdateReadyQueue(_KernelReadyQueue);
		
		simUpdateResidentList(_KernelResidentList);
		
		OCCUPIED_PAGES++;
		
		
	}
	
	return pid;  
	
}

//Added by Stuart. Run the process with the given PID
function krnRunProcess(pid)
{
   check = false;

   var selectedProcess = krnRetrieveProcess(pid);
   //If pid does not exist
   /*if(typeof selectedProcess == "undefined")
	_StdOut.putText("PID not found");
	return;
	*/
	
	if(runAllBool)
	{
		selectedProcess = _ActiveProcess;
	}

   
   if(selectedProcess.state = pcbReady)
   {
     _ActiveProcess = selectedProcess;
	 //Change state of pcb to running
	 _ActiveProcess.state = pcbRunning;
	 //Establish memory accessor base and limit registers
	 _MemoryAccessor.baseAddr = _ActiveProcess.baseAddr;
	 _MemoryAccessor.limitAddr = _ActiveProcess.limitAddr;
	 //_CPU.loadPC(_MMU.setAddress(_ActiveProcess));
	 //Turn on CPU
     _CPU.isExecuting = true;
	 //Load CPU with base address
	 _CPU.loadPC(_ActiveProcess.programCounter);
	 simUpdateReadyQueue(_KernelReadyQueue);
     //_CPU.execute(selectedProcess);
   }
}

/*Added by Stuart. Run all processes in the ready queue
  Actually, only sets a flag that gets checked on a cpu cycle,
  then runs the first process in the ready queue
*/
function krnRunAll()
{
   //Setting a flag seems easier and cleaner to me
   runAllBool = true;
   
   check = false;
   
   krnRunScheduled();
    
   //simUpdateReadyQueue(_KernelReadyQueue);

	/*
   var tempRRQ = 0;
   
   _ActiveProcess = _KernelReadyQueue.dequeue();
   
   var currentPID = _ActiveProcess.pid;
   
   for (var i = tempRRQ; i < DEFAULT_RRQ; i++)
   {
     krnRunProcess(currentPID);
   }
   */
}

function krnRunScheduled()
{
	if(_CPUScheduler.currentAlgorithm == "priority")
	{
		_ActiveProcess = _KernelPriorityQueue.dequeue();
	}
	else
	{
		_ActiveProcess = _KernelReadyQueue.dequeue();
	}	
	
	//Change state of pcb to running
	 _ActiveProcess.state = pcbRunning;
	 //Establish memory accessor base and limit registers
	 _MemoryAccessor.baseAddr = _ActiveProcess.baseAddr;
	 _MemoryAccessor.limitAddr = _ActiveProcess.limitAddr;
	 //_CPU.loadPC(_MMU.setAddress(_ActiveProcess));
	 //Turn on CPU
     _CPU.isExecuting = true;
	 //Load CPU with base address
	 _CPU.loadPC(_ActiveProcess.programCounter);
	 simUpdateReadyQueue(_KernelReadyQueue);
	
	
}

//Added by Stuart. Step through the first process loaded into memory
function krnStepProcess(button)
{
   //Never got around to this, unfortunately
   //Disable clock pulse
}


//Added by Stu. Kernel portion of context switch
function krnContextSwitch(process)
{
	var nextProcess;
	//Change state of active process
	process.state = pcbWaiting;
	//Remove the currently running process from the ready queue
	nextProcess = _KernelReadyQueue.dequeue();
	//Make the next active process the first process currently in the ready queue
    _KernelReadyQueue.enqueue(process); 
	 //Since it is back in ready queue, change state
	 process.state = pcbReady;
	//Declare it the active process
	_ActiveProcess = nextProcess;
	//Change state of new active process
	_ActiveProcess.state = pcbRunning;
	//Update base and limit registers 
	_MemoryAccessor.baseAddr = _ActiveProcess.baseAddr;
	_MemoryAccessor.limitAddr = _ActiveProcess.limitAddr; 
	//Update ready queue
	simUpdateReadyQueue(_KernelReadyQueue);
	//Log the event
	krnTrace("Context switch: pid: " + process.pid + " with pid: " + _ActiveProcess.pid);
	//Return the process to begin execution
	return nextProcess;
}

   
function krnTrapError(msg)
{
    simLog("OS ERROR - TRAP: " + msg);
	//Use jQuery or Javascript to change CSS? I think Javascript
	var display = document.getElementById("display");
	display.style.color = "rgb(0,0,0)";
	display.style.backgroundColor = "rgb(0,0,255)";
    // TODO: Display error on console, perhaps in some sort of colored screen. (Perhaps blue?)
    krnShutdown();
}


//Added by Stuart. Find process given PID for process execution
function krnRetrieveProcess(pid)
{
  var selectedProcess;
  
  for (var k = 0; k < _KernelReadyQueue.getSize(); k++)
  {
    //Works for i2 only (Not really since the ready queue is really an array)
    if(pid == _KernelReadyQueue.get(k).pid)
	  selectedProcess = _KernelReadyQueue.dequeue();
  }
  return selectedProcess;
}

//Added by Stuart. Kill the process with the given PID
function krnKill(pid)
{
  var matchedPID = -1;
  
  //Search ready queue (really an array) for process
  for(var i = 0; i < _KernelReadyQueue.getSize(); i++)
  {
	//If match
	if (_KernelReadyQueue.get(i).pid === pid)
	{
		matchedPID = pid;
		//Remove from ready queue
		_KernelReadyQueue.kill(i);
	}
  }
  
  simUpdateReadyQueue(_KernelReadyQueue);
  
  //Clear memory?
  
  return matchedPID;
  
}
