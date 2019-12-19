const ABProcessTask = require("../../../platform/process/tasks/ABProcessTask.js");

var ABProcessTaskEndDefaults = {
    key: "End", // unique key to reference this specific Task
    icon: "stop" // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'
};

module.exports = class ABProcessTaskEndCore extends ABProcessTask {
    constructor(attributes, process, application) {
        super(attributes, process, application, ABProcessTaskEndDefaults);

        // listen
    }

    // return the default values for this DataField
    static defaults() {
        return ABProcessTaskEndDefaults;
    }

    static DiagramReplace() {
        return {
            label: "Terminate End Event",
            actionName: "replace-with-terminate-end",
            className: "bpmn-icon-end-event-terminate",
            target: {
                type: "bpmn:EndEvent",
                eventDefinitionType: "bpmn:TerminateEventDefinition"
            }
        };
    }

    /**
     * do()
     * this method actually performs the action for this task.
     * @param {obj} instance  the instance data of the running process
     * @return {Promise}
     *      resolve(true/false) : true if the task is completed.
     *                            false if task is still waiting
     */
    // do(instance) {
    //     return new Promise((resolve, reject) => {
    //         // An End Event doesn't perform any other actions
    //         // than to signal it has successfully completed.
    //         // But it provides no Additional Tasks to work on.
    //         // for testing:
    //         this.stateCompleted(instance);
    //         this.log(instance, "End Event Reached");
    //         resolve(true);
    //     });
    // }

    /**
     * initState()
     * setup this task's initial state variables
     * @param {obj} context  the context data of the process instance
     * @param {obj} val  any values to override the default state
     */
    initState(context, val) {
        var myDefaults = {
            triggered: false
        };

        super.initState(context, myDefaults, val);
    }

    /**
     * nextTasks()
     * return the next tasks to be run after this task is complete.
     * @param {obj} instance  the instance data of the running process
     * @return {Promise}
     *      resolve([])
     */
    nextTasks(instance) {
        // I'm an End Event.  There are no nextTasks()
        return [];
    }
};