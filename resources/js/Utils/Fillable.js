class Fillable {
    static models = []
    static values = {}

    static get(model) {
        return this.values[model] ?? null;
    }

    static set(model, fillable) {
        this.models = [...new Set([...this.models, model])]
        this.values[model] = fillable
    }

    static has = (model, field) => {
        return this.values[model]?.[field]
    }
}

export default Fillable