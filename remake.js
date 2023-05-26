var Vvveb = {
    Components: {
        extend: objectToClass
    }
}

function format(val) {
    switch (typeof(val)) {
        case "string":
            return `\"${val}\"`
        case "object":
            if (val instanceof Array) {
                let ret = "";
                for (let i of val) ret = ret + ", " + `${format(i)}`
                return "[" + ret.slice(2) + "]";
            } else {
                let ret = "";
                for (let i in val) ret = ret + `"${format(i)}": ${format(val[i])}` + `${format(i)}`
                return "{" + ret.slice(2) + "}";
            }
        default:
            return val
    }
}

function reducer(prop) {
    return (key, value) => {
        if (typeof value == "function") {
            return String(value)
        }
        return `${value}`
    }
}

function objectToClass(base, name, data) {
    name = name.replace("html/", "");
    let class_name = name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
    let ret = `class ${class_name} extends Component {`

    for (let prop in data) {
        let val = data[prop];
        if (prop == "properties") {
            ret = ret + "\n\tget properties() {\n\t\treturn [\n\t\t\t"
            for (let item of val) {
                let r = "new Property("
                r = r + JSON.stringify(item['name'])
            }
            ret = ret + "\n\t\t]\n\t}"
        }
        else {
            if (typeof value == "function") {
                ret = ret + `\n\t${String(val).slice(8)}`;
            } else {
                ret = ret + `\n\t${prop} = ${JSON.stringify(val, reducer)}`;
            }
        }
    }

    ret = ret + "\n}"
    return ret;
}

console.log(objectToClass("", "People", {
    name: "Azeez",
    age: 17,
    sex: "male",
    schools: ["Bcgg", "pts", "iojhs"],
    others: {
        this: true,
        that: false,
        sayName: () => {
            return this.that
        }
    }
}))

