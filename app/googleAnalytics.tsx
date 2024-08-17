"use client";

import { pageview } from "../lib/gtag";
import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";


//GA_TRACKING_ID: 추적 할 ID
function GoogleAnalytics({ GA_TRACKING_ID }: { GA_TRACKING_ID?: string }) {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname) {
        pageview(pathname);
        }
    }, [pathname]);

    if (process.env.NODE_ENV !== "production") { //개발환경에서는 추적하지 않는다.
        return null; 
    }

    return (
        <>
        <Script
            strategy="afterInteractive" //페이지가 인터렉티브 된 이후에 스크립트를 로드
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
    
            gtag('config', '${GA_TRACKING_ID}');
            `}
        </Script>
        </>
    );
}

export default GoogleAnalytics;