/* ------------
   Queue.js
   
   A simple Queue, which is really just a dressed-up Javascript Array.
   See the Javascript Array documentation at http://www.w3schools.com/jsref/jsref_obj_array.asp .
   Look at the push and shift methods, as they are the least obvious here.
   
   ------------ */
   
function Queue()
{
    // Properties
    this.q = new Array(); 

    // Methods
    this.getSize  = function()
    {
        return this.q.length;    
    }

    this.isEmpty  = function()
    {
        return (this.q.length == 0);    
    }
	
	//Since this queue is really an array, I feel this is valid
	this.get = function(index)
	{
		return this.q[index];
	}
	
	//Ditto, used with the kill shell command
	this.kill = function(index)
	{
		this.q.splice(index, 1);
		return this.q;
	}

    this.enqueue  = function(element)
    {
        this.q.push(element);        
    }
	
	this.enqueuePriority = function(element) //Make better if have time
	{
		if(_KernelPriorityQueue.getSize() == 0) //Empty queue
		{
			_KernelPriorityQueue.enqueue(element);
		}
		/*
		else //One or more elements already in queue
		{
			_KernelPriorityQueue.enqueue(element);
			_KernelPriorityQueue.sort(function (a,b) {return a.priority - b.priority});
		}
		*/
		else if(_KernelPriorityQueue.getSize() == 1) //One element already in queue
		{
			var target = _KernelPriorityQueue.get(0);
			if(target.priority < element.priority) //Greater number = lower priority
			{
				_KernelPriorityQueue.enqueue(element);
			}
			else //Priority of new process is higher (lower number)
			{
				var lower = _KernelPriorityQueue.dequeue(target);
				_KernelPriorityQueue.enqueue(element);
				_KernelPriorityQueue.enqueue(lower);
				return;
			}
		}
		else //Two elements already in queue
		{
				var highTarget = _KernelPriorityQueue.get(0);
				var lowTarget = _KernelPriorityQueue.get(1);
				
				if(highTarget.priority > element.priority) //Newest element has highest priority
				{
					//(Crudely) rearrange queue
					highTarget = _KernelPriorityQueue.dequeue(highTarget);
					lowTarget = _KernelPriorityQueue.dequeue(lowTarget);
					_KernelPriorityQueue.enqueue(element); //Highest priority = lowest number
					_KernelPriorityQueue.enqueue(highTarget); //Middle priority
					_KernelPriorityQueue.enqueue(lowTarget); //Lowest priority
				}
				else if (highTarget.priority < element.priority && lowTarget.priority > element.priority) //Newest element has middle priority
				{
					//(Crudely) rearrange queue
					highTarget = _KernelPriorityQueue.dequeue(highTarget);
					lowTarget = _KernelPriorityQueue.dequeue(lowTarget);
					_KernelPriorityQueue.enqueue(highTarget); //Highest priority = lowest number
					_KernelPriorityQueue.enqueue(element); //Middle priority
					_KernelPriorityQueue.enqueue(lowTarget); //Lowest priority
				}
				else //Newest element has lowest priority, so place at end of queue
				{
					_KernelPriorityQueue.enqueue(element);
				}
			
		}
		
		
	}
    
    this.dequeue  = function()
    {
        var retVal = null;
        if (this.q.length > 0)
        {
            retVal = this.q.shift();
        }
        return retVal;        
    }
    
    this.toString = function()
    {
        retVal = "";
        for (i in this.q)
        {
            retVal += "[" + this.q[i] + "] ";
        }
        return retVal;
    }    
}
