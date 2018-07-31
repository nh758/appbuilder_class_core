/*
 * ABViewPage
 *
 * An ABView that represents a "Page" in the system.
 *
 * Pages are 
 *	- allowed to be displayed in the interface list
 *	- return a full list of components that can be added to the view editor
 * 
 *
 */

var ABViewContainer = require( "../../platform/views/ABViewContainer" );
var ABViewManager = require("../ABViewManager");

var ABDataCollection = require( "../../platform/ABDataCollection" );


// function L(key, altText) {
//     return AD.lang.label.getLabel(key) || altText;
// }


var ABViewDefaults = {
    key: 'page',		// unique key identifier for this ABView
    icon: 'file',		// icon reference: (without 'fa-' )
}

module.exports = class ABViewPageCore extends ABViewContainer {

    constructor(values, application, parent) {

        super(values, application, parent, ABViewDefaults);


        // 	{
        // 		id:'uuid',					// uuid value for this obj
        // 		key:'viewKey',				// unique key for this View Type
        // 		icon:'font',				// fa-[icon] reference for an icon for this View Type

        //		name: '',					// unique page name

        // 		label:'',					// pulled from translation

        //		settings: {					// unique settings for the type of field
        //		},

        //		translations:[]
        // 	}

        this.parent = null;  // will be set by the pageNew() that creates this obj.
    }


    static common() {
        return ABViewDefaults;
    }


    /**
     * @method toObj()
     *
     * properly compile the current state of this ABViewPage instance
     * into the values needed for saving to the DB.
     *
     * @return {json}
     */
    toObj() {

        var obj = super.toObj();

        obj.name = this.name;

        // set label of the page
        if (!this.label || this.label == '?label?')
            obj.label = obj.name;


        // compile our pages
        var pages = [];
        this._pages.forEach((page) => {
            pages.push(page.toObj())
        })
        obj.pages = pages;


        // compile our data sources
        var dataCollections = [];
        this._dataCollections.forEach((data) => {
            dataCollections.push(data.toObj())
        })
        obj.dataCollections = dataCollections;


        return obj;
    }



    /**
     * @method fromValues()
     *
     * initialze this object with the given set of values.
     * @param {obj} values
     */
    fromValues(values) {

        super.fromValues(values);

        // set label of the page
        if (!this.label || this.label == '?label?')
            this.label = this.name;


        // now properly handle our sub pages.
        var pages = [];
        (values.pages || []).forEach((child) => {
            pages.push(this.pageNew(child));  // ABViewManager.newView(child, this.application, this));
        })
        this._pages = pages;


        // now properly handle our data sources.
        var dataCollections = [];
        (values.dataCollections || []).forEach((data) => {
            dataCollections.push(this.dataCollectionNew(data));
        })
        this._dataCollections = dataCollections;


        // the default columns of ABView is 1
        this.settings.columns = this.settings.columns || 1;
        this.settings.gravity = this.settings.gravity || [1];

        // convert from "0" => 0

    }



    ///
    /// Pages
    ///


    /**
     * @method pages()
     *
     * return an array of all the ABViewPages for this ABViewPage.
     *
     * @param {fn} filter		a filter fn to return a set of ABViewPages that this fn
     *							returns true for.
     * @param {boolean} deep	flag to find in sub pages
     * 
     * @return {array}			array of ABViewPages
     */
    pages(filter, deep) {

        var result = [];

        // find into sub-pages recursively
        if (filter && deep) {

            if (this._pages && this._pages.length > 0) {

                result = this._pages.filter(filter);

                if (result.length < 1) {
                    this._pages.forEach((p) => {
                        var subPages = p.pages(filter, deep);
                        if (subPages && subPages.length > 0) {
                            result = subPages;
                        }
                    });
                }
            }

        }
        // find root pages
        else {

            filter = filter || function () { return true; };

            result = this._pages.filter(filter);

        }

        return result;

    }



    /**
     * @method pageNew()
     *
     * return an instance of a new (unsaved) ABViewPage that is tied to this
     * ABViewPage.
     *
     * NOTE: this new page is not included in our this.pages until a .save()
     * is performed on the page.
     *
     * @return {ABViewPage}
     */
    pageNew(values) {

        // make sure this is an ABViewPage description
        values.key = ABViewDefaults.key;

        // NOTE: this returns a new ABView component.  
        // when creating a new page, the 3rd param should be null, to signify 
        // the top level component.
        var page = this.application.viewNew(values, this.application, null);
        page.parent = this;
        return page;
    }





    ///
    /// Data sources
    ///

    /**
     * @method dataCollections()
     *
     * return an array of all the ABViewDataCollection for this ABViewPage.
     *
     * @param {fn} filter		a filter fn to return a set of ABViewDataCollection that this fn
     *							returns true for.
     * 
     * @return {array}			array of ABViewDataCollection
     */
    dataCollections(filter) {

        if (!this._dataCollections) return [];

        filter = filter || function () { return true; };

        return this._dataCollections.filter(filter);

    }


    /**
     * @method dataCollectionNew()
     *
     * return an instance of a new (unsaved) ABViewDataCollection that is tied to this
     * ABViewPage.
     *
     * NOTE: this new data source is not included in our this.dataCollections until a .save()
     * is performed on the page.
     *
     * @return {ABViewPage}
     */
    dataCollectionNew(values) {

        values = values || {};

        var dataCollection = new ABDataCollection(values, this.application, this);

        return dataCollection;
    }


    /**
     * @method urlView()
     * return the url pointer for views in this application.
     * @return {string} 
     */
    urlPage() {
        return this.urlPointer() + '/_pages/'
    }


    /**
     * @method urlPointer()
     * return the url pointer that references this view.  This url pointer
     * should be able to be used by this.application.urlResolve() to return 
     * this view object.
     * @return {string} 
     */
    urlPointer() {
        if (this.parent) {
            return this.parent.urlPage() + this.id;
        } else {
            return this.application.urlPage() + this.id;
        }
    }
    
}