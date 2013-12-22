/* ----------------------------------
   tsb.js
   
   Interface to represent the track-sector-block 
   arrangement of the File System Device Driver
   ---------------------------------- */ 

//3-tuple interface to represent track-sector-block location on fsdd
function TSB(t, s, b)
{
	//Properties
	this.t = t //track
	this.s = s //sector
	this.b = b //block
	
	this.occupied = false;
	
	//Methods
	this.set = tsbSet;
	this.getNext = tsbGetNext;
	this.blank = tsbBlank;
	this.isRealLoc = tsbIsRealLoc;
	this.toString = tsbToString;
}

function tsbSet(t, s, b)
{
	this.t = t;
	this.s = s;
	this.b = b;
}

function tsbGetNext()
{
	var nextBlock = this.b + 1;
	var nextSector = this.s;
	var nextTrack = this.t;
	
	if(nextBlock > 7)
	{
		nextBlock = 0;
		nextSector = this.s + 1;
	}
	if(nextSector > 7)
	{
		nextSector = 0;
		nextTrack = this.t + 1;
	}
	if(nextTrack > 3)
	{
		nextTrack = 0;
	}
	var nextTSB = new TSB();
	nextTSB.set(nextTrack, nextSector, nextBlock);
	return nextTSB;
}

//Used for FSDD formatting
function tsbBlank()
{
	this.t = -1;
	this.s = -1;
	this.b = -1;
}

//Determines if location w/data actually exists on disk
function tsbIsRealLoc()
{
	return (this.t >= 0 && this.s >= 0 && this.b >= 0);
}

//HTML 5 only works with strings, so I believe this would make everything much easier
function tsbToString()
{
	return "" + this.t + this.s + this.b;
}