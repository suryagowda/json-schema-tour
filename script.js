function initAceEditor(id) {
    var editor = ace.edit(id);
    
    editor.session.setMode("ace/mode/json");
    editor.setOptions({
        theme:'ace/theme/cobalt',
        placeholder: "JSON Schema goes here...",
    })
    return editor;
}

function initAceEditor2(id) {
    var editor = ace.edit(id);
    editor.setTheme("ace/theme/cobalt");
    editor.session.setMode("ace/mode/json");
    editor.setOptions({
        placeholder: "JSON data to validate against above Schema goes here...",
    })
    return editor;
}




// Initialize Ace Editors
var schemaEditor = initAceEditor("schemaEditor");
var instanceEditor = initAceEditor2("instanceEditor");


const Ajv = window.ajv2020;
const ajv = new Ajv();

// Function to validate the JSON schema
function validateSchema(schema) {
    try {
        const parsedSchema = JSON.parse(schema);
        // Validate the schema against the meta schema
        const isValid = ajv.validateSchema(parsedSchema);
        return isValid;
    } catch (error) {
        displayError(">> " + error.message);
        return false;
    }
}

// Function to validate the JSON instance against the schema
function validateInstance(schemaText, instanceText) {
    try {
        var schema = JSON.parse(schemaText);
        var instance = JSON.parse(instanceText);

        var validate = ajv.compile(schema);
        var valid = validate(instance);

        if (valid) {
            displayResult2("Json data Validation passed!", "green");
        } else {
            displayResult2("Json Data Validation failed!", "red");
        }
    } catch (error) {
        displayResult2("Error: " + error.message, "red");
    }
}

// Function to validate schema and instance
function validate() {
    var schemaText = schemaEditor.getValue();
    var instanceText = instanceEditor.getValue();

    var schemaIsValid = validateSchema(schemaText);
    displayError("")
    if (!schemaIsValid) {

        displayError("Invalid JSON Schema");
        return;
    }

    if (instanceText.trim() !== "") {
        validateInstance(schemaText, instanceText);
    } else {
        displayResult("JSON Schema is valid.", "green");
    }
}

// Helper function to display validation result
function displayResult(message, color) {
    var resultDiv = document.getElementById("result");
    var errorDiv = document.getElementById("error");

    // Clear error message if present
    if (errorDiv) {
        errorDiv.innerText = "";
    }

    if (resultDiv) {
        resultDiv.innerText = message;
        resultDiv.style.color = color;
    } else {
        console.error("Result container not found in the HTML.");
    }
}



// Helper function to display validation result
function displayResult2(message, color) {
    var resultDiv = document.getElementById("result2");
    var errorDiv = document.getElementById("error2");

    // Clear error message if present
    if (errorDiv) {
        errorDiv.innerText = "";
    }

    if (resultDiv) {
        resultDiv.innerText = message;
        resultDiv.style.color = color;
    } else {
        console.error("Result container not found in the HTML.");
    }
}

// Helper function to display error message
function displayError(message) {
    var errorDiv = document.getElementById("error");
    var resultDiv = document.getElementById("result");

    // Clear previous result message if present
    if (resultDiv) {
        resultDiv.innerText = "";
    }

    if (errorDiv) {
        errorDiv.innerText = message;
    } else {
        console.error("Error container not found in the HTML.");
    }
}


// Helper function to display error message
function displayError2(message) {
    var errorDiv = document.getElementById("error2");
    var resultDiv = document.getElementById("result2");

    // Clear previous result message if present
    if (resultDiv) {
        resultDiv.innerText = "";
    }

    if (errorDiv) {
        errorDiv.innerText = message;
    } else {
        console.error("Error container not found in the HTML.");
    }
}

// Function to copy code snippet to clipboard
function copyToClipboard(button) {
    const pre = button.closest('pre');
    if (!pre) {
        console.error("Parent pre element not found.");
        return;
    }
    const preClone = pre.cloneNode(true);

    const buttonClone = preClone.querySelector('.copy-btn');
    if (buttonClone) {
        buttonClone.remove();
    }

    
    const text = preClone.textContent.trim();

   
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);

    
    tempTextArea.select();
    document.execCommand("copy");

    // Remove the temporary textarea
    document.body.removeChild(tempTextArea);

    // Change button text to indicate copying
    button.textContent = "Copied!";
    setTimeout(function () {
        button.textContent = "Copy";
    }, 2000); // Reset button text after 2 seconds
}



let currentPage = 0;
const explanationPages = []; // Array to hold the explanation content for each page


if (currentPage === 0) {
    previousButton.style.display = "none"; // Hide Previous button on first page
}

document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch JSON content from a file
    function fetchJSONContent(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => {
                console.error("Error fetching JSON content:", error);
                return null;
            });
    }
    function showExplanation(currentPage) {
        const explanationDiv = document.getElementById("explanationContent");
        if (!explanationDiv) {
            console.error("Explanation container not found in the HTML.");
            return;
        }
    
        explanationDiv.innerHTML = ''; // Clear previous content
        const currentPageContent = explanationPages[currentPage];
        if (!currentPageContent) {
            console.error("Content for the current page not found.");
            return;
        }
    
        currentPageContent.content.forEach(item => {
            const elementType = Object.keys(item)[0];
            const elementContent = item[elementType];
            const element = document.createElement(elementType);
    
            if (elementType === 'ul' || elementType === 'ol') {
                const list = document.createElement(elementType);
                if (Array.isArray(elementContent)) {
                    elementContent.forEach(listItem => {
                        const listItemElement = document.createElement('li');
                        if (typeof listItem === 'string') {
                            listItemElement.textContent = listItem;
                        } else if (typeof listItem === 'object' && listItem.li) {
                            const codeText = listItem.li.code || '';
                            const normalText = listItem.li.text || '';
                            const codeElement = document.createElement('code');
                            const textElement = document.createElement('span');
                            codeElement.textContent = codeText;
                            textElement.textContent = normalText;
                            listItemElement.appendChild(codeElement);
                            listItemElement.appendChild(textElement);
                        } else if (typeof listItem === 'object' && listItem.pre) {
                            const preElement = document.createElement('pre');
                            const codeElement = document.createElement('code');
                            codeElement.textContent = listItem.pre.code || '';
                            preElement.appendChild(codeElement);
                            listItemElement.appendChild(preElement);

                            // Create a copy button
                            const copyButton = document.createElement('button');
                            copyButton.textContent = 'Copy';
                            copyButton.className = 'copy-btn';
                            copyButton.addEventListener('click', function() {
                                const textToCopy = codeElement.textContent;
                                navigator.clipboard.writeText(textToCopy).then(function() {
                                    console.log('Code copied successfully!');
                                }, function(err) {
                                    console.error('Failed to copy code: ', err);
                                });
                            });
                            
                            preElement.appendChild(copyButton);
                            
                        }
                        list.appendChild(listItemElement);
                    });
                }
                element.appendChild(list);
            } else if (elementType === 'pre' && elementContent.code) {
                const codeElement = document.createElement('code');
                codeElement.textContent = elementContent.code;
                element.appendChild(codeElement);
    
                // Create a copy button
                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';
                copyButton.className = 'copy-btn';
                copyButton.addEventListener('click', function() {
                    const textToCopy = codeElement.textContent;
                    navigator.clipboard.writeText(textToCopy).then(function() {
                        console.log('Code copied successfully!');
                    }, function(err) {
                        console.error('Failed to copy code: ', err);
                    });
                });
                element.appendChild(copyButton);
            } else {
                // Preserve leading spaces for <p> elements
                if (elementType === 'p' && typeof elementContent === 'string') {
                    element.innerHTML = elementContent.replace(/^ +/gm, match => {
                        return '&nbsp;'.repeat(match.length);
                    });
                } else {
                    element.textContent = elementContent;
                }
            }
    
            explanationDiv.appendChild(element);
        });
    }
    
    
    



    // Attach event listeners to the previous and next buttons
    const previousButton = document.getElementById("previousButton");
    const nextButton = document.getElementById("nextButton");

    if (previousButton && nextButton) {
        previousButton.addEventListener("click", goToPreviousPage);
        nextButton.addEventListener("click", goToNextPage);
    } else {
        console.error("Previous or Next button not found in the HTML.");
    }

    // URL for JSON file
    const jsonFile = "data.json";

    // Fetch JSON content and populate explanationPages array
    fetchJSONContent(jsonFile)
        .then(jsonData => {
            if (jsonData && jsonData.pages) {
                explanationPages.push(...jsonData.pages);
                // Initially display the first explanation page
                showExplanation(currentPage);
            } else {
                console.error("Invalid JSON content format.");
            }
        });


    
    // Function to navigate to the previous page
function goToPreviousPage() {
    if (currentPage > 0) {
        currentPage--;
        showExplanation(currentPage);
    }
    updateButtonVisibility();
}

// Function to navigate to the next page
function goToNextPage() {
    if (currentPage < explanationPages.length - 1) {
        currentPage++;
        showExplanation(currentPage);
    }
    updateButtonVisibility();
}

// Function to update button visibility based on current page
function updateButtonVisibility() {
    if (currentPage === 0) {
        previousButton.style.display = "none"; // Hide Previous button on first page
    } else {
        previousButton.style.display = "inline-block"; // Show Previous button on pages other than the first
    }

    if (currentPage === explanationPages.length - 1) {
        nextButton.style.display = "none"; // Hide Next button on last page
    } else {
        nextButton.style.display = "inline-block"; // Show Next button on pages other than the last
    }
}
});
