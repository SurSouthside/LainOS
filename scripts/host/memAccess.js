/* ----------------------------------
   memAccess.js
   
   Requires globals.js 
   
   The hardware Memory Accessor for the OS
   
   Provides intermediary access between main memory and CPU
   
   Added by Stuart, with inspiration from Joe Casey
   ---------------------------------- */ 
   
function MemoryAccessor()
{
   //For i2, since we are dealing with only one program
   this.baseAddr = 0x0000;
   this.limitAddr = 0x0000;   

    this.retrieveBaseAddr = maRetrieveBaseAddr;
	this.retrieveLimitAddr = maRetrieveLimitAddr;
    this.readFrom = maReadFrom;
	//this.writeToMain = maWriteToMain;
    this.writeTo = maWriteTo;
}   

//Gettor for base register
function maRetrieveBaseAddr()
{
   return this.baseAddr;
}

//Gettor for limit register
function maRetrieveLimitAddr()
{
   return this.limitAddr;
}

function maReadFrom(memLoc)
{
   var location = 0 + memLoc;
   if (location < this.baseAddr || location > this.limitAddr)
	{
		//krnTrace("Accessor out of bounds attempt");
		//krnTrapError("Invalid access on process");
		//_CPU.isExecuting = false;
	}
   
     return _MainMem.read(location + this.baseAddr);
   
}

/*function maWriteToMain(memLoc, data)
{
  var prgmByteCode = new Array();
  var byteString;
  
  for (var i = 0; i < data.length; i += 2)
  {
    byteString = data.substring(i, i+2);
	
	this.writeTo(i, byteString);
  }
  
}*/

function maWriteTo(memLoc, data)
{
	if (memLoc < this.baseAddr || memLoc > this.limitAddr)
	{
		//krnTrace("Accessor out of bounds attempt");
		//krnTrapError("Invalid access on process");
		//_CPU.isExecuting = false;
	}
	
      _MainMem.write(memLoc + this.baseAddr, data);
	
}