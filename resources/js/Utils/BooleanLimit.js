class BooleanLimit {
    static registry = {};

    static hydrate(limits = {}) {
        if (!limits || typeof limits !== "object") {
            return;
        }
        for (const model in limits) {
            if (!Object.prototype.hasOwnProperty.call(limits, model)) continue;
            this.set(model, limits[model]);
        }
    }

    static ensureModel(model) {
        if (!this.registry[model]) {
            this.registry[model] = {};
        }
    }

    static set(model, limits = {}) {
        if (!model || typeof model !== "string" || !limits) return;
        this.ensureModel(model);
        for (const field in limits) {
            if (!Object.prototype.hasOwnProperty.call(limits, field)) continue;
            const definition = limits[field] || {};
            const existing = this.registry[model][field] || {};
            const merged = {
                ...existing,
                ...definition,
            };
            if (typeof merged.max !== "number") {
                const parsedMax = Number(merged.max ?? definition.max ?? existing.max ?? 0);
                merged.max = Number.isNaN(parsedMax) ? 0 : parsedMax;
            }
            if (typeof merged.active !== "number") {
                const parsedActive = Number(definition.active ?? existing.active ?? 0);
                merged.active = Number.isNaN(parsedActive) ? 0 : parsedActive;
            }
            if (typeof merged.max === "number" && typeof merged.active === "number") {
                merged.remaining = Math.max(0, merged.max - merged.active);
            }
            this.registry[model][field] = merged;
        }
    }

    static list(model) {
        if (!model) return [];
        const registry = this.registry?.[model] ?? {};
        return Object.keys(registry).map((field) => ({
            field,
            ...registry[field],
        }));
    }

    static get(model, field) {
        if (!model || !field) return null;
        return this.registry?.[model]?.[field] ?? null;
    }

    static has(model, field) {
        return Boolean(this.get(model, field));
    }

    static canEnable(model, field, currentValue = false) {
        const config = this.get(model, field);
        if (!config) return true;
        if (currentValue) return true;
        if (typeof config.max !== "number" || config.max <= 0) return true;
        if (typeof config.active !== "number") return true;
        return config.active < config.max;
    }

    static shouldBlock(model, field, currentValue = false) {
        return !this.canEnable(model, field, currentValue);
    }

    static getMessage(model, field) {
        return this.get(model, field)?.message ?? null;
    }

    static updateFromServer(model, payload) {
        if (!model || !payload) return;
        const { field, limit } = payload;
        if (!field || !limit) return;
        this.ensureModel(model);
        const existing = this.registry[model][field] || {};
        const merged = {
            ...existing,
            ...limit,
        };
        if (typeof merged.max !== "number") {
            const parsedMax = Number(merged.max ?? limit.max ?? existing.max ?? 0);
            merged.max = Number.isNaN(parsedMax) ? 0 : parsedMax;
        }
        if (typeof merged.active !== "number") {
            const parsedActive = Number(limit.active ?? existing.active ?? 0);
            merged.active = Number.isNaN(parsedActive) ? 0 : parsedActive;
        }
        if (typeof merged.max === "number" && typeof merged.active === "number") {
            merged.remaining = Math.max(0, merged.max - merged.active);
        }
        this.registry[model][field] = merged;
    }

    static bulkUpdate(model, entries = []) {
        if (!model || !Array.isArray(entries)) return;
        this.ensureModel(model);
        entries.forEach(({ field, limit }) => {
            if (!field || !limit) return;
            const existing = this.registry[model][field] || {};
            const merged = {
                ...existing,
                ...limit,
            };
            if (typeof merged.max !== "number") {
                const parsedMax = Number(merged.max ?? limit.max ?? existing.max ?? 0);
                merged.max = Number.isNaN(parsedMax) ? 0 : parsedMax;
            }
            if (typeof merged.active !== "number") {
                const parsedActive = Number(limit.active ?? existing.active ?? 0);
                merged.active = Number.isNaN(parsedActive) ? 0 : parsedActive;
            }
            if (typeof merged.max === "number" && typeof merged.active === "number") {
                merged.remaining = Math.max(0, merged.max - merged.active);
            }
            this.registry[model][field] = merged;
        });
    }

    static applyChange(model, field, { previous, next }) {
        const config = this.get(model, field);
        if (!config || typeof config.max !== "number") return;
        if (typeof config.active !== "number") {
            config.active = 0;
        }
        if (previous === next) return;
        if (next) {
            config.active = Math.min(config.max, config.active + 1);
        } else if (previous) {
            config.active = Math.max(0, config.active - 1);
        }
        config.remaining = Math.max(0, config.max - config.active);
    }

    static remaining(model, field) {
        const config = this.get(model, field);
        if (!config) return null;
        if (typeof config.remaining === "number") return config.remaining;
        if (typeof config.max === "number" && typeof config.active === "number") {
            return Math.max(0, config.max - config.active);
        }
        return null;
    }
}

export default BooleanLimit;
