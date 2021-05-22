document.getElementById('exampleForm.ControlTextarea1').onchange = function() {
    var crashdump = document.getElementById('exampleForm.ControlTextarea1').value;

    crashdump = crashdump.replace("----------------------REPORT THE DATA BELOW THIS LINE-----------------------", "");
    crashdump = crashdump.replace("===BEGIN CRASH DUMP===", "");
    crashdump = crashdump.replace("===END CRASH DUMP===", "");

    try {
        const decodedBase64 = atob(crashdump);
        // var bytes = [];
        // for (var i = 0; i < decodedBase64.length; ++i) {
        //     var code = decodedBase64.charCodeAt(i);
        //     bytes = bytes.concat([code & 0xff, code / 256 >>> 0]);
        // }
        // const inflatedZlib = pako.inflate(bytes);
        const inflatedZlib = pako.inflate(new Uint8Array(decodedBase64), {"to":"string"});
        const decodedCrashdump = new encoding.TextDecoder('utf-8').decode(inflatedZlib);
        let jsonData = JSON.parse(decodedCrashdump);
        jsonData = JSON.stringify(jsonData, null, 2);
    } catch (error) {
        console.error(error);
    }

    if (jsonData.length >= 1) {
        var label = document.createElement("Label");
        label.className = "form-label";
        label.setAttributes("for", "exampleForm.ControlTextarea1");
        label.innerHTML = "Parsed JSON";

        var textArea = document.createElement("TEXTAREA");
        textArea.rows = "6";
        textArea.disabled = true;
        textArea.id = "exampleForm.ControlTextarea1";
        textArea.className = "form-control";
        textArea.innerHTML = jsonData;

        var element = document.createElement("div");
        element.className = "form-group";
        element.addChild(label);
        element.addChild(textArea);

        var button = document.createElement("BUTTON");
        button.type = "button";
        button.className = "btn btn-secondary";
        button.innerHTML = "Download";

        var group = document.getElementByClassName("tab-content");
        group.addChild(element);
        group.addChild(button);
    }
}
