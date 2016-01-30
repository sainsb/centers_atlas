#State of the Centers Atlas

##Current Build: 0.0.5
##Release Date: 2015-09-21

###App Notes:
A web-based version of the state of the centers atlas.

###Initial Development: 
	Developed by BNS
	qa url: https://gis.oregonmetro.gov/dev/soc/#Aloha
	issue tracking: 


#Jan 30, 2016 v0.0.6
## Tasks

* Fixed time slider in IE
* Restyled time slider to make it less obtrusive.
* Bus routes show maptip on hover.  *Note - IE map performance is really shitty with bus routes turned on.  Would be really good to simplify this geometry.
* Prevent map from zooming too close.
* Improved heatmap loading time and provided UI progress indicator.
* Implemented static heat maps to improve loading of maps.
* Fixed bug where map doesn't always zoom to Center when entering centers page 
* Fixed banner at a variety of screen widths. 
* Made analysis buffers not clickable (hides the thumb icon when hovering over them (misleading b/c nothing shows up when clicking))

## Comments

* I might suggest adding title/alt attributes to image elements so that when a user hovers over a picture in the site it gives a little tooltip with a descriptor.
* To switch the app back to the fancier Heatmap.js canvas flip the bool at the top of the script.js USE_STATIC_HEATMAPS to true *** NOte that if you do this, you'll also need to ensure that there is a ULI.png available and add it to the top of the script in the same fashion as the other 6 indicator rasters are declared.
* I haven't set the site up for build mode, to do so, consult with Kellie how to move the script.js and the style.js into the compiled js/css and remove the extra script includes from the index.htm file.

#Sep 21, 2015 v0.0.5

## Bugs Fixed
- Centers zoom to their extent upon page load
- Household income bar chart and Context Tool scores graphs set to static scales
- Center changes respect slider year
- Slider does not get re-created if it already exists
- Added slider padding

## Enhancements
- Restricted map zoom and pan to Metro Region
- Adjusted color gradient, resolution, radius, and blur of heatmap - not perfect, but looks a lot better.
- Changed newdata.json to data.json, deleted data.js

## Todo
- Forest Grove Employment breakdown numbers
- Typology averages... (?)
- Happy Valley incomes 2011

#Jul 20, 2015 v0.0.0.7

- Added home, about pages
- Added map to home page
- Set up single page app aka routing using Path.js
- Added data last updated notice in footer
- Added heatmaps to map in center page
- Moved map above graphs


#Jun 24, 2015 v0.0.0.5

- Added radar graph for context tool scores
- Added time slider for graphs
- colored center polygons in map according to type
- Added map popup with center name, type and link to view in Atlas
- Right-justified private amenity numbers in amenity grid
- Fixed Nav bar menu to dropdown to the left instead of off screen to the right.