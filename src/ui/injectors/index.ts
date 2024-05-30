import internals from "#plugin/plugins/internals";

const React = internals.vendorsNormalized.React;

export function injectCSS(css: string): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = URL.createObjectURL(new Blob([css], { type: 'text/css' }));
  link.onload = () => URL.revokeObjectURL(link.href);
  document.head.appendChild(link);
}

export function injectScript(text: string): void {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = URL.createObjectURL(new Blob([text], { type: 'application/javascript' }));
  script.async = true;
  script.onload = () => URL.revokeObjectURL(script.src);
  document.head.appendChild(script);
}

class Tween {
    private text: string;

    constructor(name: string) {
        this.text = "@keyframes " + name + " {";
    }

    from(properties: { [key: string]: any }): Tween {
        this.text += "from {";
        for (const key in properties) {
            this.text += key + ": " + properties[key] + ";";
        }
        this.text += "}";
        return this;
    }

    to(properties: { [key: string]: any }): Tween {
        this.text += "to {";
        for (const key in properties) {
            this.text += key + ": " + properties[key] + ";";
        }
        this.text += "}";
        return this;
    }

    percent(percent: number, properties: { [key: string]: any }): Tween {
        this.text += percent + "% {";
        for (const key in properties) {
            this.text += key + ": " + properties[key] + ";";
        }
        this.text += "}";
        return this;
    }

    end(): { chainTo: (string) => string, inject: () => void, get: () => string } {
        this.text += "}";
        return {
            chainTo: (css: string) => css + "\n" + this.text + "\n",
            inject: () => injectCSS(this.text),
            get: () => this.text
        };
    }
}

export function createTween(name: string): Tween {
    return new Tween(name);
}

export function getStylesByClass(className: string): { rules: { [key: string]: string }, psuedo: { [key: string]: { [key: string]: string } } } {
    const styleSheets = document.styleSheets;
    const styleSheetsRulesAggr = Array.from(styleSheets).map(x => [...x.rules]).flat();

    // @ts-ignore we know that the rules are CSSStyleRule[] as we test with instanceof
    const aggregatedRules: CSSStyleRule[] = styleSheetsRulesAggr.filter(x => {
        return (x instanceof CSSStyleRule && x.selectorText.split(".").some(x => x.startsWith(className) && !x.includes(":")));
    });

    // @ts-ignore we know that the rules are CSSStyleRule[] as we test with instanceof
    const aggregatedPsuedoRules: CSSStyleRule[] = styleSheetsRulesAggr.filter(x => {
        return (x instanceof CSSStyleRule && x.selectorText.split(".").some(x => x.startsWith(className) && x.includes(":")));
    });
    let styles  = {};
    for (const rule of aggregatedRules) {
        const cssRule = rule;
        styles = { ...styles, ...Object.fromEntries(Array.from(cssRule.style).map(x => [x, cssRule.style[x]])) };
    }
    let psuedo = {};
    for (const rule of aggregatedPsuedoRules) {
        const cssRule = rule;
        const psuedoName = cssRule.selectorText.split(":")[1];
        psuedo[psuedoName] = [...psuedo[psuedoName] || [], Object.fromEntries(Array.from(cssRule.style).map(x => [x, cssRule.style[x]]))];
    }

    return { rules: styles, psuedo };
}

// we must use any because we don't bundle react's types
export function applyStylesByClass(className: string, element: any): any {
    const { rules, psuedo } = getStylesByClass(className);
    const maps = {
        "hover": "onMouseEnter",
        "active": "onMouseDown",
        "focus": "onFocus",
    };
    const newProps = { ...element.props };
    let props: { [key: string]: any } = {};
    for (const key in psuedo) {
        if (maps[key]) {
            if (key === "hover") {
                props["onMouseLeave"] = () => {
                    props.style = { ...Object.entries(psuedo[key]).reduce((acc, [key, value]) => ({ ...acc, ...Object.entries(value).reduce((acc, [key, value]) => ({ ...acc, [key]: "" }), {}) }), rules) };
                }
            } else if (key === "active") {
                props["onMouseUp"] = () => {
                    props.style = { ...Object.entries(psuedo[key]).reduce((acc, [key, value]) => ({ ...acc, ...Object.entries(value).reduce((acc, [key, value]) => ({ ...acc, [key]: "" }), {}) }), rules) };
                }
            } else if (key === "focus") {
                props["onBlur"] = () => {
                    props.style = { ...Object.entries(psuedo[key]).reduce((acc, [key, value]) => ({ ...acc, ...Object.entries(value).reduce((acc, [key, value]) => ({ ...acc, [key]: "" }), {}) }), rules) };
                }
            }

            props[maps[key]] = () => {
                props.style = { ...props.style, ...psuedo[key] };
            }
        }
    }

    return React.cloneElement(element, { ...newProps, style: { ...rules, ...newProps.style }, ...props });
}

export function buildCSSTextByRules(className: string, rules: { rules: { [key: string]: string }, psuedo: { [key: string]: { [key: string]: string } } }): string {
    let text = "." + className + ".bppUI {"
    for (const key in rules.rules) {
        text += key + ": " + rules.rules[key] + ";";
    }
    text += "}";
    for (const key in rules.psuedo) {
        text += "." + className + ".bppUI:" + key + "{";
        for (const rule of Object.entries(rules.psuedo[key])) {
            text += rule[0] + ": " + rule[1] + ";";
        }
        text += "}";
    }
    return text;
} 