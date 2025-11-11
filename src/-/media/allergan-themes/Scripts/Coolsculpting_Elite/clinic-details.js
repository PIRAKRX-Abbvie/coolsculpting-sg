document.addEventListener('DOMContentLoaded', () => {
    var markers = [];
    var brandName = "CoolSculpting Elite";
    var countryCode = $('#settings-countrycode').attr('data-country');
    const loader = document.querySelector('#loadingDiv');
    var individualurl = null;
    var allClinicurl = null;
    var findaClinicUrl = null;
    if (document.getElementById("individualroutelink") != null && document.getElementById("individualroutelink").innerText) {
        individualurl = document.getElementById("individualroutelink").innerText;
    } else {
        individualurl = './individualclinic';
    }
    if (document.getElementById("allclinicsroutelink") != null && document.getElementById("allclinicsroutelink").innerText) {
        allClinicurl = document.getElementById("allclinicsroutelink").innerText;
    } else {
        allClinicurl = './cliniclist';
    }
    if (document.getElementById("findaclinicroutelink") != null && document.getElementById("findaclinicroutelink").innerText) {
        findaClinicUrl = document.getElementById("findaclinicroutelink").innerText;
    } else {
        findaClinicUrl = './findaclinic';
    }
    var markset, globalparsedData,
        map;
    var rateCenter = [
        {
            id: 'a7q1o000000IN0KAAW',
            score: 3
        },
        {
            id: 'a7q1o000000IN0LAAW',
            score: 3
        },
        {
            id: 'a7q1o000000IMx9AAG',
            score: 2
        },
        {
            id: 'a7q1o000000IN0SAAW',
            score: 2
        },
        {
            id: 'a7q1o000000IN14AAG',
            score: 1
        },
        {
            id: 'a7q1o000000IN6DAAW',
            score: 1
        },
        {
            id: 'a7q1o000000IMzJAAW',
            score: 1
        },
        {
            id: 'a7q1o000000IN58AAG',
            score: 1
        },
        {
            id: 'a7q1o000000IN5bAAG',
            score: 1
        }
    ];
    var rateCenter = [];
    var ddlradius;

    $(document).on('keyup', '#search', function (e) {
        if (e.keyCode == 8) {
            $('#search').attr('data-lat', '');
            $('#search').attr('data-lng', '');
        }

        if (e.keyCode == 37 || e.keyCode == 39) {
            $('#search').attr('data-lat', '');
            $('#search').attr('data-lng', '');
            $('#search').val('');
        }
        var ctrlDown = e.ctrlKey || e.metaKey;
        if (ctrlDown && e.keyCode == 86) {
            $('#search').attr('data-lat', '');
            $('#search').attr('data-lng', '');
        }
        if (ctrlDown && e.keyCode == 65 || e.keyCode == 97) {
            $('#search').attr('data-lat', '');
            $('#search').attr('data-lng', '');
        }
    });
    $(document).on('keyup', '#footerSearch', function (e) {
        if (e.keyCode == 8) {
            $('#footerSearch').attr('data-lat', '');
            $('#footerSearch').attr('data-lng', '');
        }

        if (e.keyCode == 37 || e.keyCode == 39) {
            $('#footerSearch').attr('data-lat', '');
            $('#footerSearch').attr('data-lng', '');
            $('#footerSearch').val('');
        }
        var ctrlDown = e.ctrlKey || e.metaKey;
        if (ctrlDown && e.keyCode == 86) {
            $('#footerSearch').attr('data-lat', '');
            $('#footerSearch').attr('data-lng', '');
        }
        if (ctrlDown && e.keyCode == 65 || e.keyCode == 97) {
            $('#footerSearch').attr('data-lat', '');
            $('#footerSearch').attr('data-lng', '');
        }
    });

    if (document.getElementById('loadingDiv')) {
        loader.style.display = "none";
    }

    if (document.querySelector('.mylocation') != null) {

        var mylocation = document.querySelector('.mylocation');
        mylocation.addEventListener('click', () => {
            // navigator.geolocation.getCurrentPosition(success, error, [options]);
            tryGeolocation();
            loader.style.display = "block";
        });
    }

    var apiGeolocationSuccess = function (position) {
        //alert("API geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
        initmap(position.coords.latitude, position.coords.longitude);
        searchAction(position.coords.latitude, position.coords.longitude, brandName, "");
    };

    var tryAPIGeolocation = function (geolocationSuccessFn) {
        var url = $('#settings-geolocation').attr('data-geolocationapi');
        jQuery.post(url, function (success) {
            if (geolocationSuccessFn) {
                geolocationSuccessFn({ coords: { latitude: success.location.lat, longitude: success.location.lng } });
            } else {
                apiGeolocationSuccess({ coords: { latitude: success.location.lat, longitude: success.location.lng } });
            }
        })
            .fail(function (err) {
                $('#errorModal').modal();
                $('#errorModal').on('shown.bs.modal', function () {
                    $(".modal-body").html($("#Apigeolocationerr").html());
                });
            });
    };

    var browserGeolocationSuccess = function (position) {
        //alert("Browser geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
        initmap(position.coords.latitude, position.coords.longitude);
        searchAction(position.coords.latitude, position.coords.longitude, brandName, "");
    };

    var browserGeolocationFail = function (error) {
        switch (error.code) {
            case error.TIMEOUT:
                tryAPIGeolocation();
                break;
            case error.PERMISSION_DENIED:
                if (error.message.indexOf("Only secure origins are allowed") == 0) {
                    tryAPIGeolocation();
                }
                break;
            case error.POSITION_UNAVAILABLE:
                tryAPIGeolocation();
                break;
        }
    };

    var tryGeolocation = function (geolocationSuccessFn, e) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                if (geolocationSuccessFn) {
                    geolocationSuccessFn(position, e);
                } else {
                    browserGeolocationSuccess(position);
                }
            },
                function (error) {
                    switch (error.code) {
                        case error.TIMEOUT:
                            tryAPIGeolocation(geolocationSuccessFn);
                            break;
                        case error.PERMISSION_DENIED:
                            if (error.message.indexOf("Only secure origins are allowed") == 0) {
                                tryAPIGeolocation(geolocationSuccessFn);
                            }
                            break;
                        case error.POSITION_UNAVAILABLE:
                            tryAPIGeolocation(geolocationSuccessFn);
                            break;
                    }
                },
                { maximumAge: 50000, timeout: 20000, enableHighAccuracy: true });
        }
    };




    initmap = (latitude, longitude) => {
        deleteMarkers();
        var latlon = new google.maps.LatLng(latitude, longitude);
        var myOptions = {
            center: latlon,
            zoom: 13,
            styles: myStyles,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true
        };

        if (document.getElementById("mapView") != null) {
            map = new google.maps.Map(document.getElementById("mapView"), myOptions);
            var im = document.querySelector('#markerIcon').getAttribute('data-src');
            var userMarker = new google.maps.Marker({
                position: latlon,
                map: map,
                icon: im
            })
        }

        if (document.getElementById('clinicMarkerView') != null) {
            map = new google.maps.Map(document.getElementById("clinicMarkerView"), myOptions);
            var im = document.querySelector('#markerIcon').getAttribute('data-src');
            var userMarker = new google.maps.Marker({
                position: latlon,
                map: map,
                icon: im
            })
        }
    };





    if (document.querySelector('.find-clinic-input') != null) {
        var searchInputField = document.querySelector('.find-clinic-input');
        searchInputField.addEventListener('focus', () => {
            enterPressedInForm = false;
            var input = searchInputField;

            var countryCode1 = countryCode.split(",").map(function (value, index) {
                return value.trim();
            });
            if (countryCode != "" && countryCode != undefined) {
                var options = {
                    types: ['(regions)'],
                    componentRestrictions: { country: countryCode1 }
                };

            } else {
                var options = {}
            }

            var autocomplete = new google.maps.places.Autocomplete(input, options);

            searchInputField.onkeypress = function enterKey(e) {
                if (e.keyCode == 13) {
                    var lat = searchInputField.getAttribute('data-lat');
                    var lng = searchInputField.getAttribute('data-lng');
                    if (lat == "" && lng == "" || lat == undefined && lng == undefined) {
                        if (searchInputField.value == "") {
                            $('#errorModal').modal();
                            $('#errorModal').on('shown.bs.modal', function () {
                                $(".modal-body").html($("#searchErr").html());
                            });
                        }
                    } else {
                        if (document.querySelector('.ci-info p span') != null) {
                            $('.ci-info p span').remove();
                        }
                        var element = document.createElement("span");
                        var text = document.createTextNode(document.getElementById('search').value);
                        element.appendChild(text);
                        document.querySelector('.ci-info p').append(element);

                        searchclick.click();

                        enterPressedInForm = false;
                    }

                    enterPressedInForm = true;
                }
            }

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                var lat = searchInputField.getAttribute('data-lat');
                var lng = searchInputField.getAttribute('data-lng');
                if (!place.geometry && (lat == "" && lng == "" || lat == undefined && lng == undefined)) {
                    $('#errorModal').modal();
                    $('#errorModal').on('shown.bs.modal', function () {
                        $(".modal-body").html($("#suggestionErr").html());
                    });
                } else {
                    if (place.geometry) {
                        var lat = place.geometry.location.lat();
                        var lng = place.geometry.location.lng();
                    }
                    searchInputField.setAttribute('data-lat', lat);
                    searchInputField.setAttribute('data-lng', lng);

                    if (enterPressedInForm) {
                        if (document.querySelector('.ci-info p span') != null) {
                            $('.ci-info p span').remove();
                        }
                        var element = document.createElement("span");
                        var text = document.createTextNode(document.getElementById('search').value);
                        element.appendChild(text);
                        document.querySelector('.ci-info p').append(element);
                        searchclick.click();

                        enterPressedInForm = false;
                    }

                }
            });

        });
    }

    if (document.querySelector('#footerSearch') != null) {
        var ftrsearchInputField = document.querySelector('#footerSearch');
        ftrsearchInputField.addEventListener('focus', () => {
            enterPressedInForm = false;
            var input = ftrsearchInputField;
            var countryCode = document.querySelector('#settings-countrycode').getAttribute('data-country');

            var countryCode1 = countryCode.split(",").map(function (value, index) {
                return value.trim();
            });
            if (countryCode != "" && countryCode != undefined) {
                var options = {
                    types: ['(regions)'],
                    componentRestrictions: { country: countryCode1 }
                };

            } else {
                var options = {}
            }

            var autocomplete = new google.maps.places.Autocomplete(input, options);

            ftrsearchInputField.onkeypress = function enterKey(e) {
                if (e.keyCode == 13) {
                    var lat = ftrsearchInputField.getAttribute('data-lat');
                    var lng = ftrsearchInputField.getAttribute('data-lng');
                    if ((lat == "" && lng == "") || (lat == undefined && lng == undefined) || (lat == null && lng == null)) {
                        if (ftrsearchInputField.value == "") {
                            $('#errorModal').modal();
                            $('#errorModal').on('shown.bs.modal', function () {
                                $(".modal-body").html($("#searchErr").html());
                                enterPressedInForm = false;
                            });
                        }
                    } else {
                        if (document.querySelector('.ci-info p span') != null) {
                            $('.ci-info p span').remove();
                        }
                        var element = document.createElement("span");
                        var text = document.createTextNode(document.getElementById('ftrsearch').value);
                        element.appendChild(text);
                        document.querySelector('.ci-info p').append(element);
                        ftrsearchclick.click();

                        enterPressedInForm = false;
                    }

                    enterPressedInForm = true;
                }
            }

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                var lat = ftrsearchInputField.getAttribute('data-lat');
                var lng = ftrsearchInputField.getAttribute('data-lng');
                if (!place.geometry && (lat == "" && lng == "" || lat == undefined && lng == undefined)) {
                    $('#footerErrorModal').modal();
                    $('#footerErrorModal').on('shown.bs.modal', function () {
                        $(".modal-body").html($("#suggestionErr").html());
                        enterPressedInForm = false;
                    });
                } else {
                    if (place.geometry) {
                        var lat = place.geometry.location.lat();
                        var lng = place.geometry.location.lng();
                    }
                    ftrsearchInputField.setAttribute('data-lat', lat);
                    ftrsearchInputField.setAttribute('data-lng', lng);

                    if (enterPressedInForm) {
                        if (document.querySelector('.ci-info p span') != null) {
                            $('.ci-info p span').remove();
                        }
                        var element = document.createElement("span");
                        var text = document.createTextNode(document.getElementById('ftrsearch').value);
                        element.appendChild(text);
                        document.querySelector('.ci-info p').append(element);
                        ftrsearchclick.click();

                        enterPressedInForm = false;
                    }

                }
            });

        });
    }

    var defaultDistanceto = 20;
    var defaultDistancefrom = 0;
    var distanceIncremental = 50;
    var limit = 6;
    let apiEndpoint;
    let token;
    var locationsList = [];
    searchAction = (lat, lng, brandName, clinicId) => {
        loader.style.display = "block";
        if (defaultDistancefrom != 0) {
            defaultDistanceto = parseInt((defaultDistanceto + distanceIncremental) / distanceIncremental) * distanceIncremental;
        }
        if (lat == 0 && lng == 0) {
            defaultDistanceto = -1;
        }
        if (document.querySelector('input[name="__RequestVerificationToken"]')) {
            apiEndpoint = "/sc/api/FindClinic/GetICLClinicResults";
            token = document.querySelector('input[name="__RequestVerificationToken"]').value;
            callgetresults(apiEndpoint, token, lat, lng, brandName, clinicId);
        } else {
            apiEndpoint = "clinics-details.json";
            token = "";
            callgetresults(apiEndpoint, token, lat, lng, brandName, clinicId);
        }
        defaultDistancefrom = defaultDistanceto + 1;

    }

    getClinicResults = (apiEndpoint, lat, lng, distanceFrom, distanceTo, brandName, clinicId, token) => {
        const params = new URLSearchParams({
            __RequestVerificationToken: token,
            //__RequestVerificationToken: 'tmp',
            Latitude: lat,
            Longitude: lng,
            DistanceFrom: distanceFrom,
            DistanceTo: distanceTo,
            Selectedcountrycode: countryCode,
            BrandName: brandName,
            clinicId: clinicId
        });
        return apiPostCall(apiEndpoint, params)
    }

    function apiPostCall(url, body, options = {}) {
        return fetch(url, {
            method: 'post',
            /*credentials: 'include',*/
            cache: 'no-cache',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'dataType': 'json',
            }),
            ...options,
            body: body,
        });
    }

    callgetresults = (apiEndpoint, token, lat, lng, brandName, clinicId) => {
        //lat = searchInputField.getAttribute('data-lat');
        //lng = searchInputField.getAttribute('data-lng');
        //brandName = 'coolsculpting';
        var ddlradius = document.getElementById("selectRadiusList") ? document.getElementById("selectRadiusList").options[document.getElementById("selectRadiusList").selectedIndex].value : undefined;
        getClinicResults(apiEndpoint, lat, lng, defaultDistancefrom, defaultDistanceto, brandName, clinicId, token).then((response) => {
            if (response.status === 200) {
                return response.json();
            }

            throw response;
        }).then((data) => {
            if (data.IsValid && data.data != null && data.data != "") {
                var parsedData = JSON.parse(data.data);
                if (clinicId != null && clinicId != undefined && clinicId != "") {
                    parsedData = parsedData.filter(x => x["clinicId"].toLowerCase() == clinicId.toLowerCase());
                }
                loader.style.display = "none";
                globalparsedData = parsedData;
                setTimeout(function () {
                    geoJSONCallback()
                }, 1000);
                function geoJSONCallback() {
                    if (parsedData.length <= 0) {
                        NoResultError()
                    }
                    else {
                        if (document.querySelector("#settings-isdistanceinkm") != null) {
                            var KMdistance = document.querySelector("#settings-isdistanceinkm").getAttribute("data-distanceinkm");
                        } else {
                            var KMdistance = 'false';
                        }
                        if (KMdistance.toLowerCase() == "true") {
                            parsedData.forEach((th, item) => {
                                var distt = Getdistance(lat, lng, th.lat, th.longi);
                                th.distance = (distt * 1).toFixed(2);
                                th.distancekey = " km";
                                var uid = th.id;
                                var obj = rateCenter.find(function (element) {
                                    if (element.id == uid)
                                        return element
                                });
                                /*if (obj != undefined && obj.snowflakescore != undefined)
                                {
                                    this.snowflakescore = obj.snowflakescore
                                }*/
                            })
                        }
                        else {
                            parsedData.forEach((th, item) => {
                                var distt = Getdistance(lat, lng, th.lat, th.longi);
                                th.distance = (distt * 0.621371192).toFixed(2);
                                th.distancekey = " mi";
                                var uid = th.id;
                                var obj = rateCenter.find(function (element) {
                                    if (element.id == uid)
                                        return element
                                });
                                /*if (obj != undefined && obj.snowflakescore != undefined)
                                {
                                    this.snowflakescore = obj.snowflakescore
                                }*/
                            })
                        }
                        if (ddlradius !== undefined) {
                            if (radiusparsed !== 0) {
                                parsedData = $.map(parsedData, function (value, key) {
                                    if (value.distance <= radiusparsed) {
                                        return value
                                    }
                                })
                            }
                        }
                    }
                    if (lat != 0 && clinicId == "") {
                        if (parsedData.length > 0) {


                            populateClinicDetails(parsedData, 1);

                        }
                        else {
                            populateClinicDetails(parsedData, 0);
                        }
                        var placeLoc = new google.maps.LatLng(searchInputField.getAttribute('data-lat'), searchInputField.getAttribute('data-lng'));
                        var iconBase = document.querySelector('#markerIcon').getAttribute('data-src');
                        //var marker = new google.maps.Marker({
                        //    position: placeLoc,
                        //    map: map,
                        //    icon: iconBase
                        //});
                        console.log(data.data)
                    } else if (lat != 0 && clinicId != "") {
                        if (parsedData.length > 0) {
                            if (window.location.href.includes(encodeURI(individualurl.split('.')[1]))) {
                                populateIndClinicDetails(parsedData, 1);
                            }

                        }
                        else {
                            if (window.location.href.includes(encodeURI(individualurl.split('.')[1]))) {
                                populateIndClinicDetails(parsedData, 0);
                            }
                        }
                    } else {
                        populateAllClinicDetails(parsedData, 1);
                    }
                }
            }
        });
    };

    mapinfo = (parsedData) => {
        var linkText = document.querySelector("#link-text").textContent;
        var icon = document.querySelector('#map-web-icon').getAttribute('data-icon');
        locationsList = [];

        parsedData.forEach((i, item) => {

            var isCanada = false;
            var isUSA = false;
            var isNull = false;
            switch (i.clinic_address.country.toLowerCase()) {
                case "united states of america":
                case "united states":
                case "usa":
                case "us":
                    isUSA = true;
                    break;
                case "ca":
                case "canada":
                    isCanada = true;
                    break;
                case "":
                case "-":
                    isNull = true;
                    break
            }
            var addressObj = "",
                physician = "";
            addressObj += (i.clinic_address.street != "") ? i.clinic_address.street + "\n" : "";
            if (isUSA || isCanada) {
                addressObj += (i.clinic_address.city != "") ? i.clinic_address.city + ", " : "";
                addressObj += (i.clinic_address.state != "") ? i.clinic_address.state + " " : "";
                addressObj += (i.clinic_address.zip_code != "") ? i.clinic_address.zip_code : ""
            }
            else {
                addressObj += (i.clinic_address.city != "") ? i.clinic_address.city + ", " : "";
                addressObj += (i.clinic_address.state != "") ? i.clinic_address.state + ", " : "";
                addressObj += (i.clinic_address.country != "") ? i.clinic_address.country : "";
                addressObj += "\n";
                addressObj += (i.clinic_address.zip_code != "") ? i.clinic_address.zip_code : ""
            }
            var clinicwebsite = "";
            if (i.website_url != null && i.website_url != "") {
                clinicwebsite = i.website_url.indexOf('http') !== -1 ? i.website_url : "https://" + i.website_url
            }

            var mapHTML = "";
            mapHTML += "<div class=\"map-info \">";
            if (i.clinicName) {
                mapHTML += "<a href=\"javascript:void(0)\"  data-lat='" + i.lat + '\'' + " data-lng='" + i.longi + '\'' + "  data-clinicId='" + i.clinicId + '\'' + " class=\"ci-title js-title-click practice mar_bt10\">" + i.clinicName + "</a>"
            }
            mapHTML += "<div class=\"clinicInfo-address\">";
            if (physician) {
                mapHTML += "<span class=\"physician mar_bt10\">" + physician + "</span>"
            }
            if (addressObj) {
                mapHTML += "<span class=\"address mar_bt10\">" + addressObj + "</span>"
            }
            var showphbtn = document.querySelector("#clinic-search") ? document.querySelector("#clinic-search").getAttribute("data-showphbtn") : "";
            var showphbtnqs = document.getElementById("quick-search") ? document.getElementById("quick-search").getAttribute("data-showphbtn") : "";
            var phlbl = document.querySelector("#clinichelperr") ? document.querySelector("#clinichelperr").getAttribute("data-phlbl") : "";
            var maillbl = document.querySelector("#clinichelperr") ? document.querySelector("#clinichelperr").getAttribute("data-emaillbl") : "";
            if (i.clinic_contact) {
                if (showphbtn == "True" || showphbtnqs == "True") {
                    mapHTML += "<a href='" + "javascript:void(0)" + '\'' + "class=\"mar_bt10 phonebtn ci-bluefont\"" + ">" + phlbl + "<img src=\"" + icon + "\" ></a>";
                    mapHTML += "<a href='" + 'tel:' + i.clinic_contact + '\'' + "class=\"mar_bt10 phone showclinicphoneno\"" + ">" + 'T:' + i.clinic_contact + "</a>"
                }
                else {
                    mapHTML += "<a href='" + 'tel:' + i.clinic_contact + '\'' + "class=\"mar_bt10 phone\"" + ">" + 'T:' + i.clinic_contact + "</a>"
                }
            }
            if (i.email) {
                if (showphbtn == "True" || showphbtnqs == "True") {
                    mapHTML += "<a href='" + 'mailto:' + i.email + '\'' + "class=\"mar_bt10 email ci-bluefont\"" + ">" + maillbl + "<img src=\"" + icon + "\" ></a>"
                }
                else {
                    mapHTML += "<a href='" + 'mailto:' + i.email + '\'' + "class=\"mar_bt10 email\"" + ">" + i.email + "</a>"
                }
            }
            if (i.website_url) {
                mapHTML += "<a href='" + clinicwebsite + '\'' + "target=\"_blank\" class=\"mar_bt10 ci-website\"  onclick=\"openLeaveWebsiteDisclaimerModal(event)\"  " + ">" + linkText + "<img src=\"" + icon + "\" ></a>"
            }
            mapHTML += "</div>";
            mapHTML += "</div>";
            var location = {
                lat: i.lat,
                lon: i.longi,
                html: mapHTML
            };
            locationsList.push(location);
        });
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }


    createMarker = (i, lat, long, clinicId, parsedData, locationsList, markset) => {

        var locationInfowindow = new google.maps.InfoWindow({ content: locationsList.html });
        var bounds = new google.maps.LatLngBounds;
        var icons = document.querySelector('#markerImage').getAttribute('data-src');
        var placeLoc = new google.maps.LatLng(lat, long);
        var marker = new google.maps.Marker({
            position: placeLoc,
            map: map,
            infowindow: locationInfowindow,
            icon: icons,
            label: {
                text: (i + 1).toString(),
                color: "#fff",
                fontSize: "12px",
                fontWeight: "bold"
            }
        });
        // bounds.extend(placeLoc);

        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
            dataLayer.push({ 'event': 'mapClinicClicked', 
                'clinicName': parsedData[i].clinicName,
                'clinicAddress': parsedData[i].clinic_address.street+', '+parsedData[i].clinic_address.city+', '+ parsedData[i].clinic_address.state+', '+parsedData[i].clinic_address.country })
            hideAllInfoWindows(map);
            this.infowindow.open(map, this);
        })
        showMarkers();
        // map.fitBounds(bounds);

    };

    function hideAllInfoWindows(map) {
        markers.forEach(function (marker) {
            marker.infowindow.close(map, marker)
        })
    }
    var mapinfoparsedata = [];
    populateClinicDetails = (parsedData, successCode) => {

        var icons = document.querySelector('#markerImage').getAttribute('data-src');
        sortArrayOfObjects = (arr, key) => {
            return arr.sort((a, b) => {
                return a[key] - b[key];
            });
        };
        var element = document.createElement("span");
        var text = document.createTextNode(globalparsedData.length + " ");
        element.appendChild(text);
        document.querySelector('.ci-info p').prepend(element);
        document.querySelector('.ci-info').style.display = "block";
        parsedData = sortArrayOfObjects(parsedData, "distance");
        if (document.querySelectorAll(".clinicInfo-item").length == 0) {
            dataindex = document.querySelectorAll(".clinicInfo-item").length;
        } else {
            dataindex = document.querySelectorAll(".clinicInfo-item").length + 1;
        }
        parsedData = parsedData.slice(dataindex, limit + dataindex);
        mapinfoparsedata = mapinfoparsedata.concat(parsedData);
        mapinfo(mapinfoparsedata);
        for (var i = 0; i < parsedData.length; i++) {
            markset = 1;
            var markernumber = i + document.querySelectorAll(".clinicInfo-item").length;
            createMarker(markernumber, parsedData[i].lat, parsedData[i].longi, parsedData[i].clinicId, parsedData, locationsList[markernumber], markset);
        }
        if (successCode != 0) {
            parsedData.forEach((result, i) => {
                var listitem = document.querySelectorAll(".clinicInfo-item").length;
                htmlupdate = `<div class="clinicInfo-item col-12 col-sm-6 col-md-6 col-lg-4" role="listitem">
                <div class="clinicItem-wrapper">
                    <div class="clinicInfo-title clearfix">
                        <div class="pin-info col-3">
                            <span class="pin">
                                <img src="` + document.querySelector('#markerImage').getAttribute('data-src') + `"  class="" alt="" >                                                    
                                <span class="pin-marker">${listitem + 1}</span>
                            </span>
                            <span class="ci-distance">${result.distance} ${result.distancekey}</span>
                        </div>
                        <a href="javascript:void(0)" onclick="dataLayer.push({'clinicName':${result.clinicName},'clinicAddress':${result.clinic_address.street}, ${result.clinic_address.city}, ${result.clinic_address.state}, ${result.clinic_address.country},'event':'clinicViewClinicPage'});" data-lat="${result.lat}" data-lng="${result.longi}" data-clinicId="${result.clinicId}" class="ci-title col-9">${result.clinicName}</a>
                    </div>
                    <div class="offset-0 offset-md-3 clinicInfo-address ">`;
                if (result.clinic_address != 'null' && result.clinic_address != undefined && result.clinic_address != '') {

                    htmlupdate += `<address class="address mar_bt10">${result.clinic_address.street} ${result.clinic_address.city} ${result.clinic_address.state} ${result.clinic_address.country}</address>`;
                }
                if (result.clinic_contact != 'null' && result.clinic_contact != undefined && result.clinic_contact != '') {
                    htmlupdate += `<a href="tel:${result.clinic_contact}" class="mar_bt10 phone" aria-describedby="clinic-name-01" onclick="dataLayer.push({'clinicName':${result.clinicName},'clinicAddress':${result.clinic_address.street}, ${result.clinic_address.city}, ${result.clinic_address.state}, ${result.clinic_address.country},'event':'clinicClickToCall'});">
                                <span aria-hidden="true">T:</span>
                                <span class="sr-only">telephone</span>${result.clinic_contact}
                                <span class="sr-only">opens a dialog</span>
                            </a>`;
                }

                if (result.email != 'null' && result.email != null && result.email != undefined && result.email != '') {
                    htmlupdate += `<a href="mailto:${result.email}" aria-describedby="clinic-name-11" onclick="dataLayer.push({'clinicName':${result.clinicName},'clinicAddress':${result.clinic_address.street}, ${result.clinic_address.city}, ${result.clinic_address.state}, ${result.clinic_address.country},'event':'clinicClickToEmail'});">
                            <span class="sr-only">email</span>${result.email}
                            <span class="sr-only">opens a mail dialog</span>
                        </a>`;
                }
                htmlupdate += `</div>
                    
                    <div class="clinicInfo-footer ">`;
                if (result.website_url != 'null' && result.website_url != undefined && result.website_url != '') {
                    var dynamicwebsiteText = document.getElementById('hidden-text-visitwebsite').innerText;
                    htmlupdate += `<a href="${result.website_url}" target="_blank" class="ci-website" aria-describedby="clinic-name-01" onclick="dataLayer.push({'clinicName':${result.clinicName},'clinicAddress':${result.clinic_address.street}, ${result.clinic_address.city}, ${result.clinic_address.state}, ${result.clinic_address.country},'event':'clinicVisitWebsite'});">
                                ${dynamicwebsiteText}
                                <span class="sr-only">${result.clinicName}</span>
                                <img src="https://www.coolsculpting.sg/-/media/project/coolsculpting/findclinic/circle-arrow.ashx?la=zh&amp;hash=61FADFB15EC21201EA81DB640C98363F2CDE55CE" class="mar_tp5 ft-right" alt="">                                             
                            </a>`;
                }
                htmlupdate += `</div>
                </div>
            </div>`;
                if (listitem + 1 < globalparsedData.length - 1) {
                    document.querySelector('.load-more').style.display = "inline-block";
                } else {
                    document.querySelector('.load-more').style.display = "none";
                }
                document.getElementById('clinicResults').insertAdjacentHTML('beforeend', htmlupdate);
            })
            individualClinic();
        }
    }

    populateIndClinicDetails = (parsedData, successCode) => {
        if (successCode != 0) {
            parsedData.forEach((result, i) => {
                document.querySelector('#clinic-name-1').innerHTML = `${result.clinicName}`;
                document.querySelector('#clinic-name-1').style.display = "block";
                if (result.clinic_address != 'null' && result.clinic_address != undefined && result.clinic_address != '') {

                    document.querySelector('address').innerHTML = `${result.clinic_address.street} ${result.clinic_address.city} ${result.clinic_address.state} ${result.clinic_address.country}`;
                    document.getElementsByTagName('address')[0].style.display = "block";
                } else {
                    document.getElementsByTagName('address')[0].style.display = "none";
                }
                if (result.clinic_contact != 'null' && result.clinic_contact != undefined && result.clinic_contact != '') {
                    document.getElementsByClassName('cs-phone')[0].setAttribute('href', `tel:${result.clinic_contact}`);
                    document.getElementsByClassName('cs-phone')[0].children[1].insertAdjacentHTML('afterend', `${result.clinic_contact}`)
                    document.getElementsByClassName('cs-phone')[0].style.display = "block";
                } else {
                    document.getElementsByClassName('cs-phone')[0].style.display = "none"
                }

                if (result.email != 'null' && result.email != null && result.email != undefined && result.email != '') {
                    document.getElementsByClassName('cs-email')[0].setAttribute('href', `mailto:${result.email}`);
                    document.getElementsByClassName('cs-email')[0].children[0].insertAdjacentHTML('afterend', `${result.email}`)
                    document.getElementsByClassName('cs-email')[0].style.display = "block"
                } else {
                    document.getElementsByClassName('cs-email')[0].style.display = "none"
                }
                if (result.website_url != 'null' && result.website_url != undefined && result.website_url != '') {
                    document.getElementsByClassName('cs-result-footer')[0].firstElementChild.setAttribute('href', `${result.website_url}`);
                    document.getElementsByClassName('cs-result-footer')[0].style.display = "block"
                } else {
                    document.getElementsByClassName('cs-result-footer')[0].style.display = "none"
                }

            })
        }
    }

    populateAllClinicDetails = (parsedData, successCode) => {
        parsedData = parsedData.sort((a, b) => { if (a.clinicName < b.clinicName) { return -1 }; if (a.clinicName > b.clinicName) { return 1 } });
        parsedData.forEach((result, i) => {
            htmlupdate1 = `<li role="listitem" class="clinic-list-item ">
                <a href="javascript:void(0)" data-lat="${result.lat}" data-lng="${result.longi}" data-clinicId="${result.clinicId}" class="ci-title list-item">${result.clinicName}</a>
            </li>`;
            document.getElementsByClassName('clinic-list-wrapper')[0].insertAdjacentHTML('beforeend', htmlupdate1);

        });
        individualClinic();
    }


    if (document.querySelector('[data-nav="quick-search"] li a') != null) {

        var quicksearchclick = document.querySelector('[data-nav="quick-search"] li a');

        quicksearchclick.addEventListener('click', (e) => {
            defaultDistanceto = 20;
            defaultDistancefrom = 0;


            var list = document.getElementById("clinicResults").children;
            if (document.querySelector('.ci-info p span') != null) {
                $('.ci-info p span').remove();
            }
            var element = document.createElement("span");
            var text = document.createTextNode(e.target.text);
            element.appendChild(text);
            document.querySelector('.ci-info p').append(element);
            while (list.length > 0) {
                document.getElementById("clinicResults").removeChild(list[0]);
            }
            lat = quicksearchclick.getAttribute('data-latitude');
            lng = quicksearchclick.getAttribute('data-longitude');

            if (lat == "" && lng == "" || lat == undefined && lng == undefined) {
                if (searchInputField.value == "") {
                    $('#errorModal').modal();
                    $('#errorModal').on('shown.bs.modal', function () {
                        $(".modal-body").html($("#searchErr").html());
                    });
                }
            } else {
                initmap(lat, lng);
                searchAction(lat, lng, brandName, "");
            }

        });
    }
    if (window.location.href.includes(encodeURI(findaClinicUrl.split('/')[1] + '?'))) {
        if ((GetQueryParameterValues("lat") != "" && GetQueryParameterValues("lng") != "" && GetQueryParameterValues("lat") != undefined && GetQueryParameterValues("lng") != undefined)) {
            defaultDistanceto = 20;
            defaultDistancefrom = 0;
            if (document.querySelector('.ci-info p span') != null) {
                $('.ci-info p span').remove();
            }
            var element = document.createElement("span");
            var searchTerm = decodeURIComponent(GetQueryParameterValues("searchterm"));
            searchTerm = " " + searchTerm;
            searchTerm = searchTerm.replaceAll("+", " ");
            var text = document.createTextNode(searchTerm);
            element.appendChild(text);
            document.querySelector('.ci-info p').append(element);

            var list = document.getElementById("clinicResults").children;
            while (list.length > 0) {
                document.getElementById("clinicResults").removeChild(list[0]);
            }
            lat = (GetQueryParameterValues("lat"));
            lng = GetQueryParameterValues("lng");
            if (lat == "" && lng == "" || lat == undefined && lng == undefined) {
                if (searchInputField.value == "") {
                    $('#errorModal').modal();
                    $('#errorModal').on('shown.bs.modal', function () {
                        $(".modal-body").html($("#searchErr").html());
                    });
                }
            } else {
                initmap(lat, lng);
                searchAction(lat, lng, brandName, "");
            }
        }
        else {
            window.location.href = findaClinicUrl;
        }
    }

    if (document.querySelector('.allclinics-lnk') != null) {
        var allclinics_lnk = document.querySelector('.allclinics-lnk');
        allclinics_lnk.addEventListener('click', () => {
            lat = 0;
            lng = 0;
            lng = 0;

            var form = document.createElement('form');
            form.method = "get";
            form.target = "_blank";
            form.action = allClinicurl;
            var hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "lat";
            hiddenField.value = lat;
            form.appendChild(hiddenField);

            hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "lng";
            hiddenField.value = lng;
            form.appendChild(hiddenField);

            hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "brandName";
            hiddenField.value = brandName;
            form.appendChild(hiddenField);

            hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "countryCode";
            hiddenField.value = countryCode;
            form.appendChild(hiddenField);

            document.body.appendChild(form);
            form.submit();

        });
    }

    individualClinic = () => {
        //var individualClinic = document.querySelectorAll('.ci-title'); 

        //individualClinic.forEach(item => {
        $(document).on('click', '.ci-title', function () {
            var item = $(this);
            lat = item.attr('data-lat');
            lng = item.attr('data-lng');

            clinicId = item.attr('data-clinicId');
            var form = document.createElement('form');
            form.method = "get";
            form.target = "_blank";
            form.action = individualurl;
            var hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "lat";
            hiddenField.value = lat;
            form.appendChild(hiddenField);

            hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "lng";
            hiddenField.value = lng;
            form.appendChild(hiddenField);

            hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = "clinicId";
            hiddenField.value = clinicId;
            form.appendChild(hiddenField);

            document.body.appendChild(form);
            form.submit();

        });
    }

    if (document.querySelector('#ftrsearchicon') != null) {
        var ftrsearchclick = document.querySelector('#ftrsearchicon');

        ftrsearchclick.addEventListener('click', () => {
            defaultDistanceto = 20;
            defaultDistancefrom = 0;
            lat = ftrsearchInputField.getAttribute('data-lat');
            lng = ftrsearchInputField.getAttribute('data-lng');
            if (lat == "" && lng == "" || lat == undefined && lng == undefined) {
                if (ftrsearchInputField.value == "") {
                    $('#errorModal').modal();
                    $('#errorModal').on('shown.bs.modal', function () {
                        $(".modal-body").html($("#searchErr").html());
                    });
                }
            } else {
                var form = document.createElement('form');
                form.method = "get";
                form.target = "_blank";
                form.action = findaClinicUrl;
                var hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = "lat";
                hiddenField.value = lat;
                form.appendChild(hiddenField);
                hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = "searchTerm";
                hiddenField.value = ftrsearchInputField.value;
                form.appendChild(hiddenField);

                hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = "lng";
                hiddenField.value = lng;
                form.appendChild(hiddenField);

                document.body.appendChild(form);
                form.submit();
            }
        });
    }

    //if (document.querySelector('#ftrsearchicon') != null) {
    //    var searchclick = document.querySelector('#ftrsearchicon');
    //    searchclick.addEventListener('click', () => {
    //        defaultDistanceto = 20;
    //        defaultDistancefrom = 0;
    //        if (document.querySelector('.ci-info p span') != null) {
    //            $('.ci-info p span').remove();
    //        }
    //        var element = document.createElement("span");
    //        var text = document.createTextNode(document.getElementById('footerSearch').value);
    //        element.appendChild(text);
    //        document.querySelector('.ci-info p').append(element);

    //        var list = document.getElementById("clinicResults").children;
    //        while (list.length > 0) {
    //            document.getElementById("clinicResults").removeChild(list[0]);
    //        }
    //        lat = searchInputField.getAttribute('data-lat');
    //        lng = searchInputField.getAttribute('data-lng');
    //        if (lat == "" && lng == "" || lat == undefined && lng == undefined) {
    //            if (window.location.href.includes('?') && (GetQueryParameterValues("lat") != "" && GetQueryParameterValues("lng") != "" && GetQueryParameterValues("lat") != undefined && GetQueryParameterValues("lng") != undefined)) {
    //                lat = GetQueryParameterValues("lat");
    //                lng = GetQueryParameterValues("lng");
    //            }
    //        }
    //        if (lat == "" && lng == "" || lat == undefined && lng == undefined) {
    //            if (searchInputField.value == "") {
    //                $('#errorModal').modal();
    //                $('#errorModal').on('shown.bs.modal', function () {
    //                    $(".modal-body").html($("#searchErr").html());
    //                });
    //            }
    //        } else {
    //            initmap(lat, lng);
    //            searchAction(lat, lng, brandName, "");
    //        }
    //    });
    //}



    if (document.querySelector('#fcSearchIcon') != null) {
        var searchclick = document.querySelector('#fcSearchIcon');
        searchclick.addEventListener('click', () => {
            defaultDistanceto = 20;
            defaultDistancefrom = 0;
            if (document.querySelector('.ci-info p span') != null) {
                $('.ci-info p span').remove();
            }
            var element = document.createElement("span");
            var text = document.createTextNode(document.getElementById('search').value);
            element.appendChild(text);
            document.querySelector('.ci-info p').append(element);

            var list = document.getElementById("clinicResults").children;
            while (list.length > 0) {
                document.getElementById("clinicResults").removeChild(list[0]);
            }
            lat = searchInputField.getAttribute('data-lat');
            lng = searchInputField.getAttribute('data-lng');
            if (lat == "" && lng == "" || lat == undefined && lng == undefined) {
                if (searchInputField.value == "") {
                    $('#errorModal').modal();
                    $('#errorModal').on('shown.bs.modal', function () {
                        $(".modal-body").html($("#searchErr").html());
                    });
                }
            } else {
                initmap(lat, lng);
                searchAction(lat, lng, brandName, "");
            }
        });
    }
    if (document.querySelector('.load-more') != null) {
        var loadmore = document.querySelector('.load-more');
        loadmore.addEventListener('click', () => {
            //searchAction(lat, lng, brandName, "");
            populateClinicDetails(globalparsedData, '1')
        });
    }



    function Getdistance(Slat, Slon, Rlat, Rlon) {
        if ((Slat == Rlat) && (Slon == Rlon)) {
            return 0
        }
        else {
            var radlat1 = Math.PI * Slat / 180;
            var radlat2 = Math.PI * Rlat / 180;
            var theta = Slon - Rlon;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;
            return dist
        }
    }
    if ((GetQueryParameterValues("lat") != "" && GetQueryParameterValues("lng") != "" && GetQueryParameterValues("lat") != undefined && GetQueryParameterValues("lng") != undefined)) {
        var lat = GetQueryParameterValues("lat");
        var lng = GetQueryParameterValues("lng");
        if (GetQueryParameterValues("clinicid") != "") {
            var clinicId = GetQueryParameterValues("clinicid");
        } else {
            var clinicId = ""
        }
        initmap(lat, lng);
        searchAction(lat, lng, brandName, clinicId);
    } else {

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        var myStyles = [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ]
        var geocoder = new google.maps.Geocoder;

        var countryName = $("#settings-countryname").data("countryname");

        if (countryName != undefined) {
            geocoder.geocode({ address: countryName }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lat = results[0].geometry.location.lat();
                    lon = results[0].geometry.location.lng()
                }
                else {
                    setTimeout(function () {
                        resultError()
                    }, 1000)
                }
                zoomLevelCustom = 4;
                initmap(lat, lon)
            })
        }
        //  success = (pos) => {
        //    var crd = pos.coords;
        //    let lat = crd.latitude;
        //    let long = crd.longitude;

        //    initmap(lat, long);
        //  }

        //  error= (err) => {
        //    console.warn(`ERROR(${err.code}): ${err.message}`);
        //  }
        //navigator.geolocation.getCurrentPosition(success, error, [options]);
        var url = $('#settings-geolocation').attr('data-geolocationapi');
        jQuery.post(url, function (success) {
            initmap(success.location.lat, success.location.lng);
        })
    }
    function GetQueryParameterValues(param) {
        if (!window.location.href.toLowerCase().includes('?')) {
            if (window.location.href.includes(encodeURI(individualurl.split('/')[1])) || window.location.href.includes(encodeURI(allClinicurl.split('/')[1]))) {
                window.location.href = findaClinicUrl;
            }
        }
        var url = window.location.href.toLowerCase().slice(window.location.href.toLowerCase().indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];

            }
        }

    }
    function NoResultError() {
        $('#errorModal').modal();
        $('#errorModal').on('shown.bs.modal', function () {
            var errorMessage = $("#GeoLocationAPINoResultText").html() ? $("#GeoLocationAPINoResultText").html() : "No data available for this city";
            $("#errorModal .modal-body").html(errorMessage)
        })
    }
    function resultError() {



        $('#errorModal').modal();
        $('#errorModal').on('shown.bs.modal', function () {
            $("#errorModal .modal-body").html($("#Apigeolocationerr").html())
        });



    }
});