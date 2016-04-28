var layers = [{
	'id': 'transit',
	'name': 'Transit Access',
	'source': 'Equity Atlas',
	'file': '//gis.oregonmetro.gov/equityAtlas/data/newraster/trans2.png',
	'type': 'heatmap',
	'nodata': 1,
	'ul': [-123.51819289449999, 46.0676384925],
	'step': 0.000885099,
	'width': 2116,
	'height': 1372
}, {
	'id': 'bike',
	'name': 'Bikability',
	'source': 'Equity Atlas',
	'file': '//gis.oregonmetro.gov/equityAtlas/data/newraster/trans3.png',
	'type': 'heatmap',
	'nodata': 1,
	'ul': [-123.51819289449999, 46.0676384925],
	'step': 0.000885099,
	'width': 2116,
	'height': 1372
}, {
	'id': 'sidewalk',
	'name': 'Walkability - Sidewalk Density',
	'source': 'Equity Atlas',
	'file': '//gis.oregonmetro.gov/equityAtlas/data/newraster/trans4.png',
	'type': 'heatmap',
	'nodata': 1,
	'ul': [-123.51819289449999, 46.0676384925],
	'step': 0.000885099,
	'width': 2116,
	'height': 1372
}, {
	'id': 'people',
	'name': 'Total Population Density (Residents + Employees Per Acre)',
	'source': 'Equity Atlas',
	'file': '//gis.oregonmetro.gov/equityAtlas/data/newraster/demo2.png',
	'type': 'heatmap',
	'nodata': 1,
	'ul': [-123.51819289449999, 46.0676384925],
	'step': 0.000885099,
	'width': 2116,
	'height': 1372,
	'theme': 'Demographics',
	'thumb': 'img/heatmap.jpg'
}, {
	'id': 'parks',
	'name': 'Proximity to Publicly Accessible Parks',
	'source': 'Equity Atlas',
	'file': '//gis.oregonmetro.gov/equityAtlas/data/newraster/parks1.png',
	'type': 'heatmap',
	'nodata': 1,
	'ul': [-123.51819289449999, 46.0676384925],
	'step': 0.000885099,
	'width': 2116,
	'height': 1372,
	'theme': 'Parks and Natural Areas',
	'thumb': 'img/heatmap.jpg'
}];

var USE_STATIC_HEATMAPS = true;
var static_heatmap = null;
var CUR_STATIC = '';

Chart.defaults.global.animation = false;
var DATA, centers_geom, bus_routes, center;

$(document).ready(function() {

	function clearPanel() {
		var d = $.Deferred();
		$('.container-fluid').fadeOut(100, function() {
			$(this).empty();
			d.resolve();
		})
		return d.promise()
	}

	Path.map("#about").to(function() {
		clearPanel().then(function() {
			App.about_view();
		}).then(function() {
			$('.container-fluid').fadeIn();
		});
	});

	Path.map("#about_Where").to(function() {
		clearPanel().then(function() {
			App.about_where_view();
		}).then(function() {
			$('.container-fluid').fadeIn();
		});
	});

	Path.map("#about_SOC2009").to(function() {
		clearPanel().then(function() {
			App.about_SOC2009_view();
		}).then(function() {
			$('.container-fluid').fadeIn();

		});
	});

	Path.map("#about_SOC2011").to(function() {
		clearPanel().then(function() {
			App.about_SOC2011_view();
		}).then(function() {
			$('.container-fluid').fadeIn();

		});
	});

	Path.map("#about_CIS").to(function() {
		clearPanel().then(function() {
			App.about_CIS_view();
		}).then(function() {
			$('.container-fluid').fadeIn();

		});
	});

	Path.map("#about_looking_forward").to(function() {
		clearPanel().then(function() {
			App.about_looking_forward_view();
		}).then(function() {
			$('.container-fluid').fadeIn();

		});
	});

	Path.map("#about_data_sources").to(function() {
		clearPanel().then(function() {
			App.about_data_sources_view();
		}).then(function() {
			$('.container-fluid').fadeIn();

		});
	});

	Path.map("#central_city").to(function() {
		clearPanel().then(function() {
			if (App.data == null) {
				$.getJSON('./data/data.json').then(function(data) {
					App.data = data;
					App.central_city_view();
				});
			} else {
				App.central_city_view();
			}
		}).then(function() {
			$('.container-fluid').fadeIn();
		});
	});
	Path.map("#regional_centers").to(function() {
		clearPanel().then(function() {
			if (App.data == null) {
				$.getJSON('./data/data.json').then(function(data) {
					App.data = data;
					App.regional_centers_view();
				});
			} else {
				App.regional_centers_view();
			}
		}).then(function() {
			$('.container-fluid').fadeIn();
		});
	});
	Path.map("#town_centers").to(function() {
		clearPanel().then(function() {
			if (App.data == null) {
				$.getJSON('./data/data.json').then(function(data) {
					App.data = data;
					App.town_centers_view();
				});
			} else {
				App.town_centers_view();
			}
		}).then(function() {
			$('.container-fluid').fadeIn();
		});
	});

	//   Path.map("#yummy").to(function() {
	//  clearPanel().then(function(){alert('you made it!')}).then(function(){
	//   $('.container-fluid').fadeIn();
	//  });
	// });

	Path.map("#home").to(function() {
		clearPanel().then(function() {
			App.home_view();
		}).then(function() {
			$('.container-fluid').fadeIn(100, function() {
				map.invalidateSize();
			});
		});
	});

	Path.map("#center/:center").to(function() {
		var center = this.params['center'];
		clearPanel().then(function() {
			if (App.data == null) {
				$.getJSON('./data/data.json').then(function(data) {
					App.data = data;

					App.center_view(center);

					$('.container-fluid').fadeIn(100, function() {
						App.charts.init(center);
						map.invalidateSize();

						$('.container-fluid').append(templates['footer']());
					});
				});
			} else {
				App.center_view(center);

				$('.container-fluid').fadeIn(100, function() {
					App.charts.init(center);
					map.invalidateSize();

					$('.container-fluid').append(templates['footer']());
				});
			}
		}).then(function() {});

	});

	Path.rescue(function() {
		window.location = './#home';
	});

	Path.root("#home");

	Path.listen();
});

var App = {

	data: null,
	analysis_centers: null,
	analysis_buffers: null,
	bus_routes: null,
	home_view: function() {
		$('.container-fluid').append(templates['breadcrumb']({
			title: "Home"
		}));

		$('.container-fluid').append(templates['home']({
			title: "State of the Centers"
		}));

		$('.town-center, .town-center-alt,.regional-center, .regional-center-alt').on('click', function() {

			var that = this;
			analysis_centers.eachLayer(function(layer) {
				if (layer.feature.properties.NAME == $(that).html()) {
					layer.openPopup();
				}
			});
		});

		App.map.init(null);

		document.title = "State of the Centers - Home";
		$('#brc').html("Home");

		$('.container-fluid').append(templates['footer']());

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},

	about_view: function() {

		$('.container-fluid').append(templates['breadcrumb']({
			title: "About"
		}));

		document.title = "State of the Centers - About";
		// $('.container-fluid').append(templates['about_TOC']({title: "State of the Centers"
		// }));
		$('.container-fluid').append(templates['about_container']);
		
		$('#about_content').html(templates['about']({title: "State of the Centers"
		}));
		$('#about_photos').html(templates['about_photos']);

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},
	
	central_city_view: function() {

		//if the slider hasn't already appeared in the app we need to add it.
		App.slider.init();

		$('.container-fluid').append(templates['breadcrumb']({
			title: "Central City Overview"
		}));

		document.title = "State of the Centers - Central City";

		//put the regional centers into an array

		var central_city = [];

		for(var key in App.data){
			if (App.data[key].type=='Central City'){
				central_city.push(App.data[key]);
			}
		}

		
		//get year:
		var year = $('#inc_slider').val();

		$('.container-fluid').append(templates['central_city']({data:central_city, year:year.toString()})
		);

		$('#inc_slider').off('input.t').on('input.t', function() {
			
				var year = $('#inc_slider').val();

				$('#central_city_row').fadeOut(0, function(){	$('#central_city_row').remove();
					$('.container-fluid').append(templates['central_city']({data:central_city, year:year.toString()}))});
			
		});

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},
	regional_centers_view: function() {

		//if the slider hasn't already appeared in the app we need to add it.
		App.slider.init();

		$('.container-fluid').append(templates['breadcrumb']({
			title: "Regional Centers Overview"
		}));

		document.title = "State of the Centers - Regional Centers - Overview";

		//put the regional centers into an array

		var regional_centers = [];

		for(var key in App.data){
			if (App.data[key].type=='Regional Center'){
				regional_centers.push(App.data[key]);
			}
		}

		//alphabetize regional centers.
		function compare(a,b) {
		  if (a.name < b.name)
		    return -1;
		  if (a.name > b.name)
		    return 1;
		  return 0;
		}

		regional_centers.sort(compare);

		//get year:
		var year = $('#inc_slider').val();

		$('.container-fluid').append(templates['regional_centers']({data:regional_centers, year:year.toString()})
		);

		$('#inc_slider').off('input.t').on('input.t', function() {
			
				var year = $('#inc_slider').val();

				$('#regional_center_row').fadeOut(0, function(){	$('#regional_center_row').remove();
					$('.container-fluid').append(templates['regional_centers']({data:regional_centers, year:year.toString()}))});
			
		});

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},

	town_centers_view: function() {

		//if the slider hasn't already appeared in the app we need to add it.
		App.slider.init();

		$('.container-fluid').append(templates['breadcrumb']({
			title: "Town Centers Overview"
		}));

		document.title = "State of the Centers - Town Centers - Overview";

		//put the town centers into an array

		var town_centers = [];

		for(var key in App.data){
			if (App.data[key].type=='Town Center'){
				town_centers.push(App.data[key]);
			}
		}

		//alphabetize town centers.
		function compare(a,b) {
		  if (a.name < b.name)
		    return -1;
		  if (a.name > b.name)
		    return 1;
		  return 0;
		}

		town_centers.sort(compare);

		//get year:
		var year = $('#inc_slider').val();

		$('.container-fluid').append(templates['town_centers']({data:town_centers, year:year.toString()})
		);

		$('#inc_slider').off('input.t').on('input.t', function() {
			
				var year = $('#inc_slider').val();

			$('#town_center_row').fadeOut(0, function() {
				$('#town_center_row').remove();
				$('.container-fluid').append(templates['town_centers']({
					data: town_centers,
					year: year.toString()
				}))
			});
			
		});

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},

	about_where_view: function() {

		$('.container-fluid').append(templates['breadcrumb']({
			title: "About - Where we are today"
		}));

		document.title = "State of the Centers - About - Where we are today";
		$('.container-fluid').append(templates['about_container']);
		// $('#about_TOC').html(templates['about_TOC']({title: "State of the Centers"
		// }));
		$('#about_content').html(templates['about_Where']({title: "State of the Centers"
		}));
		$('#about_photos').html(templates['about_photos']);

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},
	about_SOC2009_view: function() {

		$('.container-fluid').append(templates['breadcrumb']({
			title: "About - 2009 Report"
		}));

		document.title = "State of the Centers - About - 2009 Report";
		$('.container-fluid').append(templates['about_container']);
		// $('#about_TOC').html(templates['about_TOC']({title: "State of the Centers"
		// }));
		$('#about_content').html(templates['about_SOC2009']({title: "State of the Centers"
		}));
		$('#about_photos').html(templates['about_photos']);

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},
	about_SOC2011_view: function() {

		$('.container-fluid').append(templates['breadcrumb']({
			title: "About - 2011 Report"
		}));

		document.title = "State of the Centers - About - 2011 Report";
		$('.container-fluid').append(templates['about_container']);
		// $('#about_TOC').html(templates['about_TOC']({title: "State of the Centers"
		// }));
		$('#about_content').html(templates['about_SOC2011']({title: "State of the Centers"
		}));
		$('#about_photos').html(templates['about_photos']);

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},

	about_CIS_view: function() {

		$('.container-fluid').append(templates['breadcrumb']({
			title: "About - Community Investment Strategy"
		}));

		document.title = "State of the Centers - About - Community Investment Strategy";
		$('.container-fluid').append(templates['about_container']);
		// $('#about_TOC').html(templates['about_TOC']({title: "State of the Centers"
		// }));
		$('#about_content').html(templates['about_CIS']({title: "State of the Centers"
		}));
		$('#about_photos').html(templates['about_photos']);

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},
	about_looking_forward_view: function() {

		$('.container-fluid').append(templates['breadcrumb']({
			title: "About - Looking Forward"
		}));

		document.title = "State of the Centers - About - Looking Forward";
		$('.container-fluid').append(templates['about_container']);
		// $('#about_TOC').html(templates['about_TOC']({title: "State of the Centers"
		// }));
		$('#about_content').html(templates['about_looking_forward']({title: "State of the Centers"
		}));
		$('#about_photos').html(templates['about_photos']);

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},
	about_data_sources_view: function() {

		$('.container-fluid').append(templates['breadcrumb']({
			title: "About - Measures and Data Sources"
		}));

		document.title = "State of the Centers - About - Measures and Data Sources";
		$('.container-fluid').append(templates['about_container']);
		// $('#about_TOC').html(templates['about_TOC']({title: "State of the Centers"
		// }));
		$('#about_content').html(templates['about_data_sources']({title: "State of the Centers"
		}));
		$('#about_photos').html(templates['about_photos']);


		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},

	center_view: function(center) {

		center = center.toLowerCase().replace(' center', '').replace(' â€“ ', '_').replace('/', '_').replace('.', '').replace(' ', '_').replace(/\-/g, '_').replace(/\s/g,'');

		$('.container-fluid').append(templates['breadcrumb']({
			title: App.data[center].title
		}));

		var year = ($('#inc_slider').length === 0) ? 2015 : $('#inc_slider').val();

		$('#hh_title').html(App.data[center].title + ' ' + App.data[center].type);

		$('.container-fluid').append(templates['narrative_and_numbers_container']);

		$('#ghostNarrative, #narrative').html(templates['main'](App.data[center]));

		$('#amenities').html(templates['amenities']({
			amenities: App.data.amenities,
			data: App.data[center][year]
		}));

		var numbers_obj = {
			title: App.data[center].title + ' ' + App.data[center].type,
			type: App.data[center].type,
			stats: App.data[center][year].stats,
			averages: App.data[App.data[center].type.toLowerCase().replace(' ', '_') + '_averages'][year],
			stats_1mi_buff: App.data[center][year].stats_1mi_buff,
			narrative: App.data[center][year].narrative
		};

		$('#numbers').html(templates['numbers'](numbers_obj));

		$('.container-fluid').append(templates['map'], {});

		/* Attempt to combat inability of map to zoom to center... */

		$(document).on('scroll', function(){
			if(App.map.newext !== null && App.map.zoomed == false && isScrolledIntoView(document.getElementById('map'))){
				App.map.zoomed = true;
				setTimeout(function() {
					map.fitBounds(App.map.newext);
					map.invalidateSize();
				}, 0);

			}
		})

		function isScrolledIntoView(el) {
		    var elemTop = el.getBoundingClientRect().top;
		    var elemBottom = el.getBoundingClientRect().bottom;
		    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
		    return isVisible;
		}

		App.map.init(center);

		var d = $.Deferred();
		d.resolve();
		return d.promise();
	},
	charts: {
		init: function(center) {

			center = center.toLowerCase().replace(' center', '').replace(' â€“ ', '_').replace(' ', '_').replace('/', '').replace('.', '').replace(' ', '_').replace(/\-/g, '_');

			$('.container-fluid').append(templates['charts']({
				title: App.data[center].title
			}));

			App.slider.init();

			this.createPieChart(center);
			this.createBarChart(center);
			this.createRadarChart(center);

			$('#inc_slider').off('input change').on('input change', function() {

				var year = $('#inc_slider').val();

				//change amenities
				$('#amenities').html(templates['amenities']({
					amenities: App.data.amenities,
					data: App.data[center][year]
				}));

				//change by the numbers
				var numbers_obj = {
					title: App.data[center].title + ' ' + App.data[center].type,
					type: App.data[center].type,
					stats: App.data[center][year].stats,
					averages: App.data[App.data[center].type.toLowerCase().replace(' ', '_') + '_averages'][year],
					stats_1mi_buff: App.data[center][year].stats_1mi_buff,
					narrative: App.data[center][year].narrative
				};

				$('#numbers').html(templates['numbers'](numbers_obj));

				App.charts.createBarChart(center);
				App.charts.createPieChart(center);
				App.charts.createRadarChart(center);

				if(static_heatmap !== null && map.hasLayer(static_heatmap)){
					var imageUrl = 'rasters/'+year+'/' + CUR_STATIC + '.png',
						imageBounds = [
							[(45.6601034248 - 0.386646966), -123.158686448],
							[45.6601034248, (-123.158686448 + 0.7996629588)]
						];

					
					map.removeLayer(static_heatmap);
					

					var opacity = $('#sliHeatmap').val();
					static_heatmap = L.imageOverlay(imageUrl, imageBounds, {opacity:opacity});
					//get opacity first, just in case
					static_heatmap.addTo(map);
				}

			});
		},
		createBarChart: function(center) {
			var barChartData = {
				labels: App.data.income_breaks,
				datasets: [{
					fillColor: "rgba(40,113,127,0.5)",
					strokeColor: "rgba(220,220,220,0.8)",
					highlightFill: "rgba(220,220,220,0.75)",
					highlightStroke: "rgba(220,220,220,1)",
					data: []
				}, {
					fillColor: "rgba(131,177,151,0.5)",
					strokeColor: "rgba(220,220,220,0.8)",
					highlightFill: "rgba(220,220,220,0.75)",
					highlightStroke: "rgba(220,220,220,1)",
					data: []
				}]
			};

			var setBarChartData = function() {
				var year = $('#inc_slider').val();
				barChartData.datasets[0].data = App.data[center][year].incomes;
				barChartData.datasets[1].data = App.data[center][year].incomes_1mi_buff;
			}

			setBarChartData();

			var ctx = document.getElementById("barchart").getContext("2d");

			try {
				window.myBar.destroy();
			} catch (ex) { //it just didn't exist, not a big deal
			}
			try {
				window.myBar = new Chart(ctx).Bar(barChartData, {
					barStrokeWidth: 1,
					responsive: true,
					animationSteps: 25,
					scaleOverride : true,
			        scaleSteps : 10,
			        scaleStepWidth : 5,
			        scaleStartValue : 0 
				});
			} catch (ex) {
				console.log('failtime on barchart');
			}
		},
		createRadarChart: function(center) {
			var radardata = {
				labels: App.data.context_tool_labels,
				datasets: [{
					label: "My Second dataset",
					fillColor: "rgba(70,148,167,0.8)",
					strokeColor: "rgba(90,168,187,1)",
					pointColor: "rgba(151,187,205,0)",
					pointStrokeColor: "rgba(151,187,205,0)",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(151,187,205,1)"
				}]
			};

			var year = $('#inc_slider').val();
			var idx = App.data.data_years.indexOf(parseInt(year));

			radardata.datasets[0].data = App.data[center][year].context_tool_scores.slice(0, -1);

			var ctx = document.getElementById("radarchart").getContext("2d");

			try {
				window.myRadarChart.destroy();
			} catch (ex) { //it just didn't exist, not a big deal
			}

			window.myRadarChart = new Chart(ctx).Radar(radardata, {
				responsive: true,
				scaleOverride : true,
		        scaleSteps : 5,
		        scaleStepWidth : 1,
		        scaleStartValue : 0 
			});
		},
		createPieChart: function(center) {
			var pieChartData = [{
				color: "#87451E",
				highlight: "#87451E",
				label: "Other"
			}, {
				color: "#C3A28E",
				highlight: "#C3A28E",
				label: "Retail"
			}, {
				color: "#A57356",
				highlight: "#A57356",
				label: "Service"
			}];

			var setPieChartData = function() {
				//get index of year in years
				var year = $('#inc_slider').val();
				var idx = App.data.data_years.indexOf(parseInt(year));

				pieChartData[0].value = App.data[center][year].employment_breakdown[0];
				$('#tdOther').html(App.data[center][year].employment_breakdown[0] + '% Other');
				pieChartData[1].value = App.data[center][year].employment_breakdown[1];
				$('#tdRetail').html(App.data[center][year].employment_breakdown[1] + '% Retail');
				pieChartData[2].value = App.data[center][year].employment_breakdown[2];
				$('#tdService').html(App.data[center][year].employment_breakdown[2] + '% Service');
			}

			setPieChartData();

			try {
				window.myPie.destroy();
			} catch (ex) { //it just didn't exist, not a big deal
			}
			try {
				ctx = document.getElementById("piechart").getContext("2d");
				window.myPie = new Chart(ctx).Pie(pieChartData, {
					animateRotate: false,
					responsive: true
				});
			} catch (ex) {
				console.log('failtime' + ex.message)
			}
		}
	},
	slider : {
		init: function(){
			if (!$('#inc_slider').length) {
				var html = "<tr><td rowspan='2'><label for='inc_slider' >Year&nbsp;&nbsp;&nbsp;</label></td><td colspan='" + (App.data.data_years.length + 1) + "'><input type='range' id='inc_slider' min='" + App.data.data_years[0] + "' max='" + App.data.data_years[App.data.data_years.length - 1] + "' step='4' style='width:170px;'></td></tr>";

				for (var i = 0; i < App.data.data_years.length; i++) {
					if (i == 0) {
						html += "<td style='text-align:left;'>" + App.data.data_years[i] + "</td>";
					} else if (i > 0 && i < App.data.data_years.length - 1) {
						html += "<td style='text-align:center;'>" + App.data.data_years[i] + "</td>";
					} else if (i == App.data.data_years.length - 1) {
						html += "<td style='text-align:right;'>" + App.data.data_years[i] + "</td>";
					}
				}

				html += '</tr>';

				$('#tblSliderYears').append(html);
			}
		}
	},
	map: {
		newext:null,
		zoomed:false,
		init: function(center) {

			var southWest = L.latLng(45.28138672055432, -123.15352859699149),
		    northEast = L.latLng(45.652871076202324, -122.36748802454048),
		    bounds = L.latLngBounds(southWest, northEast);

			map = L.map('map', {minZoom:10, maxZoom:19, maxBounds: bounds});

			L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
				maxZoom: 21,
				attribution: 'ESRI'
			}).addTo(map);

			L.tileLayer('//gis.oregonmetro.gov/services/transit/LRT/{z}/{x}/{y}.png', {
				maxZoom: 21,
				minZoom: 14,
				opacity: .8,
				attribution: 'Tri-Met'
			}).addTo(map);

			L.tileLayer('//gis.oregonmetro.gov/services/land/buildings/{z}/{x}/{y}.png', {
				maxZoom: 21,
				minZoom: 15,
				attribution: 'RLIS'
			}).addTo(map);

			L.tileLayer('//gis.oregonmetro.gov/services/transit/busstops/{z}/{x}/{y}.png', {
				maxZoom: 21,
				minZoom: 15,
				attribution: 'RLIS'
			}).addTo(map);

			if (center != null) {

				var ext = App.data[center].extent;

				App.map.newext = [
					[ext[1], ext[0]],
					[ext[3], ext[2]]
				];

				setTimeout(function() {
						map.fitBounds(App.map.newext);
						map.invalidateSize();
					}, 0);

			} else {
				map.setView([45.48228066163947, -122.70767211914064], 11);
			}

			// L.tileLayer('//gis.oregonmetro.gov/ArcGIS/rest/services/metromap/baseAnno/MapServer/tile/{z}/{y}/{x}?token=xPLxWVBTxtoj_Mtop4cOywUPHY6c2St2pTeS-Hg8t04.', {
			//  maxZoom: 21,
			//  attribution: 'RLIS'
			// }).addTo(map);

			if (center == null) {
				map.on('popupopen', function(e) {
					var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup 
					px.y -= e.popup._container.clientHeight / 2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location

					map.panTo(map.unproject(px), {
						animate: true
					}); // pan to new center
				});
			} else {
				App.map.addHeatmapControls();
			}

			var add_analysis_buffers = function(data) {

				App.analysis_buffers = data;

				analysis_buffers = L.geoJson(data, {
					style: {
						color: '#334D59',
						weight: 1,
						fillOpacity: .1,
						opacity: .1
					}, clickable: false
				})

				if (center != null) {
					map.addLayer(analysis_buffers);
				}
			};

			var add_analysis_centers = function(data) {

				App.analysis_centers = data;

				var onEachFeature = function(feature, layer) {
					if (feature.properties.NAME == 'Wood Village') {var htm = '<b>' + feature.properties.NAME + '</b><br/>' + feature.properties.TYPE + '<br/><a href="./#center/fairview">View in Atlas</a>';}
					else {var htm = '<b>' + feature.properties.NAME + '</b><br/>' + feature.properties.TYPE + '<br/><a href="./#center/' + feature.properties.NAME.toLowerCase().replace(' center', '').replace(' â€“ ', '_').replace('/', '_').replace('.', '').replace(' ', '_').replace(/\-/g, '_').replace(/\s/g,'') + '">View in Atlas</a>';}
					layer.bindPopup(htm);
				};

				analysis_centers = L.geoJson(data, {
					style: function(feature) {
						var style = {
							fillOpacity: .3,
							opacity: .8,
							weight: 1
						};
						switch (feature.properties.TYPE) {
							case "Central City":
								style.color = '#AA5656';
								style.opacity = 0;
								style.fillOpacity = 0;
								break;
							case "Regional Center":
								style.color = '#859F50';
								break;
							case "Town Center":
								style.color = '#346666';
								break;
						}
						return style;
					},
					onEachFeature: onEachFeature
				});
				map.addLayer(analysis_centers);
			}

			var add_bus_routes = function(data) {

				App.bus_routes = data;

				bus_routes = L.geoJson(data, {
					style: {
						fillOpacity: .3,
						opacity: .3,
						weight: 3,
						color: '#4D5E66',
						fillColor: '#FF0000'
					}
				});

				bus_routes.on('mouseover', function(e) {
					var route = e.layer.feature.properties.ROUTES;
					$('#hoverInfo').css('top', (window.pageYOffset + e.originalEvent.clientY) + 'px');
					$('#hoverInfo').css('left', (window.pageXOffset + e.originalEvent.clientX + 13) + 'px');
					$('#hoverInfo').html("Bus routes: " + route);
					$('#hoverInfo').fadeIn(70);
				});

				bus_routes.on('mouseout', function(e) {
					$('#hoverInfo').fadeOut(70);
				});

				map.on('zoomend', function() {
					if (map.getZoom() > 13) {
						map.addLayer(bus_routes);
					} else {
						map.removeLayer(bus_routes);
					}
				});
			};

			if (App.analysis_buffers == null) {

				$.getJSON('./data/analysis_buffers.json').then(function(analysis_buffer_data) {
					add_analysis_buffers(analysis_buffer_data);
					$.getJSON('./data/analysis_centers.json').then(function(analysis_centers_data) {
						add_analysis_centers(analysis_centers_data);
					});
					$.getJSON('./data/bus_routes.json').then(function(bus_data) {
						add_bus_routes(bus_data);
					});
					//map.fitBounds(newext);
				});
			} else {
				add_analysis_buffers(App.analysis_buffers);
				add_analysis_centers(App.analysis_centers);
				add_bus_routes(App.bus_routes);
				if(typeof(newext) != 'undefined'){
					map.fitBounds(newext);
				}
			}
		},

		addHeatmapControls: function() {
			var command = L.control({
				position: 'topright'
			});

			command.onAdd = function(map) {
				var div = L.DomUtil.create('div', 'command');

				div.innerHTML = '<div class="btn-group-vertical" data-toggle="buttons" id="heatmapHouse"><div id="heatmapControlShim" style="position:absolute;top:21px;bottom:26px;left:0px;right:0;background-color:#DDD;z-index:100;display:none;opacity:.7"><img src="img/gears.svg" style="margin-left:57px;margin-top:47px"></div> <label class="btn btn-default btn-xs btn-disabled" id="lblButton">  Heatmaps </label><label class="btn btn-default btn-xs"> <input type="radio" id="q156" name="quality[25]" value="1" title="bike" /> Bicycle Access </label><label class="btn btn-default btn-xs"> <input type="radio" id="q157" name="quality[25]" value="2" title="people" /> People Per Acre </label><label class="btn btn-default btn-xs"> <input type="radio" id="q158" name="quality[25]" value="3" title="transit" /> Transit Access </label><label class="btn btn-default btn-xs"> <input type="radio" id="q159" name="quality[25]" value="4" title="uli" /> Urban Living Infrastructure </label><label class="btn btn-default btn-xs"> <input type="radio" id="q160" name="quality[25]" checked="checked" value="5" title="sidewalk" /> Sidewalk density </label> <label class="btn btn-default btn-xs"> <input type="radio" id="q160" name="quality[25]" title="parks" checked="checked" value="5" /> Access to Parks </label> <label class="btn btn-default btn-xs"> <input type="radio" id="q160" name="quality[25]" title="block" checked="checked" value="5" /> Block Size </label><label ><input type="range" value="1" min="0.01" max="1" step=".05" id="sliHeatmap" style="background:#fff;margin-left:7px;width:170px;" disabled alt="Heatmap opacity" title="Heatmap opacity"/> </label> </div>';
				L.DomEvent.disableClickPropagation(div);
				return div;
			};

			command.addTo(map);

			$('[name="quality[25]"]').on('change', function(e) {

				var id = $(this).prop('title');
				var year = $('#inc_slider').val();

				if ((App.heatmap.id !== null && id == App.heatmap.id) || CUR_STATIC == id) {
					
					$($(this).parent()).removeClass('active')
					$(this).attr('checked', false)
					if (USE_STATIC_HEATMAPS) {
						map.removeLayer(static_heatmap)
						CUR_STATIC = '';
					} else {
						map.removeLayer(App.heatmap.layer);
					}
					$('#sliHeatmap').attr('disabled', true);
					e.stopPropagation();
					return;
				}

				if (USE_STATIC_HEATMAPS) {
					var imageUrl = 'rasters/'+year+'/' + id + '.png',
						imageBounds = [
							[(45.6601034248 - 0.386646966), -123.158686448],
							[45.6601034248, (-123.158686448 + 0.7996629588)]
						];

					if(static_heatmap !== null && map.hasLayer(static_heatmap)){
						map.removeLayer(static_heatmap);
					}

					var opacity = $('#sliHeatmap').val();
					static_heatmap = L.imageOverlay(imageUrl, imageBounds, {opacity:opacity});
					//get opacity first, just in case
					static_heatmap.addTo(map);
					CUR_STATIC = id;
					$('#sliHeatmap').attr('disabled', false);
				} else {
					$('#heatmapControlShim').fadeIn();
					App.heatmap.init(id);
				}
			});

			$('#heatmapHouse > label').on('mousedown', function() {
				var id = $($(this).children()[0]).prop('title');
				if ((App.heatmap.id !== null && id == App.heatmap.id) || CUR_STATIC == id) {

					$('[name="quality[25]"]').attr('checked', false)

				}
			});

			$('#sliHeatmap').on('change', function() {
				if (USE_STATIC_HEATMAPS) {
					static_heatmap.setOpacity(parseFloat($(this).val()));
				} else {
					$('#heatmapControlShim').show();
					var opacity = parseFloat($(this).val());
					setTimeout(function() {
						App.heatmap.maxOpacity = opacity;
						App.heatmap._reconfigure();
						$('#heatmapControlShim').fadeOut();
					}, 50);
				}
			});

		}
	},
	heatmap: {
		layer: null,
		rasters: {},
		tooltip: null,
		blur: .64,
		gradientIndex: 2,
		heattip_enabled: false,
		pngdata: [],
		resolution: 1,
		radius: .0015,
		maxOpacity: 0.7,
		minOpacity: 0,
		id:null,
		gradients: [{
				'0': '#218291',
				'.6': '#91BDA8',
				'.9': '#FFFFBF',
				'.99': '#CFA263',
				'1': '#9C551F'
			}, 
			null
		],
		init: function(id) {
			this.id = id;
			var layer;

			$.each(layers, function(i, v) {
				if (v.id == id) {
					layer = v;
				}
			});

			readPNG(layer).then(function(png){
				layer.raster = png;
				layer.raster.getPixel = function(x, y) {
		            if (!this.pixels) throw new Error("pixel data is empty");
		            if (x >= this.width || y >= this.height) {
		                throw new Error("x,y position out of bound");
		            }
		            var i = this.colors * this.bitDepth / 8 * (y * this.width + x);
		            var pixels = this.pixels;
		            switch (this.colorType) {
		                case 0:
		                    return [pixels[i], pixels[i], pixels[i], 255];
		                case 2:
		                    return [pixels[i], pixels[i + 1], pixels[i + 2], 255];
		                case 3:
		                    return [this.palette[pixels[i] * 3 + 0], this.palette[pixels[i] * 3 + 1], this.palette[pixels[i] * 3 + 2], 255];
		                case 4:
		                    return [pixels[i], pixels[i], pixels[i], pixels[i + 1]];
		                case 6:
		                    return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
		            }
		        };

				App.heatmap.render(layer);

			})
		},

		_init: function() {
			this.config = {
					"radius": this.radius,
					"maxOpacity": this.maxOpacity,
					"minOpacity": this.minOpacity,
					"scaleRadius": true,
					"useLocalExtrema": true,
					"blur": this.blur,
					"gradient": this.gradients[0],
					"latField": 'lat',
					"lngField": 'lng',
					"valueField": 'count'
				},

			App.heatmap.layer = new HeatmapOverlay(this.config);

			map.addLayer(this.layer);

			this.tooltip = L.popup({
				autoPan: false
			});
		},
		render: function(layer) {

			this.pngdata = [];

			if (App.heatmap.layer == null) {
				this._init();
			}

			this.layer.setData({
				max: 0,
				data: []
			});

			if (!map.hasLayer(this.layer)) {
				map.addLayer(this.layer);
			}

			var curlng = layer.ul[0];
			var curlat = layer.ul[1];

			for (var x = 0; x < layer.width - this.resolution; x += this.resolution) {
				for (var y = 0; y < layer.height - this.resolution; y += this.resolution) {			
					var val = layer.raster.getPixel(x, y)[1];
					
					if(val > this.maxval){
						this.maxval = val;
					}

					if(val > layer.nodata && val < 255){
						
						this.pngdata.push({
							lng: curlng,
							lat: curlat,
							count: val
						});
					}
					
					curlat -= (layer.step * this.resolution);
				}
				curlng += (layer.step * this.resolution);
				curlat = layer.ul[1];
			}

			this.layer.setData({
				max: this.maxval,
				data: this.pngdata
			});

			$('#sliHeatmap').attr('disabled', false)

			$('#heatmapControlShim').fadeOut();
		},
		_reconfigure: function() {

			map.removeLayer(this.layer);

			this.config = {
				"radius": this.radius,
				"maxOpacity": this.maxOpacity,
				"minOpacity": this.minOpacity,
				"blur": this.blur,
				"gradient": this.gradients[0],
				"scaleRadius": true,
				"useLocalExtrema": true,
				"latField": 'lat',
				"lngField": 'lng',
				"valueField": 'count'
			};

			this.layer = new HeatmapOverlay(this.config);

			map.addLayer(this.layer);

			this.layer.setData({
				max: this.maxval,
				data: this.pngdata
			});
		},
	}
}


/*
todo

zoom to extent of center on center load - check
activity spectrum graph
heatmap opacity slider - resample?
  make top end less opaque
  mute heatmap gradient
All informatoin last updated on ...in footer.
zoom to feature extent and not centroid and static scale
activity spectrum and typologies
sunset transit

*/

function readPNG(layer){
	var def = $.Deferred();

	var worker = cw({
		get:function(input, cb){
			try{
				importScripts('js/PNG.js');

				var xhr = new XMLHttpRequest();
				this.fire('console', ['log', [input[0].file]]);
				xhr.open('GET', 'http:'+input[0].file, true);
				xhr.responseType = 'arraybuffer';
				pngdata = [];
				xhr.onload = function(e) {
					if (this.status == 200) {

						var reader = new PNGReader(this.response);
						reader.parse(function(err, png) {
							if (err) throw err;
							cb(png);
						});
					}
				};

				xhr.send();
			} catch(ex){
				this.fire('console', ['error', [ex.message]])
			}
		}
})

	worker.get([layer]).then(function(pngdata){
		def.resolve(pngdata)
	})
	return def.promise();
}