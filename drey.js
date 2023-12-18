
/*
$$$$$$$\                                                          
$$  __$$\                                                         
$$ |  $$ | $$$$$$\   $$$$$$\  $$\   $$\             $$\  $$$$$$$\ 
$$ |  $$ |$$  __$$\ $$  __$$\ $$ |  $$ |            \__|$$  _____|
$$ |  $$ |$$ |  \__|$$$$$$$$ |$$ |  $$ |            $$\ \$$$$$$\  
$$ |  $$ |$$ |      $$   ____|$$ |  $$ |            $$ | \____$$\ 
$$$$$$$  |$$ |      \$$$$$$$\ \$$$$$$$ |      $$\   $$ |$$$$$$$  |
\_______/ \__|       \_______| \____$$ |      \__|  $$ |\_______/ 
                              $$\   $$ |      $$\   $$ |          
                              \$$$$$$  |      \$$$$$$  |          
                               \______/        \______/           
*/

//?ver2

export const ready = (action) => window.addEventListener("load", action);

export const $ = (selector) => typeof (selector) === "string" ? document.querySelector(selector) : selector;

export const $$ = (selector) => document.querySelectorAll(selector);

export const forEach = (selector, action) => typeof (selector) === "string" ? $$(selector).forEach(action) : selector.forEach(action);

export const html = (selector, content) => $(selector).innerHTML = content;

export const move = (element, destination) => $(destination).appendChild($(element));

export const append = (selector, content) => $(selector).append(content);

export const remove = (selector) => { if ($(selector)) $(selector).remove() }

export const removeChilds = (selector) => { while ($(selector).firstChild) $(selector).removeChild($(selector).firstChild) }

export const createElement = (element) => document.createElement(element);

export const css = (selector, css, val) => $(selector).style.setProperty(css, val);

export const addClass = (selector, newClass) => { if (!hasClass(selector, newClass)) $(selector).className += ` ${newClass}` }

export const removeClass = (selector, targetclass) => forEach(targetclass.split(" "), (target) => { if (hasClass(selector, target)) $(selector).classList.remove(target) });

export const ifClass = (selector, targetclass, condition) => $(selector).classList.toggle(targetclass, condition);

export const hasClass = (selector, targetclass) => $(selector).classList.contains(targetclass);

export const replaceClass = (selector, targetClass, replaceclass) => { if (hasClass(selector, targetClass)) $(selector).classList.replace(targetClass, replaceclass) }

export const attr = (selector, name, value = "") => $(selector).setAttribute(name, value);

export const removeAttr = (selector, name) => forEach(name.split(" "), (target) => { if (hasAttr(selector, target)) $(selector).removeAttribute(target) });

export const hasAttr = (selector, name) => $(selector).hasAttribute(name);

export const event = (selector, event, action = null, callback = null, once = false) => {
    let eventAction, eventCallback;

    if (event === "hover") {
        if (once) {
            eventAction = () => { $(selector).removeEventListener("mouseover", eventAction, false); (action)() }
            eventCallback = () => { $(selector).removeEventListener("mouseleave", eventCallback, false); (callback)() }
        } else {
            eventAction = action;
            eventCallback = callback;
        }

        $(selector).addEventListener("mouseover", eventAction, false);
        $(selector).addEventListener("mouseleave", eventCallback, false);
    } else {
        once
            ? eventAction = () => { $(selector).removeEventListener(event, eventAction, false); (action)() }
            : eventAction = action;

        $(selector).addEventListener(event, eventAction, false);
    }
}

export const removeEvent = (selector, event, action, callback = null) => {
    if (event === "hover") {
        $(selector).removeEventListener("mouseover", action, false);
        $(selector).removeEventListener("mouseleave", callback, false);
    } else {
        $(selector).removeEventListener(event, action, false);
    }
}

export const resetEvents = (callback = null) => {
    forEach(document.querySelectorAll('*'), (element) => element.parentNode.replaceChild(element.cloneNode(true), element));
    if (callback != null) (callback)();
}

export const post = (url, data, json = true) => {
    let params = { method: 'POST' }
    if (json) { params.headers = { 'Content-Type': 'application/json' } }
    json ? params.body = JSON.stringify(data) : params.body = data;

    return new Promise(resolve => {
        fetch(url, params).then(res => res.text())
            .then(jsonData => {
                const jsonDataParsed = JSON.parse(jsonData);

                if (checkUndefined(jsonDataParsed?.success)) {
                    resolve(jsonDataParsed);
                } else {
                    alertError();
                }
            }).catch(error => {
                resolve(error);
                alertError();
                console.log(`%c Error: ${error} `, 'background: red; color: white;');
                console.trace(error);
            });
    });
}

export const load = (selector, url) => {
    fetch(url).then((response) => {
        return response.text();
    }).then((body) => {
        html(selector, body);
    });
}

export const checkUndefined = (input) => input === undefined ? false : true;

export const script = (selector, code, name = null) => {
    const loadScript = (src) => new Promise((resolve, reject) => {
        let script = createElement('script');
        script.src = src;
        script.type = "module";
        if (name != null) script.id = name;
        script.onload = resolve;
        script.onerror = reject;
        $(selector).appendChild(script);
    }); loadScript(code);
}

export const page = (page, noreturn = false, blank = false) => {
    if (blank) {
        window.open(page, '_blank');
    } else {
        noreturn ? location.replace(page) : location.assign(page);
    }
}

export const url = (string) => history.pushState(null, string, string);

export const title = (string) => document.title = string;

export const reload = (force = false) => force ? location.reload(true) : location.reload();

export const resizeWindow = (action) => window.onresize = action;

export const delay = (time, action) => setTimeout(action, time);

export const hasVerticalScroll = () => {
    const body = document.body;
    const html = document.documentElement;
    const fullHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    return fullHeight > window.innerHeight;
}

export const focus = (selector) => { if ($(selector)) $(selector).focus() }

export const unfocus = (selector) => { if ($(selector)) $(selector).blur() }

export const hasFocus = (selector) => $(selector) === document.activeElement;

export const download = (name, url) => {
    let link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
}

export const setStorage = (selector, value) => localStorage.setItem(selector, value);

export const getStorage = (selector) => localStorage.getItem(selector);

export const removeStorage = (selector) => localStorage.removeItem(selector);

export const firstCapitalLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

/* chrome - firefox - opera - MSIE */
export const browser = (browser) => navigator.userAgent.toLowerCase().indexOf(browser) > -1;

export const clipboard = (string) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
        return navigator.clipboard.writeText(string);
    return Promise.reject("The Clipboard API is not available.");
}

export const error = (error) => {
    console.log(`%c Error: ${error} `, 'background: red; color: white;');
    console.trace(error);
}

export const alertError = () => {
    dialog("error", "¡Ops!", "OK", `Se ha producido un <b class="bold">fallo</b> de conexión. Se va a <b class="bold">recargar la página</b> para que vuelvas a intentarlo.`, true, () => {
        reload(true);
    });
}

/* const data = await getData("example.json"); */
export async function getData(jsonUrl) {
    return new Promise(resolve => {
        fetch(`./data/${jsonUrl}?ver1`, { 'Content-Type': 'application/json' })
            .then(res => res.text())
            .then(datos => {
                resolve(JSON.parse(datos));
            }).catch(error => {
                alert(error);
            });
    });
}

export const dialog = (idName = "", titleDialog = "", buttonDialog = "OK", contentDialog = "<br>", escape = true, callback = () => { }) => {

    const closeDialog = (dialog) => {
        removeAttr(dialog, "style");
        css(dialog, '--animate-duration', '0.2s');
        removeClass(dialog, "animate__fadeIn");
        addClass(dialog, "animate__fadeOut");

        event(dialog, "animationend", () => remove(dialog));
    }

    const dialog = createElement("dialog");
    const content = `
        <h1>${titleDialog}</h1>
        ${contentDialog}
        <button id="button${idName}">${buttonDialog}</button>
    `;
    html(dialog, content);

    css(dialog, '--animate-duration', '0.3s');
    css(dialog, 'display', 'none');
    addClass(dialog, "animate__animated animate__fadeIn");
    attr(dialog, "id", idName);
    append("body", dialog);

    event(dialog, "close", () => {
        remove(dialog);
        (callback)();
    });

    event(`#button${idName}`, "click", () => closeDialog(dialog));

    if (!escape) event(`dialog#${idName}`, 'cancel', (event) => event.preventDefault());

    delay(30, () => {
        css(dialog, 'display', 'grid');
        $(dialog).showModal();
        unfocus(`#button${idName}`);
    });
}

/**
 * <
 * <
 * <
 * Validate Function - https://regexr.com/
 * @param {string} value
 * @param {string} type
 * @param {string|null} formats
 * @return {Boolean}
**/
export const validate = (value, type, formats = null) => {
    let regExp;
    const regExpOptions = {
        'email': () => regExp = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
        'mail': () => regExp = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
        'file': () => regExp = `^.*\.(${formats})$`,
    }; const regExpDefault = () => regExp = null;

    regExpOptions[type] ? regExpOptions[type]() : regExpDefault;

    if (type === "file") {
        let validate = new RegExp(regExp);
        return Boolean(validate.test(value));
    } else {
        return Boolean(regExp.test(value));
    }
}