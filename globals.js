 /* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th editiion by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global Constants
//
var APP_NAME = "Lain OS";  // Better name found
var APP_VERSION = "0.2.1.12"

var CPU_CLOCK_INTERVAL = 100;   // in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ    = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority). 
                       // NOTE: The timer is different from hardware clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;  

var WRITE_TO_CONSOLE_IRQ = 2; //For when 6502 op codes call for output

var CONTEXT_SWITCH_IRQ = 3; //Context switch between processes

var IO_REQUEST_IRQ = 4;

var SYSTEM_CALL_IRQ = 5; //Actions dependent upon contents of CPU registers


//
// Global Variables
//
var _CPU = null;

var _OSclock = 0;       // Page 23.

var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

// TODO: Fix the naming convention for these next five global vars.
var CANVAS = null;              // Initialized in hostInit().
var DRAWING_CONTEXT = null;     // Initialized in hostInit().

var STATUS_BAR = null; 			// Initialized in hostInit();
var STATUS_BAR_CONTEXT = null;	// Initialized in hostInit();

var DEFAULT_FONT = "sans";      // Ignored, just a place-holder in this version.
var DEFAULT_FONT_SIZE = 13;     
var FONT_HEIGHT_MARGIN = 4;     // Additional space added to font size when advancing a line.

var CLOCK_X_LOCATION = 200;
var CLOCK_Y_LOCATION = 10; 

//RR Quantum 
var rrq = 6; //In clock pulses
var userRRQ;
var tempRRQ = 0;
var runAllBool = false;

//Page stats
var PAGE_SIZE = 256; 
var MAX_PAGES = 3;
var OCCUPIED_PAGES = 0;

//Hard drive division
var FSDD_TRACKS = 4;
var FSDD_SECTORS_PER_TRACK = 8;
var FSDD_BLOCKS_PER_SECTOR = 8;

//Track local storage
var isLocalStorage;

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

//Variable to track end of program execution
var check = false;

//Memory - Added by Stuart
var _CPU = null;
var _MMU = null;
var _MainMem = null;
var _MemoryAccessor = null;

var _ActiveProcess = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

//
// Global Device Driver Objects - page 12
//
var krnKeyboardDriver = null;

//PCB 
var DEFAULT_PRIORITY = 0;
var MAX_PRIORITY = 7; 
