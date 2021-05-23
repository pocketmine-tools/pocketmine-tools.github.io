document.getElementById('exampleForm.ControlTextarea1').onchange = function() {
    var crashdump = document.getElementById('exampleForm.ControlTextarea1').value;

    crashdump = crashdump.replace("----------------------REPORT THE DATA BELOW THIS LINE-----------------------", "");
    crashdump = crashdump.replace("===BEGIN CRASH DUMP===", "");
    crashdump = crashdump.replace("===END CRASH DUMP===", "");

    const decodedBase64 = atob(crashdump);
    const deflatedZlib = pako.deflate(JSON.stringify(decodedBase64));
    let jsonData = JSON.parse(JSON.stringify(deflatedZlib));
    jsonData = JSON.stringify(jsonData, null, 2);

    if (jsonData.length >= 1) {
        var label = document.createElement("Label");
        label.className = "form-label";
        label.setAttribute("for", "exampleForm.ControlTextarea1");
        label.innerHTML = "Parsed JSON";

        var textArea = document.createElement("TEXTAREA");
        textArea.rows = "6";
        textArea.disabled = true;
        textArea.id = "exampleForm.ControlTextarea1";
        textArea.className = "form-control";
        textArea.innerHTML = jsonData;

        var element = document.createElement("div");
        element.className = "form-group";
        element.appendChild(label);
        element.appendChild(textArea);

        var button = document.createElement("BUTTON");
        button.type = "button";
        button.className = "btn btn-secondary";
        button.innerHTML = "Download";

        var group = document.getElementsByClassName("tab-content");
        group.appendChild(element);
        group.appendChild(button);
    }
}
