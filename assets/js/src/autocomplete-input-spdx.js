function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener('input', function(e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement('DIV');
    a.setAttribute('id', this.id + 'autocomplete-list');
    a.setAttribute('class', 'autocomplete-items');
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement('DIV');
        /*make the matching letters bold:*/
        b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener('click', function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName('input')[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener('keydown', function(e) {
    var x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add('autocomplete-active');
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName('autocomplete-items');
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener('click', function(e) {
    closeAllLists(e.target);
  });
}

/*An array containing all the country names in the world:*/
var licenses = [
  '0BSD',
  'AAL',
  'Abstyles',
  'Adobe-2006',
  'Adobe-Glyph',
  'ADSL',
  'AFL-1.1',
  'AFL-1.2',
  'AFL-2.0',
  'AFL-2.1',
  'AFL-3.0',
  'Afmparse',
  'AGPL-1.0-only',
  'AGPL-1.0-or-later',
  'AGPL-3.0-only',
  'AGPL-3.0-or-later',
  'Aladdin',
  'AMDPLPA',
  'AML',
  'AMPAS',
  'ANTLR-PD',
  'Apache-1.0',
  'Apache-1.1',
  'Apache-2.0',
  'APAFML',
  'APL-1.0',
  'APSL-1.0',
  'APSL-1.1',
  'APSL-1.2',
  'APSL-2.0',
  'Artistic-1.0',
  'Artistic-1.0-cl8',
  'Artistic-1.0-Perl',
  'Artistic-2.0',
  'Bahyph',
  'Barr',
  'Beerware',
  'BitTorrent-1.0',
  'BitTorrent-1.1',
  'blessing',
  'BlueOak-1.0.0',
  'Borceux',
  'BSD-1-Clause',
  'BSD-2-Clause',
  'BSD-2-Clause-FreeBSD',
  'BSD-2-Clause-NetBSD',
  'BSD-2-Clause-Patent',
  'BSD-3-Clause',
  'BSD-3-Clause-Attribution',
  'BSD-3-Clause-Clear',
  'BSD-3-Clause-LBNL',
  'BSD-3-Clause-No-Nuclear-License',
  'BSD-3-Clause-No-Nuclear-License-2014',
  'BSD-3-Clause-No-Nuclear-Warranty',
  'BSD-3-Clause-Open-MPI',
  'BSD-4-Clause',
  'BSD-4-Clause-UC',
  'BSD-Protection',
  'BSD-Source-Code',
  'BSL-1.0',
  'bzip2-1.0.5',
  'bzip2-1.0.6',
  'Caldera',
  'CATOSL-1.1',
  'CC-BY-1.0',
  'CC-BY-2.0',
  'CC-BY-2.5',
  'CC-BY-3.0',
  'CC-BY-4.0',
  'CC-BY-NC-1.0',
  'CC-BY-NC-2.0',
  'CC-BY-NC-2.5',
  'CC-BY-NC-3.0',
  'CC-BY-NC-4.0',
  'CC-BY-NC-ND-1.0',
  'CC-BY-NC-ND-2.0',
  'CC-BY-NC-ND-2.5',
  'CC-BY-NC-ND-3.0',
  'CC-BY-NC-ND-4.0',
  'CC-BY-NC-SA-1.0',
  'CC-BY-NC-SA-2.0',
  'CC-BY-NC-SA-2.5',
  'CC-BY-NC-SA-3.0',
  'CC-BY-NC-SA-4.0',
  'CC-BY-ND-1.0',
  'CC-BY-ND-2.0',
  'CC-BY-ND-2.5',
  'CC-BY-ND-3.0',
  'CC-BY-ND-4.0',
  'CC-BY-SA-1.0',
  'CC-BY-SA-2.0',
  'CC-BY-SA-2.5',
  'CC-BY-SA-3.0',
  'CC-BY-SA-4.0',
  'CC-PDDC',
  'CC0-1.0',
  'CDDL-1.0',
  'CDDL-1.1',
  'CDLA-Permissive-1.0',
  'CDLA-Sharing-1.0',
  'CECILL-1.0',
  'CECILL-1.1',
  'CECILL-2.0',
  'CECILL-2.1',
  'CECILL-B',
  'CECILL-C',
  'CERN-OHL-1.1',
  'CERN-OHL-1.2',
  'ClArtistic',
  'CNRI-Jython',
  'CNRI-Python',
  'CNRI-Python-GPL-Compatible',
  'Condor-1.1',
  'copyleft-next-0.3.0',
  'copyleft-next-0.3.1',
  'CPAL-1.0',
  'CPL-1.0',
  'CPOL-1.02',
  'Crossword',
  'CrystalStacker',
  'CUA-OPL-1.0',
  'Cube',
  'curl',
  'D-FSL-1.0',
  'diffmark',
  'DOC',
  'Dotseqn',
  'DSDP',
  'dvipdfm',
  'ECL-1.0',
  'ECL-2.0',
  'EFL-1.0',
  'EFL-2.0',
  'eGenix',
  'Entessa',
  'EPL-1.0',
  'EPL-2.0',
  'ErlPL-1.1',
  'EUDatagrid',
  'EUPL-1.0',
  'EUPL-1.1',
  'EUPL-1.2',
  'Eurosym',
  'Fair',
  'Frameworx-1.0',
  'FreeImage',
  'FSFAP',
  'FSFUL',
  'FSFULLR',
  'FTL',
  'GFDL-1.1-only',
  'GFDL-1.1-or-later',
  ' 	GFDL-1.2-only',
  'GFDL-1.2-or-later',
  'GFDL-1.3-only',
  'GFDL-1.3-or-later',
  'Giftware',
  'GL2PS',
  'Giftware',
  'GL2PS',
  'Glide',
  'Glulxe',
  'gnuplot',
  'GPL-1.0-only',
  'GPL-1.0-or-later',
  'GPL-2.0-only',
  '	GPL-2.0-or-later',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  'gSOAP-1.3b',
  'HaskellReport',
  'HPND',
  'HPND-sell-variant',
  'IBM-pibs',
  'ICU',
  'IJG',
  'ImageMagick',
  'iMatix',
  'Imlib2',
  'Info-ZIP',
  'Intel',
  'Intel-ACPI',
  'Interbase-1.0',
  'IPA',
  'IPL-1.0',
  'ISC',
  'JasPer-2.0',
  'JPNIC',
  'JSON',
  'LAL-1.2',
  'LAL-1.3',
  'Latex2e',
  'Leptonica',
  'LGPL-2.0-only',
  'LGPL-2.0-or-later',
  'LGPL-2.1-only',
  'LGPL-2.1-or-later',
  'LGPL-3.0-only',
  'LGPL-3.0-or-later',
  'LGPLLR',
  'Libpng',
  'libpng-2.0',
  'libtiff',
  'LiLiQ-P-1.1',
  'LiLiQ-R-1.1',
  'LiLiQ-Rplus-1.1',
  'Linux-OpenIB',
  'LPL-1.0',
  'LPL-1.02',
  'LPPL-1.0',
  'LPPL-1.1',
  'LPPL-1.2',
  'LPPL-1.3a',
  'LPPL-1.3c',
  'MakeIndex',
  'MirOS',
  'MIT',
  'MIT-0',
  'MIT-advertising',
  'MIT-CMU',
  'MIT-enna',
  'MIT-feh',
  'MITNFA',
  'Motosoto',
  'mpich2',
  'MPL-1.0',
  'MPL-1.1',
  'MPL-2.0',
  'MPL-2.0-no-copyleft-exception',
  'MS-PL',
  'MS-RL',
  'MTLL',
  'Multics',
  'Mup',
  'NASA-1.3',
  'Naumen',
  'NBPL-1.0',
  'NCSA',
  'Net-SNMP',
  'NetCDF',
  'Newsletr',
  'NGPL',
  'NLOD-1.0',
  'NLPL',
  'Nokia',
  'NOSL',
  'Noweb',
  '	NPL-1.0',
  'NPL-1.1',
  'NPOSL-3.0',
  'NRL',
  'NTP',
  'OCCT-PL',
  'OCLC-2.0',
  'ODbL-1.0',
  'ODC-By-1.0',
  'OFL-1.0',
  'OFL-1.1',
  'OGL-UK-1.0',
  'OGL-UK-2.0',
  'OGL-UK-3.0',
  'OGTSL',
  'OLDAP-1.1',
  'OLDAP-1.2',
  'OLDAP-1.3',
  'OLDAP-1.4',
  'OLDAP-2.0',
  'OLDAP-2.0.1',
  'OLDAP-2.1',
  'OLDAP-2.2',
  'OLDAP-2.2.1',
  'OLDAP-2.2.2',
  'OLDAP-2.3',
  'OLDAP-2.4',
  'OLDAP-2.5',
  'OLDAP-2.6',
  'OLDAP-2.7',
  'OLDAP-2.8',
  'OML',
  'OpenSSL',
  'OPL-1.0',
  'OSET-PL-2.1',
  'OSL-1.0',
  'OSL-1.1',
  'OSL-2.0',
  'OSL-2.1',
  'OSL-3.0',
  'Parity-6.0.0',
  'PDDL-1.0',
  'PHP-3.0',
  'PHP-3.01',
  'Plexus',
  'PostgreSQL',
  'psfrag',
  'psutils',
  'Python-2.0',
  'Qhull',
  'QPL-1.0',
  'Rdisc',
  'RHeCos-1.1',
  'RPL-1.1',
  'RPL-1.5',
  'RPSL-1.0',
  'RSA-MD',
  'RSCPL',
  'Ruby',
  'SAX-PD',
  'Saxpath',
  'SCEA',
  'Sendmail',
  'Sendmail-8.23',
  'SGI-B-1.0',
  'SGI-B-1.1',
  'SGI-B-2.0',
  'SHL-0.5',
  'SHL-0.51',
  'SimPL-2.0',
  'SISSL',
  'SISSL-1.2',
  'Sleepycat',
  'SMLNJ',
  'SMPPL',
  'SNIA',
  'Spencer-86',
  'Spencer-94',
  'Spencer-99',
  'SPL-1.0',
  'SSPL-1.0',
  'SugarCRM-1.1.3',
  'SWL',
  'TAPR-OHL-1.0',
  'TCL',
  'TCP-wrappers',
  'TMate',
  'TORQUE-1.1',
  'TOSL',
  'TU-Berlin-1.0',
  'TU-Berlin-2.0',
  'Unicode-DFS-2015',
  'Unicode-DFS-2016',
  'Unicode-TOU',
  'Unlicense',
  'UPL-1.0',
  'Vim',
  'VOSTROM',
  'VSL-1.0',
  'W3C',
  'W3C-19980720',
  'W3C-20150513',
  'Watcom-1.0',
  'Wsuipa',
  'WTFPL',
  'X11',
  'Xerox',
  'XFree86-1.1',
  'xinetd',
  'Xnet',
  'xpp',
  'XSkat',
  'YPL-1.0',
  'YPL-1.1',
  'Zed',
  'Zend-2.0',
  'Zimbra-1.3',
  'Zimbra-1.4',
  'Zlib',
  'zlib-acknowledgement',
  'ZPL-1.1',
  'ZPL-2.0',
  'ZPL-2.1',
  'LGPL-2.0+',
  'GPL-2.0-with-classpath-exception',
  'LGPL-2.1+',
  'GPL-3.0+',
  'GPL-2.0+',
  'GPL-1.0',
  'wxWindows',
  'GFDL-1.1',
  'GFDL-1.3',
  'GPL-2.0-with-GCC-exception',
  'GPL-2.0',
  'LGPL-3.0+',
  'LGPL-2.1',
  'GPL-1.0+',
  'GFDL-1.2',
  'LGPL-3.0',
  'StandardML-NJ',
  'GPL-3.0-with-GCC-exception',
  'AGPL-3.0',
  'GPL-3.0-with-autoconf-exception',
  'GPL-3.0',
  'LGPL-2.0',
  'Nunit',
  'eCos-2.0',
  'AGPL-1.0',
  'GPL-2.0-with-autoconf-exception',
  'GPL-2.0-with-font-exception',
  'GPL-2.0-with-bison-exception'
];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById('licensesspdxID'), licenses);
