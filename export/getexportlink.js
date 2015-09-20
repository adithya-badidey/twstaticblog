/*\
title: $:/plugins/welford/twstaticblog/export/get-export-link.js
type: application/javascript
module-type: macro
returns the formatted link tiddler to a tiddler
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "tv-get-export-link";

exports.params = [
];

var TAG_EXP_ATTR = "tag";
var POSTS_EXP_ATTR = "posts";
var INDEX_EXP_ATTR = "index";
var FRAMEWORK_EXP_ATTR = "framework";

var FRAMEWORK_TAG = "blog-framework";
var TAG_LINK_ATTR = "taglink";
var INDEX_POST = "index";

/*
Run the macro
*/
exports.run = function() {
	var title = this.to;
	var sanitized_title = title.replace(/([^a-z0-9]+)/gi, '-');
	var attr = this.getVariable("tv-subfolder-links");
	var path_to_root="./"	
	var finalLink=path_to_root
	//------------------------------------------------------
	//correcting the root location based on attribute type...
	//reference the folder stucture description above for more details

	//generic blog posts are 3 layers deep
	if(attr==POSTS_EXP_ATTR){
		path_to_root="../../../";
	}
	//autogenerated tag posts and framework stuff go in the same place for convenience [root]/tag/...
	else if(attr==TAG_EXP_ATTR){
		path_to_root="../";
	}
	//index.html and framework stuff are special and go in the root
	else if(attr==FRAMEWORK_EXP_ATTR || attr==INDEX_EXP_ATTR){
		path_to_root="./";
	}	

	//------------------------------------------------------
	//Using path_to_root generate the correct folder path to this post 
	//this can be based on the the presence of tags or attributes, as well as simply the link destincation
	//if we are a link to the index post....
	if(title==INDEX_POST){
		finalLink = path_to_root;
	}	
	else if(this.getAttribute(TAG_LINK_ATTR)){
		//if we are a link to a auto generated tag page
		finalLink = path_to_root+"tags/";
	}				
	else if($tw.wiki && title) {
		//links to anything else...
		var tiddler = $tw.wiki.getTiddler(title);
		if(tiddler){
			var created = tiddler.fields["created"];

			//KEEP THIS AND GET EXPORT PATH IN SYNC

			//create iso string gives us something like '2012-11-04T14:51:06.157Z'...split on T then on - to get out the data that we desire
			var tmp = created.toISOString().split("T")[0];
			var ymd = tmp.split("-");
			var fmt_created = ymd[0] + "/" + ymd[1] + "/" + ymd[2]; //in sync but for the trailing slash

			//var fmt_created = $tw.utils.formatDateString(created,"YYYY/MM/DD"); //this gives us local time, useless if we are exporting from different computers!

			finalLink = path_to_root + fmt_created + "/";
			//most posts will be in the place created above, but blog-framework tagged ones are in the root
			if(tiddler.fields.tags) {
				var p = tiddler.fields.tags.indexOf(FRAMEWORK_TAG);
				if(p !== -1) {
					finalLink = path_to_root;					
				}
			}
		}
	}
	var wikiLinkTemplateMacro = this.getVariable("tv-wikilink-template"),
		wikiLinkTemplate = wikiLinkTemplateMacro ? wikiLinkTemplateMacro.trim() : "#$uri_encoded$",
		wikiLinkText = wikiLinkTemplate.replace("$uri_encoded$",encodeURIComponent(sanitized_title));	
	wikiLinkText = wikiLinkText.replace("$uri_doubleencoded$",encodeURIComponent(sanitized_title));
	return (finalLink + wikiLinkText).toLocaleLowerCase();
};

})();