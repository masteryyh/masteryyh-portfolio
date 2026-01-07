export type Lang = "zh-CN" | "en";

export const I18N_STORAGE_KEY = "lang";

export const SUPPORTED_LANGS: Lang[] = ["zh-CN", "en"];

export const LANG_LABEL: Record<Lang, string> = {
    "zh-CN": "简体中文",
    en: "EN",
};

export function isLang(value: unknown): value is Lang {
    return value === "zh-CN" || value === "en";
}

export function getInitialLang(): Lang {
    const stored = localStorage.getItem(I18N_STORAGE_KEY);
    if (isLang(stored)) return stored;
    return "en";
}
