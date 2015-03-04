angular.module("customDirectives",[])
	.directive("shownotes", function(){
		return {
			link: function(scope,element,attrs) {
				element.bind('click', function(){

					$('.note-box').removeClass('active');
					element.children().addClass('active');
					
				})
			}
		}
	})
	.directive("removenotes", function(){
		return {
			link: function(scope,element,attrs) {
				element.bind('click', function(event){
					event.stopPropagation();
					element.removeClass('active');
					
				})
			}
		}
	})
	.directive("otcScripts", function() {
	 
	    var updateScripts = function (element) {
	        return function (scripts) {
	            element.empty();
	            angular.forEach(scripts, function (source, key) {
	                var scriptTag = angular.element(
	                    document.createElement("script"));
	                source = "//@ sourceURL=" + key + "\n" + source;
	                scriptTag.text(source)
	                element.append(scriptTag);
	            });
	        };
	    };
	 
	    return {
	        restrict: "EA",
	        scope: {
	          scripts: "=" 
	        },
	        link: function(scope,element) {
	            scope.$watch("scripts", updateScripts(element));
	        }
	    };
	});	