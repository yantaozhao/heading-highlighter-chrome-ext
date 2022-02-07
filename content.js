// @ts-check
const namespace = '__chrome-highlight-heading-ext__';
const className = 'highlight-heading-ext';
const keyContainerId = 'hheContainer';
const keyId = 'hheKey';
const styleTagId = 'hheStyleTag';
const headings = {
    h1: {
        elements: [],
        bg: 'red',
        color: '#000'
    },
    h2: {
        elements: [],
        bg: 'green',
        color: '#000'
    },
    h3: {
        elements: [],
        bg: 'blue',
        color: '#fff'
    },
    h4: {
        elements: [],
        bg: 'darkcyan',
        color: '#fff'
    },
    h5: {
        elements: [],
        bg: 'magenta',
        color: '#fff'
    },
    h6: {
        elements: [],
        bg: 'gold',
        color: '#fff'
    }
};

function initialiseHeadings() {
    // initialise all headings in the DOM
    for (let h in headings) {
        headings[h].elements = [...document.body.querySelectorAll(h)];
    }
}

function getHeadingClassNames() {
    return Object.getOwnPropertyNames(headings).reduce((prev, curr) => {
        return (prev +
                `.${className} ${curr}::before {content:"${curr}"; font-size:70%; display:inline-block; border-radius:50%;
                color:white; background-color:${headings[curr].bg}; margin-right:0.1em; opacity:0.8;}\n`);
    }, '');
}

function getStyles() {
    const styleEl = document.createElement('style');
    styleEl.id = styleTagId;
    styleEl.innerHTML = `
    #${keyId} {
      background: #fff;
      border-radius: 2px;
      border: 1px solid #ccc;
      padding: 2px;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 999999;
    }

    #${keyId} p {
        font-size: 10px;
        margin: 0;
        padding: 2px;
    }

    #${keyId}:hover {
      /** If you want to see something behind it **/
      opacity: 0.1;
    }

    ${getHeadingClassNames()}
  `;
    return styleEl;
}

function insertBadgeStyles() {
    document.head.appendChild(getStyles());
}

function createKey() {
    return Object.getOwnPropertyNames(headings)
        .map(
            h =>
                `<p style="background-color: ${headings[h].bg}; color: ${
                    headings[h].color
                }">${h}</p>`
        )
        .join('');
}

function appendKeyToDOM() {
    const container = document.createElement('div');
    container.id = keyContainerId;
    container.innerHTML = `<div id="${keyId}">${createKey()}</div>`;
    document.body.appendChild(container);
}

function hasExecuted() {
    const styles = document.querySelector(`#${styleTagId}`);
    const key = document.querySelector(`#${keyId}`);
    return Boolean(styles || key);
}

const r = node => node && node.remove();

function resetDOM() {
    r(document.querySelector(`#${keyContainerId}`));
    r(document.querySelector(`#${styleTagId}`));
    document.body.classList.remove(className);
}

function init() {
    document.body.classList.add(className);
    initialiseHeadings();
    // appendKeyToDOM();  // add legend
    insertBadgeStyles();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.namespace === namespace) {
        // false when an initial handshake is sent
        if (request.state) {
            if (request.state.isActive) {
                resetDOM();
            } else {
                init();
            }
        }
        sendResponse(hasExecuted());
    }
});
