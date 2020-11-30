// import ABApplication from "./ABApplication"
// const ABApplication = require("./ABApplication"); // NOTE: change to require()
const ABProcessTrigger = require("../../../platform/process/tasks/ABProcessTrigger.js");

var ABProcessTaskTriggerLifecycleDefaults = {
   category: "start",
   // category: {string} | null
   // if this Element should show up on one of the popup replace menus, then
   // specify one of the categories of elements it should be an option for.
   // Available choices: [ "start", "gateway", "task", "end" ].
   //
   // if it shouldn't show up under the popup menu, then leave this null

   fields: [
      "objectID",
      "lifecycleKey" /* , "triggerKey" is tracked in ABProcessTrigger */,
   ],
   // fields: {array}
   // a list of internal setting values this Element tracks

   icon: "key",
   // icon: {string}
   // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'

   key: "TriggerLifecycle",
   // key: {string}
   // unique key to reference this specific Task
};

module.exports = class ABProcessTriggerLifecycle extends ABProcessTrigger {
   constructor(attributes, process, AB) {
      attributes.type = attributes.type || "trigger";
      super(attributes, process, AB, ABProcessTaskTriggerLifecycleDefaults);

      // listen
   }

   // return the default values for this DataField
   static defaults() {
      return ABProcessTaskTriggerLifecycleDefaults;
   }

   static DiagramReplace() {
      return {
         label: "Object Lifecycle Trigger",
         actionName: "replace-with-signal-lifecycle-start",
         // type: {string} a unique key to reference this element
         className: "bpmn-icon-start-event-signal",
         target: {
            type: "bpmn:StartEvent",
            // type: {string} the general bpmn category
            //      "StartEvent", "Task", "EndEvent", "ExclusiveGateway"
            eventDefinitionType: "ab:SignalLifecycle",
         },
      };
   }

   fromValues(attributes) {
      super.fromValues(attributes);

      this.objectID = attributes.objectID || "objID.??";
      this.lifecycleKey = attributes.lifecycleKey || "lifecycle.key??";
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

      data.objectID = this.objectID;
      data.lifecycleKey = this.lifecycleKey;
      return data;
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
      var fields = null;
      if (this.objectID) {
         fields = [];
         var object = this.AB.objectByID(this.objectID);
         if (object) {
            var myID = this.diagramID;
            object.fields().forEach((field) => {
               fields.push({
                  key: `${myID}.${field.id}`,
                  label: `${this.label}->${object.label}->${field.label}`,
                  field,
                  object,
               });
            });
            fields.push({
               key: `${myID}.uuid`,
               label: `${this.label}->${object.label}`,
               field: null,
               object,
            });
         } else {
            // OK, so we have an this.objectID defined, but we can't find it.
            // that's something we need to alert:
            var error = new Error(
               `ABProcessTriggerLifecycleCore.processDataFields():TaskID[${this.id}]: could not find referenced object by ID [${this.objectID}]`
            );
            this.AB.error(error);
         }
      }
      return fields;
   }

   /**
    * processData()
    * return the current value requested for the given data key.
    * @param {obj} instance
    * @return {mixed} | null
    */
   processData(instance, key) {
      var parts = key.split(".");
      if (parts[0] == this.diagramID) {
         var myState = this.myState(instance);
         if (myState["data"]) {
            if (parts[1] === "uuid") {
               return myState["data"]["uuid"];
            } else {
               // parts[1] should be a field.id
               var object = this.AB.objectByID(this.objectID);
               var field = object.fields((f) => {
                  return f.id == parts[1];
               })[0];
               if (field) {
                  if (parts[2]) {
                     return field[parts[2]].call(field, myState["data"]);
                  } else {
                     // instance.context.data[field.column_name];
                     return myState["data"][field.columnName];
                  }
               }
            }
         }
      }
      return null;
   }

   /**
    * processDataObjects()
    * return an array of avaiable ABObjects that this element
    * can provide to other ProcessElements.
    * @return {array} | null
    */
   processDataObjects() {
      var objects = null;
      if (this.objectID) {
         objects = [this.AB.objectByID(this.objectID)];
      }
      return objects;
   }
};
