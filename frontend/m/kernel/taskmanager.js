/**
 * @class Ext.util.TaskRunner
 * Provides the ability to execute one or more arbitrary tasks in a multithreaded
 * if needed, you can create separate instances of TaskRunner.  Any number of
 * separate tasks can be started at any time and will run independently of each
 * other. Example usage:
 * <pre><code>
// Start a simple clock task that updates a div once per second
var updateClock = function(){
	Ext.fly('clock').update(new Date().format('g:i:s A'));
}
var task = {
	run: updateClock,
	interval: 1000 //1 second
}
var runner = new Ext.util.TaskRunner();
runner.start(task);

// equivalent using TaskManager
Ext.TaskManager.start({
	run: updateClock,
	interval: 1000
});

 * </code></pre>
 *
 * @constructor
 * @param {Number} interval (optional) The minimum precision in milliseconds supported by this TaskRunner instance
 * (defaults to 10)
 */
Ext.ns('Ext.util');

Ext.util.TaskRunner = function(interval) {
	interval = interval || 10;
	var tasks = [],
	removeQueue = [],
	id = 0,
	running = false,

	// private
	stopThread = function() {
		running = false;
		clearInterval(id);
		id = 0;
	},

	// private
	startThread = function() {
		if (!running) {
			running = true;
			id = setInterval(runTasks, interval);
		}
	},

	// private
	removeTask = function(t) {
		removeQueue.push(t);
		if (t.onStop) {
			t.onStop.apply(t.scope || t);
		}
	},

	// private
	runTasks = function() {
		var rqLen = removeQueue.length,
			now = new Date().getTime(),
			i;

		if (rqLen > 0) {
			for (i = 0; i < rqLen; i++) {
				Ext.Array.remove(tasks, removeQueue[i]);
			}
			removeQueue = [];
			if (tasks.length < 1) {
				stopThread();
				return;
			}
		}
		i = 0;
		var t,
			itime,
			rt,
			len = tasks.length;
		for (; i < len; ++i) {
			t = tasks[i];
			itime = now - t.taskRunTime;
			if (t.interval <= itime) {
				rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
				t.taskRunTime = now;
				if (rt === false || t.taskRunCount === t.repeat) {
					removeTask(t);
					return;
				}
			}
			if (t.duration && t.duration <= (now - t.taskStartTime)) {
				removeTask(t);
			}
		}
	};

	/**
	 * Starts a new task.
	 * @method start
	 * @param {Object} task <p>A config object that supports the following properties:<ul>
	 * <li><code>run</code> : Function<div class="sub-desc"><p>The function to execute each time the task is invoked. The
	 * function will be called at each interval and passed the <code>args</code> argument if specified, and the
	 * current invocation count if not.</p>
	 * <p>If a particular scope (<code>this</code> reference) is required, be sure to specify it using the <code>scope</code> argument.</p>
	 * <p>Return <code>false</code> from this function to terminate the task.</p></div></li>
	 * <li><code>interval</code> : Number<div class="sub-desc">The frequency in milliseconds with which the task
	 * should be invoked.</div></li>
	 * <li><code>args</code> : Array<div class="sub-desc">(optional) An array of arguments to be passed to the function
	 * specified by <code>run</code>. If not specified, the current invocation count is passed.</div></li>
	 * <li><code>scope</code> : Object<div class="sub-desc">(optional) The scope (<tt>this</tt> reference) in which to execute the
	 * <code>run</code> function. Defaults to the task config object.</div></li>
	 * <li><code>duration</code> : Number<div class="sub-desc">(optional) The length of time in milliseconds to invoke
	 * the task before stopping automatically (defaults to indefinite).</div></li>
	 * <li><code>repeat</code> : Number<div class="sub-desc">(optional) The number of times to invoke the task before
	 * stopping automatically (defaults to indefinite).</div></li>
	 * </ul></p>
	 * <p>Before each invocation, Ext injects the property <code>taskRunCount</code> into the task object so
	 * that calculations based on the repeat count can be performed.</p>
	 * @return {Object} The task
	 */
	this.start = function(task) {
		tasks.push(task);
		task.taskStartTime = new Date().getTime();
		task.taskRunTime = 0;
		task.taskRunCount = 0;
		startThread();
		return task;
	};

	/**
	 * Stops an existing running task.
	 * @method stop
	 * @param {Object} task The task to stop
	 * @return {Object} The task
	 */
	this.stop = function(task) {
		removeTask(task);
		return task;
	};

	/**
	 * Stops all tasks that are currently running.
	 * @method stopAll
	 */
	this.stopAll = function() {
		stopThread();
		for (var i = 0, len = tasks.length; i < len; i++) {
			if (tasks[i].onStop) {
				tasks[i].onStop();
			}
		}
		tasks = [];
		removeQueue = [];
	};
};

/**
 * @class Ext.TaskManager
 * @extends Ext.util.TaskRunner
 * <pre><code>
// Start a simple clock task that updates a div once per second
var task = {
	run: function(){
		Ext.fly('clock').update(new Date().format('g:i:s A'));
	},
	interval: 1000 //1 second
}
Ext.TaskManager.start(task);
</code></pre>
 * @singleton
 */
Ext.TaskManager = Ext.create('Ext.util.TaskRunner');
