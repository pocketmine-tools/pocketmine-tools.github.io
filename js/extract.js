(function() {
    var file;

    document.getElementById('extract-phar').onsubmit = function(event) {
        event.preventDefault();
        processFile(file);
    }

    function showElements() {
        for (var i = 0; i < arguments.length; i++) {
            document.getElementById(arguments[i]).style.display = 'block';
        }
    }

    function hideElements() {
        for (var i = 0; i < arguments.length; i++) {
            document.getElementById(arguments[i]).style.display = 'none';
        }
    }

    function processFile(elm) {
        hideElements('converted', 'error.corrupted', 'error.file-format', 'error.reading');
        var file = elm.files[0];
        var filename = file.name;
        var reader = new FileReader();
        if (filename.substring(filename.length - 5, filename.length) == '.phar') {
            reader.onload = (function (file) {
                return function (e) {
                    try {
                        var data = PharUtils.PharZipConverter.toZip(new PharUtils.Phar().loadPharData(new Uint8Array(e.target.result))).compress();
                        var filename = file.name;
                        filename = filename.substring(0, filename.length - 5) + '.zip';
                        saveAs(new Blob([data], {
                            type: 'application/zip'
                        }), filename);
                        showElements('converted');
                    } catch (error) {
                        showElements('error.corrupted');
                        console.error(error);
                    }
                };
            })(file);
        } else if (filename.substring(filename.length - 4, filename.length) == '.zip') {
            reader.onload = (function (file) {
                return function (e) {
                    try {
                        var data = PharUtils.PharZipConverter.toPhar(new Uint8Array(e.target.result)).savePharData(true);
                        var filename = file.name;
                        filename = filename.substring(0, filename.length - 4) + '.phar';
                        saveAs(new Blob([data], {
                            type: 'application/x-php'
                        }), filename);
                        showElements('converted');
                    } catch (error) {
                        showElements('error.corrupted');
                        console.error(error);
                    }
                };
            })(file);
        } else {
            showElements('error.file-format');
            elm.value = '';
            return;
        }
        reader.onerror = function (e) {
            showElements('error.reading');
        };
        reader.onloadend = function (e) {
            showElements('upload');
            hideElements('converting');
        };
        hideElements('upload');
        showElements('converting');
        reader.readAsArrayBuffer(elm.files[0]);
        elm.value = '';
    }

    function toUint8Array(str) {
        var u8a = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            u8a[i] = str.charCodeAt(i);
        }
        return u8a;
    }
})();
