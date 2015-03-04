angular.module("customFilters",[])
	.filter('zeroToDash',function()
	{
		return function(value, mode){
			
			if(mode == "percentage")
			{
				return (value == "0" || value == "") ? "-" : value + "%";
			}
			else
			{
				return (value == "0" || value == "") ? "-" : value;
			}	

		}
	})
	.filter('convertPCT', function(){
		return function(items, state){
			var values = [];
			var lightswitch = true;
			if(angular.isArray(items))
			{
				for(var i=0; i < items.length; i++)
				{
					if(lightswitch && items[i].data != "")
					{
						var isStartingYear = i;
						lightswitch = false;
					}
					
					if(i > isStartingYear)
					{
						//(currentyear - lastyear) / lastyear * 100 rounded to nearest 1
						var currentYear = items[i].data;
						var lastYear = items[i-1].data;

						var formula_calculation = ((currentYear - lastYear) / lastYear * 100).toFixed(1);


						values.push( formula_calculation );
						
					}
					else
					{
						values.push(0);
					}
				}
				return values;

			}
			else
			{
				return items;
			}

		
		}
	});