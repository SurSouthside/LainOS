/* ----------------------------------
   memSim.js
   
   Requires globals.js 
   
   The hardware Memory Simulation for the OS
   
   Added by Stuart
   ---------------------------------- */ 
   
function MainMemory()
{
  this.memory = new Array();
  
  this.length = 0x0300;
  
  this.read = readFromMem;
  this.write = writeToMem;
}

function readFromMem(location)
{
   var selectedData = this.memory[location];
   return selectedData;
}

function writeToMem(location, data)
{
   this.memory[location] = data;
}