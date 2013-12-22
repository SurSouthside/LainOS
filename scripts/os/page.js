/* ----------------------------------
   page.js
    
   Simulates pages for MMU and CPU scheduling
   Sort of a "wrapper" class to hold programs
	
   Added by Stuart
   ---------------------------------- */ 
   
function Page()
{
	//Properties
	this.p = new Array();
	this.maxSize = 0x0100;
}