import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { PROJECT_URL } from "../consts/consts";

type SocialButtonsProps = {
    linkedInUrl: string;
    className: string;
};

export function SocialButtons({ linkedInUrl, className }: SocialButtonsProps) {
    const iconButtonClassName =
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-lg text-slate-600 transition-[color,transform] duration-200 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 dark:focus-visible:ring-emerald-300/30";

    return (
        <div className={`items-center gap-2 ${className}`}>
            <a
                href={PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={iconButtonClassName}
                aria-label="Open project GitHub"
                title="GitHub"
            >
                <FontAwesomeIcon icon={faGithub} />
            </a>

            <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={iconButtonClassName}
                aria-label="Open LinkedIn profile"
                title="LinkedIn"
            >
                <FontAwesomeIcon icon={faLinkedinIn} />
            </a>

            <button
                type="button"
                disabled
                className={`${iconButtonClassName} opacity-50 cursor-not-allowed active:scale-100`}
                aria-label="Download resume (coming soon)"
                title="Resume (coming soon)"
            >
                <FontAwesomeIcon icon={faDownload} />
            </button>
        </div>
    );
}
