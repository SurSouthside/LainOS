/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) or interpreter for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell()
{
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit()
{
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data."
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
	
	//date
	sc = new ShellCommand();
	sc.command = "date";
	sc.description = "- Displays the current date.";
	sc.function = shellDate;
	this.commandList[this.commandList.length] = sc;
	
	//whereami
	sc = new ShellCommand();
	sc.command = "whereami";
	sc.description = "- Displays the user's current location.";
	sc.function = shellWhereAmI;
	this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help."
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running."
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position."
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;
	
	//load
	/*
	sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- Load a program";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;
	*/
	
	//loadpriority
	sc = new ShellCommand();
    sc.command = "loadpriority";
    sc.description = "<priority> - Load a program with the given priority";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;
	
	//run
	sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<pid> - Run the program with the given pid";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;
	
	//runall
	sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- Run all programs in the ready queue";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;
	
	//step
	sc = new ShellCommand();
    sc.command = "step";
    sc.description = "<pid> - Step through the program with the given pid";
    sc.function = shellStep;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc; 
	
	// status <string>
	sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - Sets the status of the OS.";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc;
	
	// rrquantum <int>
	sc = new ShellCommand();
    sc.command = "rrquantum";
    sc.description = "<int> - Sets the Round Robin quantum (in seconds).";
    sc.function = shellRRQuantum;
    this.commandList[this.commandList.length] = sc;
	
	// show PIDs
	sc = new ShellCommand();
    sc.command = "showpids";
    sc.description = "- Display the PIDs of all resident processes."; 
    sc.function = shellShowPIDs;
    this.commandList[this.commandList.length] = sc;
	
	// kill <pid>
	sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "<pid> - Terminate the active process with the given PID";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;
	
	//createfile <filename>
	sc = new ShellCommand();
    sc.command = "createfile";
    sc.description = "<filename> - Create a file with the given filename";
    sc.function = shellCreateFile;
    this.commandList[this.commandList.length] = sc;
	
	//readfile <filename>
	sc = new ShellCommand();
    sc.command = "readfile";
    sc.description = "<filename> - Read data from the given file";
    sc.function = shellReadFile;
    this.commandList[this.commandList.length] = sc;
	
	//writefile <filename> <data>
	sc = new ShellCommand();
    sc.command = "writefile";
    sc.description = "<filename> <data> - Write data to the given file";
    sc.function = shellWriteFile;
    this.commandList[this.commandList.length] = sc;
	
	//delete <filename>
	sc = new ShellCommand();
    sc.command = "deletefile";
    sc.description = "<filename> - Delete the given file";
    sc.function = shellDeleteFile;
    this.commandList[this.commandList.length] = sc;
	
	//format
	sc = new ShellCommand();
    sc.command = "format";
    sc.description = "- Format the HDD";
    sc.function = shellFormat;
    this.commandList[this.commandList.length] = sc;
	
	//ls
	sc = new ShellCommand();
    sc.command = "ls";
    sc.description = "<filename> - Show the files currently stored on disk";
    sc.function = shellLS;
    this.commandList[this.commandList.length] = sc;
	
	//setalgorithm <algorithm>
	sc = new ShellCommand();
    sc.command = "setalgorithm";
    sc.description = "<algorithm> - Set algorithm for CPU scheduler";
    sc.function = shellSetAlgorithm;
    this.commandList[this.commandList.length] = sc;
	
	//getalgorithm
	sc = new ShellCommand();
    sc.command = "getalgorithm";
    sc.description = "- View current algorithm for CPU scheduler";
    sc.function = shellGetAlgorithm;
    this.commandList[this.commandList.length] = sc;
	
	//what
	sc = new ShellCommand();
    sc.command = "what";
    sc.description = "- ?";
    sc.function = shellWhat;
    this.commandList[this.commandList.length] = sc;
	
	//possum
	sc = new ShellCommand();
    sc.command = "possum";
    sc.description = "- Fake murder (for science)...";
    sc.function = shellPossum;
    this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
	
	//var now = new Date().toUTCString();
	//document.getElementById('statusBarDate').innerHTML = now; 
	
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // Javascript may not support associative arrays (one of the few nice features of PHP, actually)
    // so we have to iterate over the command list in attempt to find a match.  TODO: Is there a better way?
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apoligies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}


function shellParseInput(buffer)
{
    var retVal = new UserCommand();
    //
    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);
    // 2. Lower-case it.
    buffer = buffer.toLowerCase();
    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");
    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in Javascript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;
    //
    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}


function shellExecute(fn, args)
{
    // we just got a command, so advance the line... 
    _StdIn.advanceLine();
    // .. call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect Javascript, we'd be 
// able to make then private.  (Actually, we can. Someone look at Crockford's stuff and give me the details, please.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
    _StdIn.putText("Okay. I forgive you. This time.");
    _SarcasticMode = false;
}

//Altered by Stuart
function shellVer(args)
{
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}

//Added by Stuart
function shellDate(args)
{
    var currentDate = new Date();
    _StdIn.putText("" + currentDate.toString());
	
}


//Added by Stuart
function shellWhereAmI(args)
{
    _StdOut.putText("Approximately 93 million miles from the nearest luminous ");
	_StdIn.advanceLine();
	_StdOut.putText("sphere of searing hot plasma");
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    { 
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }	
}

//Added by Stuart
function shellLoad(args)
{	
   if(OCCUPIED_PAGES == 3)
   {
	_StdOut.putText("Memory full");
   }
   
   var priority = parseInt(args[0]);
	
   var code = document.getElementById("programTxtBox").value;
   //Check for actual code
   if (code == "")
      _StdOut.putText("Please enter a program into the text box below.");
   else
   {
     //Convert code to array for easier interpretation
	 //_StdOut.putText("Code loaded.");
	 //_StdIn.advanceLine();
	 var trueCode = code.toString();
	 //More than 256 bytes
	 if((PAGE_SIZE * 2) < trueCode.length)
	 {
		_StdOut.putText("Error-Program too large to load into page.");
		return;
	 }
	 //alert(trueCode);
	 var arrCode = shellLoadCode(trueCode);
	 var pid = krnLoadProgramIntoMem(arrCode, priority);
	 document.getElementById("programTxtBox").innerHTML = "";
	 _StdOut.putText("PID: " + pid.toString() + " Priority: " + priority.toString());
   }
   
   document.getElementById("programTxtBox").value = "";
  
}

//Added by Stuart, thanks to Rob Fama
function shellLoadCode(code)
{ 
   var loadComplete=false;
   //alert(loadComplete);
   
   //Get rid of whitespace, shift to uppercase
   code = code.replace(/[\s\n]/g, '').toUpperCase();
   
   //Check to see if every character is a valid hex code with two hex digits
   if (code.length % 2 != 0 || code.match(/^[A-F0-9]+$/) == null)
   {
	  _StdOut.putText("Invalid program!");
	  _StdOut.advanceLine();
   }
   // Code is clean
   else 
   { 
      loadComplete=true;
	  //alert(loadComplete);
	  return code;
	 // var pid = pcb.getPID;
	 // _StdOut.putText("Program loaded succesfully.");
	 // _StdOut.advanceLine();
	  
   }
   
}

//Added by Stuart
function shellRun(args)
{
   var pid = parseInt(args[0]);
   //TODO: Add check for valid PID
   if( pid >= 0)
      krnRunProcess(pid);
}

//Added by Stuart
function shellRunAll(args)
{	
   if(!_KernelReadyQueue.isEmpty())
	 krnRunAll();
    else
     _StdOut.putText("No processes ready to run.");	
}

//Added by Stuart
function shellStep(args)
{
   //Did not perfect
   var pid = parseInt(args[0]);
   if ( pid >= 0)
      krnStepProcess(pid);
}

//Added by Stuart
function shellStatus(args)
{
   var statusString = "";
   //Concatenate the buffer
   for (var j = 0; j < args.length; j++)
   {
      if (j != 0)
	    statusString += ' ';
		
	  statusString += args[j];	
   }
   _StdOut.putText("New status: " + statusString);
   this.statusString = statusString;
   //Update the status bar above the console
   document.getElementById('statusBarStatus').innerHTML = statusString;   
}

//Added by Stuart. Allow the user to set the round robin quantum for the cpu scheduler
function shellRRQuantum(args)
{
   //Make sure the new quantum is an int
   var newRRQ = parseInt(args[0]);
   
   rrq = newRRQ;
   
   _StdOut.putText("New RRQ: " + rrq);
}

//Added by Stuart
function shellShowPIDs(args)
{
   var stringOfPIDS = " ";
   //No PCB has ready status
   if(_KernelReadyQueue.getSize() === 0)
   {
   _StdOut.putText("Currently no active processes.");
   _StdOut.advanceLine();
   }
   //Display PID of active processes
   else
   {
	 //Loop through ready queue to get other PIDs
	 for(var j = 0; j < _KernelReadyQueue.getSize(); j++)
	 {
		var selectedPID = _KernelReadyQueue.get(j).pid;
		//Concatenate to string
		stringOfPIDS += selectedPID;
	 }
   }
   
   _StdOut.putText(stringOfPIDS);
   
}

//Added by Stuart
function shellKill(args)
{
   var deletedPID = parseInt(args[0]);
   
   //Relay execution to kernel
   //_Trace("Killing process");
   var killedPID = krnKill(deletedPID);
   _StdOut.putText("Killed process with PID " + killedPID);
}

//Added by Stuart
function shellCreateFile(args)
{
   var fileName = "";
   //Concatenate the buffer
   for (var j = 0; j < args.length; j++)
   {
      if (j != 0)
	    fileName += ' ';
		
	  fileName += args[j];	
   }
   _StdOut.putText("Attempting to create " + fileName + ".");
   this.fileName = fileName;
   var successful = _KernelFileSystemDeviceDriver.createFile(fileName);
   if(successful)
   {
	_StdOut.advanceLine();
	_StdOut.putText("File " + fileName + " successfully created.");
   }
   else
   {
    _StdOut.advanceLine();
	_StdOut.putText("File " + fileName + " creation failed.");
   }
}

//Added by Stuart
function shellReadFile(args)
{
	//var fileName = "";
	//var bytes = 0;
   //Concatenate the buffer
   for (var j = 0; j < args.length; j++)
   {
      if (j != 0)
	    fileName += ' ';
		
	  fileName += args[j];	
   }
   var filename = args.toString(); 
   _StdOut.putText("Attempting to read " + filename);
   //var bytes = parseInt(args[1]);
   var stats = _KernelFileSystemDeviceDriver.readFile(filename); //Returns variable denoting success and actual data read
   if(stats[0] = true)
   {
	_StdOut.advanceLine();
	_StdOut.putText("File " + filename + " successfully read of length " + stats[1].toString().length);
	document.getElementById("programTxtBox").value = stats[1].toString();
   }
   else
   {
    _StdOut.advanceLine();
	_StdOut.putText("File " + filename + " read failed.");
   }
}

//Added by Stuart
function shellWriteFile(args)
{
	//var fileName = "";
	var newData = null;
   //Concatenate the buffer
   for (var j = 0; j < args.length; j++)
   {
      if (j != 0)
	    fileName += ' ';
		
	  fileName += args[j];	
   }
   var fileName = args[0].toString();
   var data = document.getElementById("programTxtBox").value;
   //data = data.toString();
   data = data.replace(/\s/g, '');
   _StdOut.putText("Attempting to write to " + fileName);
   var successful =	_KernelFileSystemDeviceDriver.writeFile(fileName, data);
   if(successful)
   {
	_StdOut.advanceLine();
	_StdOut.putText("File " + fileName + " successfully written to length of " + data.length);
	document.getElementById("programTxtBox").value = "";
   }
   else
   {
    _StdOut.advanceLine();
	_StdOut.putText("File " + fileName + " write to failed.");
   }
}

//Added by Stuart
function shellDeleteFile(args) 
{
   var fileName = "";
   //Concatenate the buffer
   for (var j = 0; j < args.length; j++)
   {
      if (j != 0)
	    fileName += ' '; 
		
	  fileName += args[j];	
   }
   _StdOut.putText("Attempting to delete " + fileName);
   this.fileName = fileName;
   var successful = _KernelFileSystemDeviceDriver.deleteFile(fileName);
   if(successful)
   {
	_StdOut.advanceLine();
	_StdOut.putText("File " + fileName + " successfully deleted.");
   }
   else
   {
    _StdOut.advanceLine();
	_StdOut.putText("File " + fileName + " deletion failed.");
   }
}

//Added by Stuart
function shellFormat(args)
{
	var successful = _KernelFileSystemDeviceDriver.format();
	if(successful)
    {
	_StdOut.advanceLine();
	_StdOut.putText("File system successfully formatted.");
    }
    else
    {
    _StdOut.advanceLine();
	_StdOut.putText("File system format failed.");
    }
} 

//Added by Stuart
function shellLS(args)
{
	var filenames = _KernelFileSystemDeviceDriver.list();
	_StdOut.advanceLine();
	_StdOut.putText("Files currently in storage: " + filenames);
}

//Added by Stuart
function shellSetAlgorithm(args)
{
   var newAlgo = "";
   //Concatenate the buffer
   for (var j = 0; j < args.length; j++)
   {
      if (j != 0)
	    newAlgo += ' ';
		
	  newAlgo += args[j];	
   }
   this.newAlgo = newAlgo;
   
   if(newAlgo === "rr")
		{
			_StdOut.putText("New scheduling algorithm is round robin.");
			krnTrace("Scheduling algorithm changed from " + _CPUScheduler.currentAlgorithm + " to rr");
			_CPUScheduler.setAlgorithm(newAlgo);	
		}
   else if (newAlgo === "priority")
		{
			_StdOut.putText("New scheduling algorithm is priority.");
			krnTrace("Scheduling algorithm changed from " + _CPUScheduler.currentAlgorithm + "to priority");
			rrq = Number.MAX_VALUE;
			_CPUScheduler.setAlgorithm(newAlgo);
		}
   else if (newAlgo === "fcfs")
		{
			_StdOut.putText("New scheduling algorithm is first come, first serve.");
			krnTrace("Scheduling algorithm changed from " + _CPUScheduler.currentAlgorithm + "to fcfs");
			rrq = Number.MAX_VALUE;
			_CPUScheduler.setAlgorithm(newAlgo);	
		}
   else
		_StdOut.putText("Invalid algorithm entered.");
		
		
   
}

//Added by Stuart
function shellGetAlgorithm(args)
{
	var currentAlgorithm = _CPUScheduler.getAlgorithm();
	_StdOut.putText("Current scheduling algorithm is " + currentAlgorithm);
}


var counter = 0;
//Added by Stuart
function shellWhat(args)
{
     //Switch
       switch(counter){
	     
		 case 0: _StdOut.putText("What country you from?");
		   break;
		 case 1: _StdOut.putText("\"What\" ain't no country I know! Do they speak Javascript");
				 _StdIn.advanceLine();
		         _StdOut.putText("in \"What?\"");
		   break;
		 case 2: _StdOut.putText("Javascript, zbgureshpxre! Do you speak it?");   
		   break;
	     default:
		   _StdOut.putText("Something went wrong.");
	   }
	   counter = counter + 1;
}

//Added by Stuart
function shellPossum(args)
{
    //Simulate BSOD
    _StdOut.putText("...you monster");
	_StdIn.advanceLine();
	_StdIn.advanceLine();
	_StdOut.putText("A problem has been detected and Lain has been shut-");
	_StdIn.advanceLine();
	_StdOut.putText("down to prevent damage to your internet browser");
	krnTrapError("This is a test");
}
