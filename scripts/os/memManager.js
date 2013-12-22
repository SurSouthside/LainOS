/* ----------------------------------
   memManager.js
   
   Requires globals.js
   
   The Memory Manager for the OS
   Maps the virtual address to the physical address
   
   Added by Stuart
   ---------------------------------- */ 
   
function MMU()
{
   //Keep track of memory occupied by programs and processes
   //Do we need "memory" any more, b/c dealing with pages?
   var openMemory = new Array();
   var takenMemory = new Array();
   
   
   var openPages = new Array();
   var takenPages = new Array();
   /*
   var pageBounds = new Array();//2d array, keeps track of page limits to prevent contamination
   
   this.pageLimit = 0x0080;
   this.pageSize = 0x0080;
   */
   
   this.baseAddr = 0x0000;
   this.limitAddr = 0x0000;
   
   //Methods
   this.setAddress = mmuSetAddress;
   this.allocateMemory = mmuAllocateMemory;
   this.loadProcess = mmuLoadProcess;
   
   
   
   //Keep track of occupied pages
   /*
   for (var k = 1; k <= pages; k++)
   {
     openPages.push(k); //All pages initially unoccupied
	 pageBounds[k] = new Array();
	 var pageEnd = pageBounds[k]["end"] = (PAGE_SIZE * k) - 1; 
	 var pageStart = pageBounds[k]["start"] = pageBounds[k]["end"] - (PAGE_SIZE - 1);
   }
   */
   
   
}

//Make base and limit address for given process based on occupied pages
function mmuSetAddress(pcb)
{
	if(OCCUPIED_PAGES != 3)
	{
		pcb.baseAddr = (PAGE_SIZE * OCCUPIED_PAGES);
		pcb.limitAddr = (((OCCUPIED_PAGES + 1) * PAGE_SIZE) - 1);
	}
}	
	
	/*
	var openPages = MAX_PAGES;
	
	var pages = openPages;
	
	switch(pages)
	{
		case 3:
			pcb.baseAddr = 0x0000;
			pcb.limitAddr = 0x007F;
			break;
		case 2:
			pcb.baseAddr = 0x0080;
			pcb.limitAddr = 0x00FF;
			break;
		case 1:
			pcb.baseAddr = 0x0100;
			pcb.limitAddr = 0x017F;
			break;(
		default:
			// Error
	}
	
	openPages--;
	*/
/*
  if(openPages.length == MAX_PAGES)
  {
	pcb.baseAddr = 0x0000;
	pcb.limitAddr = 0x0080;
  }
  else if (openPages.length < MAX_PAGES && openPages.length > 0)
  {
    pcb.baseAddr = pageStart * (openPages.length() - 1);
	pcb.limitAddr = pageEnd * (openPages.length() - 1);
  }
  else
  {
	//Throw error
  }
  */
  
  //openPages.pop();


function mmuAllocateMemory(codeBlock, pcb)
{
  //For i2 only since we are dealing with only one program?
  //Or make easily expandible by making program block class?

}

//Use MMU to load array of op codes into respective pages in memory
function mmuLoadProcess(program, pcb)
{
/*
  //Change the code into 6502 op codes and data
  var prgmByteCode = new Array();
  var byteString;
  for (var k = 0; k < program.length; k += 2)
    {
	  //Grab the opcode
	  byteString = program.substring(k, k + 2);
	  
	  prgmByteCode.push(parseInt(byteString, 16));
	}
	
  //Allocate the memory for the process	
  var memBlockForProcess = this.mmuAllocateMemory(prgmByteCode.length, pcb);
  
  return prgmByteCode;
  */
  
  this.setAddress(pcb);
  //Attempt to load process into memory
	  
	    for(var k = pcb.baseAddr; k < program.length + (OCCUPIED_PAGES * PAGE_SIZE); k++)
		{
		  _MemoryAccessor.writeTo(k, parseInt( program[k-pcb.baseAddr], 16 ) );
		}
		//Fill remainder of page with 00
		
		for(var j = program.length + (OCCUPIED_PAGES * PAGE_SIZE); j <= pcb.limitAddr; j++)
		{
		   _MemoryAccessor.writeTo(j, "00");
		}
		
  /*
		//Attempt to load process into memory
	  
	    for(var k = pcb.baseAddr; k < (program.length + (OCCUPIED_PAGES*PAGE_SIZE)); k++)
		{
		  _MemoryAccessor.writeTo(k, parseInt( program[k-pcb.baseAddr], 16 ) );
		}
		//Fill remainder of page with 00
		
		for(var j = (program.length + (OCCUPIED_PAGES*PAGE_SIZE)); j <= pcb.limitAddr; j++)
		{
		   _MemoryAccessor.writeTo(j, "00");
		}
		*/
}