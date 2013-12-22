/* ------------
   fsdd.js
   
   The File System Device Driver driver for the console.
   Thanks to C.J. McGregor for inspiration 
   ------------ */
   
DeviceDriverFSDD.prototype = new DeviceDriver;     // "Inherit" from prototype DeviceDriver in deviceDriver.js.
function DeviceDriverFSDD()                        // Add or override specific attributes and method pointers.
{
   // Override the base method pointers.
   this.driverEntry = fsddDriverEntry;
   this.isr = null;
   this.buffer = "";
   // "Constructor" code.
   
}  

function fsddDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
	var isLocalStorage = fsddIsLocalStorage();
	if(isLocalStorage)
	{
		this.status = "loaded";
		document.getElementById("storageLabel").value = "Local storage active.";
		localStorage.clear();
	}	
        		
    // More?
} 

//Checks to see if browser supports HTML5 local storage
function fsddIsLocalStorage()
{
	try {
	  return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

//For local storage manipulation
function fsddReadBlock(tsb, callback)
{
	//var targetURL = 
} 

//For local storage manipulation
function fsddWriteBlock(newData, tsb, callback)
{
	//var targetURL = 
}

function fsddReadBytes(tsb, callback)
{
	//var targetURL = 
}

function fsddWriteBytes(newData, tsb, callback)
{
	//var targetURL = 
}

