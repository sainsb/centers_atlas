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

Chart.defaults.global.animation = false;
var DATA, centers_geom, bus_routes, center;

$(document).ready(function() {

  function clearPanel() {
    var d = $.Deferred();
    $('.container-fluid').fadeOut(100, function(){
      $(this).empty();
      d.resolve();
    })
    return d.promise()
  }

  Path.map("#about").to(function() {
   clearPanel().then(function(){App.about_view();}).then(function(){
    $('.container-fluid').fadeIn();
   });
  });

  //   Path.map("#yummy").to(function() {
  //  clearPanel().then(function(){alert('you made it!')}).then(function(){
  //   $('.container-fluid').fadeIn();
  //  });
  // });

  Path.map("#home").to(function() {
    clearPanel().then(function(){App.home_view();}).then(function(){
    $('.container-fluid').fadeIn(100, function(){
      map.invalidateSize();
    });
   });
  });

  Path.map("#center/:center").to(function() {
    var center = this.params['center'];
    clearPanel().then(function(){
      if(App.data==null){
        $.getJSON('./data/newdata.json').then(function(data) {
          App.data= data;

          App.center_view(center);
        });
      } else {
        App.center_view(center);
      }
    }).then(function(){
    $('.container-fluid').fadeIn(1, function(){

      App.charts.init(center);
      map.invalidateSize();

      $('.container-fluid').append(templates['footer']());
    });
   });
  });

  Path.rescue(function(){
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
      var centername = $(this).html().toLowerCase().replace(' center', '').replace(' – ', '_').replace(' ', '_').replace('/', '_').replace('.', '').replace(' ', '_');

      var that = this;
      centers_geom.eachLayer(function(layer) {
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

    $('.container-fluid').append(templates['about']({
      title: "State of the Centers"
    }));

    var d = $.Deferred();
    d.resolve();
    return d.promise();
  },

  center_view: function(center) {

    center = center.toLowerCase().replace(' center', '').replace(' – ', '_').replace(' ', '_').replace('/', '_').replace('.', '').replace(' ', '_').replace('-','_');

    $('.container-fluid').append(templates['breadcrumb']({
      title: App.data[center].title
    }));

    var year = 2015;

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
      stats_1mi_buff: App.data[center][year].stats_1mi_buff
    };

    $('#numbers').html(templates['numbers'](numbers_obj));

    $('.container-fluid').append(templates['map'], {});

    App.map.init(center);

    var d = $.Deferred();
    d.resolve();
    return d.promise();

  },
  charts: {
    init: function(center) {
       center = center.toLowerCase().replace(' center', '').replace(' – ', '_').replace(' ', '_').replace('/', '').replace('.', '').replace(' ', '_').replace('-','_');

      $('.container-fluid').append(templates['charts']({title:App.data[center].title}));

	if(!$('#inc_slider').length){
		var html = "<tr><td rowspan='2'><label for='inc_slider' style='color:#fff;'>Year</label></td><td colspan='" + (App.data.data_years.length+1) + "'><input type='range' id='inc_slider' min='" + App.data.data_years[0] + "' max='" + App.data.data_years[App.data.data_years.length - 1] + "' step='4'></td></tr>";

		for (var i = 0;i< App.data.data_years.length;i++) {
		if(i==0){
		  html += "<td style='text-align:left;color:#fff'>" + App.data.data_years[i] + "</td>";
		}else if (i>0 && i< App.data.data_years.length-1){
		  html += "<td style='text-align:center;color:#fff'>" + App.data.data_years[i] + "</td>";
		}else if(i==App.data.data_years.length-1){
		  html += "<td style='text-align:right;color:#fff'>" + App.data.data_years[i] + "</td>";
		}
		}

		html += '</tr>';

		$('#tblSliderYears').append(html);
	}

      this.createPieChart(center);
      this.createBarChart(center);
      this.createRadarChart(center);

      $('#inc_slider').on('input', function() {

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
          stats_1mi_buff: App.data[center][year].stats_1mi_buff
        };

        $('#numbers').html(templates['numbers'](numbers_obj));

        App.charts.createBarChart(center);
        App.charts.createPieChart(center);
        App.charts.createRadarChart(center);
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
      try{
        window.myBar = new Chart(ctx).Bar(barChartData, {
          barStrokeWidth: 1,
          responsive: true,
          animationSteps: 25
        });
      }catch(ex){
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

      radardata.datasets[0].data = App.data[center][year].context_tool_scores.slice(0,-1);

      var ctx = document.getElementById("radarchart").getContext("2d");

      try {
        window.myRadarChart.destroy();
      } catch (ex) { //it just didn't exist, not a big deal
      }

      window.myRadarChart = new Chart(ctx).Radar(radardata, {responsive:true});
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
      try{
        ctx = document.getElementById("piechart").getContext("2d");
        window.myPie = new Chart(ctx).Pie(pieChartData, {
          animateRotate: false,
          responsive:true
        });
      }catch(ex){
        console.log('failtime'+ex.message)
      }
    }
  },

  map: {
    init: function(center) {
  
      // var map_center = (center!= null) ? App.data[center].centroid : [45.48228066163947, -122.70767211914064];

      // var map_zoom = (center!= null) ? 14:11;
      if (center != null) {
      	
      	// if(typeof(map.on) !='undefined'){
      	// 	map=null;
      	// }

        var ext = App.data[center].extent;

        var newext = [
          [ext[1], ext[0]],
          [ext[3], ext[2]]
        ];

		map = L.mapbox.map('map');

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

        map.on('load', function() {
        	setTimeout(function(){console.log('I did it');
        		map.fitBounds(newext);},100);
        });
        
        map.setView([ext[1], ext[0]], 15);

      } else {
        map = L.mapbox.map('map').setView([45.48228066163947, -122.70767211914064], 11);
      }

      // L.tileLayer('//gis.oregonmetro.gov/ArcGIS/rest/services/metromap/baseAnno/MapServer/tile/{z}/{y}/{x}?token=xPLxWVBTxtoj_Mtop4cOywUPHY6c2St2pTeS-Hg8t04.', {
      //  maxZoom: 21,
      //  attribution: 'RLIS'
      // }).addTo(map);

      if(center ==null){
            map.on('popupopen', function(e) {
              var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup 
              px.y -= e.popup._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
              
              map.panTo(map.unproject(px), {animate: true}); // pan to new center
          });
      }else{
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
				}
			})


			if (center != null) {
				map.addLayer(analysis_buffers);
			}
		};

		var add_analysis_centers = function(data) {

			App.analysis_centers = data;

			var onEachFeature = function(feature, layer) {
				var htm = '<b>' + feature.properties.NAME + '</b><br/>' + feature.properties.TYPE + '<br/><a href="./#center/' + feature.properties.NAME + '">View in Atlas</a>';
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

		var add_bus_routes = function(data){

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
				map.fitBounds(newext);
			});
		} else{
			add_analysis_buffers(App.analysis_buffers);
			add_analysis_centers(App.analysis_centers);
			add_bus_routes(App.bus_routes);
			map.fitBounds(newext);
		}
	},

    addHeatmapControls : function(){
        var command = L.control({
          position: 'topright'
        });

        command.onAdd = function(map) {
          var div = L.DomUtil.create('div', 'command');

          div.innerHTML = '<div class="btn-group-vertical" data-toggle="buttons"> <label class="btn btn-default btn-xs"> <input type="radio" id="q156" name="quality[25]" value="1" title="bike" /> Bicycle Access </label><label class="btn btn-default btn-xs"> <input type="radio" id="q157" name="quality[25]" value="2" title="people" /> People Per Acre </label><label class="btn btn-default btn-xs"> <input type="radio" id="q158" name="quality[25]" value="3" title="transit" /> Transit Access </label><label class="btn btn-default btn-xs"> <input type="radio" id="q159" name="quality[25]" value="4" title="uli" /> Urban Living Infrastructure </label><label class="btn btn-default btn-xs"> <input type="radio" id="q160" name="quality[25]" checked="checked" value="5" title="sidewalk" /> Sidewalk density </label> <label class="btn btn-default btn-xs"> <input type="radio" id="q160" name="quality[25]" title="parks" checked="checked" value="5" /> Access to Parks </label> <label class="btn btn-default btn-xs"> <input type="radio" id="q160" name="quality[25]" title="block" checked="checked" value="5" /> Block Size </label><label ><input type="range" value="1" min="0.01" max=".7" step=".05" id="sliHeatmap" style="background:#fff;margin-left:7px;"/> </label> </div>';
          L.DomEvent.disableClickPropagation(div);
          return div;
        };

        command.addTo(map);

        $('[name="quality[25]"]').on('change', function() {
          var id = $(this).prop('title');
          //
          //download png? add as a heatmap.s
          App.heatmap.init(id);
        });

        $('#sliHeatmap').on('input change', function () {
                App.heatmap.maxOpacity = parseFloat($(this).val());
                App.heatmap._reconfigure();
            });

    }
  },

  heatmap: {
    layer: null,
    rasters: {},
    rasterMultiplier: {},
    curRasters: [],
    tooltip: null,
    blur: .65,
    gradientIndex: 2,
    heattip_enabled: false,
    pngdata: [],
    resolution: 3,
    radius: .00381,
    maxOpacity: 0.7,
    minOpacity: 0,
    gradients: [{
        '.55': '#278590',
        '.85': '#F9FBBD',
        '.95': '#0000FF',
        '1': '#9D5923'
      }, {
        '.5': '#0C307A',
        '.85': '#76EC00',
        '1': '#C2523C'
      }, {
        '.3': '#3562CF',
        '.6': '#FFFFBF',
        '1': '#C44539'
      }, {
        '0': '#FFDFDF',
        '1': '#8F0C0A'
      },
      null
    ],
    init: function(id) {

      var layer;
      $.each(layers, function(i, v) {
        if (v.id == id) {
          layer = v;
        }
      });

      var xhr = new XMLHttpRequest();
      xhr.open('GET', layer.file, true);
      xhr.responseType = 'arraybuffer';
      pngdata = [];
      xhr.onload = function(e) {
        if (this.status == 200) {
          var reader = new PNGReader(this.response);
          reader.parse(function(err, png) {
            if (err) throw err;
            App.heatmap.curRasters.push(layer);
            App.heatmap.rasters[id] = png;
            App.heatmap.rasterMultiplier[id] = 1;
            App.heatmap.render(id);
          });
        }
      };

      xhr.send();
    },
    _init: function() {
      this.config = {
          "radius": this.radius,
          "maxOpacity": this.maxOpacity,
          "minOpacity": this.minOpacity,
          "scaleRadius": true,
          "useLocalExtrema": true,
          "blur": this.blur,
          "gradient": this.gradients[2],
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
    sync: function(id, active) {

      if (active == false) {
        $.each(this.curRasters, function(i, v) {
          if (App.util.getLayerId(v.name) == id) {
            App.heatmap.curRasters.splice(i, 1);
            App.heatmap.render(id);
            return false;
          }
        });
      } else {
        var lyr = $.grep(config.layers, function(item) {
          return App.util.getLayerId(item.name) == id;
        })[0];

        this.curRasters.push(lyr);

        this.render();
      }
    },
    _reconfigure: function() {

      map.removeLayer(this.layer);

      this.config = {
        "radius": this.radius,
        "maxOpacity": this.maxOpacity,
        "minOpacity": this.minOpacity,
        "blur": this.blur,
        "gradient": this.gradients[this.gradientIndex],
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
    render: function(id) {

      this.pngdata = [];

      if (App.heatmap.layer == null) {
        this._init();
      }

      if (this.curRasters.length == 0) {
        this.layer.setData({
          max: 0,
          data: []
        });
        map.removeLayer(this.layer);
        return;
      } else if (!map.hasLayer(this.layer)) {
        map.addLayer(this.layer);
      }

      var rManager = {};

      //group rasters by dimensions
      $.each(this.curRasters, function(i, v) {

        //var id = App.util.getLayerId(v.name);

        //if (typeof(v.width) != 'undefined') {
        var dims = v.width + '_' + v.height;
        // } else { //for geojson point-based heatmaps

        //   if (typeof(rManager['geojson']) != 'undefined') {
        //     rManager.geojson.push(id);
        //   } else {
        //     rManager.geojson = {
        //       rasters: [id]
        //     };
        //   };
        //   return true;
        // }

        //concatenated, stringified to code width and height to support 
        //grouping
        //for true rasters (eg. PNGs)
        if (typeof(rManager[dims]) != 'undefined') {
          rManager[dims].rasters.push(id);
        } else {
          rManager[dims] = {
            height: v.height,
            width: v.width,
            rasters: [id],
            nodata: v.nodata,
            ul: v.ul,
            step: v.step
          };
        }
      });

      for (var dims in rManager) {
        //combing point based heatmap
        this._crush(rManager[dims]);
      }

      this.layer.setData({
        max: this.maxval,
        data: this.pngdata
      });
    },
    _crush: function(colRasters) {
      var curlng = colRasters.ul[0];
      var curlat = colRasters.ul[1];

      for (var x = 0; x < colRasters.width - this.resolution; x += this.resolution) {
        for (var y = 0; y < colRasters.height - this.resolution; y += this.resolution) {
          var val = 0;

          for (var r = 0; r < colRasters.rasters.length; r++) {

            var tempval = this.rasters[colRasters.rasters[r]].getPixel(x, y)[1];
            if (tempval > colRasters.nodata) {
              val += tempval * this.rasterMultiplier[colRasters.rasters[r]];
            }
          }

          if (val > colRasters.nodata && val < 255) {
            if (val > this.maxval) {
              this.maxval = val;
            }
            this.pngdata.push({
              lng: curlng,
              lat: curlat,
              count: val
            });
          }

          curlat -= (colRasters.step * this.resolution);
        }
        curlng += (colRasters.step * this.resolution);
        curlat = colRasters.ul[1];
      }
    }
  }
}


/*
todo

zoom to extent of center on center load
activity spectrum graph
heatmap opacity slider - resample?
  make top end less opaque
  mute heatmap gradient
All informatoin last updated on ...in footer.
zoom to feature extent and not centroid and static scale
activity spectrum and typologies
sunset transit

*/