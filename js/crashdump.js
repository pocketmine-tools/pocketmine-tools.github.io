document.getElementById('exampleForm.ControlTextarea1').onkeypress = function() {
    var crashdump = document.getElementById('exampleForm.ControlTextarea1').value;

    crashdump = crashdump.replace("----------------------REPORT THE DATA BELOW THIS LINE-----------------------", "");
    crashdump = crashdump.replace("===BEGIN CRASH DUMP===", "");
    crashdump = crashdump.replace("===END CRASH DUMP===", "");

    try {
        const decodedBase64 = atob(crashdump);
        const deflatedZlib = pako.deflate(decodedBase64);
        const jsonData = JSON.stringify(JSON.parse(deflatedZlib), null, 2);
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
