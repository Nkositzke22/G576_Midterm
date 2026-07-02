// ================================
// 1. INITIAL REQUIRE SECTION
// ================================
require([
  "esri/config",                  // AMD (Autonomous Module Definition) standard- grab the libraries we need. This one specifically gives access to master settings
  "esri/WebMap",
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/widgets/Editor",
  "esri/widgets/Expand",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Locate",
  "esri/widgets/Search"
], function (esriConfig, WebMap, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Editor, Expand, BasemapGallery, Locate, Search) {

    //will need this for the S4 text response box
    let selectedFeature = null;
// ================================
// 2. SETTING UP STATES AND BUTTONS
// ================================
    //Activate State 1 on page load
    window.addEventListener('load',() => {
        //manually add 'active' to the first section 
        const state1 = document.getElementById('State_1');
        if (state1) {
            state1.classList.add('active');
        }
    });

    //Make my state change button functions globally visible
    window.showNextState = showNextState;
    window.showPrevState = showPrevState;

    //Next state trigger for "next_btn"
    function showNextState() {  //creates a named function
        //Find the currently active section
        const currentSection = document.querySelector('.state_section.active'); //creates a 'currentSection' variable. Searches my HTML DOM for an element with both the 'state_section' and 'active' classes
        
        //Find the one that comes after it in the HTML
        const nextSection = currentSection.nextElementSibling;  //creates a 'nextSection' variable. Looks at the HTML and identifies the next section html tag that appears after 'curretnSection'
        
        //Only proceed if there is actually a "next" section
        if (nextSection && nextSection.classList.contains('state_section')) {   //if there is a next element, and if that element has a 'state_section' class,...
            currentSection.classList.remove('active');  //removes 'active' badge from my current section
            nextSection.classList.add('active');    //makes the next section active
        }
    }

    //Previous state trigger for "prev_btn"
    function showPrevState() {
        const currentSection = document.querySelector('.state_section.active');
        const prevSection = currentSection.previousElementSibling;
        if (prevSection && prevSection.classList.contains('state_section')) {
            currentSection.classList.remove('active');
            prevSection.classList.add('active');

            
        }
    }

// ================================
// 3. GLOBAL CONSTANTS AND CONFIG
// ================================
    const MAP_CONFIG ={
        center: [0, 20],
        zoom: 2,
        basemap: "satellite",
    };

// ================================
// 5. DATA LAYERS
// ================================
    const studentPointsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Chosen_Point/FeatureServer/0",
        outFields: ["*"],
        popupTemplate: {
            title: "Student Rationale",
            content: "Rationale: {Point_Rationale}"
        }
    })


// ================================
// 4. DOM ELEMENTS AND INITIALIZATION
// ================================
    //State 2 map
    const webmapS2 = new WebMap({ 
        portalItem: {
            id: "e32b22d21baf41a1876b337c80c73243"
        }
     });

    const viewS2 = new MapView({
        map: webmapS2,
        center: [28.9784, 41.0082],
        zoom: 7,
        container: "mapView_S2"

    });

    //State 3 map
    const mapS3 = new Map({ 
        basemap: MAP_CONFIG.basemap, 
        layers: [studentPointsLayer]
    });
    const viewS3 = new MapView({
        map: mapS3,
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        container: "mapView_S3"
    });



    //State 4 map
    const mapS4 = new Map({ 
        basemap: MAP_CONFIG.basemap, 
        layers: [studentPointsLayer]
    });
    const viewS4 = new MapView({
        map: mapS4,
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        container: "mapView_S4"
    });

    //Click listener in S4
    viewS4.on("click", (event) => {
        viewS4.hitTest(event).then((response) => {
            if (response.results.length > 0) {
                selectedFeature = response.results[0].graphic;
                const inputField = document.getElementById("responseInput");
                if (inputField) {
                    inputField.value = selectedFeature.attributes.Classmate_Response || "";
                }
            }
        });
    });

// ================================
// 6. UI/WIDGETS
// ================================
// 6. UI/WIDGETS
    const editor = new Editor({
        view: viewS3,
        allowedWorkflows: ["create"],
        layerInfos: [{ layer: studentPointsLayer, addEnabled: true }]
    });
    viewS3.ui.add(editor, "top-right");



// ================================
// 7. HANDLING ERRORS
// ================================

// ================================
// 8. SCRIPT EXECUTION
// ================================
    window.saveResponse = function() {
        if (selectedFeature) {
            selectedFeature.attributes.Classmate_Response = document.getElementById("responseInput").value;
            studentPointsLayer.applyEdits({
                updateFeatures: [selectedFeature]
            }).then(() => {
                alert("Response saved successfully!");
            });
        } else {
            alert("Please select a point on the map first.");
        }
    };
});

