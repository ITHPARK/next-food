export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;


export const pageview = (url: URL | string) => { //페이지에 방문하면 기록을 하게 되는 함수
    if (process.env.NODE_ENV !== "development") { //개발환경이 아닐 떄 기록ㄴ
        window.gtag("config", GA_TRACKING_ID as string, {
        page_path: url, //현재 페이지의 경로를 추적
        });
    }
};

type gtagEvent = {
    action: string; // 이벤트가 발생한 동작
    category: string; // 이벤트의 범주를 나타냄
    label: string; // 이벤트 부가적인 설명을 제공하는 라벨
    value: number; // 이벤트와 관련된 값을 나타냄 ex) 클릭 횟수
};


export const event = ({ action, category, label, value }: gtagEvent) => {
    if (process.env.NODE_ENV !== "development") {
        window.gtag("event", action, { // 이벤트 정보를 google anlytics에 전달
        event_category: category,
        event_label: label,
        value: value,
        });
    }
};