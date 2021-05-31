var map = [], markers = [], mapBounds = [], clusterer = [];

var fitOnClick = [];

var mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#92b1cc"
            },
            {
                "lightness": 30
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            },
            {
                "lightness": 80
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            },
            {
                "lightness": 70
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            },
            {
                "lightness": 60
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            }
        ]
    },
    {
        "featureType": "poi.government",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            },
            {
                "lightness": 10
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "poi.place_of_worship",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            },
            {
                "saturation": -100
            },
            {
                "lightness": -100
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            },
            {
                "lightness": 10
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#92b1cc"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#93b1cc"
            },
            {
                "lightness": -10
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
];

$(document).ready(function() {

    var infoWindow = new google.maps.InfoWindow({maxWidth: 400, maxHeight: 400});
    var clusterStyles = [];

    Cluster.prototype.inVicinity = function (dist) {
        for (var i = 0; i < this.markers_.length; i++) {
            var markerPos = this.markers_[i].getPosition();
            if (Math.pow(this.center_.k - markerPos.k, 2) + Math.pow(this.center_.D - markerPos.D, 2) > Math.pow(dist, 2)) return false;
        }
        return true;
    };

    /**
     * The default function for determining the label text and style
     * for a cluster icon.
     *
     * @param {Array.<google.maps.Marker>} markers The array of markers represented by the cluster.
     * @param {number} numStyles The number of marker styles available.
     * @return {ClusterIconInfo} The information resource for the cluster.
     * @constant
     * @ignore
     */
    MarkerClusterer.nkCALCULATOR = function (markers, numStyles) {
        var index = 0;
        var title = "";
        var count = markers.length.toString();
        var currentType = '';
        var homogene = true;
        var digital = true;

        markers.forEach(function(marker, i) {
            if (i > 0) {
                if (marker.type != currentType) {
                    homogene = false;
                    if (marker.type.substr(0, 7) != 'digital') {
                        digital = false;
                    }
                }
            } else {
                currentType = marker.type;
            }
        });

        if (homogene) {
            clusterStyles.forEach(function(style, styleIndex) {
              if (style.type == currentType) {
                  index = styleIndex + 1;
              }
            });
        } else {
            clusterStyles.forEach(function(style, styleIndex) {
                if ((style.type == 'heterogen') && (digital == false)) {
                    index = styleIndex + 1;
                } else if ((style.type == 'digital-heterogen') && (digital == true)) {
                    index = styleIndex + 1;
                }
            });

        }

        index = Math.min(index, numStyles);
        return {
            text: count,
            index: index,
            title: title
        };
    };


    // -----------------------------------------------------------------

    function addMapMarker(map, pointOfInterest) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(pointOfInterest.lat, pointOfInterest.lon),
            icon: pointOfInterest.icon,
            height: 38,
            width: 32,
            title: pointOfInterest.title,
            map: map,
            type: pointOfInterest.type
        });

        marker.infoText = pointOfInterest.info;

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.close();
            infoWindow.open(map, marker);
            infoWindow.setContent(marker.infoText);
        });

        return marker;
    }

    // -----------------------------------------------------------------


    function getMapCenter(id) {
        var center;

        if (gmapConfig[id]['center']['mode'] == 'fixed') {
            center = new google.maps.LatLng(gmapConfig[id]['center']['lat'], gmapConfig[id]['center']['lon']);
        } else if ((gmapConfig[id]['center'] == 'user') && (navigator.geolocation)) {
            navigator.geolocation.getCurrentPosition(function(position) {
                center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            },
            function() {
                center = mapBounds[id].getCenter();
            });

        } else {
            if (markers[id].length > 500) {
                return false;
            } else {
                center = mapBounds[id].getCenter();
            }
        }
        return center;
    }

    // -----------------------------------------------------------------

    function fitGMap(id) {

        google.maps.event.trigger(map[id], 'resize');

        map[id].fitBounds(mapBounds[id]);
        // map[id].setCenter(mapBounds[id].getCenter());
        var center = getMapCenter(id);
        if (center == false) {
            center = new google.maps.LatLng(54.136244, 10.409546);
        }

        map[id].setCenter(center);

        if (map[id].getZoom() > 12) {
            map[id].setZoom(12);
        }

        if (map[id].getZoom() < 9) {
            map[id].setZoom(9);
        }
    }

    // -----------------------------------------------------------------

    function getClusterStyle(elementType, iconUrl, iconWithBadge) {
        if (iconWithBadge) {
            var anchorText =  [-1, -14];
        } else {
            var anchorText =  [-11, -4];
        }

        return {
            url: iconUrl,
            height: 47,
            width: 40,
            anchorIcon: [34, 16],
            anchorText: anchorText,
            textColor: '#ffffff',
            textSize: 12,
            textHeight: 22,
            textWidth: 22,
            lineHeight : 22,
            background: '#850057',
            borderRadius: '99px',
            type: elementType
        };
    }


    // -----------------------------------------------------------------

    function createCluster(id) {

        var iconBase = gmapConfig[id]['iconBase'];

        clusterStyles = [
            getClusterStyle('heterogen', iconBase + 'heterogen.svg', false),
            getClusterStyle('digital-heterogen', iconBase + 'heterogen_digital.svg', true),

            getClusterStyle('event-church_service', iconBase + 'event_gottesdienst.svg', false),
            getClusterStyle('event-edu', iconBase + 'event_bildung.svg', false),
            getClusterStyle('event-committee', iconBase + 'event_gremien.svg', false),
            getClusterStyle('event-event', iconBase + 'event_gemeindeleben.svg', false),
            getClusterStyle('event-leisure', iconBase + 'event_freizeit.svg', false),
            getClusterStyle('event-music', iconBase + 'event_konzerte.svg', false),
            getClusterStyle('event-spirituality', iconBase + 'event_spiritualitaet.svg', false),
            getClusterStyle('event-base', iconBase + 'event_gemeindeleben.svg', false),

            getClusterStyle('digital-event-church_service', iconBase + 'event_digital-gottesdienst.svg', true),
            getClusterStyle('digital-event-edu', iconBase + 'event_digital-bildung.svg', true),
            getClusterStyle('digital-event-committee', iconBase + 'event_digital-gremien.svg', true),
            getClusterStyle('digital-event-event', iconBase + 'event_digital-gemeindeleben.svg', true),
            getClusterStyle('digital-event-leisure', iconBase + 'event_digital-freizeit.svg', true),
            getClusterStyle('digital-event-music', iconBase + 'event_digital-konzerte.svg', true),
            getClusterStyle('digital-event-spirituality', iconBase + 'event_digital-spiritualitaet.svg', true),
            getClusterStyle('digital-event-base', iconBase + 'event_digital-gemeindeleben.svg', true),

            getClusterStyle('institution-4', iconBase + 'inst_kirchengemeinde.svg', false),
            getClusterStyle('institution-6', iconBase + 'inst_friedhof.svg', false),
            getClusterStyle('institution-9', iconBase + 'inst_kirche.svg', false),
            getClusterStyle('institution-11', iconBase + 'inst_kita.svg', false),
            getClusterStyle('institution-12', iconBase + 'inst_kirchenkreis.svg', false),
            getClusterStyle('institution-16', iconBase + 'inst_synode.svg', false),
            getClusterStyle('institution-22', iconBase + 'inst_diakonie.svg', false),
            getClusterStyle('institution-31', iconBase + 'inst_kirchenamt.svg', false),
            getClusterStyle('institution-33', iconBase + 'inst_kirchenbuero.svg', false),
            getClusterStyle('institution-35', iconBase + 'inst_bischof.svg', false),
            getClusterStyle('institution-37', iconBase + 'inst_kirchenleitung.svg', false),
            getClusterStyle('institution-42', iconBase + 'inst_kirchenamt.svg', false),
            getClusterStyle('institution-65', iconBase + 'inst_tagungshaus.svg', false),
            getClusterStyle('institution-122', iconBase + 'inst_pfadfinder.svg', false)
        ];

        clusterer[id] = new MarkerClusterer(map[id], markers[id], {
            gridSize: 40,
            calculator: MarkerClusterer.nkCALCULATOR,
            styles: clusterStyles
        });

        google.maps.event.addListener(clusterer[id], 'clusterclick', function (cluster) {
            if (cluster.inVicinity(0.0003)) {
                clusterer[id].setZoomOnClick(false);
                infoWindow.close();
                infoWindow.setContent(
                    cluster.getMarkers().map(function(m){return m.infoText;}).join('')
                );
                infoWindow.setPosition(cluster.getCenter());
                infoWindow.open(map[id]);
                setTimeout(
                    function(){
                        clusterer[id].setZoomOnClick(true);
                    },
                    50
                );
            }
        });
    }

    // -----------------------------------------------------------------

    function filterMarker(id, value) {
        clusterer[id].setMap(null);
        var addMarkers = [];
        var removeMarkers = [];
        if (value) {
            markers[id].forEach(function(marker) {
                var types = marker.type.split(' ');
                if (types.indexOf(value) > -1) {
                    if (!marker.getVisible()) {
                        marker.setVisible(true);
                        addMarkers.push(marker);
                    }
                } else {
                    marker.setVisible(false);
                    removeMarkers.push(marker);
                }
            });
        } else {
            markers[id].forEach(function(marker) {
                if (!marker.getVisible()) {
                    marker.setVisible(true);
                    addMarkers.push(marker);
                }
            });
        }
        clusterer[id].setMap(map[id]);
        clusterer[id].removeMarkers(removeMarkers, false, true);
        clusterer[id].addMarkers(addMarkers, false);

    }

    // -----------------------------------------------------------------

    function loadMapMarkers(id, url, page) {
        var requestUrl = url +  '&' + gmapConfig[id]['pagination'] + '=' + page;
        $.getJSON(requestUrl, function(result) {
            if (result && (result.data.length > 0)) {
                for (var i = 0, pointOfInterest; pointOfInterest = result.data[i]; i++) {
                    markers[id].push(addMapMarker(map[id], pointOfInterest));
                    mapBounds[id].extend(new google.maps.LatLng(pointOfInterest.lat, pointOfInterest.lon));
                }

                if (result.crdate) {
                    createCluster(id);
                    $('.gmap-canvas-container[data-gmap-id="' + id + '"] .overlay').hide();
                } else {
                    window.setTimeout(500, loadMapMarkers(id, url, page + 1));
                }

            } else {

                createCluster(id);

                // fitGMap(id);

                $('.gmap-canvas-container[data-gmap-id="' + id + '"] .overlay').hide();

            }
        });
    }

    // -----------------------------------------------------------------

    function initGMap(id) {

        map[id] = new google.maps.Map(document.getElementById('gmap-canvas-' + id), {
            center: new google.maps.LatLng(54.136244, 10.409546),
            zoom: 8,
            initialZoom: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUi: true,
            disableDoubleClickZoom: true,
            keyboardShortcuts: true,
            scrollwheel: true,
            styles: mapStyle
        });

        mapBounds[id] = new google.maps.LatLngBounds();
        markers[id] = [];

        // Add markers from array
        if (gmapConfig[id]['markers'].length) {
            gmapConfig[id]['markers'].forEach(function(pointOfInterest) {
                markers[id].push(addMapMarker(map[id], pointOfInterest));
                mapBounds[id].extend(new google.maps.LatLng(pointOfInterest.lat, pointOfInterest.lon));
            });

            createCluster(id);

            fitGMap(id);

        } else {
            if (gmapConfig[id]['streamUri']) {

                loadMapMarkers(id, gmapConfig[id]['streamUri'], 1);

            } else if (gmapConfig[id]['requestUri']) {
                $.getJSON(gmapConfig[id]['requestUri'], function(result) {
                    if (result && result.data && (result.data.length > 0)) {
                        for (var i = 0, pointOfInterest; pointOfInterest = result.data[i]; i++) {
                            markers[id].push(addMapMarker(map[id], pointOfInterest));
                            mapBounds[id].extend(new google.maps.LatLng(pointOfInterest.lat, pointOfInterest.lon));
                        }

                        createCluster(id);

                        fitGMap(id);

                        $('.gmap-canvas-container[data-gmap-id="' + id + '"] .overlay').hide();
                    }
                });
            }
        }

        // Filter map marker by select box
        $('select.map-filter').change(function() {
            var id = $(this).data('gmap-id');
            var type = $(this).data('type');
            var value = $(this).val();

            // reset all other filters
            $('.map-filter').each(function() {
               if ($(this).data('type') != type) {
                   $(this).val('');
                   $(this).niceSelect('update');
               }
            });

            filterMarker(id, value);
        });

        // Filter map marker by list item
        $('ul.form-field--map-filter li').click(function() {
            var $list = $(this).parent('.form-field--map-filter');
            var id = $list.data('gmap-id');
            var type = $list.data('type');
            var value = $(this).data('value');

            // reset all other filters
            $('.form--map-filter .form__field').each(function() {
                var $filter = $(this).find('ul.form-field--map-filter');
                if ($filter.data('type') != type) {
                    var defaultValue = $filter.find('li:first-child').data('caption');
                    $(this).find('.form-field__selected-option').html(defaultValue);
                    $filter.parent('.form-field--dropdown').removeClass('form-field--selected');
                }
            });

            filterMarker(id, value);

        });



        // change map zoom to fit all markers
        google.maps.event.addListener(map[id], 'zoom_changed', function() {
            zoomChangeBoundsListener = google.maps.event.addListener(map[id], 'bounds_changed', function() {
                if (this.getZoom() > 12 && this.initialZoom == true) {
                    this.setZoom(12);
                    this.initialZoom = false;
                }
                google.maps.event.removeListener(zoomChangeBoundsListener);
            });
        });

        if (gmapConfig[id]['fitOnClick'] != '') {
            if (typeof(fitOnClick[gmapConfig[id]['fitOnClick']]) == 'undefined') {
                fitOnClick[gmapConfig[id]['fitOnClick']] = true;
                $(gmapConfig[id]['fitOnClick']).click(function() {
                    $('.gmap-canvas-container').each(function() {
                        var mapId = $(this).data('gmap-id');
                        var gmapCanvas = $('#gmap-canvas-' + mapId);
                        if (gmapCanvas.hasClass('initialized') == false) {
                            fitGMap(mapId);
                            gmapCanvas.addClass('initialized');
                        }
                    });
                });
            }
        } else {
            $('#gmap-canvas-' + id).addClass('initialized');
        }
    }

    var observerCallback = function(entries, observer) {
        for(var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if(entry.intersectionRatio >= 0.1) {
                initGMap($(entry.target).data('gmap-id'));
                observer.unobserve(entry.target);
            }
        }
    };

    var mapElements = document.querySelectorAll('.gmap-canvas-container');

    if(mapElements && mapElements.length > 0) {
        var observer = new IntersectionObserver(observerCallback, {
            threshold: [0.1]
        });
        for(var i = 0; i < mapElements.length; i++) {
            observer.observe(mapElements[i]);
        }
    }

    // -----------------------------------------------------------------

});
