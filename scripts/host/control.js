/* ------------  
   Control.js

   Requires global.js.
   
   Routines for the hardware simulation, NOT for our client OS itself. In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document envorinment inside a browser is the "bare metal" (so to speak) for which we write code that
   hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using JavaScript in 
   both the host and client environments.
   
   This (and other host/simulation scripts) is the only place that we should see "web" code, like 
   DOM manipulation and JavaScript event handling, and so on.  (Index.html is the only place for markup.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th editiion by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */


// 
// Control Services
// 
function simInit()
{
	// Get a global reference to the canvas.  TODO: Move this stuff into a Display Device Driver, maybe?
	CANVAS  = document.getElementById('display');
	// Get a global reference to the drawing context.
	DRAWING_CONTEXT = CANVAS.getContext('2d');
	// Enable the added-in canvas text functions (see canvastext.js for provenance and details).
	CanvasTextFunctions.enable(DRAWING_CONTEXT);
	// Get a global reference to the status bar.
	//STATUS_BAR = document.getElementById('statusBar');
	// Get a global reference to the drawing context.
	//STATUS_BAR_CONTEXT = STATUS_BAR.getContext('2d');
	// Enable the added-in canvas text functions (see canvastext.js for provenance and details).
	//CanvasTextFunctions.enable(STATUS_BAR_CONTEXT);
	// Clear the log text box.
	document.getElementById("ctrlLog").value="";
	// Set focus on the start button.
    document.getElementById("btnStartOS").focus();     // TODO: This does not seem to work.  Why?
}

function simLog(msg, source)
{
    // Check the source.
    if (!source)
    {
        source = "?";
    }

    // Note the OS CLOCK.
    var clock = _OSclock;

    // Note the REAL clock in milliseconds since January 1, 1970.
    var now = new Date().getTime();

    // Build the log string.   
    var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";    
    // WAS: var str = "[" + clock   + "]," + "[" + now    + "]," + "[" + source + "]," +"[" + msg    + "]"  + "\n";

    // Update the log console.
    taLog = document.getElementById("ctrlLog");
    taLog.value = str + taLog.value;
    // Optionally udpate a log database or some streaming service.
	
}


//
// Control Events
//
function simBtnStartOS_click(btn)
{
    // Disable the start button...
    btn.disabled = true;
    
    // .. enable the Emergency Halt and Reset buttons ...
    document.getElementById("btnHaltOS").disabled = false;
    document.getElementById("btnReset").disabled = false;
	document.getElementById("btnStep").disabled = false;
    
    // .. set focus on the OS console display ... 
    document.getElementById("display").focus();
    
    // ... Create and initialize the CPU ...
    _CPU = new CPU();
	_MainMem = new MainMemory();
	_MemoryAccessor = new MemoryAccessor();

    // ... then set the clock pulse simulation to call ?????????.
    hardwareClockID = setInterval(simClockPulse, CPU_CLOCK_INTERVAL);
    // .. and call the OS Kernel Bootstrap routine. 
    krnBootstrap();
}

function simBtnHaltOS_click(btn)
{
    simLog("emergency halt", "host");
    simLog("Attempting Kernel shutdown.", "host");
    // Call the OS sutdown routine.
    krnShutdown();
    // Stop the JavaScript interval that's simulating our clock pulse.
    clearInterval(hardwareClockID);
    // TODO: Is there anything else we need to do here?
}

function simBtnReset_click(btn)
{
    // The easiest and most thorough way to do this is to reload (not refresh) the document.
    //location.reload(true);  
    // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
    // be reloaded from the server. If it is false or not specified, the browser may reload the 
    // page from its cache, which is not what we want.
	
	//Soft reset
	simReboot();
}

//Added by Stu. Allow the user the ability to reboot the host OS (and by proxy the client OS) without reloading the actual page
function simReboot()
{
	//What to do here?
	//Clear memory, ready queue, pcbs?
	//Reset shell and log
	//Call krnBootstrap()? 
}

//Provide the user with the ability to perform single-step execution of a process
function simBtnStep_click(btn)
{
   simLog("begin step", "host");
   //Step through program loaded into memory
   krnStepProcess(btn);
}

//Display updated PCB properties on console
//Called at end of program execution with given pcb
function simUpdatePCBPanel(pcb)
{
   simLog("Updating PCB display", "console");
   var pcbDisplay = document.getElementById("pcbPanel");
   pcbDisplay.innerHTML = "";
   
   var pcbStats = pcbToString(pcb);
   
   pcbDisplay.innerHTML += pcbStats;
   
}

//Display updated CPU properties on console
//Called on krnOnCPUClockPulse
function simUpdateCPUPanel(_CPU)
{
   //simLog("Updating CPU display", "console"); Can't have this lagging the sim on the clock pulse
   var cpuDisplay = document.getElementById("cpuPanel");
   cpuDisplay.innerHTML = "";
   
   var cpuStats = cpuToString(_CPU);
   
   cpuDisplay.innerHTML += cpuStats;
}

//Display current PCBs in ready queue
//Called after process is loaded and on context switches
function simUpdateReadyQueue(queue)
{
	var process;
	var string;
	var readyQueueDisplay = document.getElementById("readyQueueDisplay");
	
	readyQueueDisplay.innerHTML = "";
	
	for (var k = 0; k < queue.getSize(); k++)
	{
		process = queue.get(k);
		string += process.toReadyString(process);
	}
	
	readyQueueDisplay.innerHTML += string;
	readyQueueDisplay.innerHTML += "\n";
}

//Display current resident processes in memory
//Called after process is loaded 
function simUpdateResidentList(queue)
{
	var process;
	var string;
	var readyQueueDisplay = document.getElementById("residentListDisplay");
	
	readyQueueDisplay.innerHTML = "";
	
	for (var k = 0; k < queue.getSize(); k++)
	{
		process = queue.get(k);
		string += process.toReadyString(process);
	}
	
	readyQueueDisplay.innerHTML += string;
	readyQueueDisplay.innerHTML += "\n";
}
//Display the contents of main memory after a program is loaded
//Called after process is loaded
function simUpdateMemoryDisplay()
{
	//for(var i = 0; i < _KernelReadyQueue.getSize(); k++)
    //simLog("Updating Memory display", "console"); Can't have this lagging the sim on the clock pulse
    var memDisplay = document.getElementById("memLog");
	memDisplay.innerHTML = "";
	
	if(OCCUPIED_PAGES > 0)
	{
		memDisplay.innerHTML += " -----------------------------------------------";
		memDisplay.innerHTML += "\n";
	}
	
	for(var k = 0; k < 32; k++)
	{
	  /*if( (k % 8) == 0)
	  {
	    memDisplay.innerHTML += " ------------------- <br>";
	  }*/
	  
	  memDisplay.innerHTML += stringFiller((k*8).toString(16), "0000");
	  memDisplay.innerHTML += ":    ";
	  for (var j = 0; j < 8; j++)
	  { 
	    var readData = _MemoryAccessor.readFrom((k*8) + j);
		/*
		if(readData = null)
		{ 
		   readData = "00";
		}
		*/
		memDisplay.innerHTML += stringFiller(readData.toString(16).toUpperCase(), "00");
		memDisplay.innerHTML += "  ";
	  }
	  memDisplay.innerHTML += "\n";
	}
	
}
