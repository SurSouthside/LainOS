/* ------------
   statusBar.js   
   ------------ */
   
function statusBar(){
   
   //Properties
   this.CurrentFont      = DEFAULT_FONT;
   this.CurrentFontSize  = DEFAULT_FONT_SIZE;
   this.CurrentXPosition = 0; 
   this.CurrentYPosition = DEFAULT_FONT_SIZE;
   this.buffer = "";
   
   //TODO: change to label or textbox?

   //Methods
   this.init        = statusBarInit;
   this.clearScreen = statusBarClearScreen;
   this.resetXY     = statusBarResetXY;
   this.writeDate   = statusBarWriteDate;
   this.putStatus   = statusBarPutStatus;

}

function statusBarInit()
{
    statusBarClearScreen();
    statusBarResetXY();
}

function statusBarClearScreen()
{
	STATUS_BAR_CONTEXT.clearRect(0, 0, STATUS_BAR.width, STATUS_BAR.height);
}

function statusBarResetXY()
{
    this.CurrentXPosition = 0;
    this.CurrentYPosition = this.CurrentFontSize;    
}

function statusBarWriteDate(newDate){

   var newDate = new Date().toUTCString();
   STATUS_BAR_CONTEXT.drawText(this.CurrentFont, this.CurrentFontSize, CLOCK_X_LOCATION, CLOCK_Y_LOCATION, newDate);

}

function statusBarChangeStatus(newStatus){
 
   if(status.valueOf() != null)
   {
      statusBarClearScreen();
      STATUS_BAR_CONTEXT.drawText(this.CurrentFont, this.CurrentFontSize, 5, 5, newStatus);
     //STATUS_BAR_CONTEXT.clearRect(0,0, 200, STATUS_BAR.height);
     //this.putTextAtLocation(5, 5, newStatus);
   }

}