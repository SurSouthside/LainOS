/* ------------
   fsdd.js
   
   The File System Device Driver for the console.
   Thanks to C.J McGregor for inspiration
   ------------ */   
   
function FileSystemDeviceDriver()
{
	//FSDD Locations
	var FSDD_NAME_START = new TSB(0,0,0);
	var FSDD_NAME_END = new TSB(0,7,7);
	var FSDD_DATA_START = new TSB(1,0,0);
	var FSDD_DATA_END = new TSB(3,7,7);
	
	this.buffer = "";
	this.validLoc = null;
	
	//File methods
	this.createFile = fsddCreateFile;
	this.readFile = fsddReadFile;
	this.writeFile = fsddWriteFile;
	this.deleteFile = fsddDeleteFile;
	this.list = fsddList;
	
	//Callback methods
	this.createFileCallback = fsddCreateFileCallback;
	this.readFileCallback = fsddReadFileCallback;
	this.writeFileCallback = fsddWriteFileCallback;
	this.deleteFileCallback = fsddDeleteFileCallback;
	this.listCallback = fsddListCallback;
	
	//Driver methods
	this.format = fsddFormat;
	this.getNextOpenBlock = fsddGetNextOpenBlock;
	this.chainBlocks = fsddChainBlocks;
	this.findFilename = fsddFindFilename;
	this.searchFilename = fsddSearchFilename;
	this.retrieveFilenames = fsddRetrieveFilenames;
	this.getFirstFilename = fsddGetFirstFilename;
	this.readData = fsddReadData;
	this.writeData = fsddWriteData;
	this.parseNewData = fsddParseNewData;
	
	//Process methods
	this.rollIn = fsddRollIn;
	this.rollOut = fsddRollOut;
	this.parseRollInData = fsddParseRollInData;
	this.parseRollOutData = fsddParseRollOutData;
	
	
}  

function fsddCreateFile(filename)
{ 
	var successful = false;
	//Helper function to find if name does not already exist 
	var targetLoc = this.findFilename(filename, false);
	
	if(targetLoc != null)
	{
		localStorage.setItem(targetLoc, filename);
		successful = true;
		return successful;
	}
		
}

function fsddCreateFileCallback()
{
	
}

function fsddReadFile(filename)
{
	//Prime new data
	this.buffer = "";
	var successful = false;
	var filename = filename;
	//Helper function to find if name does not already exist 
	var targetLoc = this.searchFilename(filename);

	if(targetLoc != null)
	{
		var data = this.readData(targetLoc);
		if(data != null)
		{
			successful = true;
			return [successful, data]; 
		}
	}

}

function fsddReadFileCallback()
{

}

function fsddWriteFile(filename, newdata)   
{
	//Create array
	var successful = false;
	var newdata = newdata;
	var filename = filename;
	//Eliminate spaces
	//writtenData = writtenData.replace(" ", "");
	//Helper function to find if name does not already exist 
	var targetName = this.searchFilename(filename);
	//JSON.Stringify

	if(targetName != null)
	{
		var writeBlock = this.getNextOpenBlock();
		if(writeBlock != null)
		{
			localStorage.setItem(targetName, writeBlock);
			var dataBlocks = this.parseNewData(newdata);
			//if(dataBlocks.length > 1)
				//this.chainBlocks(dataBlocks, false);
			var successful = this.writeData(writeBlock, dataBlocks);
			return successful;
			//localStorage.setItem(writeBlock, occupiedBlocks[0]);
		}
	}
}

function fsddWriteFileCallback()
{

}

function fsddDeleteFile(filename)
{
	var successful = false;
	var chainedLoc;
	var targetLoc = this.findFilename(filename, true);
	
	if(targetLoc != null)
	{
		successful = this.chainBlocks(targetLoc, null, false, true);	
	}
	
	return successful;
}

function fsddDeleteFileCallback()
{

}

function fsddList()
{
	/*
	var startLoc = new tsb();
	startLoc.set(FSDD_NAME_START);
	_KernelFileSystemDeviceDriver.buffer = "";
	
	//krnFSDD.readBlock(startloc
	*/
	
	var filenames = this.retrieveFilenames();
	return filenames;
}

function fsddListCallback()
{
	var filenames = _KernelFileSystemDeviceDriver.buffer;
	//var 
}

//Reset HDD 
function fsddFormat()
{
	var tempTSB = new TSB();
	//localStorage.clear() would work if not for pesky MBR
	for(var k = 0; k < FSDD_TRACKS; k++) //4
	{
		for(var j = 0; j < FSDD_SECTORS_PER_TRACK; j++) //8
		{
			for(var i = 0; i < FSDD_BLOCKS_PER_SECTOR; i++) //8
			{
				//Overwriting the master boot record is something I would try to avoid
				if((k === 0 && j === 0 && i === 0))
					continue;
				
					tempTSB.set(k, j, i);
					var key = tempTSB.toString();
					localStorage.remove(key);
				
			}
		}
	}
	
	var success = true;
	return true;
}

//Used for file writing
function fsddGetNextOpenBlock()
{
	var storedData;
	var dataLoc = null;
	this.validLoc;
	var tempTSB = new TSB();
	tempTSB.set(1,0,0);

	while(storedData == null)
	{
		storedData = localStorage.getItem(tempTSB.toString());
		if(!tempTSB.occupied)
		{
			validLoc = tempTSB.toString();
			return validLoc;
		}
		tempTSB = tempTSB.getNext();
	}
} 


//Utility function to insure that specified file exists. Used for creation and deletion
function fsddFindFilename(filename, areDeleting)
{
	var storedName;
	var nameLoc = null;
	this.validLoc;
	//var startLoc = new TSB();
	var tempTSB = new TSB();
	tempTSB.set(0,0,1);
	//startLoc.set(FSDD_NAME_START);
	
	if(!areDeleting)
	{
		while(typeof storedName == "undefined")
		{
			if(!tempTSB.occupied && localStorage.getItem(tempTSB.toString()) == null)
			{
				tempTSB.occupied = true;
				validLoc = tempTSB.toString();
				return validLoc;
			}
			tempTSB = tempTSB.getNext();
		}
	}
	else
	{
			validLoc = tempTSB.toString();
			var targetName = localStorage.getItem(validLoc) ;
			if(targetName = filename)
			{
				//validLoc = tempTSB.toString();
				return validLoc;
			}
			tempTSB.getNext();
		
	}
}

//Utility function to insure that specified file exists. Used for reading and writing
function fsddSearchFilename(filename)
{
	var targetName;
	var nameLoc = null;
	var tempTSB = new TSB();
	tempTSB.set(0,0,1);
	
	while (typeof targetName == "undefined")
	{
		var file = localStorage.getItem(tempTSB.toString());
		if(file == filename)
		{
			nameLoc = tempTSB.toString();
			targetName = localStorage.getItem(nameLoc);
			return targetName;
		}
		tempTSB = tempTSB.getNext();
	}
}

//Searches through data track for filenames for ls command
function fsddRetrieveFilenames()
{
	var buffer = ""; 
	var areFilenames = false;
	var tempTSB = new TSB();
	tempTSB.set(0, 0, 1);
	var validLoc = tempTSB.toString();
	
	//Decided to use a priming read
	var name = localStorage.getItem(validLoc);
	if(name != null)
	{
		name = name.toString();
		buffer += name;
		buffer += " "; //Concatenate
		areFilenames = true;
	}

	tempTSB = tempTSB.getNext(); 
	
	while(areFilenames) //Iterate through track until empty block found
	{
		validLoc = tempTSB.toString();
		var name = localStorage.getItem(validLoc);
		if(name == null) //Once last file is found
		{
			areFilenames = false;
			return buffer; //Return what is present
		}
		name = name.toString();
		buffer += name;
		buffer += " ";
		//areFilenames = true;
		tempTSB = tempTSB.getNext();
	}
}

//Used during roll in to start placing process from disk in memory
function fsddGetFirstFilename()
{
	var filename;
	var tempTSB = new TSB();
	tempTSB.set(0,0,1); //First block for filenames
	var validLoc = tempTSB.toString();
	var name = localStorage.getItem(validLoc);
	
	if (name != null) //First check
		return name;
		
	else //Iterate until a file is found
	{
		while (name = null)
		{
			tempTSB = tempTSB.getNext();
			validLoc = tempTSB.toString()
			name = localStorage.getItem(validLoc);
		}
		
		return name;
	}
}
	
//Given a location, returns data(with chaining);
function fsddReadData(location)
{	
	var targetBlock;
	var tsb = location;
	var targetData;
	var chainedData;
	targetBlock = localStorage.getItem(location);
	
	if(targetBlock != null)
	{
		tsb = targetBlock.toString();
		targetData = localStorage.getItem(tsb);
		//var dataArray = new Array();
		//dataArray.push(targetData);
		chainedData = this.chainBlocks(tsb, targetData, true, false);
		return chainedData;
	}
}


//Receives tsb of first block and array of data to write (through chaining)
function fsddWriteData(location, data)
{
	 var success;
	 //if(data.length > 1)
	 success = this.chainBlocks(location, data, false, false);
	 //No need to chain if fits within one block	
	 //localStorage.setItem(location, data);
	 return success;
	 /*
	 if(localStorage.setItem(location, data))
	 {
		success = true;
		return success;
	 }
	 else
	 {
		success = false;
		return success;
	 }
	 */
}

//Bounce through local storage to either distribute array of data to write or compile array of data to read or delete filename and associated data
function fsddChainBlocks(location, data, areReading, areDeleting)
{
	//var nextBlock;
	var successful;
	var target = location;
	var tempTSB = new TSB();
	var nextTSB;
	var readData = new Array();
	if(areDeleting)
	{
		target = localStorage.getItem(location);
		//localStorage.removeItem(target);
	    while(target != null)
	    {
			//TODO: Fix this, including deletion of filename to tsb of first block of data
			localStorage.removeItem(location);
			target = localStorage.getItem(target);
			if(target == null)
			{
				successful = true;
				return successful;
			}	
			var tsb = target.split(""); //Split tsb to prepare for actual tsb
			tempTSB.set(parseInt(tsb[0]), parseInt(tsb[1]), parseInt(tsb[2]));
			nextTSB = tempTSB.getNext();
			localStorage.removeItem(target);
			target = nextTSB.toString(); //Local storage is string-only
	    }
	  
	  successful = true;
	  return successful;
	}
	else if(areReading && !areDeleting) //Reading-The first element of the array is the key whose value is the tsb which is the key to the next segment of data
	{
		readData = readData.concat(data);
		var tsb  = location.split("");
		tempTSB.set(parseInt(tsb[0]), parseInt(tsb[1]), parseInt(tsb[2]));
		nextTSB = tempTSB.getNext();
		data = nextTSB.toString();
		var nextData = localStorage.getItem(data.toString());
		while(nextData != null)
		{
			readData = readData.concat(nextData);
			nextTSB = nextTSB.getNext();
			data = nextTSB.toString();
			nextData = localStorage.getItem(data);
			/*
			data = localStorage.getItem(location);
			
			readData = readData.concat(data); //Place first slice of program into array
			readData = readData.concat(nextData);
			
			nextData = localStorage.getItem(nextData); //The TSB value paired with first data key
			nextData = localStorage.getItem(nextData); //The next data value paired with TSB;
			readData = readData.concat(nextData); //Piece together entireity of program
			*/
		}
		//readData = readData.concat(data);
		return readData;
	}
	else if(!areReading && !areDeleting) //Writing-The array will be spread out over the tracks, creating keys through the next tsb
	{
		for(var k = 0; k < data.length; k++) //Iterate over array of data and assign to TSB
		{
			//TODO: Check for presence of data
			localStorage.setItem(target, data[k]); //Store first item
			var tsb = target.split(""); //Split tsb to prepare for actual tsb
			tempTSB.set(parseInt(tsb[0]),parseInt(tsb[1]),parseInt(tsb[2])); //Create next tsb 
			nextTSB = tempTSB.getNext(); //Find next tsb
			target = nextTSB.toString(); //Local storage is string-only
			
		}
		successful = true;
		return successful;
	}
}

var dataArray = new Array();
//Parses data to fit into size of fsdd block
function fsddParseNewData(data)
{
	var data = data.toString();
	var size = data.length;	
	var parsedData;
	var remainingData;

	if(size < 120) //If only takes up one block
	{
		dataArray.push(data);
		return dataArray;
	}	
	else{
	  for (var k = 120; k < size; k = k+120) //Slice data to fit into block size
	  {
		//60 bytes = 120 hex characters
		if(k % 120 == 0) //Do I need this if already checking every 120 characters? (Yet, redundancy can reduce errors)
		{
			//Take characters out of original string
			//Or splice?
			parsedData = data.substring(0, k-1);
			remainingData = data.substring(k);
			dataArray.push(parsedData);
			//Call recursively with remainder of data
			this.parseNewData(remainingData);
			
		}
	  }
	}

	return dataArray;

	
}

//Swaps process from memory to disk
function fsddRollOut(process)
{
	var successful; 
	var data;
	var filename = process.pid.toString();
	successful = this.createFile(filename);
	if(successful)
	{
		//Concatenate code into one long string
		data = this.parseRollOutData();
		//Write data to disk
		var success = this.writeFile(filename, data);
		if(success)
		{
			//Reset memory to make room for process from disk
			for(var i = process.baseAddr; i <= process.limitAddr; i++)
			{
				_MemoryAccessor.writeTo(i, "00"); 
			}
		}
	}
}

//Swaps process from disk to memory
function fsddRollIn(process)
{
	var successful;
	var data; 
	var filename = this.getFirstFilename();
	successful = this.readFile(filename); //Semi-redundant here
	
	if(successful[0] = true)
	{
		data = successful[1].toString(); //Convert data to string
		var pid = krnLoadProgramIntoMem(data, DEFAULT_PRIORITY);
		krnRunProcess(pid);
	}
	
}

//Prepares the process stored in memory to be written to disk
function fsddParseRollOutData()
{
	//_MemoryAccessor.baseAddr = 0;
	var buffer = "";
	for(var j = 0; j < PAGE_SIZE; j++)
	{
		var byteOfProcess = _MemoryAccessor.readFrom(j);
		byteOfProcess = byteOfProcess.toString(16); //Convert to base 16 for 6502 op code prep
		buffer += byteOfProcess; 
	}
	
	return buffer;
}

//Prepares the process stored on disk to be written to memory
//Do I need this?
function fsddParseRollInData()
{
	
}


   