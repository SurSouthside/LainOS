/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document envorinment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th editiion by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function CPU()
{
    //Registers
    this.PC    = 0;     // Program Counter 
	this.ir    = 0;
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Zero flag (Think of it as "isZero".)
    this.isExecuting;
	
	this.loadPC = cpuLoadPC;
	//this.execute = cpuExecute;
	this.stepThrough = cpuStepThrough;
	this.halt = cpuHalt;
	this.fetchAddress = cpuFetchAddress;
	this.cycle = cpuCycle;
	//this.readNullTerminatedString = cpuReadNullTerminatedString;
	
	this.init = cpuInit;
	this.init();
	
}

//Prime CPU for programs
function cpuInit()
    { 
	    this.loadPC(0);
        this.isExecuting = false;  
    }
	
function cpuLoadPC(address)
{
  this.PC = address;
}


function cpuStepThrough(process)
{
     var opCode = _MemoryAccessor.readFrom(this.PC++);
	 this.ir = opCode;
	 //See which action to perform
	 
	    if (parseInt("A9", 16) == opCode) //Load accumulator with constant
		{
		  //Set accumulator
		  this.Acc = _MemoryAccessor.readFrom(this.PC++);
		}
	    else if (parseInt("AD", 16) == opCode) //Load accumulator from memory
		{
		  //Find load location
		  var loadTarget = this.fetchAddress();
		  //Read memory for new accumulator
		  this.Acc = _MemoryAccessor.readFrom(loadTarget);
		}
		else if (parseInt("8D", 16) == opCode) //Store accumulator in memory
		{
		   //Find store location
		   var storeTarget = this.fetchAddress();
		   //Write accumulator to store location
		   _MemoryAccessor.writeTo(storeTarget, this.Acc);
		}
		else if (parseInt("6D", 16) == opCode) //Add to accumulator with carry
		{
		  //Find load location
		  var loadTarget = this.fetchAddress();
		  //Perform addition on accumulator
		  this.Acc = this.Acc + _MemoryAccessor.readFrom(loadTarget);
		}
		else if (parseInt("A2", 16) == opCode) //Load x register with constant
		{
		  //Set x register
		  this.Xreg = _MemoryAccessor.readFrom(this.PC++);
		}
		else if (parseInt("AE", 16) == opCode) //Load x register from memory
		{
		  //Find load location
		  var loadTarget = this.fetchAddress();
		  //Set x register
		  this.Xreg = _MemoryAccessor.readFrom(loadTarget);
		}
		else if (parseInt("A0", 16) == opCode) //Load y register with constant
		{
		  //Set y register 
		  this.Yreg = _MemoryAccessor.readFrom(this.PC++);
		}
		else if (parseInt("AC", 16) == opCode) //Load y register from memory
		{
		  //Find load location
		  var loadTarget = this.fetchAddress();
		  //Set y register
		  this.Yreg = _MemoryAccessor.readFrom(loadTarget);
		}
		else if (parseInt("EA", 16) == opCode) //No op
		{
		  //Do nothing?
		}
		else if (parseInt("00", 16) == opCode) //Break
		{
		   //_CPU.isExecuting = false
		   this.halt(); 
			_ActiveProcess.updateState(pcbExecuted);
			simUpdatePCBPanel(_ActiveProcess);
		}
		else if (parseInt("EC", 16) == opCode) //Compare byte to Xreg, set Zreg if equal
		{
		  //Find load location
		  var loadTarget = this.fetchAddress();
		  //Retrieve data from memory
		  var byteData = _MemoryAccessor.readFrom(loadTarget);
		  //Compare data to x register, and set Z flag accordingly
		  if(this.Xreg == byteData) 
		     this.Zreg = 1;
		  else
             this.Zreg = 0;		  
		}
		else if (parseInt("D0", 16) == opCode) //Branch if Zreg = 0 (Branch not equal)
		{
		   //Retrieve data from memory
		   var branchLength = _MemoryAccessor.readFrom(this.PC++);
		   branchLength = branchLength.toString(16);
		   if(this.Zreg == 0)
		   {
		     var branchTarget = this.PC + parseInt(branchLength, 16);
			 //Check for out of bounds error
			 if(branchTarget > 0xFF)
			 {
			   branchTarget = branchTarget - 0x100;
			 }
			 this.PC = branchTarget;
		   }
		}
		else if (parseInt("EE", 16) == opCode) //Increment value of byte
		{
		  //Find load location
		  var loadTarget = this.fetchAddress();
		  //Retrieve data from load location
		  var changedByte = _MemoryAccessor.readFrom(loadTarget);
		  //Write incremeted byte back to memory
		  _MemoryAccessor.writeTo(loadTarget, ++changedByte);
		  
		}
		else if (parseInt("FF", 16) == opCode) //System call
		{
		  //Print contents of Y register to screen 
		   if(this.Xreg == 1) 
		   {
		     krnInterruptHandler(WRITE_TO_CONSOLE_IRQ, this.Yreg.toString()); 
		   }
			// _KernelInterruptQueue.enqueue(interrupt);
		  //Print out 00 terminated string stored at address in Y Register (Thanks to CJ McGregor)
		  else if(this.Xreg == 2)
		  {
		    var loadTarget = this.Yreg; //starting address of the string
			var str = ""; //Empty string to prime for concatentation
			var charValue = _MemoryAccessor.readFrom(loadTarget); //Retrieve first value
			while(charValue != 0) //String is null (00) terminated, so run until we encounter null
			{
			str += String.fromCharCode(charValue); //Convert int char code to actual string and append to our var
			charValue = _MemoryAccessor.readFrom(++loadTarget); //Get next value
			}
			_StdOut.putText(str); //print str out via std out
			//_Console.advanceLine();
			//_OsShell.putPrompt();
		  }  
		}
		else //Invalid opcode
		{
		  krnTrapError("Invalid opcode detected");
		}
   }


//Stop CPU
function cpuHalt()
{
   this.isExecuting = false;
}

/*Retrieve location for data storage
  Takes next two commands and combines them
  to form storage location
*/
function cpuFetchAddress()
{
  var littleEnd = _MemoryAccessor.readFrom(this.PC++);
  var bigEnd = _MemoryAccessor.readFrom(this.PC++);
  
 return ( bigEnd << 8 ) | littleEnd;
}

//Display registers in string format
function cpuToString(cpu)
{

   var cpuRegs = document.getElementById("cpuRegs");
		
   cpuRegs.innerHTML = "PC    IR    X    Y    ACC    Z";
   
   //While an array is slower, I find it easier to manage
   var cpuStats = new Array();

   cpuStats.push(cpu.PC.toString(16));
   cpuStats.push("\t" + "\t");  //These tabs don't appear to work
   cpuStats.push(cpu.ir.toString(16));
   cpuStats.push("\t" + "\t");
   cpuStats.push(cpu.Xreg.toString(16));
   cpuStats.push("\t" + "\t");
   cpuStats.push(cpu.Yreg.toString(16));
   cpuStats.push("\t" + "\t");
   cpuStats.push(cpu.Acc.toString(16));
   cpuStats.push("\t" + "\t");
   cpuStats.push(cpu.Zflag.toString(16));
   return cpuStats.toString();
}

 
    this.pulse = function()
    {
        // TODO: Do we need this?  Probably not.
    }
    
    function cpuCycle(process)
    {
	
        krnTrace("CPU cycle");
	    if (this.isExecuting = true)
	    {
			//Move context switching here?
			
		   _CPU.stepThrough(process);
		   //tempRRQ++;
		   /*
		   var specRRQ;
		   
		   //Change rrquantum based on user specification
		   if(typeof USER_RRQ == "undefined")
		   {
				specRRQ = DEFAULT_RRQ;
		   }
		   else
		   {
				specRRQ = USER_RRQ;
		   }
		   */
		   
		   //TODO: Move to scheduler
		   //_CPUScheduler.schedule();
		   /*
		   if(tempRRQ === rrq && runAllBool && !_KernelReadyQueue.isEmpty())
			{
			   krnTrace("Initiating context switch");
			   krnInterruptHandler(CONTEXT_SWITCH_IRQ, process);	
			   //process = _CPUScheduler.contextSwitch();
			   tempRRQ = 0;
			}
			*/
	    }
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do real work here. Set this.isExecuting appropriately.
    }
