
var releasesContents = new Array();

$(document).ready(function(){
  $("#releaseBtn").click(function(){
      var list = "#contactReleases, #dateReleases, #descReleases, #downloadUrlReleases, #homePageUrlReleases, #languagesReleases, #nameReleases, #organizationReleases, #partnerReleases, #licensesReleases, #reposUrlReleases, #relatedCodeReleases, #statusReleases, #tagsReleases, #vcsReleases, #versionReleases";
      var className = document.getElementById("contactReleases").className;
    if(className == "releaseColl collapse"){
      $(list).collapse('show');
    }
    else{
      releasesContents.push( 
                "#contactReleases", "#urlContact", "#emailContact", "#nameContact", "#phoneContact", "#enUrlContact", "#frUrlContact",                         
                "#dateReleases", "#createdDate", "#lastModifiedDate", "#metaLastUpdatedDate", 
                "#descReleases", "#enDesc", "#frDesc",
                "#downloadUrlReleases",
                "#homePageUrlReleases",
                "#languagesReleases",
                "#nameReleases", "#enName", "#frName",
                "#organizationReleases", "#enOrganization", "#frOrganization",
                "#partnerReleases", "#URLpartner", "#enUrlPartner", "#frUrlPartner", "#emailPartner", "#namePartner",
                "#licensesReleases", "#urlLicenses", "#urlLicensesName","#urlLicensesEn", "#urlLicensesFr",
                "#reposUrlReleases", "#enReposUrl", "#frReposUrl",
                "#relatedCodeReleases", "#relatedCodeURL", "#relatedCodeName",
                "#statusReleases",
                "#tagsReleases", "#enTagsReleases", "#frTagsReleases",
                "#vcsReleases", 
                "#versionReleases"
                  );

      releasesContents.forEach(function(elem){
        $(elem).collapse('hide');
      })
    }
  });
});

$(document).ready(function(){
  $("#contactBtn").click(function(){
    var listToShow = "#urlContact,#emailContact, #nameContact, #phoneContact";
    var listToHide = listToShow + "," + "#enUrlContact, #frUrlContact";
    showHideContentsPrime("urlContact", "contactColl collapse", listToShow, listToHide);
  });

  $("#urlContactBtn").click(function(){
    var list = "#enUrlContact, #frUrlContact";  
    showHideContents("enUrlContact","urlContactColl collapse", list)
  });

  $("#dateBtn").click(function(){
      var list = "#createdDate, #lastModifiedDate, #metaLastUpdatedDate"; 
      showHideContents("createdDate","dateColl collapse", list)

  });

  $("#descBtn").click(function(){
      var list = "#enDesc, #frDesc";
      showHideContents("enDesc","descColl collapse", list)

  });

  $("#nameBtn").click(function(){
      var list = "#enName, #frName";
      showHideContents("enName","nameColl collapse", list)

  });

  $("#organizationBtn").click(function(){
    var list = "#enOrganization, #frOrganization";
    showHideContents("enOrganization","organizationColl collapse", list)

  });

  $("#partnerBtn").click(function(){
      var listToShow = "#urlPartner,#emailPartner, #namePartner";
      var listToHide = listToShow + "," + "#enUrlPartner, #frUrlPartner";
      showHideContentsPrime("urlPartner", "partnerColl collapse", listToShow, listToHide);
  });

  $("#urlPartnerBtn").click(function(){
    var list = "#enUrlPartner, #frUrlPartner";  
    showHideContents("enUrlPartner","urlPartnerColl collapse", list)
  });

  $("#licensesBtn").click(function(){
    var listToShow = "#urlLicenses, #urlLicensesName";
    var listToHide = listToShow + "," + "#urlLicenses, #urlLicensesName, #urlLicensesEn, #urlLicensesFr";
    showHideContentsPrime("urlLicenses", "licensesColl collapse", listToShow, listToHide);
  });

  $("#urlLicensesBtn").click(function(){
      var list = "#urlLicensesEn, #urlLicensesFr";
      showHideContents("urlLicensesEn","urlLicensesColl collapse", list)
  });

  $("#reposUrlBtn").click(function(){
      var list = "#enReposUrl, #frReposUrl";
      showHideContents("enReposUrl","reposUrlColl collapse", list)

  });
  
  $("#relatedCodeBtn").click(function(){
      var list = "#relatedCodeURL, #relatedCodeName";
    showHideContents("relatedCodeURL","relatedCodeColl collapse", list)

  });

  $("#tagsReleasesBtn").click(function(){
      var list = "#enTagsReleases, #frTagsReleases";
    showHideContents("enTagsReleases","tagsReleasesColl collapse", list)
  });
  
});

function showHideContents(elementId, className, list){
  (document.getElementById(elementId).className == className) ? $(list).collapse('show'): $(list).collapse('hide');
}

function showHideContentsPrime(elementId, className, listToShow, listToHide){
  (document.getElementById(elementId).className == className) ? $(listToShow).collapse('show') : $(listToHide).collapse('hide');
}
