/*
 * ABFieldEmail
 *
 * An ABFieldEmail defines a boolean field type.
 *
 */

var ABField = require("../../platform/dataFields/ABField");


function L(key, altText) {
// TODO:
	return altText;  // AD.lang.label.getLabel(key) || altText;
}


var ABFieldEmailDefaults = {
	key: 'email', // unique key to reference this specific DataField

	icon: 'envelope',   // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'

	// menuName: what gets displayed in the Editor drop list
	menuName: L('ab.dataField.email.menuName', '*Email'),

	// description: what gets displayed in the Editor description.
	description: L('ab.dataField.email.description', '*Email fields are used to store email addresses.'),

	supportRequire: true

}


var defaultValues = {
	default: ""
}



module.exports = class ABFieldEmailCore extends ABField {
	constructor(values, object) {
		super(values, object, ABFieldEmailDefaults);

		// we're responsible for setting up our specific settings:
		for (var dv in defaultValues) {
			this.settings[dv] = values.settings[dv] || defaultValues[dv];
		}

		this.settings.default = values.settings.default || '';
	}

	// return the default values for this DataField
	static defaults() {
		return ABFieldEmailDefaults;
	}


	///
	/// Instance Methods
	///


	isValid() {

		var validator = super.isValid();

		// validator.addError('columnName', L('ab.validation.object.name.unique', 'Field columnName must be unique (#name# already used in this Application)').replace('#name#', this.name) );

		return validator;
	}





	///
	/// Working with Actual Object Values:
	///

	/**
	 * @method defaultValue
	 * insert a key=>value pair that represent the default value
	 * for this field.
	 * @param {obj} values a key=>value hash of the current values.
	 */
	defaultValue(values) {
		// if no default value is set, then don't insert a value.
		if (!values[this.columnName]) {

			// Set default string
			if (this.settings.default) {
				values[this.columnName] = this.settings.default;
			}

		}
	}


	/**
	 * @method isValidData
	 * Parse through the given data and return an error if this field's
	 * data seems invalid.
	 * @param {obj} data  a key=>value hash of the inputs to parse.
	 * @param {OPValidator} validator  provided Validator fn
	 * @return {array} 
	 */
	isValidData(data, validator) {

		if (data[this.columnName]) {

			var Reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			var value = data[this.columnName];
			value = String(value).toLowerCase();
			if (!Reg.test(value)) {

				validator.addError(this.columnName, 'Invalid email');

			}
		}

	}


}
