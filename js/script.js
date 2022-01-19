let connectivityStatus, gamepad, connectivityInterval;

// When gamepad is connected
window.addEventListener("gamepadconnected", function() {

    // Store the credentials of the functional gamepad
    gamepad = navigator.getGamepads()[0];
    connectivityStatus = `${gamepad.id} <br> ${gamepad.buttons.length} Buttons | ${gamepad.axes.length} Axes`;
    document.querySelector('.status-message').innerHTML = connectivityStatus;

    // Check gamepad inputs after every 100 milliseconds
    connectivityInterval = setInterval(runGamepad, 100);

    // Inject connectivity status to the webpage
    document.querySelector('.value-box').style.display = 'flex';
});

// When gamepad is disconnected
window.addEventListener("gamepaddisconnected", function(e) {

    // Run only when the same gamepad is disconnected
    if (e.gamepad.index === gamepad.index) {

        // Stop reading the inputs when disconnected
        clearInterval(connectivityInterval);

        // Inject connectivity status to the webpage
        connectivityStatus = `Gamepad disconnected`;
        document.querySelector('.status-message').innerHTML = connectivityStatus;
        document.querySelector('.value-box').style.display = 'none';
    }
});

// Do tasks when gamepad is connected and running
const runGamepad = () => {

    // Get gamepad defaults
    // Scan the gamepad inputs and display in the browser
    // Perform corresponding functions for each keypress
    let gamepadObject = navigator.getGamepads()[0];
    let buttons = gamepadObject.buttons;
    let axes = gamepadObject.axes;

    let div = document.createElement('div');
    div.classList = 'values';
    
    // Read all buttons' inputs
    for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
        
        // When button is pressed
        // Including the buttons with fractional inputs ranging from 0 to 1
        if (buttons[buttonIndex].value > 0.4) {

            // Store input values
            let p = document.createElement('p');
            p.innerHTML = `Button ${buttonIndex} pressed`;
            div.appendChild(p);
            
            // Keypress function
            keyHandler(buttonIndex);
        }
    }

    // Read all axes' inputs
    for (let axesIndex = 0; axesIndex < axes.length; axesIndex += 2) {
        
        // When stick moves significantly away from center
        if (axes[axesIndex] > 0.4 || axes[axesIndex] < -0.4 || axes[axesIndex + 1] > 0.4 || axes[axesIndex + 1] < -0.4) {

            // Store input values
            let p = document.createElement('p');
            let stick = axesIndex === 0 ? 'Left' : 'Right';
            p.innerHTML = `Moved ${stick} Stick by (${axes[axesIndex]}, ${axes[axesIndex + 1]})`;
            div.appendChild(p);

            // When left stick is used
            if (axesIndex === 0) {

                // Scroll the webpage according to the direction of joystick
                window.scrollBy(axes[axesIndex] * 80, axes[axesIndex + 1] * 80);
            }

            // When right stick is used
            if (axesIndex === 2) {

                // Move to previous option in SELECT dropdown
                if (axes[axesIndex] < 0 || axes[axesIndex + 1] < 0) {
                    arrowKeyEventHandler(upKey);
                }

                // Move to next option in SELECT dropdown
                else if (axes[axesIndex] > 0 || axes[axesIndex + 1] > 0) {
                    arrowKeyEventHandler(downKey);
                }
            }
        }
    }

    // Inject stored input values to the webpage
    document.querySelector('.value-box').replaceChild(div, document.querySelector('.values'));
};

// Event handler for gamepad buttons and axes
// Perform actions/functionality according to inputs recieved
const keyHandler = buttonIndex => {
    switch (buttonIndex) {

        // When buttons[0] is pressed
        case 0: 
            clickEventHandler();
            break;

        // When buttons[4] is pressed
        case 4:

            // Tab to prev element
            focusElement(prevFocus);
            break;

        // When buttons[5] is pressed
        case 5:

            // Tab to next element
            focusElement(nextFocus);
            break;

        // When buttons[6] is pressed
        case 6:
        
            // Move to previous page in history
            window.history.back();
            break;

        // When buttons[7] is pressed
        case 7:

            // Move to next page in history
            window.history.forward();
            break;

        // When buttons[9] is pressed
        case 9:

            // Reload window
            location.reload();
            break;

        // When buttons[12] or buttons[14] is pressed
        case 12:
        case 14:

            // Move to previous option in SELECT dropdown
            arrowKeyEventHandler(upKey);
            break;

        // When buttons[13] or buttons[15] is pressed
        case 13:
        case 15:

            // Move to previous option in SELECT dropdown
            arrowKeyEventHandler(downKey);
            break;
    }
};

// Move the focus to the next or previous element according to action
const focusElement = action => {

    // Filter for selecting all focussable elements we want to include
    const focussableElementsFilter = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), select, [tabindex]:not([disabled]):not([tabindex="-1"])';

    // Select the focussable elements from the webpage and store them
    const focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElementsFilter),
        function (element) {

            // Check for visibility while always include the current activeElement 
            return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
        }
    );

    // Find index of currently focussed element
    let activeElementIndex = focussable.indexOf(document.activeElement);
    action(activeElementIndex, focussable);
    
    // Move the focus to first element when the BODY tag is focussed
    if (document.activeElement === document.querySelector('body')) {
        focussable[0].focus();
    }
};

// Parameter passed to focusElement function
// Move the focus to next element
const nextFocus = (index, focussable) => {

    // If any element is currently focussed
    if (index > -1) {
        let nextElement = focussable[index + 1] || focussable[0];

        // Focus on previous element
        nextElement.focus();
    }
};

// Parameter passed to focusElement function
// Move the focus to previous element
const prevFocus = (index, focussable) => {

    // If any element is currently focussed
    if (index > -1) {
        let prevElement = focussable[index - 1] || focussable[focussable.length - 1];

        // Focus on previous element
        prevElement.focus();
    }
}

// Click the focussed element
const clickEventHandler = () => {

    // If SELECT element is currently focussed
    // Otherwise perform the regular click option
    if (document.activeElement.nodeName === 'SELECT') {

        // Set initial no of options to 0
        let optionsLength = 0;

        // Compute the number of options and store it
        document.activeElement.childNodes.forEach(node => {

            // Filter out OPTION element only
            if (node.nodeName === 'OPTION') { 
                optionsLength++;
            }
        });

        // Expand all options in the dropdown
        // Otherwise shrink back dropdown
        if ($(document.activeElement).attr('size') === '1' || !$(document.activeElement).attr('size')) {
            $(document.activeElement).attr('size', optionsLength);
        }
        else {
            $(document.activeElement).attr('size', 1);
        }
    }
    else {

        // Click or Select the currently active element
        document.activeElement.click();
    }
}

// Event handler for direction keys on the gamepad
// DIRECTION KEYS - buttons[12], buttons[13], buttons[14], buttons[15]
const arrowKeyEventHandler = keyFunction => {

    // If SELECT element is currently focussed
    if (document.activeElement.nodeName === 'SELECT') {
        let activeElement = document.activeElement.nodeName.toLowerCase();
        keyFunction(activeElement);
    }
}

// Parameter passed to arrowKeyEventHandler function
// When UP direction key or buttons[12] is pressed
const upKey = activeElement => {
    let prevElement = $(`${activeElement} option:selected`).prev('option');
    if (prevElement.length > 0) {
        $(`${activeElement} option:selected`).removeAttr('selected').prev('option').attr('selected', 'selected');
    }
}

// Parameter passed to arrowKeyEventHandler function
// When DOWN direction key or buttons[13] is pressed
const downKey = activeElement => {
    let nextElement = $(`${activeElement} option:selected`).next('option');
    if (nextElement.length > 0) {
        $(`${activeElement} option:selected`).removeAttr('selected').next('option').attr('selected', 'selected');
    }
}
