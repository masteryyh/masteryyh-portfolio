import { Terminal } from "./components/Terminal";
import { ThemeToggle } from "./components/ThemeToggle";
import type { Lang } from "./i18n";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HeaderBar } from "./components/HeaderBar";
import { AboutSection } from "./components/AboutSection";
import { StackSection } from "./components/StackSection";
import { CertsSection } from "./components/CertsSection";
import { LanguageToggle } from "./components/LanguageToggle";
import { ContactCard } from "./components/ContactCard";
import { Card } from "./components/Card";
import { fetchJson } from "./utils/fetchJson";
import { loadI18nLanguage } from "./i18n";

type Contact = {
    email: string;
    wechat: string;
    phone: string;
    github: string;
    linkedin: string;
};

type Profile = {
    name: string;
    contact: Contact;
};

type Cert = {
    name: string;
    issuer: string;
    year: string;
    href: string;
};

type TechStack = Record<string, string[]>;

type LoadState<T> = {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
};

function App() {
    const { t, i18n } = useTranslation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";
    const [scrolled, setScrolled] = useState(false);
    const [activePath, setActivePath] = useState<string>("");

    const [profileState, setProfileState] = useState<LoadState<Profile>>({
        data: null,
        isLoading: true,
        error: null,
    });
    const [certsState, setCertsState] = useState<LoadState<Cert[]>>({
        data: null,
        isLoading: true,
        error: null,
    });
    const [techStackState, setTechStackState] = useState<LoadState<TechStack>>({
        data: null,
        isLoading: true,
        error: null,
    });

    const [i18nError, setI18nError] = useState<Error | null>(null);
    const [i18nReady, setI18nReady] = useState(false);
    const [languageSwitching, setLanguageSwitching] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const handleRetry = useCallback(() => {
        setI18nError(null);
        setI18nReady(false);
        setLanguageSwitching(false);
        setProfileState({ data: null, isLoading: true, error: null });
        setCertsState({ data: null, isLoading: true, error: null });
        setTechStackState({ data: null, isLoading: true, error: null });
        setRetryCount((prev) => prev + 1);
    }, []);

    useEffect(() => {
        let cancelled = false;

        void (async () => {
            try {
                await loadI18nLanguage(i18n.language as Lang);
                if (!cancelled) {
                    setI18nReady(true);
                }
            } catch (e) {
                if (!cancelled) {
                    console.error(e);
                    setI18nError(e instanceof Error ? e : new Error(String(e)));
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [retryCount, i18n.language]);

    const handleLangChange = useCallback(
        async (next: Lang) => {
            if (next === lang) return;
            if (languageSwitching) return;

            try {
                setLanguageSwitching(true);
                await loadI18nLanguage(next);
                await i18n.changeLanguage(next);

                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });
            } catch (e) {
                console.error(e);
                setI18nError(e instanceof Error ? e : new Error(String(e)));
            } finally {
                setLanguageSwitching(false);
            }
        },
        [i18n, languageSwitching, lang],
    );

    const aboutItems = t("about.items", { returnObjects: true });
    const aboutList: string[] = Array.isArray(aboutItems)
        ? aboutItems.filter((it): it is string => typeof it === "string")
        : [];

    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, "");
        const infoUrl = `${baseUrl}/assets/info.json`;
        const certsUrl = `${baseUrl}/assets/certs.json`;
        const techStacksUrl = `${baseUrl}/assets/techStacks.json`;

        const abortController = new AbortController();

        void (async () => {
            const [profileRes, certsRes, techStackRes] = await Promise.allSettled([
                fetchJson<Profile>(infoUrl, { signal: abortController.signal }),
                fetchJson<Cert[]>(certsUrl, { signal: abortController.signal }),
                fetchJson<TechStack>(techStacksUrl, { signal: abortController.signal }),
            ]);

            if (abortController.signal.aborted) return;

            if (profileRes.status === "fulfilled") {
                setProfileState({ data: profileRes.value, isLoading: false, error: null });
            } else {
                console.error(profileRes.reason);
                setProfileState({
                    data: null,
                    isLoading: false,
                    error: profileRes.reason instanceof Error ? profileRes.reason : new Error(String(profileRes.reason)),
                });
            }

            if (certsRes.status === "fulfilled") {
                setCertsState({ data: certsRes.value, isLoading: false, error: null });
            } else {
                console.error(certsRes.reason);
                setCertsState({
                    data: null,
                    isLoading: false,
                    error: certsRes.reason instanceof Error ? certsRes.reason : new Error(String(certsRes.reason)),
                });
            }

            if (techStackRes.status === "fulfilled") {
                setTechStackState({ data: techStackRes.value, isLoading: false, error: null });
            } else {
                console.error(techStackRes.reason);
                setTechStackState({
                    data: null,
                    isLoading: false,
                    error:
                        techStackRes.reason instanceof Error
                            ? techStackRes.reason
                            : new Error(String(techStackRes.reason)),
                });
            }
        })();

        return () => {
            abortController.abort();
        };
    }, [retryCount]);

    useEffect(() => {
        const name = profileState.data?.name;
        document.title = t("meta.title", { name });
    }, [lang, profileState.data?.name, t]);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 8);

            const anchorY = 120;
            const sections: Array<{ id: string; segment: string }> = [
                { id: "about", segment: "about" },
                { id: "stack", segment: "tech-stacks" },
                { id: "certs", segment: "certificates" },
            ];

            let nextPath = "";
            for (const s of sections) {
                const el = document.getElementById(s.id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= anchorY && rect.bottom > anchorY) {
                    nextPath = `/${s.segment}`;
                    break;
                }
            }

            setActivePath(nextPath);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (i18nError || profileState.error) {
        return (
            <div className="min-h-dvh relative">
                <div className="bg-grid" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="mx-4 flex max-w-md flex-col items-center gap-4 text-center">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                                {t("error.title")}
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {t("error.message")}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-500 dark:focus:ring-offset-2"
                        >
                            {t("error.retry")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!i18nReady) {
        return (
            <div className="min-h-dvh relative" aria-busy="true">
                <div className="bg-grid" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4" role="status">
                        <div
                            className="h-12 w-12 animate-spin rounded-full border-2 border-slate-400 border-t-transparent dark:border-slate-500 dark:border-t-transparent"
                            aria-hidden="true"
                        />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300" aria-live="polite">
                            {t("loading")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const profile = profileState.data;
    const certs = certsState.data;
    const techStack = techStackState.data;

    return (
        <div className="min-h-dvh">
            <div className="bg-grid" />

            <HeaderBar
                scrolled={scrolled}
                activePath={activePath}
                lang={lang}
                onLangChange={handleLangChange}
                langDisabled={languageSwitching}
            />

            <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
                <header className="flex flex-col gap-7">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                                    {profile ? (
                                        profile.name
                                    ) : (
                                        <span
                                            className="inline-block h-7 w-48 animate-pulse rounded bg-slate-200 align-middle dark:bg-slate-800 sm:h-8"
                                            aria-hidden="true"
                                        />
                                    )}
                                </h1>
                                <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                    @masteryyh
                                </span>
                            </div>

                            {!scrolled ? (
                                <div className="hidden items-center gap-2 sm:flex">
                                    <ThemeToggle />
                                    <LanguageToggle value={lang} onChange={handleLangChange} disabled={languageSwitching} />
                                </div>
                            ) : null}
                        </div>

                        <p className="text-balance text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                            {t("header.tagline")}
                        </p>
                    </div>

                    <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        {profileState.error ? (
                            <Card>
                                <div className="text-sm text-slate-600 dark:text-slate-300">{t("error.message")}</div>
                            </Card>
                        ) : profile ? (
                            <Terminal
                                title="~/portfolio"
                                name={profile.name}
                                line2={t("terminal.line2")}
                                contact={profile.contact}
                            />
                        ) : (
                            <Card aria-busy="true">
                                <div className="animate-pulse" aria-label="Loading terminal">
                                    <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
                                    <div className="mt-3 h-3 w-52 rounded bg-slate-200 dark:bg-slate-800" />
                                    <div className="mt-3 h-3 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                                    <div className="mt-6 space-y-2">
                                        {Array.from({ length: 6 }).map((_, idx) => (
                                            <div key={idx} className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {profileState.error ? (
                            <Card>
                                <div className="text-sm text-slate-600 dark:text-slate-300">{t("error.message")}</div>
                            </Card>
                        ) : profile ? (
                            <ContactCard contact={profile.contact} />
                        ) : (
                            <Card aria-busy="true">
                                <div className="animate-pulse" aria-label="Loading contact information">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                                        <div className="h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    </div>
                                    <div className="mt-5 grid gap-3">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className="h-[52px] rounded-xl border border-slate-200 bg-white/60 dark:border-slate-800/70 dark:bg-slate-950/40"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </header>

                <main className="mt-9 grid gap-8 sm:mt-10 sm:gap-10">
                    <AboutSection title={t("about.title")} items={aboutList} />

                    <StackSection
                        title={t("stack.title")}
                        isLoading={techStackState.isLoading}
                        errorMessage={techStackState.error ? t("error.message") : undefined}
                        groups={
                            techStack
                                ? Object.entries(techStack).map(([group, items]) => ({
                                      title: t(group),
                                      items,
                                  }))
                                : []
                        }
                    />

                    <CertsSection
                        title={t("cert.title")}
                        validLabel={t("cert.valid")}
                        viewLabel={t("cert.viewOnCredly")}
                        isLoading={certsState.isLoading}
                        errorMessage={certsState.error ? t("error.message") : undefined}
                        certs={
                            certs
                                ? certs.map((c) => ({
                                      name: c.name,
                                      issuer: `${t(c.issuer)}`,
                                      year: c.year,
                                      href: c.href,
                                  }))
                                : []
                        }
                    />
                </main>

                <footer className="mt-12 border-t border-slate-200 py-6 text-xs text-slate-600 dark:border-slate-800/70 dark:text-slate-400 sm:py-8 sm:text-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-slate-900 dark:text-slate-300">masteryyh</span> • {t("footer.builtWith")}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default App;
