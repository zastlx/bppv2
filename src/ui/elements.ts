import internals from "#plugin/plugins/internals";
import * as injectors from "#ui/injectors";

const React = internals.vendorsNormalized.React;

const FontFamily = {
    Header: "'Titan One', sans-serif",
    Text: "Nunito, sans-serif"
};

const Styles = {
    Button: {

    },
    Dropdown: {

    },
    Input: {

    },
    Checkbox: {

    },
    Toggle: {

    },
    Slider: {

    }
};

const {
    Button,
    Dropdown,
    Input,
    Checkbox,
    Toggle,
    Slider
} = {
    Button: (properties: { [key: string]: any }, text: string) => {
        return React.createElement("button", properties, text);
    },
    Dropdown: (properties: { [key: string]: any }, options: string[]) => {
        return React.createElement("select", properties, options.map(option => React.createElement("option", {}, option)));
    },
    Input: (properties: { [key: string]: any }) => {
        return React.createElement("input", properties);
    },
    Checkbox: (properties: { [key: string]: any }) => {
        return React.createElement("input", { type: "checkbox", ...properties });
    },
    Toggle: (properties: { [key: string]: any }) => {
        return React.createElement("input", { type: "checkbox", ...properties });
    },
    Slider: (properties: { [key: string]: any }) => {
        return React.createElement("input", { type: "range", ...properties });
    },
};


export function registerStyles() {
    const classes = ["clearButton-module__clearButton___", null, "input-module__inputContainer___", "authentication-module__checkBox___", null, null];

    const elements = ["Button", "Dropdown", "Input", "Checkbox", "Toggle", "Slider"];

    const injectCSS = injectors.injectCSS;

    let styleText = "";
    for (var x of elements) {
        const rules = injectors.getStylesByClass(classes[elements.indexOf(x)]).rules;
        const text = injectors.buildCSSTextByRules(classes[elements.indexOf(x)], {
            rules: {
                ...(rules || {}),
                ...Styles[x]
            },
            psuedo: {}
        });
        styleText += text;
    }

    injectCSS(styleText);
};

export {
    Button,
    Dropdown,
    Input,
    Checkbox,
    Toggle,
    Slider
};