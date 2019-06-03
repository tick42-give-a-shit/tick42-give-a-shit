const DOMContentLoadedCallback = () => {

    const tabAElements = document.getElementsByClassName('tab-a');
    for (const tabAElement of tabAElements) {
        tabAElement.addEventListener('click', ({ target }) => {
            const activeTab = document.getElementsByClassName('active-a')[0];
            const activeTabContent = document.getElementsByClassName('tab-active')[0];
            activeTab.classList.remove('active-a');
            activeTabContent.classList.remove('tab-active');
            target.classList.add('active-a');
            document.querySelector(`.tab[data-id='${target.getAttribute('data-id')}']`).classList.add('tab-active');
        });
    }
};

const getInfoFromBackgoundJs = () => {
    chrome.runtime.getBackgroundPage((windowObj) => {
        console.log("opaa", windowObj)

        const p = document.getElementById('contextP');
        p.innerHTML = JSON.stringify(windowObj.context)
    });
};

document.addEventListener('DOMContentLoaded', () => {
    DOMContentLoadedCallback();
    getInfoFromBackgoundJs()
}, false);


