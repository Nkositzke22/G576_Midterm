require([                         // Links back to ESRI API's files (one of the src's we linked above)
  "esri/config",                  // AMD (Autonomous Module Definition) standard- grab the libraries we need. This one specifically gives access to master settings
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/widgets/Editor",
  "esri/widgets/Expand",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Locate",
  "esri/widgets/Search",
  "esri/symbols/PictureMarkerSymbol",
  "esri/renderers/SimpleRenderer",

], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Editor, Expand, BasemapGallery, Locate, Search, PictureMarkerSymbol, SimpleRenderer) {
    //esriConfig.apiKey = "AAPTau7l9zV1JqiD1DBhryF-CPg..ZLSOcbqgh0ONE2slQEiaTqrrUI9TlEQg-3ZfWtrR-Ur2oKQRwsv-KCdLKsARwQBmPGaG2FKABsW3UmmWIU-XJKOMLXRXHIwIGTZ-em8fZ6ln7jgXILnyk_sdiPEmyHHJ2R3aewVZeHoN_D5zBlUrSDh34lDuLWb8Pqkd_AZTEeTKoUFodKYWH-GFpwherADvTOzXsWe5qGAf9LXl64x-tfRA3Ohh_KUnBRvjZni6S_7xIgaT4DTFIQZ8DMMEk0vvSSN_JwLUAT1_WThHLKNd"

  // ==========================================
  // 1. GLOBAL CONSTANTS AND CONFIG
  // ==========================================
  const MAP_CONFIG = {            // Define configurations here, to use throughout rest of script
    center: [-89.4125, 43.0722],
    zoom: 12,
    basemap: "hybrid",
    urls: {
        inputLayer: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Bird_Locations/FeatureServer/0"
    }
  };

  // [H. McBride: Added Global Popup Template, 07/08/2026, based off of G576 Lab 2]
  const popupBirds = {
    title: "Bird Sighting Details",
    content: "<b>Bird Type:</b> {Bird_Type}<br><b>Sighting Time:</b> {Sighting_Time}<br>"
  }

  // ==========================================
  // 2. DOM ELEMENTS AND INITIALIZATION
  // ==========================================
  const map = new Map({ basemap: MAP_CONFIG.basemap });   //Initialize new map

  const view = new MapView({
    map: map,
    center: MAP_CONFIG.center,
    zoom: MAP_CONFIG.zoom,
    container: "viewDiv"
  });

  // ==========================================
  // 3. DATA LAYERS
  // ==========================================


  // Graphics logic


  // Feature Layers [H. McBride: Added outfields and popup to the feature layer, 07/08/2026]
  const inputLayer = new FeatureLayer({
    url: MAP_CONFIG.urls.inputLayer,
    outFields: ["Bird_Type", "Sighting_Time"],
    popupTemplate: popupBirds
  });

  // Create symbol for usage as point marker
  const birdSymbol = {
    type: "picture-marker",
   url: "https://raw.githubusercontent.com/Nkositzke22/G576_Midterm/main/bird_icon_glow.png",
   width: "32px",
   height: "32px"
  };

  // Creates a renderer object for my birdSymbol
  const birdRenderer = {
    type: "simple", // Every feature in my inputLayer will use the same symbol
    symbol: birdSymbol
  };

  // Applies the renderer to my layer
  inputLayer.renderer = birdRenderer;
  
  // ==========================================
  // 4. UI/WIDGETS
  // ==========================================
    //Creating the widgets
  const searchWidget = new Search({     // Creates the search  widget 
    view:view                           // Links widget to specific map view (widget needs to know which map view to search)
  });

  const locateBtn = new Locate({        // Creates the locate button widget
    view: view                          // Links widget to specific map view
  });



    //Nesting widgets
  const searchExpand = new Expand({     
    view: view,
    content: searchWidget,              // Tells the Expand container to hold the search widget
    expandIcon: "search"                // Tells the UI to display the universal Search icon when the exand widget is closed
  });

  const locateExpand = new Expand({     
    view: view,
    content: locateBtn,              // Tells the Expand container to hold the locate button widget
    expandIcon: "locate"                // Tells the UI to display the universal Locate icon when the exand widget is closed
  });

  const editor = new Editor({   // Sets up the editor panel
    view: view,
    layerInfos: [{
        layer: inputLayer, // Applies the Editor to my featureLayer
        addEnabled: true,
        updateEnabled: true,
        deleteEnabled: true
    }]
  });

  const editorExpand = new Expand({ // Wraps the Editor in an Expand panel
    view: view,
    content: editor, 
    expandIcon: "pencil",   // Sets the icon for the Expand Editor wrapper
    group: "top-left"
  });

    //- Adding widgets to view
  view.ui.add(searchExpand, {           // Adds the searchExpand widget to the map view      
    position: "top-left",               // Positions the widget
    index: 0                            // Stacks at the top of the expand stack (top corner of screen)
  });

  view.ui.add(locateExpand, {             // Adds the locate button widget to the map view
    position: "top-left",               // Positions the widget
    index: 1                            // Stacks at the top of the expand stack (top corner of screen)
  });

  view.ui.add(editorExpand, "top-left");    // Adds the expand widget to the map view, and positions it at the top left under the search and locate widgets

  // ==========================================
  // 5. HANDLING ERRORS
  // ==========================================
  locateBtn.on("locate-error", (event) => {     // Listen for errors on the Locate button
    console.error("Locate Widget Error:", event.error);
    alert("Unable to find your location. Please check your phone's privacy settings or ensure your GPS signal is strong.");
  });

  inputLayer.load().catch((error) => {               // Catch errors when the layer fails to load
    console.error("Layer Load Error:", error);
    alert("Failed to load the layer. Please try again later.");
  });


  // ==========================================
  // 6. SCRIPT EXECUTION
  // ==========================================
    map.add(inputLayer);


});