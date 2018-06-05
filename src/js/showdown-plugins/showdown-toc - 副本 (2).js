var $ = require("../jquery-3.1.1.js");
(function(){

	var toc = function(converter) {
		return [

			{
				type: 'output', 
				filter: function(source) {
					var elements = $(source);
					var output = [];
					// two simple stack to save all levels of TOC
					// index of TOCs in output
					var tocIds = [];
					// heading levels of items in corresponded TOC
					var headingLevels = [];
					var top = 0;
					for (var i=0; i<elements.length; i++) {

						var element = $(elements[i]);
						var results = null;

						// Does the element consist only of [toc]?
						// If so, we can replace this element with out list.
						if (element.text().trim()=='[toc]') {
							//element = $('<ol>',{'class':'showdown-toc'});
							element = $('<p>',{'class':'toc'});//Gary update,the [toc] element will use the output.push(element),then make :tocIds[top++] = output.length,and make the  tocIds[top] insert in output[]current tail
							//element = "";
							headingLevels[top] = null;
							tocIds[top++] = output.length;//gary注：在每个有toc标记的位置，记住当前数组的长度，使toc相应的内容能插在当前数组的最后(toc要插入的位置）。
						}
//Gary update,As I think should use [toc] as a line
/*
						// Does this item contain a [toc] with other stuff?
						// If so, we'll split the element into two 
						else if (results = element.text().trim().match(/^([\s\S]*?)((?:\\)?\[toc\])([\s\S]*)$/)) {

							// If there was a \ before the [toc] they're trying to escape it,
							// so return the [toc] string without the \ and carry on. For
							// some reason (I'm guessing a bug in showdown) you actually
							// appear to need two \ (\\) in order to get this to show up for
							// the filter. Leaving this code here anyway for now because it's
							// "the right thing to do"(tm).
							if (results[2][0]=='\\') {
								element.text(results[1]+results[2].substr(1)+results[3]);
							}

							// Otherwise start building a new table of contents.
							else {
								var before = null;
								var after = null;

								// Create two of the same element.
								if (element.prop('tagName')) {
									if (results[1].trim().length>0) {
										before = $('<'+element.prop('tagName')+'>').text(results[1]);
									}
									if (results[3].trim().length>0) {
										after = $('<'+element.prop('tagName')+'>').text(results[3]);
									}
								}

								// Otherwise if there's no tagName assume it's a text node
								// and create two of those.
								else {
									if (results[1].trim().length>0) {
										before = document.createTextNode(results[1]);
									}
									if (results[3].trim().length>0) {
										after = document.createTextNode(results[3]);
									}
								}

								// Our new table of contents container.
								toc = $('<ol>',{'class':'showdown-toc'});

								// If there was text before our [toc], add that in
								if (before) {
									output.push(before);
								}

								// Keep track of where our current table is in the elements array.
								tocIds[top] = output.length;

								// If there was text after, push the contents onto the array and
								// use the after part as our current element.
								if (after) {
									output.push(toc);
									element = after;
								}

								// Otherwise use the contents as the current element.
								else {
									element = toc;
								}

								// Reset the heading level - we're going to start looking for new
								// headings again
								headingLevels[top++] = null;

							}
						}
*/
						// If we've started a table of contents, but have nothing in it yet,
						// look for the first header tag we encounter (after the [toc]).
						// That's going to be what we use as contents entries for this table
						// of contents.
						else {
							for (var j = top - 1; j >= 0; j--) {
								if (tocIds[j] && !headingLevels[j] && element.prop("tagName")) {
									switch (element.prop("tagName")) {
										case 'H1':
										case 'H2':
										case 'H3':
										case 'H4':
										case 'H5':
										case 'H6':
											headingLevels[j] = parseInt(element.prop('tagName').substr(1));
											break;
									}
								}
							}
						} 
							

						// If we know what header level we're looking for (either we just
						// found it above, or we're continuing to look for more) then check to
						// see if this heading should be added to the contents.
						var levelFound = false;
						for (var j = top - 1; j >= 0; j--) {
							if (!tocIds[j]) {
								continue;
							}
							if (tocIds[j] && headingLevels[j]) {
								switch (element.prop('tagName')) {
									case 'H1':
									case 'H2':
									case 'H3':
									case 'H4':
									case 'H5':
									case 'H6':
										var thisLevel = parseInt(element.prop('tagName').substr(1));
										//if (thisLevel==headingLevels[j]) {
										if(true)//gary update,as I want all level
										{
											levelFound = true;
											var eleId=element.attr('id');
											var eleText=element.text();
											
											//Gary add,as want to display the level
											
											var liLevelEleStr='';
											var liLevelEleStr_start='';
											var liLevelEleStr_end='';
											for(var level_i=0;level_i<thisLevel;level_i++)
											{
                                               liLevelEleStr_start=liLevelEleStr_start+'<span class="toc" >';
                                               liLevelEleStr_end=liLevelEleStr_end+'</span>';  
											}
											liLevelEleStr=liLevelEleStr_start+'<a href=#'+element.attr('id')+'>'+element.text()+'</a>'+liLevelEleStr_end;
											output[tocIds[j]] = $(output[tocIds[j]]).append($(liLevelEleStr));
											//liLevelEleStr=liLevelEleStr+'<a>';
											//output[tocIds[j]] = $(output[tocIds[j]]).append($(liLevelEleStr),{href:'#'+element.attr('id'),text:element.text()});
											//output[tocIds[j]] = $(output[tocIds[j]]).append($(liLevelEleStr).append($('<a>',{href:'#'+element.attr('id'),text:element.text()})));
											
											//output[tocIds[j]] = $(output[tocIds[j]]).append($('<li>').append($('<a>',{href:'#'+element.attr('id'),text:element.text()})));
										}
										// If we move up in what would be the document tree
										// (eg: if we're looking for H2 and we suddenly find an
										// H1) then we can probably safely assume that we want
										// the table of contents to end for this section.
										else if (thisLevel<headingLevels[j]) {//gary update,and make don't run this
											top--;
										}
										break;
								}
								if (levelFound) {
									break;
								}
							}
						}
						
						// Push whatever element we've been looking at onto the output array.
						output.push(element);
					}//for (var i=0; i<elements.length; i++)
					// Build some HTML to return
					// Return it.
					//return $('<div>').append(output).html();
					var output_html=$('<p>').append(output).html();

					return output_html;
				}
			}

		];
	};

	// Client-side export
	if (typeof window !== 'undefined' && window.showdown && window.showdown.extension) { window.showdown.extension("showdown-toc",toc); }
	// Server-side export
	if (typeof module !== 'undefined') module.exports = toc;

}());

