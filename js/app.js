/*DownStore.....supposedly a Media Store...

this project Assumes 3 web APIs...
1 API from vimeo.com for video
2 API from 4shared.com for music
3 API  from 4shared.com for apps
*/


var app = angular.module("DownStore", ['ngAnimate']).config(function($sceProvider){
	$sceProvider.enabled(false);
});

app.controller("APIController", function($scope, $http)
{
		apiCtrl = this;

		apiCtrl.APIS = {
			video :  {
				idName: "video",
				requestMethod: "GET",
				playerUrl: "https://player.vimeo.com/video/",
				url:"https://api.vimeo.com/tags/fun/videos?per_page=5",
				pageUrl:"https://api.vimeo.com/tags/fun/videos?per_page=20",
				searchUrl:"https://api.vimeo.com/videos?",
				pageLimitiParamName: "per_page",
				sort: "created_time",
				headers:{
					Authorization: "bearer 34210aeac4e02a251b8821a53620e93c",
					Accept: "application/vnd.vimeo.*+json;version=3.0"
				},
				responseDataKey:"data",
			},


			music:{
				idName: "music",
				iconUrl: "img/music_icon.jpg",
				requestMethod: "jsonp",
				url: "https://api.4shared.com/v0/files.jsonp?oauth_consumer_key=0d3484a1de10c0a182316553199137b2&limit=5&category=1",
				searchUrl: "https://api.4shared.com/v0/files.jsonp?oauth_consumer_key=0d3484a1de10c0a182316553199137b2&category=1",
				pageUrl: "https://api.4shared.com/v0/files.jsonp?oauth_consumer_key=0d3484a1de10c0a182316553199137b2&limit=20&category=1",
				pageLimitiParamName: "limit",
				responseDataKey: "files",
			},

			app:{
				idName: "app",
				iconUrl: "img/app_icon.jpg",
				requestMethod: "jsonp",
				url: "https://api.4shared.com/v0/files.jsonp?oauth_consumer_key=0d3484a1de10c0a182316553199137b2&limit=5&category=6",
				searchUrl: "https://api.4shared.com/v0/files.jsonp?oauth_consumer_key=0d3484a1de10c0a182316553199137b2&category=6",
				pageUrl: "https://api.4shared.com/v0/files.jsonp?oauth_consumer_key=0d3484a1de10c0a182316553199137b2&limit=20&category=6",
				pageLimitiParamName: "limit",
				responseDataKey: "files",
			}

		}

		
		$scope.responseData = {};

		apiCtrl.searchParam = null;

		apiCtrl.menuOut = false;

		apiCtrl.connect = function(api, urlType){
			api.loading = true;
			$scope.responseData[api.idName] = null;
			$http({
			    method: api.requestMethod,
			    url: api[urlType]+"&callback=JSON_CALLBACK",
			    headers: api.headers,
			    params: apiCtrl.searchParam,
			    responseType: "json"
			}).success(function(response){
				api.loading = false;
				$scope.responseData[api.idName] = response[api.responseDataKey];
				if($scope.responseData[api.idName].length ===0)
				{
					api.contigencyOutput = "No results Found";
				}
				console.log(response);
			}).error(function(){
				api.contigencyOutput = "Connection Error Please. Make sure you are connected";
			});
		};

		apiCtrl.setHome = function(){
			apiCtrl.outPutLimit = 5;
			apiCtrl.searchParam = {};
			angular.forEach(apiCtrl.APIS, function(value, key)
			{		
				value.display= true;	
				apiCtrl.connect(value, "url");	
			}
				);

		}


		apiCtrl.setHome();


		apiCtrl.pageView = function(api)
		{
			apiCtrl.toggleMenu();
			angular.forEach(apiCtrl.APIS, function(value, key)
			{		
				value.display= false;	
			}
				);

			api.display = true;
			apiCtrl.outPutLimit = 20;
			apiCtrl.connect(api, "pageUrl");
		}

		
		apiCtrl.search = function(){
			console.log($scope.searchQuery);
			apiCtrl.searchParam = {query: $scope.searchQuery};
			angular.forEach(apiCtrl.APIS, function(value, key)
			{		
				apiCtrl.searchParam[value.pageLimitiParamName] = apiCtrl.outPutLimit;
				apiCtrl.connect(value, "searchUrl");	
			}
				);
			apiCtrl.searchParam, $scope.searchQuery = null;
		}


		apiCtrl.toggleMenu = function(event){
			apiCtrl.menuOut = !apiCtrl.menuOut;		
	}
});

