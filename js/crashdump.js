document.getElementById('exampleForm.ControlTextarea1').oninput = function() {
    try {
        var crashdump = document.getElementById('exampleForm.ControlTextarea1').value;

        crashdump = crashdump.replace("----------------------REPORT THE DATA BELOW THIS LINE-----------------------", "");
        crashdump = crashdump.replace("===BEGIN CRASH DUMP===", "");
        crashdump = crashdump.replace("===END CRASH DUMP===", "");

        const decodedBase64 = atob(crashdump);
        const data = decodedBase64.split("").map(function(x) {
            return x.charCodeAt(0);
        });
        const binaryData = new Uint8Array(data);
        const inflatedData = pako.inflate(binaryData);
        var jsonData = String.fromCharCode.apply(null, new Uint16Array(inflatedData));
        jsonData = JSON.parse(jsonData);
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
            textArea.textContent = jsonData;

            if (document.getElementsByClassName("form-group").length < 2) {
                var element = document.createElement("div");
                element.className = "form-group";
                element.appendChild(label);
                element.appendChild(textArea);
            } else {
                var element = document.getElementsByClassName("form-group")[1];
                element.innerHTML = "";
                element.appendChild(label);
                element.appendChild(textArea);
            }

            if (document.getElementsByClassName("btn btn-secondary").length == 0) {
                var button = document.createElement("BUTTON");
                button.type = "button";
                button.className = "btn btn-secondary";
                button.innerHTML = "Download";
                button.onclick = function() {
                    const blob = new Blob([jsonData], {type: "application/json;charset=utf-8"});
                    saveAs(blob, "crashdump.json");
                }
            }

            var group = document.getElementsByClassName("tab-content")[0];
            if (document.getElementsByClassName("form-group").length < 2) {
                group.appendChild(element);
            }
            if (document.getElementsByClassName("btn btn-secondary").length == 0) {
                group.appendChild(button);
            }
        }
    } catch {
    }
}
