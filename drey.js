
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

export const ready = (action) => window.addEventListener("load", action);

export const $ = (selector) => document.querySelector(selector);

export const html = (selector, content) => $(selector).innerHTML = content;

export const append = (selector, content) => $(selector).append(content);

export const css = (selector, css, val) => $(selector).setAttribute("style", `${css}:${val}`);

export const addClass = (selector, newclass) => {
    if (!hasClass(selector, newclass)) $(selector).classList.add(newclass);
}

export const removeClass = (selector, targetclass) => {
    if (hasClass(selector, targetclass)) $(selector).classList.remove(targetclass);
}

export const ifClass = (selector, targetclass, condition) => $(selector).classList.toggle(targetclass, condition);

export const hasClass = (selector, targetclass) => $(selector).classList.contains(targetclass);

export const replaceClass = (selector, targetClass, replaceclass) => {
    if (hasClass(selector, targetclass)) $(selector).classList.replace(targetClass, replaceclass);
}

export const attr = (selector, name, value = "") => $(selector).setAttribute(name, value);

export const removeAttr = (selector, name) => {
    if ($(selector).hasAttribute(name)) $(selector).removeAttribute(name);
}

export const hasAttr = (selector, name) => $(selector).hasAttribute(name);

export const event = (selector, event, action, callback = null, capture = false) => {
    if (event === "hover") {
        $(selector).addEventListener("mouseover", action, capture);
        $(selector).addEventListener("mouseleave", callback, capture);
    } else {
        $(selector).addEventListener(event, action, capture);
    }
}

export const removeEvent = (selector, event, action, capture = false) => {
    if (event === "hover") {
        $(selector).removeEventListener("mouseover", action, capture);
        $(selector).removeEventListener("mouseleave", callback, capture);
    } else {
        $(selector).removeEventListener(event, action, capture);
    }
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
        let script = document.createElement('script');
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

export const reload = (force = false) => force ? location.reload(true) : location.reload();

export const resizeWindow = (action) => window.onresize = action;

export const title = (string) => document.title = string;

export const delay = (time, action) => setTimeout(action, time);

export const hasVerticalScroll = () => {
    const body = document.body;
    const html = document.documentElement;
    const fullHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    return fullHeight > window.innerHeight;
}

export const remove = (target) => $(target).remove();

export const download = (name, url) => {
    let link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
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

/* chrome - firefox - opera - MSIE */
export const browser = (browser) =>  navigator.userAgent.toLowerCase().indexOf(browser) > -1;

export const dialog = (idName = "", titleDialog = "", buttonDialog = "OK", contentDialog = "<br>", escape = true, callback = () => { }) => {

    const closeDialog = (dialog) => {
        dialog.removeAttribute("style");
        dialog.style.setProperty('--animate-duration', '0.2s');
        if (dialog.classList.contains("animate__fadeIn")) dialog.classList.remove("animate__fadeIn");
        if (!dialog.classList.contains("animate__fadeOut")) dialog.classList.add("animate__fadeOut");

        dialog.addEventListener("animationend", () => {
            dialog.remove();
            (callback)();
        });
    }

    const dialog = document.createElement("dialog");

    const content = `
        <h1>${titleDialog}</h1>
        ${contentDialog}
        <button id="button${idName}">${buttonDialog}</button>
    `;

    dialog.innerHTML = content;

    dialog.style.setProperty('--animate-duration', '0.3s');
    dialog.className = "animate__animated animate__fadeIn";
    dialog.setAttribute("id", idName);

    $("body").appendChild(dialog);

    dialog.addEventListener("close", () => {
        closeDialog(dialog);
        (callback)();
        dialog.remove();
    });

    $(`#button${idName}`).addEventListener("click", () => {
        closeDialog(dialog);
    });

    if (!escape) $(`dialog#${idName}`).addEventListener('cancel', (event) => event.preventDefault());

    $(`dialog#${idName}`).showModal();
    $(`#button${idName}`).blur();
}

export const clipboard = (string) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
        return navigator.clipboard.writeText(string);
    return Promise.reject("The Clipboard API is not available.");
}

export const move = (element, destination) =>  $(destination).appendChild($(element));

/**
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