const ABProcessElement = require("../../../platform/process/tasks/ABProcessElement.js");

var ABProcessTaskApprovalDefaults = {
    category: null,
    // category: {string} | null
    // if this Element should show up on one of the popup replace menus, then
    // specify one of the categories of elements it should be an option for.
    // Available choices: [ "start", "task", "end" ].
    //
    // if it shouldn't show up under the popup menu, then leave this null

    fields: ["who", "toUsers", "userFormID", "userFormResponse"],
    // fields: {array}
    // a list of internal setting values this Element tracks

    icon: "check-circle", // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'
    // icon: {string}
    // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'

    key: "Approval"
    // key: {string}
    // unique key to reference this specific Task
};

module.exports = class ABProcessTaskUserApprovalCore extends ABProcessElement {
    constructor(attributes, process, application) {
        attributes.type = attributes.type || "process.task.user.approval";
        super(attributes, process, application, ABProcessTaskApprovalDefaults);

        // listen
    }

    // return the default values for this DataField
    static defaults() {
        return ABProcessTaskApprovalDefaults;
    }

    static DiagramReplace() {
        return null;
    }

    fromValues(attributes) {
        /*
        {
            id: uuid(),
            name: 'name',
            type: 'xxxxx',
            json: "{json}"
        }
        */
        super.fromValues(attributes);

        ABProcessTaskApprovalDefaults.fields.forEach((f) => {
            this[f] = attributes[f];
        });
    }

    /**
     * @method toObj()
     *
     * properly compile the current state of this ABApplication instance
     * into the values needed for saving to the DB.
     *
     * Most of the instance data is stored in .json field, so be sure to
     * update that from all the current values of our child fields.
     *
     * @return {json}
     */
    toObj() {
        var data = super.toObj();

        ABProcessTaskApprovalDefaults.fields.forEach((f) => {
            data[f] = this[f];
        });

        return data;
    }

    ////
    //// Process Instance Methods
    ////

    /**
     * initState()
     * setup this task's initial state variables
     * @param {obj} context  the context data of the process instance
     * @param {obj} val  any values to override the default state
     */
    initState(context, val) {
        var myDefaults = {
            userFormID: null,
            userFormResponse: null
        };

        super.initState(context, myDefaults, val);
    }

    /**
     * processDataFields()
     * return an array of avaiable data fields that this element
     * can provide to other ProcessElements.
     * Different Process Elements can make data available to other
     * process Elements.
     * @return {array} | null
     */
    processDataFields() {
        // in this Task, we can return the Response to the UserForm
        return [
            {
                key: `${this.id}.userFormResponse`,
                label: `${this.label}->Response`
            }
        ];
    }

    /**
     * processData()
     * return the current value requested for the given data key.
     * @param {obj} instance
     * @return {mixed} | null
     */
    processData(instance, key) {
        var parts = key.split(".");
        if (parts[0] == this.id) {
            var myState = this.myState(instance);
            return myState[parts[1]];
        }
        return null;
    }
};
