/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function Console()
{   
    //Canvas properties
	this.width = CANVAS.width;
	this.height = CANVAS.height;
    
    this.CurrentFont      = DEFAULT_FONT;
    this.CurrentFontSize  = DEFAULT_FONT_SIZE;
    this.CurrentXPosition = 0; 
    this.CurrentYPosition = DEFAULT_FONT_SIZE;
    this.buffer = "";
	
    
    // Methods
    this.init        = consoleInit;
    this.clearScreen = consoleClearScreen;
    this.resetXY     = consoleResetXY;
    this.handleInput = consoleHandleInput;
    this.putText     = consolePutText;
    this.advanceLine = consoleAdvanceLine;
}

function consoleInit()
{
    consoleClearScreen();
    consoleResetXY();
}

function consoleClearScreen()
{
	DRAWING_CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

function consoleResetXY()
{
    this.CurrentXPosition = 0;
    this.CurrentYPosition = this.CurrentFontSize;    
}

function consoleHandleInput()
{
    while (_KernelInputQueue.getSize() > 0)
    {
        // Get the next character from the kernel input queue.
        var chr = _KernelInputQueue.dequeue();
        // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
        // Check to see if the user wanted to confirm the command
		if (chr == String.fromCharCode(13))  //     Enter key   
        {
            // The enter key marks the end of a console command, so ...
            // ... tell the shell ... 
            _OsShell.handleInput(this.buffer);
            // ... and reset our buffer.
            this.buffer = "";
        }
		// Check to see if the user wanted to delete the last character entered
		else if (chr == String.fromCharCode(8)) // Backspace key
		{
		   //alert("Backspace pressed");
		   //Check for empty string
		   
		      //Account for pesky off by 1 errors
		      var commandLength = this.buffer.length;
			  commandLength = commandLength - 1;
			  //alert(commandLength);
			  
			  //Obtain the last character entered into the string
			  var erasedChar = this.buffer.charAt(commandLength);
			  //alert(erasedChar);
			  
			  //Create a new string 
			  var freshString = "";
			  var k = 0;
			  
			  //Load the previous string into the new string minus the last character
			  for (k = 0; k < commandLength; k++)
			  { 
				freshString = freshString + this.buffer.charAt(k);
				//alert(freshString);
			  }
			  this.buffer = freshString;
			  //alert(freshString);
			  
			  //Calculate new cursor position 
			  var newCursorPos = DRAWING_CONTEXT.measureText(this.CurrentFont, this.CurrentFontSize, erasedChar);
			  this.CurrentXPosition = this.CurrentXPosition - newCursorPos;
			  
			  //Erase the character
			  DRAWING_CONTEXT.clearRect(this.CurrentXPosition, 
                (this.CurrentYPosition - this.CurrentFontSize), 
                    newCursorPos, (this.CurrentFontSize + FONT_HEIGHT_MARGIN)); 
			  
		}
        // TODO: Write a case for Ctrl-C.
        else
        {
            // This is a "normal" character, so ...
            // ... draw it on the screen...
            this.putText(chr);
            // ... and add it to our buffer.
            this.buffer += chr;
        }
    }
}

function consolePutText(txt)    
{
    // My first inclination here was to write two functions: putChar() and putString().
    // Then I remembered that Javascript is (sadly) untyped and it won't differentiate 
    // between the two.  So rather than be like PHP and write two (or more) functions that
    // do the same thing, thereby encouraging confusion and decreasing readability, I 
    // decided to write one function and use the term "text" to connote string or char.
    if (txt != "")
    {
        // Draw the text at the current X and Y coordinates.
        DRAWING_CONTEXT.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, txt);
    	// Move the current X position.
        var offset = DRAWING_CONTEXT.measureText(this.CurrentFont, this.CurrentFontSize, txt);
        this.CurrentXPosition = this.CurrentXPosition + offset;    
    }
}

//Thanks to Joe Bedell for his idea and reference to his code
function consoleAdvanceLine()
{
    this.CurrentXPosition = 0;
	
	if( (CANVAS.height - this.CurrentYPosition) < (DEFAULT_FONT_SIZE + FONT_HEIGHT_MARGIN)) //Reached border of canvas
	{
	  var topLine = DRAWING_CONTEXT.getImageData(0, DEFAULT_FONT_SIZE + FONT_HEIGHT_MARGIN, CANVAS.width, CANVAS.height - (DEFAULT_FONT_SIZE + FONT_HEIGHT_MARGIN)); //Capture current text
	  this.clearScreen();
	  DRAWING_CONTEXT.putImageData(topLine, 0, 0); //Redraw text from top of canvas
	}
	else
	  this.CurrentYPosition += DEFAULT_FONT_SIZE + FONT_HEIGHT_MARGIN;
	//TODO: handle scrolling
	/*if(this.CurrentYPosition >= CANVAS.height )
{
this.scrollDown(1);
/*var numLines = 1;
DRAWING_CONTEXT.scrollDown(numLines);
this.CurrentYPosition -= (DEFAULT_FONT_SIZE + FONT_HEIGHT_MARGIN)*numLines;*/
} 
    
/*function consoleScrollDown(numLines)
{
DRAWING_CONTEXT.scrollDown(numLines);
this.CurrentYPosition -= (DEFAULT_FONT_SIZE + FONT_HEIGHT_MARGIN)*numLines;
} */


