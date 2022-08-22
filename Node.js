class Node {
    constructor(elem) {
        this.$el = elem;
    }

    addClass(className) {
        this.$el.classList.add(className);
        return this;
    }

    addPlaceholder(placeholder) {
        this.$el.placeholder = placeholder;
        return this;
    }

    addListener(event, callback) {
        this.$el.addEventListener(event, callback)
        return this;
    }

    append(...args) {
        this.$el.append(...args);
        return this.$el;
    }

    value(val) {
        this.$el.value = val;
        return this;
    }

    addText(text) {
        this.$el.textContent = text;
        return this;
    }
}
