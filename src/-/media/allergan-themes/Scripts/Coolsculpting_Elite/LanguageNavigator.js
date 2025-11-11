$(document).ready(function () {
    $('html').attr('data-lang', $('a.active .langTitle').attr("lang").toLowerCase());

var dataLayer = [{
    'language': 'en',
    'patientType': 'Positive Ageing',
    'event': 'Pageview'
}];
dataLayer[0].language = $('a.active .langTitle').attr("lang");
var sitename = window.location.hostname.substring(window.location.hostname.indexOf('.') + 1);
var name = sitename + "site#lang" + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
var lan = "";
for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        lan = c.substring(name.length, c.length);
        break;
    }
} if (lan != "en" && lan != "" && window.location.origin + "/" == window.location.href) {
    window.location.href = window.location.origin + "/" + lan;
}
/** Language Navigator **/
$('.language_selector a,.language_selector .sel-lang a').click(function () {
    $('a,.sel-lang a').removeClass('active');
    $(this).addClass('active'); var selectedLanguage = $(this).find(".langTitle").attr("lang").toLowerCase(); var oldSelectedLanguage = $(this).prev().prev().find(".langTitle").attr("lang") == undefined ? "" : $(this).prev().prev().find(".langTitle").attr("lang").toLowerCase();
    if (oldSelectedLanguage == "") {
        oldSelectedLanguage = $(this).next().next().find(".langTitle").attr("lang").toLowerCase();
    } var data = {}; data.languageName = selectedLanguage;
    data.itemID = $(this).attr("data-id");
    $.ajax({
        type: "GET",
        url: "/api/Language/SetLangauge/" + data.languageName,
        cache: false,
        dataType: 'json',
        success: function (result) {
                $('html').attr('data-lang', selectedLanguage);
            
            var urlsplit = window.location.origin;
            if (selectedLanguage == "zh") {
                window.location.href = urlsplit + '/關於elite';
            } else {
                window.location.href = urlsplit + '/en/elite';
            }
        }
    });
});
});

