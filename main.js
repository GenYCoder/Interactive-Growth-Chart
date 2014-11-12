angular.module("myApp",["customFilters","customDirectives"])
	.constant("csvData", "Model/fakedata.csv")
	.controller("mainController", function($scope, $filter, csvData)
	{

		var selectedRegion = "Combined";
		var selectedCategory = "or-cases";
		var masterModel = null;
		var setChartBool = false;
		$scope.scripts = [];


		var code = "var graph = Morris.Bar({element: 'dynamic-chart', data: [], xkey: 'year', ykeys: 'v', labels: ['Value'], hideHover:'true' });";

		$scope.scripts = [code];



		//parses the csv data into json form
		Papa.parse(csvData,{ 
			download:true,
			header:true,
			dynamicTyping: true,
			complete: function(results){
				masterModel = results.data;
				$scope.model = masterModel;
				//since angularjs would not recognize the model change I called the function in which it did $scope.apply()
				$scope.updateModel(); 
			}
		});

		//updates the data
		$scope.updateModel = function()
		{
			$scope.model = $filter('filter')(masterModel, {'area':selectedRegion, 'dept':selectedCategory});

			//note to self create a custom filter for this on angularjs
			var graphData = [];
			var year = null;
			var value = null;

			for(var i = 0; i < 16; i++)
			{
				year = $scope.model[i].section;
				value = $scope.model[i].data;


				graphData.push({"year": year, "v": value});
			}


			$scope.scripts.push("graph.setData(" + JSON.stringify(graphData)+ ")");

			if(setChartBool)
			{	
				graph.setData(graphData);
				
			}


			setChartBool = true;

		}

		$scope.getGrowthRange = function(from, to)
		{
			var from = $filter('filter')($scope.model, {'section':from});
			var to = $filter('filter')($scope.model, {'section':to});

			if(from[0].data == 0)
			{
				return '0'
			}
			else
			{
				return to[0].data - from[0].data		
			}	

		}

		$scope.getGrowthRangePct = function(from, to)
		{
			var from = $filter('filter')($scope.model, {'section':from});
			var to = $filter('filter')($scope.model, {'section':to});

			if(from[0].data == 0)
			{
				return '0'
			}
			else
			{
				return (((to[0].data - from[0].data) / from[0].data) * 100).toFixed(0)
			}
		}

		$scope.setRegion = function(value)
		{
			if(value == "Manhattan")
			{
				selectedCategory = "or-cases";
			}
			//needed this to switch back to first tab because catgory does not exist
			if( (value == "Combined" || value == "Regional") && (selectedCategory == "inpatient-days" || selectedCategory == "transplants"))
			{
				selectedCategory = "or-cases";
			}	

			selectedRegion = value;
			$scope.updateModel();
		}

		$scope.setCategory = function(value)
		{
			selectedCategory = value;
			$scope.updateModel();
		}

		$scope.getRegionClass = function(value)
		{
			return (selectedRegion == value) ? "active-region" : "";
		}

		$scope.getCategoryClass = function(value)
		{
			return (selectedCategory == value) ? "active-category" : "";
		}

		$scope.getNativationClass = function(value)
		{
			if(selectedRegion == "Manhattan" && value == "navone")
			{
				return "active-navigation";
			}	
			else if(selectedRegion != "Manhattan" && value == "navtwo")
			{
				return "active-navigation";
			}	
			else{
				return "";
			}

			
		}

		//get the percentage of the growth volume
		$scope.getPCT = function(value)
		{
			var currentYear = $filter('filter')($scope.model, value)[0];
			var lastYear = $filter('filter')($scope.model, value-1)[0];


			//there should be something in the array
			if(currentYear.length == 0 || lastYear.length == 0)
			{
				return '-';
			}
			else
			{
				return (((currentYear.data - lastYear.data) / lastYear.data ) * 100).toFixed(1) + '%';
			}
		}


	});