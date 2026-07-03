import {watch} from 'vue'
import {i18n} from '../i18n'
import {banner, bannerMessage} from '../utils/banner'

// Use Function constructor to bypass terser drop_console
const safeClear = new Function('console.clear()')
const safeLogStyled = new Function('msg', 'style', 'console.log(msg, style)')

export function useBanner() {
    const printBanner = (lang: string) => {
        const l = lang === 'zh' ? 'zh' : 'en'
        safeClear()
        safeLogStyled(
            `%c${banner[l]}`,
            'color: #478CBF; font-family: monospace; font-size: 11px; line-height: 1.4;'
        )

        safeLogStyled(
            `%c${bannerMessage[l]}`,
            'color: #48BB78; font-weight: bold; font-size: 13px;'
        )
    }

    const locale = i18n.global.locale

    // Print on load
    printBanner(locale.value)

    // Re-print on language change
    watch(locale, (newLang) => {
        printBanner(newLang)
    })
}
